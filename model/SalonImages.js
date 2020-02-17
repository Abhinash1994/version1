var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;
var request = require('request');
var async = require('async');


var salonImageSchema = new Schema({

	 parlorId: { type: Schema.ObjectId, ref: 'parlor', required: true },

	 parlorName: { type: 'String', default: 'test' },

	 createdAt : { type: 'date'},

	 updatedAt : { type: 'date'},

	 
});


salonImageSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.role = parseInt(this.role);
    this.updatedAt = currentDate;
    if (!this.createdAt)
        this.createdAt = currentDate;

    next();
});


salonImageSchema.pre('update', function(next) {
  this.update({},{ $set: { updatedAt: new Date() } });
  next();
});

var SalonImages = mongoose.model('salonimage' , salonImageSchema);

module.exports = SalonImages;