/**
 * Created by ginger on 4/17/2017.
 */


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var faceStructureSchema = new Schema({

    parlorId:{ type: Schema.ObjectId, ref : 'parlor' },
    faces:[{
        id:{type:'string'},
        faceType:{type:'number'},    // 0-employees, 1- customer
        customerType:{type:'number'},     // 0-old customer, 1- new customer, null- employeess
        face:{type:'string'}
        }]

});




faceStructureSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();
    // change the updated_at field to current date
    this.updatedAt = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.createdAt)
        this.createdAt = currentDate;

    next();
});

var DetectedFaces = mongoose.model('detectedFaces', faceStructureSchema);

module.exports = DetectedFaces;
