const jwt = require('jsonwebtoken');

exports.pointPage = async (req, res) => { 
    try {
        const token = req.cookies["token"];
        const decodedToken = jwt.verify(token, process.env.JWT_PW);
        const userId = decodedToken.userId;
        let urlPoint = `http://localhost:3000/api/point/${userId}`;

        let pointInfo = await fetch(urlPoint);
        pointInfo = await pointInfo.json();
     
        res.render('pages/point/point.ejs', {pointInfo})
    } catch {
        res.status(401).json({error: 'Failed Request'});
    }
};