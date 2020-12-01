const History = require("../../models/history");
const bcrypt = require('bcrypt');
const Qrcode = require("../../models/qrcode");
const Container = require("../../models/container");
const Partner = require("../../models/partner");
const Point = require("../../models/point")
const jwt = require("jsonwebtoken");
const UserContainer = require("../../models/userContainer")

exports.createHistory = async (req, res, next) => {
  
  try {
  
  const {reference, token} = req.body;
  const decodedToken = jwt.verify(token, process.env.JWT_PW);
  const userId = decodedToken.userId;

  const qrcode = await Qrcode.findOne({ reference });
  const container = await Container.findOne({ _id: qrcode.containerId });
  const userPoint = await Point.findOne({ userId });

  if (qrcode.action == "emprunt"){
    if (userPoint.credit < container.credit){
      res.status(404).json({ error: "Crédit insuffisant" });
      return;
    }
  }

  const history = new History({
    containerId: qrcode.containerId,
    userId,
    partnerId: qrcode.partnerId,
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

  } catch {console.log('probleme')}


  res.status(201).json({ reference });

  }catch{
    res.status(404).json({ error: "tout est faux" })
  }
  
};

exports.getAllHistory = (req, res, next) => {
    History.find()
    .then(histories => res.status(200).json(histories))
    .catch(error => res.status(400).json({error}));
};

exports.getOneHistory = (req, res, next) => {
  History.findOne({ reference: req.params.reference })
    .then((history) => res.status(200).json(history))
    .catch((error) => res.status(404).json({ error }));
};
