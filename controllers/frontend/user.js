global.fetch = require("node-fetch");
const jwt = require('jsonwebtoken');

exports.userPage = async (req, res) => { 
    try {
        let url = `http://localhost:3000/api/user/`;

        let userInfo = await fetch(url);
        userInfo = await userInfo.json();

        res.render('pages/user/login', {userInfo})
    } catch {
        res.status(401).json({error: 'Failed Request'});
    }
};

exports.userDetailsPage = async (req, res) => { 
    try {
        let url = `http://localhost:3000/api/user/${req.params.id}`;

        let userInfo = await fetch(url);
        userInfo = await userInfo.json();

        res.render('pages/user/userDetails', {userInfo});
    } catch {
        res.status(401).json({error: 'Failed Request'});
    }
};

exports.createUserPage = (req, res) => { res.render('pages/user/register')};

exports.updateUserPage = async (req, res) => { 
    try {
        //const token = req.cookies['token'];
        let url = `http://localhost:3000/api/user/${req.params.id}`;

        /*let myInit = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };*/

        let userInfo = await fetch(url /*, myInit*/);
        userInfo = await userInfo.json();

        res.render('pages/user/updateUser', {userInfo})
    } catch {
        res.status(401).json({error: 'Unauthenticated Request'});
    }
};


exports.changePasswordPage = async (req, res) => { 
    try {
        const token = req.cookies['token'];
        const decodedToken = jwt.verify(token, process.env.JWT_PW);
        const userId = decodedToken.userId;

        //let url = `http://localhost:3000/api/user/${req.params.id}`;

        /*let myInit = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };*/

        //let userInfo = await fetch(url /*, myInit*/);
        //userInfo = await userInfo.json();

        res.render('pages/user/changepassword', {userId})
    } catch {
        res.status(401).json({error: 'Unauthenticated Request'});
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