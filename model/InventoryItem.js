/**
 * Service.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var inventoryItemSchema = new Schema({

    name: { type: 'string', required: true },

    sellingPrice: { type: 'number', required: true },

    sellingPrices: [{ sellingPrice: { type: 'number', required: true } }],

    productCategoryId: { type: Schema.ObjectId, ref: 'productCategories' },

    productCategoryName: { type: 'string' },

    tax: { type: 'number', required: true },

    salonType: [],

    itemId: { type: 'number', required: true },

    sellerId: { type: Schema.ObjectId, ref: 'seller' },

    sellerName: { type: 'string' },

    images: [],

    bestBefore: { type: 'number', required: true },

    capacity: { type: 'string' },

    createdAt: { type: 'date' },

    oneUnitQuantity: { type: 'number', default: 1 },

    updatedAt: { type: 'date' },
    
    active: { type: 'boolean', default: true },
});


inventoryItemSchema.statics.insertCategory = function(req, callback) {

    InventoryItem.update({ _id: req.body.itemId }, { $set: { productCategoryId: req.body.categoryId } }, function(err, response) {

        if (err) {
            console.log(err)
            callback(true, response);
        } else {
            callback(false, response);
        }

    })
}


inventoryItemSchema.statics.items = function(callback) {


    InventoryItem.find({}, {}, { sort: { 'createdAt': -1 } }, function(err, items) {

        items = _.map(items, function(item) {
            return InventoryItem.parse(item);
        });
        return callback(err, items);

    });

};

inventoryItemSchema.statics.addNewItem = function(req, callback) {
    var newItem = InventoryItem.newObj(req);
    InventoryItem.findOne({}, {}, { sort: { 'itemId': -1 } }, function(err, s) {
        newItem.itemId = s ? s.itemId + 1 : 1;
        console.log("ccccccccccccccccc", req.body.categoriesId)
        ProductCategories.findOne({ _id: req.body.categoriesId }, function(err, result) {
            console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr", result)
            newItem.productCategoryId = result._id;
            newItem.productCategoryName = result.name;
            newItem.salonType = result.salonType;
            newItem.images=result.images
            console.log("finallllllllllllllll", newItem)
            InventoryItem.create(newItem, function(err, item) {
                console.log("created result", item);
                return callback(err, item);
            });

        })

    });
};

inventoryItemSchema.statics.parse = function(s) {

    return {
        itemId: s.itemId,
        name: s.name,
        sellingPrice: s.sellingPrice,
        bestBefore: s.bestBefore,
        capacity: s.capacity,
        sellerId : s.sellerId,
        brand: s.brand,
        Id: s._id,
        images:s.images,
        oneUnitQuantity : s.oneUnitQuantity,
        categoriesId: s.productCategoryId,
        categoriesName: s.productCategoryName,
        salonType: s.salonType,
        active: s.active

    };
};

inventoryItemSchema.statics.newObj = function(req) {
    return {
        itemId: 0,
        name: req.body.name,
        sellingPrice: req.body.sellingPrice,
        bestBefore: req.body.bestBefore,
        capacity: 'n/a',
        tax: 18,
    };
};
//  on every save, add the date
inventoryItemSchema.pre('save', function(next) {
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
var InventoryItem = mongoose.model('inventoryitem', inventoryItemSchema);

// make this available to our users in our Node applications
module.exports = InventoryItem;