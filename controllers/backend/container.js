const Container = require('../../models/container');
const User = require('../../models/user');
const Partner = require('../../models/partner');
const joi = require('joi-oid');
const fs = require('fs');

exports.createContainer = (req, res, next) => {
    const schema = joi.object().keys({
        name: joi.string().trim().required(),
        material: joi.string().trim().required(),
        credit: joi.number().required(),
        partnerId: joi.objectId().required()
    });

    const result = schema.validate(req.body, { allowUnknown: true });
    if (result.error) {
        if (req.file) {
            fs.unlink(`./public/img/container/${req.file.filename}`, () => {});
        }
        res.status(400).render('pages/error', {error: result.error.details[0].message});
        return;
    }

    if (req.file){
        req.body.image = JSON.stringify(req.file);
    }
    if (req.body.default == "on"){
        req.body.default = true
    }else{req.body.default = false}
    const container = new Container({
        ...req.body,
    });

    let redirect ="";

    User.findOne({_id : req.body.partnerId})
        .then(user => {
            if (user && user.status == "admin") {
                redirect = "/dashboard/container"
            } else {
                Partner.findOne({_id : req.body.partnerId})
                .then(partner => {redirect =`/mycontainer/${partner.idUser}`})
            }
        })
        
    
    container.save()
        .then(() => res.status(201).redirect(redirect))
        .catch(() => res.status(400).render('pages/error',{ error: "Le contenant n'as pas pu être sauvé"} ));
};


exports.getAllContainer = (req, res, next) => {
    Container.find()
    .then(containers => res.status(200).json(containers))
    .catch(error => res.status(400).render('pages/error',{ error: "Nous n'avons pas trouvé les contenants"} ));
};

exports.getAllDefaultContainer = (req, res, next) => {
    Container.find({default:true})
    .then(containers => res.status(200).json(containers))
    .catch(error => res.status(400).render('pages/error',{ error: "Contenants introuvables"} ));
};

exports.getOneContainer = (req, res, next) => {
    Container.findOne({_id:req.params.id})
    .then(container => res.status(200).json(container))
    .catch(error => res.status(404).render('pages/error',{ error: "Contenant introuvable"} ));
};

exports.updateContainer = (req, res, next) => {

    const schema = joi.object().keys({
        name: joi.string().trim().required(),
        material: joi.string().trim().required(),
        credit: joi.number().required()
    });

    const result = schema.validate(req.body, { allowUnknown: true });
    if (result.error) {
        if (req.file) {
            fs.unlink(`./public/img/container/${req.file.filename}`, () => {});
        }
        res.status(400).render('pages/error',{ error: result.error.details[0].message});
        return;
    }

    let container = {...req.body}
    if (req.file) {
        fs.unlink(`./public/img/container/${req.body.oldImage}`, () => {});
        container =  {
            ...req.body,
            image: JSON.stringify(req.file)

        }
    }
    Container.updateOne({_id: req.params.containerId}, {        
        ...container, 
        _id: req.params.containerId,
        
    })
    .then(() => {

        res.status(200).redirect(`/container/${req.params.containerId}`);
    })
    .catch(error => res.status(400).render('pages/error',{ error: "Le contenant n'a pas pu être modifié"} ));
};

exports.deleteContainer = (req, res, next) => {
    Container.findOne({_id:req.params.containerId})
    .then(container => {
        if ((container.image != "noImage" && container.basedOnDefault == false) || (container.image != "noImage" && container.default == true)) {
            fs.unlink(`./public/img/container/${JSON.parse(container.image).filename}`, () => {});
        } 

        let redirect ="/mycontainer"

        User.findOne({_id : container.partnerId})
            .then(user => {
                if (user) {
                    redirect = "/dashboard/container"
                }
            })
            
        Container.deleteOne({_id: req.params.containerId})
                .then(()=> res.status(200).redirect(redirect))
                .catch(() => res.status(400).render('pages/error',{ error: "Le contenant n'a pas pu être supprimé"} ));
    })
    .catch(error => res.status(404).json({error}));
};

exports.getAllPartnerContainer = (req, res, next) => {
    Container.find({partnerId:req.params.id})
    .then(container => res.status(200).json(container))
    .catch(error => res.status(404).render('pages/error',{ error: "Contenants introuvables"} ));
};