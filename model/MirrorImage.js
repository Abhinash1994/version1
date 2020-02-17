var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var mirrorImageSchema = new Schema({
    userId : { type: Schema.ObjectId, ref : 'user' },
    imageUrl : { type: 'string'},
    type : { type: 'string'},
    skinScoreObj : {},
    type : { type: 'String', default : '' },
    createdAt : {type : 'date'},
    verifiedAt : {type : 'date'},
});

// on every save, add the mirrorImagete
mirrorImageSchema.pre('save', function (next) {
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
var MirrorImage = mongoose.model('mirrorImage', mirrorImageSchema);
module.exports = MirrorImage;