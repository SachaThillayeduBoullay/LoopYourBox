const jwt = require('jsonwebtoken');
const User = require("../models/user");

//must be at least member to acces backend routes (/api/...)
module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_PW)
        const userId = decodedToken.userId;

        const userInfo = await User.findOne ({_id: userId});

        if (!userInfo) {
            throw `Ce membre n'existe pas`;
        } else {
            next();
        }
    } catch (error){
        res.status(401).render('pages/error',{error})
    }
};