const mongoose = require('mongoose');


const containerSchema = mongoose.Schema({
    name: { type: String, required: true },
    material: { type: String, required: true },
    credit: { type: Number, required: true },
    idPartner: { //type: mongoose.Schema.Types.ObjectId, required: false
    },
    image: { type: String, default:"noImage" },

});


module.exports = mongoose.model('Container', containerSchema);