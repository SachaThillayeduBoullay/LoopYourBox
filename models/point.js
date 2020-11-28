const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const pointSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true},
    loyaltyPoint: { type: Number, default: 0 },
    credit: { type: Number, default: 0 },
    environmentalImpact: { type: mongoose.Schema.Types.Decimal128, default: 0 },
});

pointSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Point', pointSchema);