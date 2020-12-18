const jwt = require('jsonwebtoken');
const User = require ('../models/user');

//must be partner or admin to acces backend routes (/api/...)
module.exports = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        const decodedToken = jwt.verify(token, process.env.JWT_PW)
        const userId = decodedToken.userId;
        
        const userInfo = await User.findOne({_id: userId});
        
        if (!userInfo || userInfo.status == 'member') {
            throw `Vous n'êtes pas partenaire`;
        } else {
            next();
        }
    } catch (error) {
        res.status(401).render('pages/error',{error})
    }
};