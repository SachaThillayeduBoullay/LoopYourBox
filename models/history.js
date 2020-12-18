const mongoose = require('mongoose');

const historySchema = mongoose.Schema({
    containerInfo: { type: Object, required: true },
    userInfo: { type: Object, required: true },
    partnerInfo: { type: Object, required: true},
    action: { type: String, required: true },
    date:  {type: Date, default: Date.now},
    timeOffset: {type: Date, default: new Date().getTimezoneOffset()}, //to get the right timezone but not implemented yet
    reference: { type: String, required: true}
});

module.exports = mongoose.model('History', historySchema);