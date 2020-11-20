global.fetch = require("node-fetch");

exports.pointPage = async (req, res) => { 
    try {
        let url = `http://localhost:3000/api/user/`;

        let userInfo = await fetch(url);
        userInfo = await userInfo.json();

        res.render('pages/point/point', {userInfo})
    } catch {
        res.status(401).json({error: 'Failed Request'});
    }
};