var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var smsSchema = new Schema({
    smsType : {type: 'string'},     // offer = 2 | informative = 1
    offerCode : {type: 'string'},
    creditUsed : {type :'number'},
    parlorId : { type: Schema.ObjectId, ref : 'parlor' },
    phoneNumbers : { type: "array" },
    otp : { type: "string" },
    message: {type: 'string'}
});

smsSchema.statics.saveSms = function(parlor, obj, callback){
        Sms.create(obj, function(err, data){
        	Parlor.update({_id : obj.parlorId}, { smsRemaining : parlor.smsRemaining - obj.creditUsed  } , function(err, data){
        		return callback(err, parlor.smsRemaining - obj.creditUsed);
        	});
        });
  };

// on every save, add the date
smsSchema.pre('save', function (next) {
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
var SMS = mongoose.model('sms', smsSchema);
module.exports = SMS;