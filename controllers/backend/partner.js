const Partner = require('../../models/partner');
const joi = require('joi');
const fs = require('fs');

exports.createPartner = (req, res, next) => {

    const schemaSchedule = joi.object().keys({
        monday: joi.string().trim(),
        tuesday: joi.string().trim(),
        wednesday: joi.string().trim(),
        thursday: joi.string().trim(),
        friday: joi.string().trim(),
        saturday: joi.string().trim(),
        sunday: joi.string().trim()
    });

    const schema = joi.object().keys({
        name: joi.string().trim().required(),
        phoneNumber: joi.string().trim().empty(''),
        address: joi.string().trim().required(),
        website: joi.string().trim().empty(''),
        schedule: schemaSchedule, //not working
        foodType: joi.string().trim(),
        idUser: joi.string().trim().required(),
        chain: joi.string().trim().empty('')
    });

    const result = schema.validate(req.body, { allowUnknown: true }); //need to change
    if (result.error) {
        if (req.file) {
            fs.unlink(`./public/img/partner/${req.file.filename}`, () => {});
        }
        res.status(400).send(result.error.details[0].message);
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
        address: JSON.parse(req.body.address)
    });
    partner.save()
        .then(() => res.status(201).redirect('/partner'))
        .catch(error => res.status(400).json({ error }));
};


exports.getAllPartner = (req, res, next) => {

    Partner.find()
    .then(partners => res.status(200).json(partners))
    .catch(error => res.status(400).json({error}));

};

exports.getOnePartner = (req, res, next) => {
    Partner.findOne({_id:req.params.id})
    .then(partner => res.status(200).json(partner))
    .catch(error => res.status(404).json({error}));
};

exports.updatePartner = (req, res, next) => {
    let partner = {...req.body}
    if (req.file) {
        fs.unlink(`./public/img/partner/${req.body.oldImage}`, () => {});
        partner =  {
            ...req.body,
            image: JSON.stringify(req.file)

        }
    }
    Partner.updateOne({_id: req.params.id}, {        
        ...partner, 
        _id: req.params.id,
        address: JSON.parse(req.body.address)
    })
    .then(() => {
        res.status(200).redirect(`/partner/${req.params.id}`);
    })
    .catch(error => res.status(400).json({ error }));
};

exports.deletePartner = (req, res, next) => {
    Partner.findOne({_id:req.params.id})
    .then(partner => {
        if (partner.image != "noImage") {
            fs.unlink(`./public/img/partner/${JSON.parse(partner.image).filename}`, () => {});
        } 
        Partner.deleteOne({_id: req.params.id})
                .then(()=> res.status(200).redirect('/partner'))
                .catch(error => res.status(400).json({error}));
    })
    .catch(error => res.status(404).json({error}));
};