const Partner = require('../../models/partner');

exports.createPartner = (req, res, next) => {

    const partner = new Partner({
        ...req.body,
        image: JSON.stringify(req.file)
        
    });
    partner.save()
        .then(() => res.status(201).redirect('/'))
        .catch(error => res.status(400).json({ error }));
   
};