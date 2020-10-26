const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const partnerSchema = mongoose.Schema({
    name: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    address: { type: String, required: true, unique: true },
    website: { type: String, required: true, default:"NoWebsite" },
    image: { type: String, required: true, default:"NoImage" },
    description: { type: String, required: true, default:"NoDescription" },
    schedule: {
        monday: { type: String, required: true },
        tuesday: { type: String, required: true },
        wednesday: { type: String, required: true },
        thursday:{ type: String, required: true },
        friday:{ type: String, required: true },
        saturday:{ type: String, required: true },
        sunday:{ type: String, required: true },
    },
    
    idUser: { type: String, required: true },
    description: { type: String }

});

partnerSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Partner', partnerSchema);