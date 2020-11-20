const mongoose = require('mongoose');


const historySchema = mongoose.Schema({
    containerId: { type: mongoose.Schema.Types.ObjectId, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    partnerId: { type: mongoose.Schema.Types.ObjectId, required: true},
    action: { type: String, required: true },
    date:  {type: Date, default: Date.now}
});



module.exports = mongoose.model('History', historySchema);