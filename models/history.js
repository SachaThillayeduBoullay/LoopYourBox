const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const historySchema = mongoose.Schema({
    idContainer: { type: mongoose.Schema.Types.ObjectId, required: true },
    idUser: { type: mongoose.Schema.Types.ObjectId, required: true },
    idPartner: { type: mongoose.Schema.Types.ObjectId, required: true},
    typeOfAction: { type: String, required: true },
    date:  {type: Date, default: Date.now, required: true}

});

historySchema.plugin(uniqueValidator);

module.exports = mongoose.model('History', historySchema);