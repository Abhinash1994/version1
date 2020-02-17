var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var songSchema = new Schema({
    songId : { type: 'string', required: true },
    name : { type: 'string', required: true },
    imageUrl : { type : 'string'},
    songUrl : { type : 'string'},
    description : {type : 'string', required : true},
    createdAt : { type: 'date', defaultsTo: Date.now() },
});

songSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.updatedAt = currentDate;
    if (!this.createdAt)
        this.createdAt = currentDate;
    next();
});

var Song = mongoose.model('song', songSchema);
module.exports = Song;
