/**
 * Created by ginger on 4/28/2017.
 */


var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var productCategoriesSchema = new Schema({

    name:{type:'string',required:true,unique:true},

    images:[],

    sellerId:{ type: Schema.ObjectId, ref : 'seller' },

    salonType:[],

    sellerName:{type:'string'},

    createdAt : { type: 'date' },

    updatedAt : { type: 'date' }

});



productCategoriesSchema.statics.deleteMyData=function (query,callback) {

    ProductCategories.remove(query,function (err,response) {

        if(err){
            console.log(err)
            callback(true,response);
        }else{
            callback(false,response);
        }
        
    })


}




productCategoriesSchema.statics.createNew=function (data,callback) {
console.log("andar",data)
    ProductCategories.create(data,function (err,response) {
if(err){
    console.log(err)
    callback(true,response);
}else{
    callback(false,response);
}

        
    })

    
}

productCategoriesSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();
    // change the updated_at field to current date
    this.updatedAt = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.createdAt)
        this.createdAt = currentDate;

    next();
});

var ProductCategories = mongoose.model('productCategories', productCategoriesSchema);

module.exports = ProductCategories;
