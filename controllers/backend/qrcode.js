const Qrcode = require("../../models/qrcode");
const joi = require("joi-oid");
const QrcodeGenerator = require('qrcode');
const uniqid = require('uniqid');

exports.saveQrcode = (req, res, next) => {

   /* const schema = joi.object().keys({
        qrcode: joi.string().trim().required()
    });

    const result = schema.validate(qrcodeString);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }*/
    const reference = uniqid();
    const qrcode = new Qrcode({...req.body, reference});
    const {action, partnerId, containerId} = req.body;

    const result = `${reference}##${action}##${partnerId}##${containerId}`;

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