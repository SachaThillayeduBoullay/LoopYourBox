const express = require ('express');
const User = require ('../../models/user');
const Partner = require ('../../models/partner');
const Container = require ('../../models/container');
const UserContainer = require ('../../models/userContainer');
const bcrypt = require ('bcrypt');
const jwt = require ('jsonwebtoken');
const joi = require ('joi-oid');
const nodemailer = require ('nodemailer');
const Point = require ('../../models/point');

exports.getAllUser = (req, res, next) => {
  User.find ()
    .then (things => res.status(200).json(things))
    .catch (error => res.status(400).render('pages/error',{ error: `Membres introuvables`}));
};



exports.getOneUser = (req, res, next) => {
  User.findOne ({_id: req.params.id})
    .then (user => res.status(200).json(user))
    .catch (error => res.status(404).render('pages/error',{ error: `Membre introuvable`}));
};




exports.login = (req, res, next) => {
  User.findOne ({email: req.body.email.toLowerCase()})
    .then (user => {
      if (!user) {
        return res.status(401).render('pages/error',{ error: `Membre introuvable`});
      }
      bcrypt
        .compare (req.body.password, user.password)
        .then (valid => {
          if (!valid) {
            return res.status(401).render('pages/error', {error: 'Email ou mot de passe incorrect'});
          }
          const token = jwt.sign ({userId: user._id}, process.env.JWT_PW, {
            expiresIn: '24h',
          });
          res.cookie ('token', token, { maxAge: 1000*60*60*24*30*12 });
          res.status(200).redirect ('/partner');
        })
        .catch (error => res.status(500).render('pages/error',{ error: `Cryptage du mot de passe raté`}));
    })
    .catch (error => res.status(500).render('pages/error',{ error: `Membre introuvable`}));
};


exports.signup = async (req, res, next) => {
  const schema = joi.object ().keys ({
    firstname: joi.string ().trim ().required (),
    lastname: joi.string ().trim ().required (),
    email: joi.string ().trim ().email ().required (),
    password: joi
      .string ()
      .pattern (
        new RegExp (
          '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
        )
      )
      .required (), //1 upper, 1 lower, 1 number, 1 special char, 8 min length
    confirmPassword: joi
      .any ()
      .equal (joi.ref ('password'))
      .required ()
      .label ('Confirm password')
      .messages ({'any.only': '{{#label}} does not match'}),
    status: joi.any ().valid ('member'),
  });

  const result = schema.validate (req.body);
  if (result.error) {
    res.status(400).render('pages/error',{ error: result.error.details[0].message});
    return;
  }

  bcrypt
    .hash (req.body.password, 10)
    .then (hash => {
      const user = new User ({
        ...req.body,
        password: hash,
        email: req.body.email.toLowerCase()
      });

      const point = new Point ({
        userId: user._id,
      });

      point.save ();
      user
        .save ()
        .then (() => res.status(201).redirect ('/login'))
        .catch (() => res.status(400).render('pages/error', { error: `Le membre n'a pas pu être créé`}));
    })
    .catch (() => res.status(500).render('pages/error', { error: `Le membre n'a pas pu être créé`}));
};




exports.updateUser = (req, res, next) => {
    const schema = joi.object ().keys ({
        firstname: joi.string ().trim ().required (),
        lastname: joi.string ().trim ().required (),
        email: joi.string ().trim ().email ().required (),
      });
    
      const result = schema.validate (req.body);
      if (result.error) {
        res.status(400).render('pages/error',{ error: result.error.details[0].message});
        return;
    }

  if (req.body.password) {
    bcrypt
      .hash (req.body.password, 10)
      .then (hash => {
        User.updateOne (
          {_id: req.params.id},
          {...req.body, 
            _id: req.params.id, 
            password: hash,
            email: req.body.email.toLowerCase()
          }
        )
          .then (() => {
            res.status(200).redirect ('/myaccount');
          })
          .catch (error => res.status(400).render('pages/error',{ error: `Le membre n'a pas pu être modifié`}));
      })
      .catch (error => res.render('pages/error',{ error: `Le mot de passe n'a pas pu être crypté`}));
  }

  User.updateOne ({_id: req.params.id}, {...req.body, _id: req.params.id, email: req.body.email.toLowerCase()})
    .then (() => {
      res.status(200).redirect ('/myaccount');
    })
    .catch (error => res.status(400).render('pages/error',{ error: `Membre non modifié`}));
};

exports.updateUserStatus = (req, res, next) => {
  const schema = joi.object ().keys ({
      status: joi.string ().trim ().required (),
    });
  
    const result = schema.validate (req.body);
    if (result.error) {
      res.status(400).render('pages/error',{ error: result.error.details[0].message});
      return;
  }

User.updateOne ({_id: req.params.id}, {...req.body})
  .then (() => {
    res.status(200).redirect ('/dashboard/user');
  })
  .catch (error => res.status(400).render('pages/error',{ error: `Membre non modifié`}));
};



