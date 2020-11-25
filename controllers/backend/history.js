const History = require("../../models/history");
const joi = require("joi-oid");
const bcrypt = require('bcrypt');
const Qrcode = require("../../models/qrcode");
const Container = require("../../models/container");
const Partner = require("../../models/partner");
const Point = require("../../models/point")
const jwt = require("jsonwebtoken");

exports.createHistory = async (req, res, next) => {
  
  try {
  
  const {reference, token} = req.body;
  const decodedToken = jwt.verify(token, process.env.JWT_PW);
  const userId = decodedToken.userId;
  
  const qrcode = await Qrcode.findOne({ reference });
  const container = await Container.findOne({ _id: qrcode.containerId });
  const userPoint = await Point.findOne({ _id: qrcode.userId });

  //////////////////////
  //  CA MARCHE PAS  //
  ////////////////////

  if (qrcode.action == "emprunt"){
    if (userPoint.credit < container.credit){
      res.status(201).render('/pages/index.ejs', { error: "Crédit insuffisant" });
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
  //await Qrcode.deleteOne({ reference });

  
  //const partner = await Partner.findOne({ _id: qrcode.partnerId });

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
    $inc: {credit: deltaCredit},
    $inc: {environmentalImpact: deltaEnvironmentalImpact}
  }

  //Point.updateOne({ userId }, point)  
  try {
    await Point.findOneAndUpdate({userId}, point, {
      new: true, useFindAndModify: false
    });

  } catch {console.log('probleme')}


  res.status(201).json({ reference });

  /*Qrcode.findOne({ reference })
    .then((qrcode) => {
      const history = new History({
        containerId: qrcode.containerId,
        userId,
        partnerId: qrcode.partnerId,
        action: qrcode.action,
        reference: qrcode.reference,
      });*/
      /*Container.findOne({ _id: qrcode.containerId })
      Partner.findOne({ _id: qrcode.partnerId })*/
      /*history.save()
      .then(()=>{Qrcode.deleteOne({ reference })
      .then(() => res.status(201).json({ reference }))
    })
      

      
      .catch(error => res.status(400).json({ error }));

    })
    .catch((error) => res.status(404).json({ error }));*/
  }catch{
    res.status(404).json({ error })
  }
  

  
  
  /*const schema = joi.object().keys({
    idContainer: joi.objectId().required(),
    idUser: joi.objectId().required(),
    idPartner: joi.objectId().required(),
    action: joi.string().trim().required(),
    date: joi.date().required()
  });

  const result = schema.validate(req.body);
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const history = new History({...req.body});

  history
    .save()
    .then(() => res.status(201).redirect("/home"))
    .catch((error) => res.status(400).json({ error }));*/
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

/*
exports.getHistoryFromUserId = (req, res, next) => {
  History.findOne({ idUser: req.params.userId })
    .then((container) => res.status(200).json(container))
    .catch((error) => res.status(404).json({ error }));
};



exports.updateHistory = (req, res, next) => {

  const schema = joi.object().keys({
    name: joi.string().trim().required(),
    phoneNumber: joi.string().trim().empty(""),
    address: joi.string().trim().required(),
    website: joi.string().trim().empty(""),
    foodType: joi.string().trim(),
    chain: joi.string().trim().empty(""),
  });

  const result = schema.validate(req.body, { allowUnknown: true }); //need to change
  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  let history = { ...req.body };
  if (req.file) {
    fs.unlink(`./public/img/history/${req.body.oldImage}`, () => {});
    history = {
      ...req.body,
      image: JSON.stringify(req.file),
    };
  }
  History.updateOne(
    { _id: req.params.id },
    {
      ...history,
      _id: req.params.id,
      address: JSON.parse(req.body.address),
    }
  )
    .then(() => {
      res.status(200).redirect(`/history/${req.params.id}`);
    })
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteHistory = (req, res, next) => {
  History.findOne({ _id: req.params.id })
    .then((history) => {
      if (history.image != "noImage") {
        fs.unlink(
          `./public/img/history/${JSON.parse(history.image).filename}`,
          () => {}
        );
      }
      History.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).redirect("/history"))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(404).json({ error }));
};
*/
