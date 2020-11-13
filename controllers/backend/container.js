const Container = require('../../models/container');
const joi = require('joi');
const fs = require('fs');

exports.createContainer = (req, res, next) => {


    const schema = joi.object().keys({
        name: joi.string().trim().required(),
        number: joi.string().trim().empty(''),
        //address: schemaAddress,
        credit: joi.string().trim().empty(''),

    });

    const result = schema.validate(req.body, { allowUnknown: true }); //need to change
    if (result.error) {
        if (req.file) {
            fs.unlink(`./public/img/container/${req.file.filename}`, () => {});
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

    const container = new Container({
        ...req.body,
        image: JSON.stringify(req.file),
        address: JSON.parse(req.body.address)
    });
    container.save()
        .then(() => res.status(201).redirect('/container'))
        .catch(error => res.status(400).json({ error }));
};


exports.getAllContainer = (req, res, next) => {

    Container.find()
    .then(containers => res.status(200).json(containers))
    .catch(error => res.status(400).json({error}));

};

exports.getOneContainer = (req, res, next) => {
    Container.findOne({_id:req.params.id})
    .then(container => res.status(200).json(container))
    .catch(error => res.status(404).json({error}));
};

exports.updateContainer = (req, res, next) => {
    let container = {...req.body}
    if (req.file) {
        fs.unlink(`./public/img/container/${req.body.oldImage}`, () => {});
        container =  {
            ...req.body,
            image: JSON.stringify(req.file)

        }
    }
    Container.updateOne({_id: req.params.id}, {        
        ...container, 
        _id: req.params.id,
        address: JSON.parse(req.body.address)
    })
    .then(() => {
        res.status(200).redirect(`/container/${req.params.id}`);
    })
    .catch(error => res.status(400).json({ error }));
};

exports.deleteContainer = (req, res, next) => {
    Container.findOne({_id:req.params.id})
    .then(container => {
        if (container.image != "noImage") {
            fs.unlink(`./public/img/container/${JSON.parse(container.image).filename}`, () => {});
        } 
        Container.deleteOne({_id: req.params.id})
                .then(()=> res.status(200).redirect('/container'))
                .catch(error => res.status(400).json({error}));
    })
    .catch(error => res.status(404).json({error}));
};