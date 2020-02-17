/**
 * Created by ginger on 4/17/2017.
 */


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var discountStructureSchema = new Schema({

    sellerId : { type: Schema.ObjectId, ref : 'seller' },

    salonType:[],

    sellerName: { type: 'string' },

    slabs : [{
        rangeFrom: {type: 'number'},

        rangeTo: {type: 'String'},

        retailDiscount: {type: 'number'},

        professionalDiscount: {type: 'number'},

        yearBenefit: {type: 'number'},

        directDiscount:{type: 'number'},
        
        merchandising:{type: 'number'},
        beUPurchaseScheme:{type: 'number'},
        cashDiscountOnWax:{type: 'number'},
        cashDiscountOnWaxOil:{type: 'number'},
        cashDiscount:{type: 'number'},
        educationTraining:{type: 'number'},
        totalDiscount:{type:'number'}
    }],

    newSlab : [],

    contactNumber:{type: 'number'},

    parlorId : { type: Schema.ObjectId, ref : 'parlor' },

    createdAt : { type: 'date' },

    updatedAt : { type: 'date' }

});



var nodemailer = require('nodemailer');




discountStructureSchema.statics.createNew = function(data, callback) {

    console.log(data[0].sellerId)
    Sellers.findOne({_id:data[0].sellerId}).exec(function (err,result) {
        // console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrr",result)
        if(result){

            data[0]["sellerName"]=result.name
           
            console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrr dATA STRUCTURE",data)
            DiscountStructure.create(data, function(err, doc) {
                callback(err, doc);
            });
            }
    })

}




discountStructureSchema.statics.updateSlab = function(data, callback) {


    console.log("sdasdasdasdasda243");
console.log(data.slabs[0]._id);
console.log(data.slabs[0]);
    console.log("sdasdasdasdasdihuirtr7t87ret87rt9t8ertea243");

    var slab=data.slabs[0]._id

    DiscountStructure.update({"sellerId":data.sellerId,"slabs._id":slab},{$set: {

        "slabs.$.retailDiscount": data.slabs[0].retailDiscount ? data.slabs[0].retailDiscount :0,
        "slabs.$.professionalDiscount": data.slabs[0].professionalDiscount ? data.slabs[0].professionalDiscount:0,
        "slabs.$.yearBenefit": data.slabs[0].yearBenefit ? data.slabs[0].yearBenefit:0,
        "slabs.$.merchandising": data.slabs[0].merchandising ? data.slabs[0].merchandising:0,
        "slabs.$.cashDiscount": data.slabs[0].cashDiscount ? data.slabs[0].cashDiscount:0,
        "slabs.$.directBilling": data.slabs[0].directBilling ? data.slabs[0].directBilling:0,
        "slabs.$.directDiscount": data.slabs[0].directDiscount ? data.slabs[0].directDiscount:0,
        "slabs.$.educationTraining": data.slabs[0].educationTraining ? data.slabs[0].educationTraining:0,
        "slabs.$.beUPurchaseScheme":data.slabs[0].beUPurchaseScheme ?data.slabs[0].beUPurchaseScheme:0,
        "slabs.$.cashDiscountOnWax":data.slabs[0].cashDiscountOnWax ?data.slabs[0].cashDiscountOnWax :0 ,
        "slabs.$.cashDiscountOnWaxOil":data.slabs[0].cashDiscountOnWaxOil?data.slabs[0].cashDiscountOnWaxOil:0,
        "slabs.$.totalDiscount":data.slabs[0].totalDiscount?data.slabs[0].totalDiscount:0
        // "$salonType":data.slabs[0].salonType

    }}).exec(function(err,doc) {

        console.log(err)
        console.log(doc)

        callback(err, doc);

    })
}



discountStructureSchema.statics.getStructure = function(data, callback) {
    console.log(data.body)

    DiscountStructure.find({sellerId:data.body.sellerId,salonType:{$in:[data.body.salonType]}}).exec(function (err,resdata) {
console.log(resdata)
        callback(err,resdata);

    })


}











discountStructureSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();
    // change the updated_at field to current date
    this.updatedAt = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.createdAt)
        this.createdAt = currentDate;

    next();
});

var DiscountStructure = mongoose.model('discountStructure', discountStructureSchema);

module.exports = DiscountStructure;
