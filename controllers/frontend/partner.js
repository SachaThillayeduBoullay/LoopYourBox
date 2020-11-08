global.fetch = require("node-fetch");
const jwt = require('jsonwebtoken');

exports.partnerPage = async (req, res) => { 
    try {
        let url = `http://localhost:3000/api/partner/`;

        let partnerInfo = await fetch(url);
        partnerInfo = await partnerInfo.json();

        let foodType = Array.from(new Set(partnerInfo.map(element => element.foodType)));
        let chain = Array.from(new Set(partnerInfo.map(element => element.chain)));
        let postcode = Array.from(new Set(partnerInfo.map(element => element.address.postcode)));
        let city = Array.from(new Set(partnerInfo.map(element => element.address.city)));

        let selectInfo = {
            foodType: foodType,
            chain: chain,
            postcode: postcode,
            city: city
        };

        //console.log(selectInfo)

        res.render('pages/partner/partner', {partnerInfo, selectInfo})
    } catch {
        res.status(401).json({error: 'Failed Request'});
    }
};

exports.partnerDetailsPage = async (req, res) => { 
    try {
        let url = `http://localhost:3000/api/partner/${req.params.id}`;

        let partnerInfo = await fetch(url);
        partnerInfo = await partnerInfo.json();

        if (partnerInfo.image != "noImage") {
            partnerInfo.image = JSON.parse(partnerInfo.image);
        }
        console.log(partnerInfo)
        res.render('pages/partner/partnerDetails', {partnerInfo});
    } catch {
        res.status(401).json({error: 'Failed Request'});
    }
};

exports.createPartnerPage = (req, res) => { 
    const token = req.cookies["token"];
    const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET");
    const userId = decodedToken.userId;
    res.render('pages/partner/createPartner', {userId})
};

exports.updatePartnerPage = async (req, res) => { 
    try {
        const token = req.cookies['token'];
        let url = `http://localhost:3000/api/partner/${req.params.id}`;

        let myInit = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };

        let partnerInfo = await fetch(url, myInit);
        partnerInfo = await partnerInfo.json();

        if (partnerInfo.image != "noImage") {
            partnerInfo.image = JSON.parse(partnerInfo.image);
        }

        res.render('pages/partner/updatePartner', {partnerInfo})
    } catch {
        res.status(401).json({error: 'Unauthenticated Request'});
    }
};