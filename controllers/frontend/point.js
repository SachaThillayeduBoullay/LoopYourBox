const jwt = require('jsonwebtoken');

exports.pointPage = async (req, res) => { 
    try {
        const token = req.cookies["token"];
        const decodedToken = jwt.verify(token, process.env.JWT_PW);
        const userId = decodedToken.userId;
        let urlPoint = `${process.env.DOMAIN}/api/point/${userId}`;

        let myInit = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };

        let pointInfo = await fetch(urlPoint, myInit);
        pointInfo = await pointInfo.json();
     
        res.render('pages/point/point.ejs', {pointInfo})
    } catch {
        res.status(401).render('pages/error',{ error: `Requête invalide`});
    }
};