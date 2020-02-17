var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dailyDealSchema = new Schema({
	dealDay : { type: 'number', required: true }, // day 1, 2, 3
    dealId : { type: 'number', required: true },
    offerName : {type : 'string', required : true},
    offerGender : { type: 'string', enum: ["M", "F"], size: 1, default: "F" },
    offerTitle : {type:'string', required : true},
    offerText : {type : 'string', required : true},
    alternateText : {type : 'string', required : true}
});

var DailyDeal = mongoose.model('dailydeals', dailyDealSchema);

// make this available to our users in our Node applications
module.exports = DailyDeal;
