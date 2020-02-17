var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var chapterSchema = new Schema({
    name : {type :'string'},
    createdAt : {type : 'date'},
    updatedAt : {type : 'date'},
});


// on every save, add the date
chapterSchema.pre('save', function (next) {
    // get the current date
    var currentDate = new Date();
    this.role = parseInt(this.role);
    
    // change the updated_at field to current date
    this.updatedAt = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.createdAt)
        this.createdAt = currentDate;

    next();
});
var Chapter = mongoose.model('chapter', chapterSchema);
module.exports = Chapter;