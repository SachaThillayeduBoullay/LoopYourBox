global.fetch = require("node-fetch");
const jwt = require('jsonwebtoken');
const checkStatus = require('../../public/js/checkstatus');


exports.historyDetailsPage = async (req, res) => { 
    try {
        const token = req.cookies["token"];

        let url = `http://localhost:3000/api/history/${req.params.reference}`;

        let historyInfo = await fetch(url);
        historyInfo = await historyInfo.json();

        let date = historyInfo[0].date.split('T')[0].split('-');
        let dateString = `${date[2]}/${date[1]}/${date[0]}`;
        let hour = historyInfo[0].date.split("T")[1].slice(0,2);
        hour = parseInt(hour) + 1;
        let min = historyInfo[0].date.split("T")[1].slice(2,5);
        let time = `${hour}${min}`;

        historyInfo[0].date = `${dateString} - ${time}`,

        res.render('pages/myaccount/historydetails', {historyInfo});
    } catch {
        res.status(401).json({error: 'Failed Request'});
    }
};  
