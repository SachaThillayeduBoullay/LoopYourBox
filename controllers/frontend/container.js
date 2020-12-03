global.fetch = require("node-fetch");
const jwt = require('jsonwebtoken');
const checkStatus = require('../../public/js/checkstatus');

exports.containerPage = async (req, res) => { 
    try {
        let url = `http://localhost:3000/api/container/`;

        let containerInfo = await fetch(url);
        containerInfo = await containerInfo.json();

        res.render('pages/container/container', {containerInfo})
    } catch {
        res.status(401).render('pages/error',{ error: `Requête invalide`});
    }
};

exports.containerDetailsPage = async (req, res) => { 
    try {
        const token = req.cookies["token"];
        let status = await checkStatus(token);
        status = status.userStatus;
        let url = `http://localhost:3000/api/container/${req.params.id}`;

        let containerInfo = await fetch(url);
        containerInfo = await containerInfo.json();

        if (containerInfo.image != "noImage") {
            containerInfo.image = JSON.parse(containerInfo.image);
        }
        res.render('pages/container/containerDetails', {containerInfo, status});
    } catch {
        res.status(401).render('pages/error',{ error: `Requête invalide`});
    }
};

exports.createContainerPage = async (req, res) => { 
    try {
        const token = req.cookies["token"];
        const decodedToken = jwt.verify(token, process.env.JWT_PW);
        const userId = decodedToken.userId;
        let url = `http://localhost:3000/api/partner/container/${userId}`;

        let myInit = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };

        let urlUser = `http://localhost:3000/api/user/${userId}`;

        let userInfo = await fetch(urlUser, myInit);
        userInfo = await userInfo.json();

        let partnerId = userId;

        if (userInfo.status != 'admin') {
            let partnerInfo = await fetch(url, myInit);
            partnerInfo = await partnerInfo.json();
            partnerId = partnerInfo._id;
        }

        let urlContainer = `http://localhost:3000/api/container/partner/default`;

        let containerInfo = await fetch(urlContainer);
        containerInfo = await containerInfo.json();



        res.render('pages/container/createContainer', {partnerId, containerInfo, userStatus: userInfo.status})
    } catch {
        res.status(401).render('pages/error',{ error: `Requête invalide`});
    }
};

exports.updateContainerPage = async (req, res) => { 
    try {
        //const token = req.cookies['token'];
        let url = `http://localhost:3000/api/container/${req.params.id}`;

        let containerInfo = await fetch(url);
        containerInfo = await containerInfo.json();

        if (containerInfo.image != "noImage") {
            containerInfo.image = JSON.parse(containerInfo.image);
        }

        res.render('pages/container/updateContainer', {containerInfo})
    } catch {
        res.status(401).render('pages/error',{ error: `Requête invalide`});
    }
};