const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const historySchema = mongoose.Schema({
    idContainer: { type: String, required: true },
    idUser: { type: String, required: true },
    idPartner: { type: String, required: true},
    typeOfAction: { type: String, required: true },
    date:  {type: Date, default: Date.now, required: true}

});

historySchema.plugin(uniqueValidator);

module.exports = mongoose.model('History', historySchema);