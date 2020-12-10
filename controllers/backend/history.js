const History = require("../../models/history");
const Qrcode = require("../../models/qrcode");
const Container = require("../../models/container");
const Partner = require("../../models/partner");
const Point = require("../../models/point")
const jwt = require("jsonwebtoken");
const UserContainer = require("../../models/userContainer");
const User = require("../../models/user");
const mongoose = require('mongoose');

exports.createHistory = async (req, res, next) => {
  
  try {
  
  const {reference, token} = req.body;
  const decodedToken = jwt.verify(token, process.env.JWT_PW);
  const userId = decodedToken.userId;

  const qrcode = await Qrcode.findOne({ reference });
  const container = await Container.findOne({ _id: qrcode.containerId });
  const userPoint = await Point.findOne({ userId });
  const partner = await Partner.findOne({ _id: qrcode.partnerId });
  const user = await User.findOne({ _id: userId });

  if (qrcode.action == "emprunt"){
    if (userPoint.credit < container.credit){
      res.status(404).render('pages/error',{ error: "Crédit insuffisant" });
      return;
    }
  }

  const history = new History({
    containerInfo: container,
    userInfo: user,
    partnerInfo: partner,
    action: qrcode.action,
    reference: qrcode.reference,
  });

  await history.save();

  if(qrcode.action == "emprunt"){
    const userContainer = new UserContainer({
      containerId: qrcode.containerId,
      userId,
      partnerId: qrcode.partnerId,
    });

    await userContainer.save()
  
  } else if(qrcode.action == "retour"){
    await UserContainer.deleteOne({userId, containerId: qrcode.containerId});
  }
  
  await Qrcode.deleteOne({ reference }); 

  
  

  let deltaCredit = 0;
  if (qrcode.action == 'retour') {
    deltaCredit = container.credit;
  } if (qrcode.action == 'emprunt') {
    deltaCredit = (container.credit)*(-1);
  }

  let deltaEnvironmentalImpact = 0;
  if (qrcode.action == 'réutilisation') {
    if (container.material == "Plastique"){
    deltaEnvironmentalImpact = 0.1145;
    } else if (container.material == "Verre"){
      deltaEnvironmentalImpact = 0.11925;
    }else if (container.material == "Inox") {
      deltaEnvironmentalImpact = 0.1152;
    }
  }


  let point = {
    $inc: {credit: deltaCredit, environmentalImpact: deltaEnvironmentalImpact},
  }

  try {
    await Point.findOneAndUpdate({userId}, point, {
      new: true, useFindAndModify: false
    });

  } catch {res.status(400).render('pages/error',{ error: "Les crédits n'ont pas été modifiés"} )}


  res.status(201).json({ reference });

  }catch{
    res.status(404).render('pages/error',{ error: "L'historique n'as pas pu être créé"} )
  }
  
};

exports.getAllHistory = (req, res, next) => {



    let match = {};


  for (const filter in req.query) {
    let propertyName = filter;
    if (req.query[filter] != "all") {
      if (filter == "day" || filter == "month" || filter == "year" || filter == "action") {
        propertyName = filter;
        let value = 0;
        if (filter != "action") {
          value = parseInt(req.query[filter]);
          match[propertyName] = value;
        } else {
          match[propertyName] = req.query[filter];}
      } else if (filter == "partner" ) {
        propertyName = `partnerInfo.name`;
        match[propertyName] = req.query[filter];
      }
      
    }
  }


  History.aggregate([
    
    {
      '$addFields': {
        'day': {
          '$dayOfMonth': '$date'
        }, 
        'month': {
          '$month': '$date'
        }, 
        'year': {
          '$year': '$date'
        }
      }
    },
    
    {
      $match: match,
    },
  ])


    .then((historyInfo) => {
    res.status(200).json(historyInfo)})
    .catch((error) => res.status(400).render('pages/error',{ error: `Historiques introuvables`}));
};

exports.getOneHistory = (req, res, next) => {

  /*History.aggregate(
  [        
    {
    '$match': {
    'reference': req.params.reference
    }
    },
    {
      '$lookup': {
        'from': 'partners', 
        'localField': 'partnerId', 
        'foreignField': '_id', 
        'as': 'partnerInfo'
      }
    }, {
      '$lookup': {
        'from': 'containers', 
        'localField': 'containerId', 
        'foreignField': '_id', 
        'as': 'containerInfo'
      }
    }, {
      '$lookup': {
        'from': 'users', 
        'localField': 'userId', 
        'foreignField': '_id', 
        'as': 'userInfo'
      }
    }, {
      '$unwind': {
        'path': '$containerInfo'
      }
    }, {
      '$unwind': {
        'path': '$partnerInfo'
      }
    }, {
      '$unwind': {
        'path': '$userInfo'
      }
    }, {
      '$project': {
        'containerId': 0, 
        'partnerId': 0, 
        'userId': 0
      }
    }
  ]
  )*/
  History.find({reference: req.params.reference})
  .then(async (history) => {
    
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_PW);
    const userId = decodedToken.userId;

    const user = await User.findOne ({_id: userId});
    const partner = await Partner.findOne ({idUser: userId});
  
    if(userId == history[0].userInfo._id || user.status == "admin" || partner._id.toString() == history[0].partnerInfo._id.toString()) {
      res.status(200).json(history);
      
    } else {
        throw new Error("Vous n'avez pas accès à cette page")
    }
  })
  .catch((error) => res.status(400).render('pages/noaccess',{ error: `Vous n'avez pas accès à cette page`} ));
};

exports.getAllHistoryForOneUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.JWT_PW);
    const userId = decodedToken.userId;

    const user = await User.findOne ({_id: userId});

    const partner = await Partner.findOne ({idUser: userId});


    if ((req.params.param == "userId" && req.params.id == userId) || user.status == "admin" || (req.params.param == "partnerId" && req.params.id == partner._id)) {
  
      let filter = {};

      if (req.params.param == "userId") {
        
        filter = { "$match" : 
          { "userInfo._id" : mongoose.Types.ObjectId(req.params.id) } 
        };
      } else if (req.params.param == "partnerId") {
        filter = { "$match" : 
          { "partnerInfo._id" : mongoose.Types.ObjectId(req.params.id) } 
        };
      }
      /*let filter = {};
      filter[req.params.param] = req.params.id;*/
   
      History.aggregate([ filter])
      .then(histories => res.status(200).json(histories))
      .catch(error => res.status(400).render('pages/error',{ error: "Historique introuvable"} ));
    }

  } catch {
    res.status(400).render('pages/noaccess',{ error: `Vous n'avez pas accès à cette page`} );
  }
};