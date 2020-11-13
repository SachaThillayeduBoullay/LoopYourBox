const express = require('express');
const User = require('../../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const joi = require('joi-oid');
const nodemailer = require('nodemailer');

exports.getAllUser = (req, res, next) => {
    User.find()
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({error}));
    };

exports.getOneUser = (req, res, next) => {
    User.findOne({_id:req.params.id})
    .then(user => res.status(200).json(user))
    .catch(error => res.status(404).json({error}));
};

exports.getLastUser = (req, res, next) => {
    User.find().sort({ _id: -1 }).limit(1)
    .then(user => res.status(200).json(user))
    .catch(error => res.status(404).json({error}));
};

exports.createUser = async (req, res, next) => {

    const schema = joi.object().keys({
        firstname: joi.string().trim().required(),
        lastname: joi.string().trim().required(),
        birthdate: joi.string().trim().required(),
        mainSport: joi.string().trim().required(),
        email: joi.string().trim().email().required(),
        password: joi.string().pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$')).required(), //1 upper, 1 lower, 1 number, 1 special char, 8 min length
        confirmPassword: joi.any().equal(joi.ref('password'))
        .required()
        .label('Confirm password')
        .messages({ 'any.only': '{{#label}} does not match' }),
        status: joi.any().valid('member')
    });

    const result = schema.validate(req.body);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    bcrypt.hash(req.body.password, 10)
    .then(hash => {
            const user = new User({
            ...req.body,
            password: hash
        })
    
    user.save()
      .then(() => res.status(201).redirect('/signup3/'))
      .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
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
        res.status(200).redirect('/myprofile');
    })
    .catch(error => res.status(400).json({ error }));
};

exports.deleteUser = (req, res, next) => {
    User.deleteOne({_id: req.params.id})
    .then(()=> res.status(200).json({message: 'Your account has been deleted'}))
    .catch(error => res.status(400).json({error}));
};

exports.signin = (req, res, next) => {
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
            res.status(200).redirect('/home/');
        })
        .catch(error => res.status(500).json({error}));
    })
    .catch (error => res.status(500).json({error}));
};

exports.lostPwd = (req, res, next) => {

    User.findOne({email:req.body.email})
    .then(user => {
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // use SSL
            auth: {
              user: 'becode.netp@gmail.com',
              pass: '123Banane!'
            }
        });
          
        let mailOptions = {
            from: 'contact@npproject.com',
            to: req.body.email,
            subject: 'Sending Email using Node.js',
            html: `
            <h1>npProject</h1>
            <p>Click on the link to change your password: </p>
            <p>
                <a href="http://localhost:3000/changepwd?id=${user._id}">Change password</a>
            </p>
            `
        };

          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
              res.redirect('/');
            }
          });
    })
    .catch(error => res.status(404).json({error}));

    
};
