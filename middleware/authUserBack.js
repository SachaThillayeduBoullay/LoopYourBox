const jwt = require('jsonwebtoken');
const User = require ('../models/user');

//must be member and the member himself or admin to acces backend routes (/api/...)
module.exports = async (req, res, next) => {
    try {
        
        let token="";
        if(!req.cookies.token){  
            token = req.headers.authorization.split(' ')[1];
        } else {
            token = req.cookies.token;
        }
        const decodedToken = jwt.verify(token, process.env.JWT_PW)
        const userId = decodedToken.userId;
        
        const userInfo = await User.findOne ({_id: userId});

        if (!userInfo || (userInfo._id != req.params.id && userInfo.status != 'admin')) {
            throw `Vous n'avez pas accès à cette page`;
        }  else { 
            next()
        }
    } catch (error) {
        res.status(401).render('pages/error',{error})
    }
};