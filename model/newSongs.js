/**
 * Created by ginger on 22/02/2018.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var newSongsSchema = new Schema({
    parlorId: { type: Schema.Types.ObjectId, ref: 'parlors'},
    createdAt: { type: 'date' },
    updatedAt: { type: 'date' },
    songId: {type : 'String'},
    songName: {type : 'String'},
    fileName : {type : "String"},
    downloadUrl : {type : 'String'}
});

newSongsSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.updatedAt = currentDate;
    if (!this.createdAt)
        this.createdAt = currentDate;
    next();
});

newSongsSchema.pre('update', function(next) {
  this.update({},{ $set: { updatedAt: new Date() } });
  next();
});

var NewSongs = mongoose.model('newsongs', newSongsSchema);
module.exports = NewSongs;
