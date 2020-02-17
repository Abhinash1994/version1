var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var chapterTabSchema = new Schema({

    chapterName : {type :'string'},

    title : {type :'string'},

    chapterId: { type: Schema.ObjectId, ref: 'chapter', required: true },

    content : {type : 'string', default : ""},

    createdAt : {type : 'date'},
    
    updatedAt : {type : 'date'},
});


// on every save, add the date
chapterTabSchema.pre('save', function (next) {
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
var ChapterTab = mongoose.model('chaptertab', chapterTabSchema);
module.exports = ChapterTab;