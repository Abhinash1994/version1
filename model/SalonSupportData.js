var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var async = require('async');

var salonSupportDataSchema = new Schema({

    createdAt : { type : 'date'},

    updatedAt : { type : 'date'},

    parlorId  : { type : Schema.ObjectId},

    parlorName : { type : 'string'},

    cityId : { type : 'number'},

    active : { type : 'boolean'},

    showInSalon : { type : 'boolean', default : false},

    projectedRevenue : { type : 'number' , default :0},

    supportProvided : { type : 'number' , default :0},

    royalityAmount : { type: 'number' , default :0},

    earlyBirdSupport : { type: 'number' , default :0},

    hrSupport : { type: 'number' , default :0},

    trainingSupport : { type: 'number' , default :0},

    startDate : { type : 'date'},

    currentMonthUsageAllowed : { type : 'number' , default :0},

    currentAmountUsage : {type : 'number' , default :0},

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



salonSupportDataSchema.statics.createSupportData = function(date, month, year, createNew){
   
    var d = [];
    Parlor.find({}, { name: 1, active: 1, avgRoyalityAmount: 1, geoLocation: 1 , cityId: 1}, function(err, parlors) {
        async.each(parlors, function(parlor, call) {
            if(createNew == false){
                SalonSupportData.remove({usageMonth : month , usageYear : year} , function(err , removed){
                    SalonSupportData.createFunction(parlor, date,  function(data){
                        d.push(data);
                        call();
                    })
                });
            } else if(createNew = true){
                SalonSupportData.createFunction(parlor, date,  function(data){
                    d.push(data);
                    call();
                })
            }    
        }, function allTaskCompleted() {
            console.log('done')
        });
    });
};

salonSupportDataSchema.statics.createFunction = function(parlor, date, callback){
    var dd = [];

    var monthDate= new Date(date.setMonth(date.getMonth()));
    var monthStart= HelperService.getCurrentMonthStart(monthDate);
    var monthEnd= HelperService.getMonthLastDate(monthDate);
    var sellerName = HelperService.getMonthName(monthStart.getMonth())+" Closing Balance";

        DisountOnPurchase.findOne({ parlorId: parlor._id, sellerName: sellerName }, function(err, productDiscount) {
            
            Appointment.aggregate([{ $match: { parlorId: ObjectId(parlor._id), status: 3, appointmentStartTime: { $gte: monthStart, $lt: HelperService.getDayEnd(monthEnd) } } },
                { $group: { _id: null, loyalityRevenue: { $sum: '$loyalityPoints' } } }
            ], function(err, appts) {
                Appointment.find({ parlorId: ObjectId(parlor._id), status: 3, appointmentStartTime: { $gte: monthStart, $lt:  HelperService.getDayEnd(monthEnd) } }, 

                    {appointmentType :1, productRevenue:1, bookingMethod: 1, latitude: 1, longitude: 1, serviceRevenue: 1, mode: 1, appBooking: 1, appointmentStartTime: 1, client: 1, couponCode: 1 }, function(err, distanceAppts) {

                        SubscriptionSale.find({firstParlorId : parlor._id ,actualPricePaid:{$in : [1199, 699]}, createdAt: { $gte: monthStart, $lt:  HelperService.getDayEnd(monthEnd) }}, {actualPricePaid : 1}, function(err , earlyBird){
                            
                            var fiveHundredCount = 0, oneThousandCount = 0;
                            
                            if(earlyBird.length> 0 ){
                                _.forEach(earlyBird , function(eB){
                                    if(eB.actualPricePaid == 1199)fiveHundredCount++
                                    else if(eB.actualPricePaid == 699)oneThousandCount++
                                })
                            }
                            var earlyBirdLoyalty = (500*fiveHundredCount) + (1000*oneThousandCount);
                            
                            HrSupportData.find({parlorId : parlor._id, month : monthStart.getMonth()}).count(function(err , hrData){
                                var hrSupport = 3000 * hrData;

                                TrainingSession.find({parlorId : parlor._id , trainingDate: { $gte: monthStart, $lt:  HelperService.getDayEnd(monthEnd) }}).count(function(err , trainingData){
                                    
                                    var trainingSupport = 3000 * trainingData ; 

                                    var product = (productDiscount != null) ? productDiscount.discountPaid : 0;

                                    if (appts && appts.length > 0) {

                                        var loyalityRevenue = appts[0].loyalityRevenue ;
                                        var distanceRevenue = 0;
                                      
                                        if (distanceAppts && distanceAppts.length > 0) {

                                            _.forEach(distanceAppts, function(a) {
                                                if(a.latitude == null)a.latitude = 0;
                                                if(a.longitude == null)a.longitude = 0;
                                                if ( a.appointmentType == 3 || a.couponCode || a.mode==5 || a.mode == 7 || a.mode == 9) {
                                                    var distance = HelperService.getDistanceBtwCordinates1(parlor.geoLocation[1], parlor.geoLocation[0], a.latitude, a.longitude)

                                                    if ((distance >= 0.05  && a.appointmentType == 3 && a.client.noOfAppointments == 0) || a.couponCode || a.mode == 5 || a.mode == 7 || a.mode == 9) {
                                                        distanceRevenue += (a.serviceRevenue + a.productRevenue);
                                                    }
                                                }

                                            })

                                        }
                                    }

                                var supportTypes = [
                                    {
                                        supportCategoryId: "5b07c358885fca10041b35b6",
                                        supportTypeName: "Discount",
                                        supportCategoryName: "Salon Driven Support",
                                        percentage: 100,
                                        totalUsageAllowed: parlor.avgRoyalityAmount,
                                        previousBalance: 0,
                                        usageThisMonth: product,
                                        refundable: false,
                                    },
                                    {
                                        supportCategoryId: "5b07c343885fca10041b35b5",
                                        supportTypeName: "Be U Clients",
                                        supportCategoryName: "Be U Driven Support",
                                        percentage: 100,
                                        totalUsageAllowed: parlor.avgRoyalityAmount,
                                        previousBalance: 0,
                                        usageThisMonth: distanceRevenue,
                                        refundable: true,
                                    },
                                    {
                                        supportCategoryId: "5b07c358885fca10041b35b6",
                                        supportTypeName: "Loyalty",
                                        supportCategoryName: "Salon Driven Support",
                                        percentage: 100,
                                        totalUsageAllowed: parlor.avgRoyalityAmount,
                                        previousBalance: 0,
                                        usageThisMonth: (loyalityRevenue + earlyBirdLoyalty + hrSupport + trainingSupport),
                                        refundable: true,
                                    }
                                ];

                                var obj = {
                                    cityId: parlor.cityId,
                                    parlorId: parlor.id,
                                    parlorName: parlor.name,
                                    active: parlor.active,
                                    usageMonth: monthStart.getMonth(),
                                    usageYear: monthStart.getFullYear(),
                                    startDate: monthStart,
                                    royalityAmount: parlor.avgRoyalityAmount ? parlor.avgRoyalityAmount : 0,
                                    supportTypes: [],
                                    projectedRevenue: 0,
                                    supportProvided: (loyalityRevenue + product + distanceRevenue + earlyBirdLoyalty + hrSupport + trainingSupport),
                                    currentMonthUsageAllowed: (3 * parlor.avgRoyalityAmount),
                                    currentAmountUsage: (loyalityRevenue + product + distanceRevenue + earlyBirdLoyalty + hrSupport + trainingSupport),
                                    earlyBirdSupport : earlyBirdLoyalty,
                                    hrSupport : hrSupport,
                                    trainingSupport : trainingSupport,

                                }
                                obj.supportTypes = supportTypes;
                                SalonSupportData.create(obj, function(err, created) {
                                    if (!err) {
                                        callback();
                                    } else
                                        callback();
                                });

                            });
                        });
                    });
                });
            });
        });
};

salonSupportDataSchema.statics.updateSupportData = function(parlorId , newRoyalty){
    var date = new Date();
    var currentMonth = date.getMonth();
    var currentYear = date.getFullYear();
    SalonSupportData.findOne({parlorId: parlorId , usageMonth : currentMonth , usageYear: currentYear}, function(err, supportData){
        _.forEach(supportData.supportTypes , function(supp){

                if(supp.supportTypeName == "Be U Clients"){
                   totalUsageAllowed: newRoyalty
                }
                if(supp.supportTypeName == "Discount"){
                   totalUsageAllowed: newRoyalty
                }
                if(supp.supportTypeName == "Loyalty"){
                   totalUsageAllowed: newRoyalty 
                }
        })

        var obj ={
            active: parlor.active,
            royalityAmount: newRoyalty ? newRoyalty : 0,
            currentMonthUsageAllowed: (3 * parlor.newRoyalty),
            supportTypes: supportData.supportTypes 
        }
        SalonSupportData.update({_id: parlorId , usageMonth : currentMonth , usageYear: currentYear},obj , function(err , updated){
            console.log('support updated')
        })
    })

};


//  on every save, add the date
salonSupportDataSchema.pre('save', function(next) {
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

var SalonSupportData = mongoose.model('salonSupport', salonSupportDataSchema);
module.exports = SalonSupportData;