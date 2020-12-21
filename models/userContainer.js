const mongoose = require('mongoose');

const userContainerSchema = mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId},
    containerId: { type: mongoose.Schema.Types.ObjectId},
    partnerId: { type: mongoose.Schema.Types.ObjectId},
});

module.exports = mongoose.model('UserContainer', userContainerSchema);