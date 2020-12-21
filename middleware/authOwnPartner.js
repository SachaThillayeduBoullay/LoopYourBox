const jwt = require('jsonwebtoken');

//must be partner and the partner itself or admin to acces frontend routes
module.exports = async (req, res, next) => {
    try {
        const token = req.cookies['token'];
        const decodedToken = jwt.verify(token, process.env.JWT_PW)
        const userId = decodedToken.userId;

        let url = `${process.env.DOMAIN}/api/user/${userId}`;

        let myInit = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };  

        let userInfo = await fetch(url, myInit);
        userInfo = await userInfo.json();
        
        let urlPartner = `${process.env.DOMAIN}/api/partner/container/${userId}`;

        let partnerInfo = await fetch(urlPartner, myInit);
        partnerInfo = await partnerInfo.json();

        if (!partnerInfo) {
            partnerInfo = {};
            partnerInfo.idUser = "none";
        }
        if ((userInfo && userInfo._id == partnerInfo.idUser && userInfo.status != 'member') || userInfo.status == 'admin') {
            next();
        } else {
            throw `Vous n'êtes pas partenaire`;
        }
    } catch (error){
        res.status(401).render('pages/error',{error})
    }
};