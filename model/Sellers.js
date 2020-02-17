/**
 * Created by ginger on 4/17/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;
var async = require('async');

var sellerSchema = new Schema({
    emailId: [],
    emailIdcc: [],
    emailId1: [{
        city: String,
        cityId: Number,
        ids: []

    }],
    emailIdcc1: [{
        city: String,
        cityId: Number,
        ids: []

    }],
    name: { type: 'string', required: true },

    contactNumber: [],
    contactNumber1: [{
        cityId: Number,
        city: String,
        phoneNumbers: []

    }],

    poNumber: { type: 'string' },

    address: { type: 'string' },

    tinNumber: { type: 'string' },

    // brands : [{brand:{ type: 'string',  required: true }}],

    items: [{ itemId: { type: Schema.ObjectId, ref: 'seller' }, name: { type: 'string', required: true } }],

    createdAt: { type: 'date' },

    updatedAt: { type: 'date' }


});


sellerSchema.statics.createNew = function(data, callback) {
    Sellers.create(data, function(err, doc) {
        callback(err, doc);
    });
}


sellerSchema.statics.insertItems1 = function(data, respond) {

    // ,{$unset: {sellerId:1,sellerName:1}},{multi: true}


    console.log(data.body.itemIds);

    InventoryItem.find({ sellerId: data.body.sellerId }).exec(function(err, result2) {

        var ids = _.map(result2, function(u) {

            return u._id

        })
        InventoryItem.update({ _id: { $in: ids } }, {
            $unset: {
                sellerId: 1,
                sellerName: 1
            }
        }, { multi: true }).exec(function(err, result2) {

            ParlorItem.find({ sellerId: data.body.sellerId }).exec(function(err, result3) {

                var ids2 = _.map(result3, function(u) {

                    return u.inventoryItemId

                })


                ParlorItem.update({ "inventoryItemId": { $in: ids2 } }, {
                    $unset: {
                        sellerId: 1,
                        sellerName: 1
                    }
                }, { multi: true }).exec(function(err, result3) {

                    Sellers.update({ _id: data.body.sellerId }, {
                        $set: {
                            "items": [],
                            name: data.body.name,
                            emailId1: data.body.emailId,
                            emailIdcc1: data.body.emailId,
                            contactNumber1: data.body.contactNumber
                        }
                    }).exec(function(err, data1) {

                        var queryy = {};
                        if (data.body.itemIds.length > 0) {

                            queryy = {
                                $set: {
                                    "items": data.body.itemIds
                                }

                            }
                        } else {
                            queryy = { $set: { "items": [] } }



                        }




                        Sellers.update({ "_id": data.body.sellerId }, queryy).exec(function(err, data22) {
                            if (err) {
                                respond(true, "error");
                            }


                            var itemids = _.map(data.body.itemIds, function(u) {


                                return u.itemId

                            })

                            console.log("------------===================iiiiiiiiiiii", itemids)
                            InventoryItem.update({ _id: { $in: itemids } }, {
                                $set: {
                                    sellerId: data.body.sellerId,
                                    sellerName: data.body.name
                                }
                            }, { multi: true }).exec(function(err, result2) {
                                ParlorItem.update({ "inventoryItemId": { $in: itemids } }, {
                                    $set: {
                                        sellerId: data.body.sellerId,
                                        sellerName: data.body.name
                                    }
                                }, { multi: true }).exec(function(err, result3) {

                                    if (err) {
                                        respond(true, "error in sending query");
                                    }
                                    respond(false, "done");
                                })


                            })

                        })

                    })

                })

            })
        })

    })
}
sellerSchema.statics.insertItems = function(data, respond) {




    // console.log(data.body)

    var array = []
    var itemArray = []

    _.map(data.body.itemIds, function(k) {

        array.push(k.itemId)
    })


    console.log("items are--------------->>>>", data.body.itemIds)

    ProductCategories.update({ sellerId: data.body.sellerId }, { $set: { sellerId: null, sellerName: null } }, { multi: true }, function(err, cats) {
        ProductCategories.update({ _id: { $in: array } }, { $set: { sellerId: data.body.sellerId, sellerName: data.body.name } }, { multi: true }, function(err, cats) {


            InventoryItem.find({ productCategoryId: { $in: array } }, function(err, cat) {

                _.map(cat, function(p) {

                    itemArray.push({ itemId: p._id, name: p.name })
                })

                InventoryItem.find({ sellerId: data.body.sellerId }).exec(function(err, result2) {

                    var ids = _.map(result2, function(u) {

                        return u._id

                    })


                    console.log(ids)
                    InventoryItem.update({ _id: { $in: ids } }, {
                        $unset: {
                            sellerId: 1,
                            sellerName: 1
                        }
                    }, { multi: true }).exec(function(err, result2) {

                        ParlorItem.find({ sellerId: data.body.sellerId }).exec(function(err, result3) {

                            var ids2 = _.map(result3, function(u) {

                                return u.inventoryItemId

                            })


                            ParlorItem.update({ "inventoryItemId": { $in: ids2 } }, {
                                $unset: {
                                    sellerId: 1,
                                    sellerName: 1
                                }
                            }, { multi: true }).exec(function(err, result3) {

                                Sellers.update({ _id: data.body.sellerId }, {
                                    $set: {
                                        "items": [],
                                        name: data.body.name,
                                        emailId1: data.body.emailId,
                                        emailIdcc1: data.body.emailIdcc,
                                        address: data.body.address,
                                        contactNumber1: data.body.contactNumber
                                    }
                                }).exec(function(err, data1) {

                                    var queryy = {};
                                    if (itemArray.length > 0) {
                                        queryy = {
                                            $set: {
                                                "items": data.body.itemIds
                                            }

                                        }
                                    } else {
                                        queryy = { $set: { "items": [] } }
                                    }

                                    Sellers.update({ "_id": data.body.sellerId }, queryy).exec(function(err, data22) {
                                        if (err) {
                                            respond(true, "error");
                                        }


                                        var itemids = _.map(itemArray, function(u) {


                                            return u.itemId

                                        })

                                        console.log("------------===================iiiiiiiiiiii", itemids)
                                        InventoryItem.update({ _id: { $in: itemids } }, {
                                            $set: {
                                                sellerId: data.body.sellerId,
                                                sellerName: data.body.name
                                            }
                                        }, { multi: true }).exec(function(err, result2) {
                                            ParlorItem.update({ "inventoryItemId": { $in: itemids } }, {
                                                $set: {
                                                    sellerId: data.body.sellerId,
                                                    sellerName: data.body.name
                                                }
                                            }, { multi: true }).exec(function(err, result3) {

                                                if (err) {
                                                    respond(true, "error in sending query");
                                                }
                                                respond(false, "done");
                                            })


                                        })

                                    })

                                })

                            })

                        })
                    })

                })


            })

        })
    })

}








sellerSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();
    // change the updated_at field to current date
    this.updatedAt = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.createdAt)
        this.createdAt = currentDate;

    next();
});

var Sellers = mongoose.model('seller', sellerSchema);

module.exports = Sellers;