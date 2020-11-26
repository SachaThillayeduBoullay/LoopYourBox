global.fetch = require("node-fetch");

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

exports.loginPage = async (req, res) => { 
        res.render('pages/user/login')
};

exports.updatePasswordPage = async (req, res) => {
    try {
        let url = `http://localhost:3000/api/user/${req.params.id}`;

        let userInfo = await fetch(url);
        userInfo = await userInfo.json();

        res.render('pages/user/updatePassword', {userInfo})
    } catch {
        res.status(401).json({error: 'Unauthenticated Request'});
    }
}