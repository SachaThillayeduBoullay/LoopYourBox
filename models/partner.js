const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const partnerSchema = mongoose.Schema({
    name: { type: String, required: true },
    phoneNumber: { type: String, default:"noNumber" },
    address: { type: Object, required: true },
    website: { type: String, default:"noWebsite" },
    image: { type: String, default:"noImage" },
    schedule: {
        monday: { type: String, default:"none" },
        tuesday: { type: String, default:"none" },
        wednesday: { type: String, default:"none" },
        thursday:{ type: String, default:"none" },
        friday:{ type: String, default:"none" },
        saturday:{ type: String, default:"none" },
        sunday:{ type: String, default:"none" },
    },
    foodType: { type: String, default:"Autres" },
    idUser: { type: String, required: true, unique: true }, //change to ObjectId
    chain: { type: String, default:"noChain" }
});

partnerSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Partner', partnerSchema);