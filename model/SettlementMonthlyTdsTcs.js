
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;
var async = require('async');


var monthlyTdsTcsSchema = new Schema({

	createdAt : { type : 'date'},

	updateAt : { type : 'date'},
	
	parlorId : { type : Schema.Types.ObjectId, ref: 'parlors'},

	parlorName : { type : 'string'},

	parlorAddress1 : { type : 'string'},

	parlorAddress2 : { type : 'string'},

	monthlyTDS : { type : 'number', default :0},

	monthlyTCS : { type : 'number', default :0},

	month: {type : 'number', required : true},

	year: {type : 'number' , required : true},

});



monthlyTdsTcsSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.role = parseInt(this.role);
    this.updatedAt = currentDate;
    if (!this.createdAt)
        this.createdAt = currentDate;
    next();
});

var SettlementMonthlyTdsTcs = mongoose.model('monthlyTdsTcs', monthlyTdsTcsSchema);
module.exports = SettlementMonthlyTdsTcs;
