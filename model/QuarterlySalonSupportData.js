var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var async = require('async');

var quarterlySalonSupportDataSchema = new Schema({

    createdAt : { type : 'date'},

    updatedAt : { type : 'date'},

    parlorId  : { type : Schema.ObjectId},

    parlorName : { type : 'string'},

    address : {type : 'string'},

    address2 : {type : 'string'},

    cityId : { type : 'number'},

    active : { type : 'boolean'},

    showInSalon : { type : 'boolean', default : false},

    projectedRevenue : { type : 'number' , default :0},

    supportProvided : { type : 'number' , default :0},

    royalityAmount : { type: 'number' , default :0},
    
    differenceInSalonDriven : { type: 'number' , default :0},

    differenceInBeuDriven : { type: 'number' , default :0},

    amountToBeCharged : { type: 'number' , default :0},

    startDate : { type : 'date'},

    currentQuarterUsageAllowed : { type : 'number' , default :0},

    currentAmountUsage : {type : 'number' , default :0},

    quarterDate : {type : 'string'},

    usageMonth : {type : 'number'},

    usageYear : {type : 'number' },

    supportTypes : [{

        supportCategoryId : {type: Schema.ObjectId},

        supportCategoryName : { type :'String'},

        supportTypeName : { type :'String'},

        percentage : {type : 'number' , default :0},

        totalUsageAllowed : {type : 'number' , default :0},

        previousBalance : {type : 'number' , default :0},

        usageThisMonth : { type : 'number' , default :0},

        refundable : { type : 'boolean' , default : false}, 
    }],
    
});


//  on every save, add the date
quarterlySalonSupportDataSchema.pre('save', function(next) {
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

var QuarterlySalonSupportData = mongoose.model('quarterlysalonSupport', quarterlySalonSupportDataSchema);
module.exports = QuarterlySalonSupportData;