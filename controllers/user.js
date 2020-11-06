const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');



exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
        const user = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: hash
        });
        user.save()
            .then(() => res.status(201).redirect('/index'))
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






