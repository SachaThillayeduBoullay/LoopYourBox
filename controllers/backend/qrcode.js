const Qrcode = require("../../models/qrcode");
const QrcodeGenerator = require('qrcode');
const uniqid = require('uniqid');

exports.saveQrcode = (req, res, next) => {
    const reference = uniqid();
    const qrcode = new Qrcode({...req.body, reference});
    const {action, partnerId, containerId} = req.body;

    const result = reference;

    qrcode.save()
    //generate a QRcode then render qrcodeimage.ejs with it
        .then(() => 
        QrcodeGenerator.toDataURL(result, function (err, action) {
                res.render('pages/qrcode/qrcodeimage.ejs', {action}, );
            })
        )

    .catch(error => res.status(500).render('pages/error',{ error: `Le QrCode n'a pas pu être sauvé`}));
};

exports.getOneQrcode = (req, res, next) => {
    Qrcode.findOne({ reference: req.params.reference })
        .then((qrcode) => res.status(200).json(qrcode))
        .catch((error) => res.status(404).render('pages/error',{ error: `QrCode introuvable`}));
};