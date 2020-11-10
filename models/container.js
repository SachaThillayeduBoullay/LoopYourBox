const mongoose = require('mongoose');


const containerSchema = mongoose.Schema({
    name: { type: String, required: true },
    material: { type: String, required: true },
    credit: { type: Number, required: true },
    partnerId: { type: String},
    image: { type: String, default:"noImage" },
});


module.exports = mongoose.model('Container', containerSchema);