global.fetch = require("node-fetch");
const jwt = require('jsonwebtoken');
const checkStatus = require('../../public/js/checkstatus');

exports.partnerPage = async (req, res) => { 
    let url;
    if (req.query) {
        let urlStringFilter = "?";
        for (let property in req.query) {
            urlStringFilter += `${property}=${req.query[property]}&`
        }
        urlStringFilter = urlStringFilter.slice(0, urlStringFilter.length-1)
        url = `http://localhost:3000/api/partner${urlStringFilter}`;
    
    }
    
    try {
        let urlSelect = `http://localhost:3000/api/partner`;

        let partnerInfoForSelect = await fetch(urlSelect);
        partnerInfoForSelect = await partnerInfoForSelect.json();

        let partnerInfo = await fetch(url);
        partnerInfo = await partnerInfo.json();
        
        partnerInfo.forEach(info => {
            if(info.image != "noImage") {
                info.image = JSON.parse(info.image);
            }
        })

        let foodType = Array.from(new Set(partnerInfoForSelect.map(element => element.foodType))).sort();
        let chain = Array.from(new Set(partnerInfoForSelect.map(element => element.chain))).sort();
        let postcode = Array.from(new Set(partnerInfoForSelect.map(element => element.address.postcode))).sort();
        let city = Array.from(new Set(partnerInfoForSelect.map(element => element.address.city))).sort();

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

        res.render('pages/partner/partner', { selectInfo, containerInfo, partnerInfo})
    } catch {
        res.status(401).json({error: 'Failed Request'});
    }
};

exports.partnerDetailsPage = async (req, res) => { 
    try {
        let statusInfo = {userStatus: 'guest'};

        if(req.cookies["token"]) {
            statusInfo = await checkStatus(req.cookies["token"]);
        }

        let url = `http://localhost:3000/api/partner/${req.params.id}`;

        let partnerInfo = await fetch(url);
        partnerInfo = await partnerInfo.json();

        if (partnerInfo.image != "noImage") {
            partnerInfo.image = JSON.parse(partnerInfo.image);
        }
        res.render('pages/partner/partnerDetails', {partnerInfo, statusInfo});
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