exports.deleteUser = async (req, res, next) => {
  try {
  await UserContainer.deleteMany ({userId: req.params.id})
  await Point.deleteOne ({userId: req.params.id})

  const partner = await Partner.findOne({idUser: req.params.id});

  if (partner) {
    await Container.deleteMany ({partnerId: partner._id})
    await Partner.deleteOne ({_id: partner._id})
  }

  await User.deleteOne ({_id: req.params.id})
  res.clearCookie('token').status(200).redirect('/')
    
  } catch {
    res.status(400).render('pages/error',{ error: `Ce compte n'a pas pu être supprimé`});
  }
};


exports.lostPwd = (req, res, next) => {
  User.findOne ({email: req.body.email.toLowerCase()})
    .then (user => {
      let transporter = nodemailer.createTransport ({
        host: 'felix.o2switch.net',
        port: 465,
        secure: true, // use SSL
        auth: {
          user: '_mainaccount@heqo8419.odns.fr',
          pass: process.env.EMAIL_PSWD,
        },
        tls: {
          rejectUnauthorized: false
        }
      });

      let mailOptions = {
        from: 'noreply@loopyourbox.com',
        to: req.body.email.toLowerCase(),
        subject: 'Password reset',
        html: `
            <h1>Loop Your Box</h1>
            <p>Please click on the link to change your password: </p>
            <p>
                <a href="${process.env.DOMAIN}/passwordrecovery?id=${user._id}">Change password</a>
            </p>
            `,
      };

      transporter.sendMail (mailOptions, function (error, info) {
        if (error) {
          console.log (error);
        } else {
          //console.log ('Email sent: ' + info.response);
          res.redirect ('/');
        }
      });
    })
    .catch (error => res.status(404).render('pages/error',{ error: `Membre introuvable`}));
};




exports.getLogout = (req, res) => {
  res.clearCookie ('token');
  res.redirect ('/');
};




exports.modifyPassword = (req, res, next) => {
const schema = joi.object ().keys ({
    oldPassword: joi
    .string ()
    .pattern (
    new RegExp (
        '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
    )
    )
    .required (),
    password: joi
        .string ()
        .pattern (
        new RegExp (
            '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
        )
        )
        .required (), //1 upper, 1 lower, 1 number, 1 special char, 8 min length
    confirmPassword: joi
        .any ()
        .equal (joi.ref ('password'))
        .required ()
        .label ('Confirm password')
        .messages ({'any.only': '{{#label}} does not match'}),
    status: joi.any ().valid ('member'),
    });

    const result = schema.validate (req.body);
    if (result.error) {
    res.status(400).render('pages/error',{ error: result.error.details[0].message});
    return;
    }

  if (req.body.password == req.body.confirmPassword) {
    if (req.body.password == req.body.oldPassword) {
      return res.status(401).render('pages/error',{ error: `Veuillez entrer un nouveau mot de passe`});
    }
    User.findOne ({_id: req.params.id}).then (user => {
      if (!user) {
        return res.status(401).render('pages/error',{ error: `Membre introuvable`});
      }

      bcrypt.compare (req.body.oldPassword, user.password).then (valid => {
        if (!valid) {
          return res.status(401).render('pages/error',{ error: `Mauvais mot de passe`});
        }

        bcrypt.hash (req.body.password, 10)
        .then (hash => {
          User.updateOne (
            {_id: req.params.id},
            {password: hash, _id: req.params.id}
          )
            .then (() => {
              res.status(200).redirect ('/myaccount');
            })
            .catch (error => res.status(400).render('pages/error',{ error: `Membre non modifié`}));
        })
        .catch (error => res.status(400).render('pages/error',{ error: `Le mot de passe n'a pas pu être crypté`}));
      });
    });
  } else {
    return res.status(401).render('pages/error',{ error: `Les mots de passe ne correspondent pas`});
  }
};




exports.recoveryPassword = (req, res, next) => {
  const schema = joi.object ().keys ({
      password: joi
          .string ()
          .pattern (
          new RegExp (
              '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
          )
          )
          .required (), //1 upper, 1 lower, 1 number, 1 special char, 8 min length
      confirmPassword: joi
          .any ()
          .equal (joi.ref ('password'))
          .required ()
          .label ('Confirm password')
          .messages ({'any.only': '{{#label}} does not match'}),
      });
  
      const result = schema.validate (req.body);
      if (result.error) {
      res.status(400).render('pages/error',{ error: result.error.details[0].message});
      return;
      }
  
    if (req.body.password == req.body.confirmPassword) {
 
      User.findOne ({_id: req.params.id}).then (user => {
        if (!user) {
          return res.status(401).render('pages/error',{ error: `Membre introuvable`});
        }
  
        bcrypt.hash (req.body.password, 10)
        .then (hash => {
          User.updateOne ({_id: req.params.id}, {password: hash, _id: req.params.id})
            .then (() => {
              res.status(200).redirect ('/login');
            })
            .catch (error => res.status(400).render('pages/error',{ error: `Membre non modifié`}));
        })
        .catch (error => res.status(400).render('pages/error',{ error: `Le mot de passe n'a pas pu être crypté`}));
        });
    } else {
      return res.status(401).render('pages/error',{ error: `Les mots de passe ne correspondent pas`});
    }
  };
  
