const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const partnerSchema = mongoose.Schema({
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { type: String, required: true, unique: true },
    website: { type: String, required: true, default:"NoWebsite" },
    image: { type: String, required: true, default:"NoImage" },
    schedule: {
        monday: { type: String, required: true },
        tuesday: { type: String, required: true },
        wednesday: { type: String, required: true },
        thursday:{ type: String, required: true },
        friday:{ type: String, required: true },
        saturday:{ type: String, required: true },
        sunday:{ type: String, required: true },
    },
    foodType: { type: String, required: true },
    idUser: { type: String, required: true },
    lat: { type: String, required: true },
    long: { type: String, required: true },
    chain: { type: String, required: true, default:"noChain" }
});

partnerSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Partner', partnerSchema);