/**
 * Service.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var parlorItemSchema = new Schema({

    name: { type: 'String' },

    active: { type: 'boolean', default: true },

    inventoryItemId: { type: Schema.Types.ObjectId, ref: 'InventoryItem' },

    parlorId: { type: Schema.Types.ObjectId, ref: 'parlor' },

    itemId: { type: 'number', required: true },

    sellingPrice: { type: 'number', required: true },

    sellingPrices: [{ sellingPrice: { type: 'number', required: true } }],

    sellerId: { type: Schema.ObjectId, ref: 'seller' },

    productCategoryId: { type: Schema.ObjectId, ref: 'productCategories' },

    productCategoryName: { type: 'string' },

    salonType: [],

    sellerName: { type: 'string' },

    tax: { type: 'number', required: true },

    bestBefore: { type: 'number', required: true },

    manufactureMonth: { type: 'date', required: true },

    commission: { type: 'number', required: true },

    costPrice: { type: 'number', required: true },

    quantity: { type: 'number', required: true },

    actualUnits: { type: 'number', default : 0 },

    totalSold: { type: 'number', defaultsTo: 0 },

    orderedStatus: { type: 'number' },

    addHistory: [{

        manufactureMonth: { type: 'date', required: true },

        quantity: { type: 'number', required: true },

        addedOn: { type: 'date' },

        costPrice: { type: 'number', default: 0 },

        sellingPrice: { type: 'number', default: 0 },

    }],

    minimumQuantity: { type: 'number', required: true },

    capacity: { type: 'string', required: true },
});

parlorItemSchema.statics.items = function(parlorId, callback) {
    ParlorItem.find({ parlorId: parlorId }, function(err, items) {
        items = _.map(items, function(item) {
            return ParlorItem.parse(item);
        });
        return callback(err, items);
    });
};


parlorItemSchema.statics.addItemToInventory = function(req, itemId, callback) {
    InventoryItem.findOne({ itemId: itemId }, function(err, item) {
        var newItem = ParlorItem.createNewObj(req, item);
        ParlorItem.findOne({ parlorId: req.session.parlorId, itemId: itemId }, function(err, parlorItem) {
            if (!parlorItem) {
                ParlorItem.create(ParlorItem.createNewObj(req, item), function(err, newItem) {
                    return callback(null, ParlorItem.parseForParlor(item, newItem));
                });
            } else return callback(true, null);
        });
    });
};

var async = require('async');
parlorItemSchema.statics.copyItemToParlor = function(parlorId) {
    var allItems = [];
    ParlorItem.find({ parlorId: parlorId }, function(err, parlorItems) {
        async.each(parlorItems, function(item, cb) {

            allItems.push(createNewCopyObj(parlorId, item))
            cb();
        }, function() {
            ParlorItem.create(allItems, function(err, newItem) {
                console.log("All Items are copied")
            });

        })
    });

};

parlorItemSchema.statics.consumeParlorProducts = function(productsUsedInService,parlorId, cb) {
    Async.each(productsUsedInService, function(product, callback) {
        InventoryItem.findOne({_id : product.inventoryItemId}, {oneUnitQuantity : 1} , function(er, inventoryItem){
             ParlorItem.findOne({ parlorId: parlorId, inventoryItemId: product.inventoryItemId }, function(err, parlorItem) {
                    if (parlorItem) {
                        var newUnits = parlorItem.actualUnits - (product.inventoryItemQunatity * product.serviceQuantity);
                        var newQuantity = parlorItem.quantity - (newUnits % inventoryItem.oneUnitQuantity != 0 ? parseInt((parlorItem.actualUnits-newUnits)/inventoryItem.oneUnitQuantity) : parlorItem.quantity - parseInt(newUnits/inventoryItem.oneUnitQuantity));
                        if (newQuantity != parlorItem.quantity && newQuantity >= 0) {
                            ParlorItem.update({ parlorId: parlorId, inventoryItemId: product.inventoryItemId }, {actualUnits : newUnits, quantity: newQuantity, $push: { 'addHistory': { quantity: newQuantity - parlorItem.quantity, costPrice: parlorItem.costPrice, manufactureMonth: new Date(), addedOn: new Date() } } }, function(err, newItem) {
                                callback();
                            });
                        } else if(newQuantity >= 0){
                            ParlorItem.update({ parlorId: parlorId, inventoryItemId: product.inventoryItemId }, {actualUnits : newUnits }, function(err, newItem) {
                                callback();
                            });
                        }else{
                                callback();
                        }

                    } else {
                        callback();
                    }
                });
        });
    }, function allTaskCompleted() {
        console.log("done");
        cb();
    });
};

parlorItemSchema.statics.consumeItem = function(req, items, apptointmentCompleted, cb) {
    async = require('async');
    async.series([
        function(done) {
            async.each(items, function(item, callback) {

                ParlorItem.findOne({ parlorId: req.session.parlorId, _id: item.Id }, function(err, parlorItem) {
                    if (parlorItem) {
                        var newQuantity = parlorItem.quantity + parseInt(item.amount);
                        if (newQuantity >= 0) {
                            console.log("consuming", item.item)
                            ParlorItem.update({ parlorId: req.session.parlorId, _id: item.Id }, { quantity: newQuantity, $push: { 'addHistory': { quantity: item.amount, costPrice: parlorItem.costPrice, manufactureMonth: req.body.manufactureMonth, addedOn: new Date() } } }, function(err, newItem) {
                                console.log("updateddddddddddddddddd", newItem)
                                item.newQuantity = newQuantity;
                                callback();
                            });
                        } else {
                            callback();
                        }

                    } else {
                        callback();
                    }
                });
            }, done);
        },
    ], function allTaskCompleted() {
        console.log('done');
        var newItems = _.map(items, function(i) { return { quantity: i.newQuantity, itemId: i.itemId }; });
        if (!apptointmentCompleted)
            return cb(null, { quantity: items[0].newQuantity });
        else
            return cb(null, newItems);
    });
};

parlorItemSchema.statics.createNewObj = function(req, item) {
    return {
        name: item.name,
        inventoryItemId: item.id,
        parlorId: req.session.parlorId,
        itemId: item.itemId,
        tax: item.tax,
        sellingPrice: item.sellingPrice,
        bestBefore: item.bestBefore,
        actualUnits : item.oneUnitQuantity * 0,
        manufactureMonth: req.body.manufactureMonth,
        addHistory: [{
            manufactureMonth: req.body.manufactureMonth,
            quantity: 0,
            addedOn: new Date(),
        }],
        commission: req.body.commission,
        costPrice: req.body.costPrice,
        quantity: 0,
        minimumQuantity: req.body.minimumQuantity,
        capacity: item.capacity,
        sellerId: item.sellerId,
        sellerName: item.sellerName,
        productCategoryId: item.productCategoryId,
        productCategoryName: item.productCategoryName,
        salonType: item.salonType,
        active: item.active
    };
};
parlorItemSchema.statics.createNewCopyObj = function(parlorId, item) {
    return {
        name: item.name,
        inventoryItemId: item.id,
        parlorId: parlorId,
        itemId: item.itemId,
        tax: item.tax,
        sellingPrice: item.sellingPrice,
        bestBefore: item.bestBefore,
        manufactureMonth: item.manufactureMonth,
        addHistory: [{
            manufactureMonth: item.manufactureMonth,
            quantity: 0,
            addedOn: new Date(),
        }],
        commission: item.commission,
        costPrice: item.costPrice,
        quantity: item.quantity,
        minimumQuantity: item.minimumQuantity,
        capacity: item.capacity,
        sellerId: item.sellerId,
        sellerName: item.sellerName,
        productCategoryId: item.productCategoryId,
        productCategoryName: item.productCategoryName,
        salonType: item.salonType,
        active: item.active
    };
};

parlorItemSchema.statics.parseForParlor = function(s, newItem) {
    return {
        itemId: s.itemId,
        name: s.name,
        sellingPrice: s.sellingPrice,
        bestBefore: s.bestBefore,
        capacity: s.capacity,
        brand: s.brand,
        quantity: newItem.quantity,
        minimumQuantity: newItem.minimumQuantity,
        active: newItem.active
    };
};

parlorItemSchema.statics.parse = function(s) {
    return {
        itemId: s.itemId,
        name: s.name,
        sellingPrice: s.sellingPrice,
        bestBefore: s.bestBefore,
        capacity: s.capacity,
        tax: s.tax,
        brand: s.brand,
        commission: s.commission,
    };
};

//  on every save, add the date
parlorItemSchema.pre('save', function(next) {
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
var ParlorItem = mongoose.model('parloritem', parlorItemSchema);

// make this available to our users in our Node applications
module.exports = ParlorItem;