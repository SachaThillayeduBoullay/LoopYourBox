global.fetch = require("node-fetch");
const jwt = require('jsonwebtoken');

exports.partnerPage = async (req, res) => { 
    try {
        let url = `http://localhost:3000/api/partner/`;

        let partnerInfo = await fetch(url);
        partnerInfo = await partnerInfo.json();

        let foodType = Array.from(new Set(partnerInfo.map(element => element.foodType))).sort();
        let chain = Array.from(new Set(partnerInfo.map(element => element.chain))).sort();
        let postcode = Array.from(new Set(partnerInfo.map(element => element.address.postcode))).sort();
        let city = Array.from(new Set(partnerInfo.map(element => element.address.city))).sort();

        let urlContainer = `http://localhost:3000/api/container/`;

        let containerInfo = await fetch(urlContainer);
        containerInfo = await containerInfo.json();

        let material = Array.from(new Set(containerInfo.map(element => element.material))).sort();

        let selectInfo = {
            foodType: foodType,
            chain: chain,
            postcode: postcode,
            city: city,
            material: material
        };

        res.render('pages/partner/partner', {partnerInfo, selectInfo, containerInfo})
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
        res.render('pages/partner/partnerDetails', {partnerInfo});
    } catch {
        res.status(401).json({error: 'Failed Request'});
    }
};

exports.createPartnerPage = (req, res) => { 
    try {
        const token = req.cookies["token"];
        const decodedToken = jwt.verify(token, process.env.JWT_PW);
        const userId = decodedToken.userId;
        res.render('pages/partner/createPartner', {userId})
    } catch {
        res.status(401).json({error: 'You cannot access this page'});
    }
    
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