const mongoose = require('mongoose');

const imageSchema = mongoose.Schema({
    date: {type: String, required: true},
    contentType: {type: String, required: true},
    image: {type: String, require: true},
    pwd: {type: String}
});

module.exports = mongoose.model('Images', imageSchema);