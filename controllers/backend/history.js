const History = require("../../models/history");
const joi = require("joi-oid");

exports.createHistory = (req, res, next) => {

  const schema = joi.object().keys({
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
    .catch((error) => res.status(400).json({ error }));
};

exports.getAllHistory = (req, res, next) => {
    History.find()
    .then(histories => res.status(200).json(histories))
    .catch(error => res.status(400).json({error}));
};
/*
exports.getHistoryFromUserId = (req, res, next) => {
  History.findOne({ idUser: req.params.userId })
    .then((container) => res.status(200).json(container))
    .catch((error) => res.status(404).json({ error }));
};

exports.getOneHistory = (req, res, next) => {
  History.findOne({ _id: req.params.id })
    .then((history) => res.status(200).json(history))
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