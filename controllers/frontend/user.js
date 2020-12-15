global.fetch = require("node-fetch");
const jwt = require('jsonwebtoken');



exports.userDetailsPage = async (req, res) => { 
    try {
        const token = req.cookies['token'];
        let url = `${process.env.DOMAIN}/api/user/${req.params.id}`;

        let myInit = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };

        let userInfo = await fetch(url, myInit);
        userInfo = await userInfo.json();

        res.render('pages/user/userDetails', {userInfo});
    } catch {
        res.status(401).render('pages/error',{ error: `Requête invalide`});
    }
};

exports.createUserPage = (req, res) => { res.render('pages/user/register')};

exports.updateUserPage = async (req, res) => { 
    try {
        const token = req.cookies['token'];
        let url = `${process.env.DOMAIN}/api/user/${req.params.id}`;

        let myInit = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };

        let userInfo = await fetch(url , myInit);
        userInfo = await userInfo.json();

        res.render('pages/user/updateUser', {userInfo})
    } catch {
        res.status(401).render('pages/error',{ error: `Requête invalide`});
    }
};


exports.changePasswordPage = async (req, res) => { 
    try {
        const token = req.cookies['token'];
        const decodedToken = jwt.verify(token, process.env.JWT_PW);
        const userId = decodedToken.userId;

        //let url = `${process.env.DOMAIN}/api/user/${req.params.id}`;

        /*let myInit = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };*/

        //let userInfo = await fetch(url /*, myInit*/);
        //userInfo = await userInfo.json();

        res.render('pages/user/changepassword', {userId})
    } catch {
        res.status(401).render('pages/error',{ error: `Requête invalide`});
    }
};

exports.loginPage = async (req, res) => { 
        res.render('pages/user/login')
};

exports.lostPasswordPage = async (req, res) => { 
    res.render('pages/user/lostpassword')
};

exports.passwordRecoveryPage = async (req, res) => { 
    const userId = req.query.id;
    res.render('pages/user/passwordrecovery', {userId})
};