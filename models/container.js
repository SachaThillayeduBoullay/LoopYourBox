const mongoose = require('mongoose');


const containerSchema = mongoose.Schema({
    name: { type: String, required: true },
    material: { type: String, required: true },
    credit: { type: Number, required: true },
    partnerId: { type: mongoose.Schema.Types.ObjectId},
    image: { type: String, default:"noImage" },
    default: {type: Boolean, default: false}
});


module.exports = mongoose.model('Container', containerSchema);