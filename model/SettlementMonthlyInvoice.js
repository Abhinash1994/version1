var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;
var async = require('async');

var settlementMonthlyInvoiceSchema = new Schema({

    createdAt : {type : 'date'},

    parlorId: { type : Schema.ObjectId},

    parlorName : { type : 'string'},

    parlorAddress : { type : 'string'},

    salonGST : { type : 'string'},

    legalEntity : {type : 'string'},

    stateName : { type : 'string'},

    invoiceNumber : { type : 'number'},

    code : { type : 'number'},

    onlinePaymentFee : { type : 'number'},

    onlinePaymentFeeExempt : { type : 'number'},

    managementFee : { type : 'number'},

    CGST  : { type : 'number'},

    SGST  : { type : 'number'},

    IGST  : { type : 'number'},

    CGSTpercentage  : { type : 'number'},

    SGSTpercentage  : { type : 'number'},

    IGSTpercentage  : { type : 'number'},

    taxTotal  : { type : 'number'},

    amountTotal  : { type : 'number'},

    amountTotalString  : { type : 'string'},

    taxTotalString  : { type : 'string'},

    date  : { type : 'string'},

    month : {type : 'number'},

    year : {type : 'number'},

    newSalon : {type: 'boolean'}
});


settlementMonthlyInvoiceSchema.statics.createInvoice =  function(month, parlorId, managementFee, onlinePaymentFee, onlinePaymentFeeExempt, invoiceNumber, callback){
    console.log('chala scheduler')
    var d = [];
    
    var lastDate = HelperService.getLastMonthEndDate();
    // var lastDate = new Date(2018,4,31,23,59,59);
    var startDate = HelperService.getCurrentMonthStart(lastDate);
    var fg = HelperService.getDayEnd(lastDate);

    console.log('startDate' , startDate)
    console.log('lastDate' , lastDate)
    console.log('fg' , fg)
    SettlementMonthlyInvoice.findOne({}).sort({$natural: -1}).exec(function (err, settleInvoice){
        console.log(settleInvoice.invoiceNumber)
         var i = invoiceNumber ? invoiceNumber : settleInvoice.invoiceNumber +1;
         // var i = 203;
        Parlor.find({ _id: parlorId }, {legalEntity : 1, stateName:1, commissionType: 1, minimumGuarantee: 1, gstNumber: 1, address: 1, address2: 1, name: 1, cityId: 1, latitude: 1, longitude: 1 }, function(err, parlors) {
            async.each(parlors , function(p , call){
                SettlementReport.aggregate([{$match : {parlorId: ObjectId(p.id) , startDate: {$gte : startDate} , endDate : {$lte : fg}}},
                        {$group : {_id: '$parlorId' , totalOnlinePaymentFee :{$sum :'$onlinePaymentFee'}, totalOnlinePaymentFeeTax : {$sum : '$onlinePaymentFeeTax'},
                                    lastManagementFee : {$last : '$amountCollectedTillDate'}}},
                        ], function(err , agg){
                            console.log(p.id , p.name)
                            console.log(agg)
                           
                        p.address2 = p.address2.split(",").pop();
                        var obj = {
                            parlorId: p.id,
                            parlorName: p.name,
                            legalEntity : p.legalEntity,
                            parlorAddress: p.address + ", " + p.address2,
                            salonGST: p.gstNumber ? p.gstNumber : "",
                            stateName: p.stateName,
                            invoiceNumber: i,
                            CGST: 0,
                            SGST: 0,
                            IGST: 0,
                            CGSTpercentage: 9,
                            SGSTpercentage: 9,
                            IGSTpercentage: 18,
                            taxTotal: 0,
                            amountTotal: 0,
                            amountTotalString: "",
                            taxTotalString: "",
                            date: lastDate.toDateString(),
                            month: lastDate.getMonth(),
                            year: lastDate.getFullYear(),
                            newSalon : false,
                            managementFee : managementFee,
                            onlinePaymentFee: onlinePaymentFee,
                            onlinePaymentFeeExempt:  onlinePaymentFeeExempt,
                           
                        }
                     // SettlementReport.findOne({parlorId: p.id, endDate: { $gte: lastDate, $lte: fg } }, function(err, settlement) {
                        // var fee1 = 0, fee = 0;
                        // if(agg.length > 0){
                        //       fee1 = Math.round(agg[0].totalOnlinePaymentFeeTax);
                        //       fee = Math.round(fee1 /0.18);
                        //      var onlinePaymentFee = Math.round(agg[0].totalOnlinePaymentFee)
                           
                        //     obj.onlinePaymentFee = (agg[0].totalOnlinePaymentFee > 0) ? fee : 0;
                        //     obj.onlinePaymentFeeExempt = ((agg[0].totalOnlinePaymentFee - agg[0].totalOnlinePaymentFeeTax) > 0) ? Math.round(onlinePaymentFee - fee1 - fee) : 0;
                        //     // obj.managementFee = agg[0].lastManagementFee;   
                        //     obj.managementFee = managementFee;   
                        // }else if(agg.length == 0){
                        //     console.log("------------------------------")
                        //     obj.newSalon = true;
                        //     obj.managementFee = managementFee;
                        // }
                        // if(obj.managementFee == 0){
                        //     obj.managementFee = p.minimumGuarantee;
                        // }
                        if (p.gstNumber) {
                            var gstCode = p.gstNumber.slice(0, 2);
                            obj.code = gstCode;
                           console.log("gstCode" , gstCode)
                            if (gstCode == "07" || p.stateName == "New Delhi") {
                                obj.CGST = Math.round((obj.managementFee + obj.onlinePaymentFee /*fee */)  * 0.09);
                                obj.SGST = Math.round((obj.managementFee + obj.onlinePaymentFee /*fee */) * 0.09);
                                obj.taxTotal = obj.CGST + obj.SGST;

                            } else {
                                obj.IGST = Math.round((obj.managementFee + obj.onlinePaymentFee /*fee */) * 0.18);
                                obj.taxTotal = obj.IGST;
                            }
                        }else {
                            if(p.stateName == "New Delhi"){
                                obj.CGST = Math.round((obj.managementFee + obj.onlinePaymentFee /*fee */)  * 0.09);
                                obj.SGST = Math.round((obj.managementFee + obj.onlinePaymentFee /*fee */) * 0.09);
                                obj.taxTotal = obj.CGST + obj.SGST;
                            } else {
                                obj.IGST = Math.round((obj.managementFee + obj.onlinePaymentFee /*fee */) * 0.18);
                                obj.taxTotal = obj.IGST;
                            }
                        }
                        obj.amountTotal = Math.round((obj.managementFee + obj.taxTotal + obj.onlinePaymentFee /*fee */ + obj.onlinePaymentFeeExempt));
                        obj.amountTotalString = HelperService.convertNumberToWOrds(obj.amountTotal);
                        obj.taxTotalString = HelperService.convertNumberToWOrds(obj.taxTotal);
                        
                        console.log(obj)
                            SettlementMonthlyInvoice.create(obj , function(err , invoice){
                               console.log(err)
                                call();

                            })
                        })
                    // })
                }, function allTaskCompleted(){
                
                return callback("All done")
            });
        }); 
    });      
};



