const express = require ('express');
const nodemailer = require ('nodemailer');


exports.sendEmail = (req, res, next) => {

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
            from: `${req.body.email}`,
            to: 'francesca@loopyourbox.be',
            subject: `${req.body.object}`,

            // Mail HTML
            html: `
                <p>Prénom: ${req.body.firstname}</p>
                <p>Nom: ${req.body.lastname}</p>
                <p>Email: ${req.body.email}</p>
                <p>Message: </p>
                <div>${req.body.message}</div>
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
};
