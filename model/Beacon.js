/**
 * Created by Nikita on 2/20/2017.
 */
/**
 * Created by Nikita on 2/18/2017.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;


var beaconSchema = new Schema({

    createdAt: { type: 'date' },

    updatedAt: { type: 'date' },

    macAddress : {type: 'string' , required:true},

    major : {type: 'string' , required:true},

    minor : {type: 'string' , required:true},

    udid : {type: 'string' , required:true},

    userId : {type: 'string' , required:true}

});




beaconSchema.statics.getNewBeaconObj =  function(req, item){
    return {
            macAddress: req.body.macAddress,
            major : req.body.major,
            minor: req.body.minor,
            udid : req.body.udid,
            userId : req.body.userId
    };

};


// on every save, add the date
beaconSchema.pre('save', function(next) {
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
// beaconSchema.plugin(autoIncrement.plugin, 'admin');

var Beacon = mongoose.model('beacon', beaconSchema);
// make this available to our users in our Node applications

module.exports = Beacon;