settlementMonthlyInvoiceSchema.statics.createInvoiceByScheduler =  function(month){
    console.log('chala scheduler')
    var d = [];
    var newYear = new Date().getFullYear()
    var lastDate = HelperService.getLastMonthEndDate();
    // var lastDate = new Date(2018,4,31,23,59,59);
    var startDate = HelperService.getCurrentMonthStart(lastDate);
    var fg = HelperService.getDayEnd(lastDate);

    console.log('startDate' , startDate)
    console.log('lastDate' , lastDate)
    console.log('fg' , fg)
    SettlementMonthlyInvoice.findOne({}).sort({$natural: -1}).exec(function (err, settleInvoice){
        console.log(settleInvoice.invoiceNumber)
         var count =  settleInvoice.invoiceNumber;
         // var i = 203;
        Parlor.find({ }, {stateName:1, commissionType: 1, minimumGuarantee: 1, gstNumber: 1, address: 1, address2: 1, name: 1, cityId: 1, latitude: 1, longitude: 1 }, function(err, parlors) {
            async.each(parlors , function(p , call){
                SettlementReport.aggregate([{$match : {parlorId: ObjectId(p.id) , startDate: {$gte : startDate} , endDate : {$lte : fg}}},
                        {$group : {_id: '$parlorId' , totalOnlinePaymentFee :{$sum :'$onlinePaymentFee'}, totalOnlinePaymentFeeTax : {$sum : '$onlinePaymentFeeTax'},
                                    lastManagementFee : {$last : '$amountCollectedTillDate'}}},
                        ], function(err , agg){
                            // console.log(p.id , p.name)
                            // console.log(agg)
                           
                        p.address2 = p.address2.split(",").pop();
                        var obj = {
                            parlorId: p.id,
                            parlorName: p.name,
                            parlorAddress: p.address + ", " + p.address2,
                            salonGST: p.gstNumber ? p.gstNumber : "",
                            stateName: p.stateName,
                            
                            CGST: 0,
                            SGST: 0,
                            IGST: 0,
                            CGSTpercentage: 9,
                            SGSTpercentage: 9,
                            IGSTpercentage: 18,
                            taxTotal: 0,
                            amountTotal: 0,
                            amountTotalString: "",
                            taxTotalString: "",
                            date: lastDate.toDateString(),
                            month: lastDate.getMonth(),
                            year: lastDate.getFullYear(),
                            newSalon : false,
                            managementFee : 0,
                            onlinePaymentFee: 0,
                            onlinePaymentFeeExempt:  0,
                           
                        }
                     SettlementReport.findOne({parlorId: p.id, endDate: { $gte: lastDate, $lte: fg } }, function(err, settlement) {
                        var fee1 = 0, fee = 0;
                        if(agg.length > 0){
                              fee1 = Math.round(agg[0].totalOnlinePaymentFeeTax);
                              fee = Math.round(fee1 /0.18);
                             var onlinePaymentFee = Math.round(agg[0].totalOnlinePaymentFee)
                           
                            obj.onlinePaymentFee = (agg[0].totalOnlinePaymentFee > 0) ? fee : 0;
                            obj.onlinePaymentFeeExempt = ((agg[0].totalOnlinePaymentFee - agg[0].totalOnlinePaymentFeeTax) > 0) ? Math.round(onlinePaymentFee - fee1 - fee) : 0;
                            obj.managementFee = agg[0].lastManagementFee;   
                            // obj.managementFee = managementFee;   
                        }else if(agg.length == 0){
                            console.log("------------------------------")
                            obj.newSalon = true;
                            obj.managementFee = managementFee ? managementFee : 0;
                        }
                        if(obj.managementFee == 0){
                            obj.managementFee = p.minimumGuarantee;
                        }
                        
                        if (p.gstNumber) {
                            var gstCode = p.gstNumber.slice(0, 2);
                            obj.code = gstCode;
                           console.log("gstCode" , gstCode)
                            if (gstCode == "07" || p.stateName == "New Delhi") {
                                obj.CGST = Math.round((obj.managementFee + obj.onlinePaymentFee /*fee */)  * 0.09);
                                obj.SGST = Math.round((obj.managementFee + obj.onlinePaymentFee /*fee */) * 0.09);
                                obj.taxTotal = obj.CGST + obj.SGST;

                            } else {
                                obj.IGST = Math.round((obj.managementFee + obj.onlinePaymentFee /*fee */) * 0.18);
                                obj.taxTotal = obj.IGST;
                            }
                        }else {
                            if(p.stateName == "New Delhi"){
                                obj.CGST = Math.round((obj.managementFee + obj.onlinePaymentFee /*fee */)  * 0.09);
                                obj.SGST = Math.round((obj.managementFee + obj.onlinePaymentFee /*fee */) * 0.09);
                                obj.taxTotal = obj.CGST + obj.SGST;
                            } else {
                                obj.IGST = Math.round((obj.managementFee + obj.onlinePaymentFee /*fee */) * 0.18);
                                obj.taxTotal = obj.IGST;
                            }
                        }
                        obj.amountTotal = Math.round((obj.managementFee + obj.taxTotal + obj.onlinePaymentFee /*fee */ + obj.onlinePaymentFeeExempt));
                        obj.amountTotalString = HelperService.convertNumberToWOrds(obj.amountTotal);
                        obj.taxTotalString = HelperService.convertNumberToWOrds(obj.taxTotal);
                        
                        console.log(obj)
                        if(obj){
                            obj.invoiceNumber = count++;
                        }
                            SettlementMonthlyInvoice.create(obj , function(err , invoice){
                               // console.log(err)
                                call();

                            })
                        })
                    })
                }, function allTaskCompleted(){
                
                return "All done"
            });
        }); 
    });      
};


// on every save, add the date
settlementMonthlyInvoiceSchema.pre('save', function (next) {
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
var SettlementMonthlyInvoice = mongoose.model('SettlementMonthlyInvoice', settlementMonthlyInvoiceSchema);
module.exports = SettlementMonthlyInvoice;