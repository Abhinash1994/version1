var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var salesCkeckinSchema = new Schema({

    userId : { type: Schema.ObjectId},

    parlorName : 'String',

    parlorPhoneNumber : { type: 'string', required: true },

    latitude:'Number',

    longitude:'Number',

    // checkIn:{ type: 'date' },

    // checkOut:{ type: 'date' },

    createdAt: { type: 'date' },

    updatedAt: { type: 'date' },

    // macAddress : 'String',
    
});

salesCkeckinSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();
    // change the updated_at field to current date
    this.updatedAt = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.createdAt)
        this.createdAt = currentDate;

    next();
});

var SalesCheckin = mongoose.model('salesCheckin', salesCkeckinSchema);
module.exports = SalesCheckin;