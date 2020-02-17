var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var beuMirrorSchema = new Schema({
    parlorId : { type: Schema.ObjectId },
    parlorIdNumeric : { type: 'number'},
    cityId : { type: 'number'},
    wifiName : { type: 'string'},
    wifiPassword : { type: 'string'},
    firebaseId : { type: 'string'},
    macAddress : { type: 'string', unique : true, required : true},
    createdAt : {type : 'date'},
    updatedAt : {type : 'date'},
});

// on every save, add the beuMirrorte
beuMirrorSchema.pre('save', function (next) {
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
var BeuMirror = mongoose.model('beuMirror', beuMirrorSchema);
module.exports = BeuMirror;