global.fetch = require("node-fetch");

exports.containerPage = async (req, res) => { 
    try {
        let url = `http://localhost:3000/api/container/`;

        let containerInfo = await fetch(url);
        containerInfo = await containerInfo.json();

        res.render('pages/container/container', {containerInfo})
    } catch {
        res.status(401).json({error: 'Failed Request'});
    }
};

exports.containerDetailsPage = async (req, res) => { 
    try {
        let url = `http://localhost:3000/api/container/${req.params.id}`;

        let containerInfo = await fetch(url);
        containerInfo = await containerInfo.json();

        if (containerInfo.image != "noImage") {
            containerInfo.image = JSON.parse(containerInfo.image);
        }
        console.log(containerInfo)
        res.render('pages/container/containerDetails', {containerInfo});
    } catch {
        res.status(401).json({error: 'Failed Request'});
    }
};

exports.createContainerPage = (req, res) => { res.render('pages/container/createContainer')};

exports.updateContainerPage = async (req, res) => { 
    try {
        //const token = req.cookies['token'];
        let url = `http://localhost:3000/api/container/${req.params.id}`;

        /*let myInit = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };*/

        let containerInfo = await fetch(url /*, myInit*/);
        containerInfo = await containerInfo.json();

        if (containerInfo.image != "noImage") {
            containerInfo.image = JSON.parse(containerInfo.image);
        }

        res.render('pages/container/updateContainer', {containerInfo})
    } catch {
        res.status(401).json({error: 'Unauthenticated Request'});
    }
};