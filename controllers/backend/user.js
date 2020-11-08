const User = require('../../models/user');
const joi = require('joi');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/*
exports.createUser = (req, res, next) => {

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
        //address: schemaAddress,
        website: joi.string().trim().empty(''),
        schedule: schemaSchedule, //not working
        foodType: joi.string().trim(),
        idUser: joi.string().trim().required(),
        chain: joi.string().trim().empty('')
    });

    const result = schema.validate(req.body, { allowUnknown: true }); //need to change
    if (result.error) {
        if (req.file) {
            fs.unlink(`./public/img/user/${req.file.filename}`, () => {});
        }
        res.status(400).send(result.error.details[0].message);
        return;
    }


    const user = new User({
        ...req.body,
        image: JSON.stringify(req.file),
        address: JSON.parse(req.body.address)
    });
    user.save()
        .then(() => res.status(201).redirect('/user'))
        .catch(error => res.status(400).json({ error }));
};
*/

exports.getAllUser = (req, res, next) => {

    User.find()
    .then(users => res.status(200).json(users))
    .catch(error => res.status(400).json({error}));

};

exports.getOneUser = (req, res, next) => {
    User.findOne({_id:req.params.id})
    .then(user => res.status(200).json(user))
    .catch(error => res.status(404).json({error}));
};

exports.updateUser = (req, res, next) => {

    if (req.body.password) {
        bcrypt.hash(req.body.password, 10)
        .then(hash => {
            //console.log(hash);
            User.updateOne({_id: req.params.id}, {...req.body, _id: req.params.id, password: hash})
            .then(() => {
                res.status(200).redirect('/myprofile');
            })
            .catch(error => res.status(400).json({ error }));
            }
        )
        .catch(error => res.json({error}));
    }

    User.updateOne({_id: req.params.id}, {...req.body, _id: req.params.id})
    .then(() => {
        res.status(200).redirect('/user');
    })
    .catch(error => res.status(400).json({ error }));
};

exports.deleteUser = (req, res, next) => {
    User.findOne({_id:req.params.id})
    .then(user => {
        User.deleteOne({_id: req.params.id})
                .then(()=> res.status(200).redirect('/user'))
                .catch(error => res.status(400).json({error}));
    })
    .catch(error => res.status(404).json({error}));
};



exports.signup = (req, res, next) => {
   bcrypt.hash(req.body.password, 10)
       .then(hash => {
        const user = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: hash,
        });
        user.save()
            .then(() => res.status(201).redirect('/user'))
            .catch(error => res.status(400).json({ error }));
      })
        .catch(error => res.status(500).json({ error }));
};


exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
    .then (user => {
        if(!user) {
            return res.status(401).json({error: 'User not found'});
        }
        bcrypt.compare(req.body.password, user.password)
        .then (valid =>{
            if (!valid) {
                return res.status(401).json({error: 'Wrong password'});
            }
            const token = jwt.sign(
                {userId: user._id},
                'RANDOM_TOKEN_SECRET',
                {expiresIn: '24h'}
                );
            res.cookie('token', token);
            res.status(200).redirect('/my-account');
        })
        .catch(error => res.status(500).json({error}));
    })
    .catch (error => res.status(500).json({error}));
};