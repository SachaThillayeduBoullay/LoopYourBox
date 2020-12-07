global.fetch = require("node-fetch");


exports.mapPage = async (req, res) => { 
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

        res.render('pages/map/map', {partnerInfo, selectInfo})
    } catch {
        res.status(401).render('pages/error',{ error: `Requête invalide`});
    }
};