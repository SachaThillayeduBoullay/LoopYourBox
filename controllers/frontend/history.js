global.fetch = require("node-fetch");

exports.historyDetailsPage = async (req, res) => { 
    try {
        const token = req.cookies["token"];

        let myInit = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        };

        let url = `${process.env.DOMAIN}/api/history/${req.params.reference}`;

        let historyInfo = await fetch(url, myInit);
        historyInfo = await historyInfo.json();

        //create date string to display
        let date = historyInfo[0].date.split('T')[0].split('-');
        let dateString = `${date[2]}/${date[1]}/${date[0]}`;
        let hour = historyInfo[0].date.split("T")[1].slice(0,2);
        hour = parseInt(hour) + 1;
        let min = historyInfo[0].date.split("T")[1].slice(2,5);
        let time = `${hour}${min}`;

        historyInfo[0].date = `${dateString} - ${time}`,

        res.render('pages/myaccount/historydetails', {historyInfo});
    } catch {
        res.status(401).render('pages/error',{ error: `Requête invalide`});
    }
};  
