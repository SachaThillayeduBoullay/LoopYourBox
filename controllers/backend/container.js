const Container = require('../../models/container');
const User = require('../../models/user');
const Partner = require('../../models/partner');
const joi = require('joi-oid');
const fs = require('fs');

exports.createContainer = async (req, res, next) => {

    //JOI form validation
    const schema = joi.object().keys({
        name: joi.string().trim().required(),
        material: joi.string().trim().required(),
        credit: joi.number().required(),
        partnerId: joi.objectId().required()
    });

    const result = schema.validate(req.body, { allowUnknown: true });
    if (result.error) {
        if (req.file) {
            //delete uploaded img from form because validation failed
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
    } else {
        req.body.default = false
    }
    
    const container = new Container({...req.body});

    let redirect ="";

    try {
        const user = await User.findOne({_id : req.body.partnerId})
        
        if (user && user.status == "admin") {
            redirect = "/dashboard/container"
        } else {
            const partner = await Partner.findOne({_id : req.body.partnerId})
                redirect =`/mycontainer/${partner.idUser}`;
        }
    } catch {
        res.status(400).render('pages/error',{ error: "Le contenant n'a pas été créé"} )
    }
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

    //JOI form validation
    const schema = joi.object().keys({
        name: joi.string().trim().required(),
        material: joi.string().trim().required(),
        credit: joi.number().required()
    });

    const result = schema.validate(req.body, { allowUnknown: true });
    if (result.error) {
        if (req.file) {
            //delete uploaded img from form because validation failed
            fs.unlink(`./public/img/container/${req.file.filename}`, () => {});
        }
        res.status(400).render('pages/error',{ error: result.error.details[0].message});
        return;
    }

    let container = {...req.body}

    if (req.file) {
        //delete old img
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
    .then(() => {res.status(200).redirect(`/container/${req.params.containerId}`)})
    .catch(error => res.status(400).render('pages/error',{ error: "Le contenant n'a pas pu être modifié"} ));
};

exports.deleteContainer = async (req, res, next) => {
    try {
        const container = await Container.findOne({_id:req.params.containerId});
    
        if ((container.image != "noImage" && container.basedOnDefault == false) || (container.image != "noImage" && container.default == true)) {
            //delete img
            fs.unlink(`./public/img/container/${JSON.parse(container.image).filename}`, () => {});
    } 
        let redirect ="";
        const user = await User.findOne({_id : container.partnerId})
        
        if (user && user.status == "admin") {
            redirect = "/dashboard/container"
        } else {
            const partner = await Partner.findOne({_id : container.partnerId})
            redirect =`/mycontainer/${partner.idUser}`;
        }
        await Container.deleteOne({_id: req.params.containerId})
        res.status(200).redirect(redirect)
    } catch {
        res.status(400).render('pages/error',{ error: "Le contenant n'a pas été supprimé"})
    }
};

exports.getAllPartnerContainer = (req, res, next) => {
    Container.find({partnerId:req.params.id})
    .then(container => res.status(200).json(container))
    .catch(error => res.status(404).render('pages/error',{ error: "Contenants introuvables"} ));
};