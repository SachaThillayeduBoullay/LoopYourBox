const mongoose = require('mongoose');


const historySchema = mongoose.Schema({
    containerId: { type: mongoose.Schema.Types.ObjectId, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    partnerId: { type: mongoose.Schema.Types.ObjectId, required: true},
    action: { type: String, required: true },
    date:  {type: Date, default: Date.now},
    timeOffset: {type: Date, default: new Date().getTimezoneOffset()},
    reference: { type: String, required: true}
});



module.exports = mongoose.model('History', historySchema);