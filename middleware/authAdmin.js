const jwt = require('jsonwebtoken');

//must be admin to acces frontend routes
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

        if (!userInfo || userInfo.status != 'admin' ) {
            throw `Vous n'êtes pas administrateur`;
        } else {
            next();
        }
    } catch (error) {
        res.status(401).render('pages/error',{error});
    }
};