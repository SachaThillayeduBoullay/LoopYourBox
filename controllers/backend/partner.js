const Partner = require("../../models/partner");
const User = require("../../models/user");
const joi = require("joi-oid");
const fs = require("fs");
const jwt = require('jsonwebtoken');

exports.createPartner = (req, res, next) => {
  const schemaSchedule = joi.object().keys({
    monday: joi.string().trim(),
    tuesday: joi.string().trim(),
    wednesday: joi.string().trim(),
    thursday: joi.string().trim(),
    friday: joi.string().trim(),
    saturday: joi.string().trim(),
    sunday: joi.string().trim(),
  });

  const schema = joi.object().keys({
    name: joi.string().trim().required(),
    phoneNumber: joi.string().trim().empty(""),
    address: joi.string().trim().required(),
    website: joi.string().trim().empty(""),
    schedule: schemaSchedule, //not working
    foodType: joi.string().trim(),
    idUser: joi.string().trim().required(),
    chain: joi.string().trim().empty(""),
  });

  const result = schema.validate(req.body, { allowUnknown: true }); //need to change
  if (result.error) {
    if (req.file) {
      fs.unlink(`./public/img/partner/${req.file.filename}`, () => {});
    }
    res.status(400).render('pages/error',{ error: result.error.details[0].message});
    return;
  }

  if (req.body.phoneNumber == "") {
    req.body.phoneNumber = undefined;
  }

  if (req.body.website == "") {
    req.body.website = undefined;
  }

  if (req.body.chain == "") {
    req.body.chain = undefined;
  }

  const partner = new Partner({
    ...req.body,
    image: JSON.stringify(req.file),
    address: JSON.parse(req.body.address),
  });
  partner
    .save()
    .then(() => res.status(201).redirect("/partner"))
    .catch((error) => res.status(400).render('pages/error',{ error: `Le partenaire n'a pas pu être créé`}));
};

exports.getPartnerFromUserId = (req, res, next) => {
  Partner.findOne({ idUser: req.params.userId })
    .then((container) => res.status(200).json(container))
    .catch((error) => res.status(404).render('pages/error',{ error: `Partenaire introuvable`}));
};

exports.getOnePartner = (req, res, next) => {
  Partner.findOne({ _id: req.params.id })
    .then((partner) => res.status(200).json(partner))
    .catch((error) => res.status(404).render('pages/error',{ error: `Partenaire introuvable`}));
};

exports.updatePartner = async (req, res, next) => {

  const schemaSchedule = joi.object().keys({
    monday: joi.string().trim(),
    tuesday: joi.string().trim(),
    wednesday: joi.string().trim(),
    thursday: joi.string().trim(),
    friday: joi.string().trim(),
    saturday: joi.string().trim(),
    sunday: joi.string().trim(),
  });

  const schema = joi.object().keys({
    name: joi.string().trim().required(),
    phoneNumber: joi.string().trim().empty(""),
    address: joi.string().trim().required(),
    website: joi.string().trim().empty(""),
    schedule: schemaSchedule, //not working
    foodType: joi.string().trim(),
    chain: joi.string().trim().empty(""),
  });

  const result = schema.validate(req.body, { allowUnknown: true }); //need to change
  if (result.error) {
    if (req.file) {
      fs.unlink(`./public/img/partner/${req.file.filename}`, () => {});
    }
    res.status(400).render('pages/error',{ error: result.error.details[0].message});
    return;
  }

  if (req.body.phoneNumber == "") {
    req.body.phoneNumber = "noNumber";
  }

  if (req.body.website == "") {
    req.body.website = "noWebsite";
  }

  if (req.body.chain == "") {
    req.body.chain = "noChain";
  }

  let partner = { ...req.body };
  if (req.file) {
    fs.unlink(`./public/img/partner/${req.body.oldImage}`, () => {});
    partner = {
      ...req.body,
      image: JSON.stringify(req.file),
    };
  }
  Partner.updateOne(
    { _id: req.params.id },
    {
      ...partner,
      _id: req.params.id,
      address: JSON.parse(req.body.address),
    }
  )
    .then(() => {
      res.status(200).redirect(`/partner/${req.params.id}`);
    })
    .catch((error) => res.status(400).render('pages/error',{ error: `Le partenaire n'a pas pu être modifié`}));
};

exports.deletePartner = (req, res, next) => {
  Partner.findOne({ _id: req.params.id })
    .then((partner) => {
      if (partner.image != "noImage") {
        fs.unlink(
          `./public/img/partner/${JSON.parse(partner.image).filename}`,
          () => {}
        );
      }
      Partner.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).redirect("/partner"))
        .catch((error) => res.status(400).render('pages/error',{ error: `Le partenaire n'a pas pu être supprimé`}));
    })
    .catch((error) => res.status(404).render('pages/error',{ error: `Partenaire introuvable`}));
};

exports.getAllPartner = (req, res, next) => {
  let match = {};

  if (req.query.material && req.query.material != "all") {
    match = {
      containerInfo: {
        $elemMatch: {
          material: req.query.material,
        },
      },
    };
  }

  for (const filter in req.query) {
    let propertyName = filter;
    if (req.query[filter] != "all" && filter != "material") {
      if (filter == "city" || filter == "postcode") {
        propertyName = `address.${filter}`;
      }
      match[propertyName] = req.query[filter];
    }
  }

  Partner.aggregate([
    {
      $lookup: {
        from: "containers",
        localField: "_id",
        foreignField: "partnerId",
        as: "containerInfo",
      },
    },
    {
      $match: match,
    },
  ])
    .then((partnerInfo) => res.status(200).json(partnerInfo))
    .catch((error) => res.status(400).render('pages/error',{ error: `Partenaires introuvables`}));
};

