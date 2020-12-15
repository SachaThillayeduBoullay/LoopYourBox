const jwt = require('jsonwebtoken');


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

        if (!userInfo || (userInfo._id != req.params.id && userInfo.status != 'admin')) {
            throw `Vous n'avez pas accès à cette page`;
        } else {
            next();
        }
    } catch (error) {
        res.status(401).render('pages/noaccess',{error})
    }
};