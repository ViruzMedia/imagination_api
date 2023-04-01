const mongoose = require('mongoose');

const accountSchema = mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: {type: String},
    refreshToken: { type: String },
});

module.exports = mongoose.model('Accounts', accountSchema);