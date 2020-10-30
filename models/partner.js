const mongoose = require('mongoose');
//const uniqueValidator = require('mongoose-unique-validator');

const partnerSchema = mongoose.Schema({
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    address: { 
        street: { type: String, required: true },
        zip: { type: Number, required: true },
        city: { type: String, required: true },
        country:{ type: String, default:"Belgique" },
    },
    website: { type: String, default:"noWebsite" },
    image: { type: String, required: true, default:"noImage" },
    schedule: {
        monday: { type: String, default:"none" },
        tuesday: { type: String, default:"none" },
        wednesday: { type: String, default:"none" },
        thursday:{ type: String, default:"none" },
        friday:{ type: String, default:"none" },
        saturday:{ type: String, default:"none" },
        sunday:{ type: String, default:"none" },
    },
    foodType: { type: String, default:"noType" },
    idUser: { type: String, required: true },
    lat: { type: String, required: true },
    long: { type: String, required: true },
    chain: { type: String, default:"noChain" }
});

//partnerSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Partner', partnerSchema);