const mongoose = require('mongoose');

const roleSchema = mongoose.Schema({
    name: { type: String, require: true },
    color: { type: String, default: "#1a1a1a" },
    priority: { type: String, default: 0 }
});

module.exports = mongoose.model('Roles', roleSchema);