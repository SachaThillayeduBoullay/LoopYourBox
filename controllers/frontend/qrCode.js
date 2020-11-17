const jwt = require('jsonwebtoken');

exports.qrCodePage = (req, res) => { 
    res.render('pages/qrcode/qrcode');
}

exports.qrCodePartnerPage = async (req, res) => { 

    try {
        const token = req.cookies["token"];
        const decodedToken = jwt.verify(token, process.env.JWT_PW);
        const userId = decodedToken.userId;

        let url = `http://localhost:3000/api/partner/container/${userId}`;

        let partnerInfo = await fetch(url);
        partnerInfo = await partnerInfo.json();

        let urlContainer = `http://localhost:3000/api/containerpartner/${partnerInfo._id}`;
        let containerInfo = await fetch(urlContainer);
        containerInfo = await containerInfo.json();

        res.render('pages/qrcode/qrcodegenerator', {partnerId : partnerInfo._id, containerInfo});
    } catch {
        res.status(401).json({error: 'Failed Request'});
    }

    
}
