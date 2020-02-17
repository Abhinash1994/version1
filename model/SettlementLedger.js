
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;
var async = require('async');
var mongoose = require('mongoose');
var request = require('request');
var ObjectId = mongoose.Types.ObjectId;


var settlementLedgerSchema = new Schema({

	createdAt : { type : 'date'},

	updateAt : { type : 'date'},
	
	parlorId : { type : Schema.Types.ObjectId, ref: 'parlors'},

	parlorName : { type : 'string'},

	previousDues : { type : 'number', default :0},

	yearlyModel : { type : 'boolean', default : false},

	monthlyTDS : { type : 'number', default :0},

	monthlyTCS : { type : 'number', default :0},

	currentDue : { type : 'number', default :0},

	gstDeduction : { type : 'number', default :0},
	
	productDiscount : { type : 'number', default :0},

	month: {type : 'number'},

	year: {type : 'number'},
	
	period : {type : 'number'},

	previousMonthRoyalty : { type : 'number', default :0},

	totalRecoverable : { type : 'number', default :0},

	quarterSettlementAmount : { type : 'number', default :0},

	monthWiseDetail : [{

			period : {type : 'number'},

			name : { type: 'string'},

			amountAdjustedInThisSettlement : { type : 'number', default :0},

			amountPaidToSalon : { type : 'number', default :0},

			moreAmountToBeAdjusted : { type : 'number', default :0},

			netPayableOfThisSettlement : { type : 'number', default :0},

			utrNumber : { type : 'string', default :""},

			moneySentTime : {type : 'date', }
	}]


});



settlementLedgerSchema.statics.calculateTDSandTCS = function(parlorId , tdsPercentage , tcsPercentage, c){
	let startDate = HelperService.getLastMonthCustomStartDate();
	let endDate = HelperService.getDayEnd(HelperService.getLastMonthEndDate());

	console.log("startDate " , startDate)
	console.log("endDate " , endDate)
	let monthlyTDS = 0 , monthlyTCS = 0;
	SettlementReport.aggregate([{$match : {parlorId: ObjectId(parlorId) , startDate: {$gte : startDate} , endDate : {$lte : endDate}}},
            {$group : {_id: '$parlorId' , collectedByLoyalityPoints :{$sum :'$collectedByLoyalityPoints'} ,collectedByAffiliates :{$sum :'$collectedByAffiliates'} ,collectedByApp :{$sum :'$collectedByApp'}}},
            ], function(err , agg){
            	console.log(err)
            	console.log(agg)
                monthlyTDS = agg[0].collectedByLoyalityPoints * tdsPercentage/100;
                monthlyTCS = (((agg[0].collectedByAffiliates * 1.18) + (agg[0].collectedByApp * 1.18)) * tcsPercentage/100);
                 return c({
			        monthlyTDS : monthlyTDS ? monthlyTDS.toFixed(2) :0,
			        monthlyTCS : monthlyTCS ? monthlyTCS.toFixed(2) :0
			    })
            })
};





settlementLedgerSchema.pre('save', function(next) {
    var currentDate = new Date();
    this.role = parseInt(this.role);
    this.updatedAt = currentDate;
    if (!this.createdAt)
        this.createdAt = currentDate;
    next();
});

var SettlementLedger = mongoose.model('settlementledger', settlementLedgerSchema);
module.exports = SettlementLedger;
