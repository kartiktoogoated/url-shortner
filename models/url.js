const mongoose = require ('mongoose');

const urlSchema= new mongoose.Schema({
    originalUrl:{type: String, required:true},
    shortUrl:{type: String, required: true, unique: true},
    accessCount:{type: Number, default: 0},
});

module.exports = mongoose.model('Url',urlSchema);