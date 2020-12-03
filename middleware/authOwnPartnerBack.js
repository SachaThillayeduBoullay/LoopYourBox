const jwt = require('jsonwebtoken');
const Partner = require("../models/partner");
const User = require("../models/user");


module.exports = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    const decodedToken = jwt.verify(token, process.env.JWT_PW);
    const userId = decodedToken.userId;


    const user = await User.findOne({_id: userId});
    if(user.status != "admin") {
      const partner = await Partner.findOne({ _id: req.params.id })
        if(partner.idUser != userId) {  

          res.status(401).json({ error: `Vous n'avez pas accès à cette page`});
        } else {
          next();
        }
    } else {
      next();
    }
  } catch (error) {
    res.status(401).render('pages/error',{error})
  }
};