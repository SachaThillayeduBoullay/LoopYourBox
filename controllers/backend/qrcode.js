const Qrcode = require("../../models/qrcode");
const QrcodeGenerator = require('qrcode');
const uniqid = require('uniqid');

exports.saveQrcode = (req, res, next) => {
    const reference = uniqid();
    const qrcode = new Qrcode({...req.body, reference});
    const {action, partnerId, containerId} = req.body;

    const result = reference;

    qrcode.save()
        .then(() => 
        QrcodeGenerator.toDataURL(result, function (err, action) {
                res.render('pages/qrcode/qrcodeimage.ejs', {action}, );
            })
        )

    .catch(error => res.status(500).json({ error }));
    };

exports.getOneQrcode = (req, res, next) => {
    Qrcode.findOne({ reference: req.params.reference })
        .then((qrcode) => res.status(200).json(qrcode))
        .catch((error) => res.status(404).json({ error }));
    };