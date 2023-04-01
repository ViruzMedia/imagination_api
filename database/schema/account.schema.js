const mongoose = require('mongoose');

const accountSchema = mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    roles: {
        user: {
            type: Number,
            default: 1000
        },
        moderator: {
            type: Number
        },
        administrator: {
            type: Number
        }
    },
    refreshToken: { type: String },
});

module.exports = mongoose.model('Accounts', accountSchema);