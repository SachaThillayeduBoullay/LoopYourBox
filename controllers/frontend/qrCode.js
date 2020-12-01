const jwt = require('jsonwebtoken');
const checkStatus = require('../../public/js/checkstatus');

exports.qrCodePage = async (req, res) => { 
    if(req.cookies["token"]) {
        statusInfo = await checkStatus(req.cookies["token"]);
    
        if (statusInfo.userStatus == "partner") {
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
        } else if (statusInfo.userStatus == "member" || statusInfo.userStatus == "admin")
            res.render('pages/qrcode/qrcode');
    } else {
        res.status(401).json({error: 'You need to signup to see this page'});
    }
}

exports.confirmationPage = async (req, res) => { 
    try {
        const reference = req.query.ref;
        const token = req.cookies["token"];

        let url = `http://localhost:3000/api/history/${reference}`;

        let historyInfo = await fetch(url);
        historyInfo = await historyInfo.json();

        let urlPartner = `http://localhost:3000/api/partner/${historyInfo.partnerId}`;
        let partnerInfo = await fetch(urlPartner);
        partnerInfo = await partnerInfo.json();

        let urlContainer = `http://localhost:3000/api/container/${historyInfo.containerId}`;
        let containerInfo = await fetch(urlContainer);
        containerInfo = await containerInfo.json();

        //const localNow = new Date (historyInfo.date.getTime() -  ( historyInfo.timeOffset * 60000 ));
        let date = historyInfo.date.split('T')[0].split('-');
        let dateString = `${date[2]}/${date[1]}/${date[0]}`;
        let hour = historyInfo.date.split("T")[1].slice(0,2);
        hour = parseInt(hour) + 1;
        let min = historyInfo.date.split("T")[1].slice(2,5);
        let time= `${hour}${min}`;
        
        const result = {
            date: `${dateString} - ${time}`,
            
            partner: {
                name: partnerInfo.name,
                city: partnerInfo.address.city
            },
            containerName: containerInfo.name,
            action: historyInfo.action,
            //time: localNow
        }

        res.render('pages/qrcode/confirmation', {result});
    } catch {
        res.status(401).json({error: 'Failed Request'});
    }
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
