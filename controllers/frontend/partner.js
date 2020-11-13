global.fetch = require("node-fetch");

exports.partnerPage = async (req, res) => { 
    try {
        let url = `http://localhost:3000/api/partner/`;

        let partnerInfo = await fetch(url);
        partnerInfo = await partnerInfo.json();

        res.render('pages/partner/partner', {partnerInfo})
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

exports.createPartnerPage = (req, res) => { res.render('pages/createPartner')};

exports.updatePartnerPage = async (req, res) => { 
    try {
        //const token = req.cookies['token'];
        let url = `http://localhost:3000/api/partner/${req.params.id}`;

        /*let myInit = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };*/

        let partnerInfo = await fetch(url /*, myInit*/);
        partnerInfo = await partnerInfo.json();

        if (partnerInfo.image != "noImage") {
            partnerInfo.image = JSON.parse(partnerInfo.image);
        }

        res.render('pages/partner/updatePartner', {partnerInfo})
    } catch {
        res.status(401).json({error: 'Unauthenticated Request'});
    }
};