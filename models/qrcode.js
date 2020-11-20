const mongoose = require('mongoose');

const qrcodeSchema = mongoose.Schema({
    containerId: { type: mongoose.Schema.Types.ObjectId, required: true },
    partnerId: { type: mongoose.Schema.Types.ObjectId, required: true},
    action: { type: String, required: true },
    reference: { type: String, required: true}
});

module.exports = mongoose.model('Qrcode', qrcodeSchema);