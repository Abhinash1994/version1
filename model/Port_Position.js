/**
 * Created by Nikita on 5/11/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var port_positionSchema = new Schema({

    positionName:{type: 'string'},

    createdAt : { type: 'date', default: Date.now() },


});


port_positionSchema.statics.getNewPositionObj =  function(req){
        return {
            positionName: req.body.name
        }
};


//  on every save, add the date
port_positionSchema.pre('save', function(next) {
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

var Port_Position = mongoose.model('port_position', port_positionSchema);


module.exports = Port_Position;