const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    try {
        const token = req.cookies['token'];
        const decodedToken = jwt.verify(token, process.env.JWT_PW)
        const userId = decodedToken.userId;

        let url = `http://localhost:3000/api/user/${userId}`;

        let myInit = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };  

        let userInfo = await fetch(url, myInit);
        userInfo = await userInfo.json();
        
        let urlPartner = `http://localhost:3000/api/partner/container/${userId}`;

        let partnerInfo = await fetch(urlPartner, myInit);
        partnerInfo = await partnerInfo.json();

        if (!partnerInfo) {
            partnerInfo = {};
            partnerInfo.idUser = "none";
        }
        if ((userInfo && userInfo._id == partnerInfo.idUser && userInfo.status != 'member') || userInfo.status == 'admin') {
            next();
        } else {
            throw `Ce membre n'est pas partenaire`;
        }
    } catch {
        res.status(401).json({
            error: new Error('Invalid request')
        });
    }
};