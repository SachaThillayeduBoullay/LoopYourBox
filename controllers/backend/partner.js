const Partner = require('../../models/partner');
const joi = require('joi');

exports.createPartner = (req, res, next) => {

    const schemaSchedule = joi.object().keys({
        monday: joi.string().trim().required(),
        tuesday: joi.string().trim().required(),
        wednesday: joi.string().trim().required(),
        thursday: joi.string().trim().required(),
        friday: joi.string().trim().required(),
        saturday: joi.string().trim().required(),
        sunday: joi.string().trim().required()
    });

    const schema = joi.object().keys({
        name: joi.string().trim().required(),
        phoneNumber: joi.string().trim().required(),
        address: joi.string().trim().required(),
        website: joi.string().trim().required(),
        image: joi.string().trim().required(),
        schedule: schemaSchedule, //not working
        foodType: joi.string().trim().required(),
        idUser: joi.string().trim().required(),
        lat: joi.string().trim().required(),
        long: joi.string().trim().required(),
        chain: joi.string().trim().required()
    });

    const result = schema.validate(req.body, { allowUnknown: true }); //need to change
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const partner = new Partner({
        ...req.body,
        image: JSON.stringify(req.file)
        
    });
    partner.save()
        .then(() => res.status(201).redirect('/'))
        .catch(error => res.status(400).json({ error }));
};