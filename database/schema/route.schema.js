const mongoose = require('mongoose');

const routeSchema = mongoose.Schema({
    type: { type: String, require: true},
    path: { type: String, require: true },
    method: { type: String, require: true},
    priority: { type: String, default: 0 }
});

module.exports = mongoose.model('Routes', routeSchema);