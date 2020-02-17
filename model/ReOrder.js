/**
 * Created by ginger on 4/17/2017.
 */



var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var reorderSchema = new Schema({


    sellerId: { type: Schema.ObjectId, ref: 'seller' },

    name: { type: 'string', required: true },

    billUploadDate: { type: 'date' },

    billProcessDate: { type: 'date' },

    poNumber: 'number',

    quotationNumber: { type: 'number' },

    parlorId: { type: Schema.ObjectId },

    contactNumber: { type: 'number' },

    ApprovalStatus: { type: 'boolean', default: false },

    imageUrl: [{
        image: { type: 'string' }
    }],

    items: [{
        itemId: { type: Schema.ObjectId, ref: 'InventoryItem' },
        itemName: { type: 'string' },
        categorySum: { type: 'string' },
        categoryName: { type: 'string' },

        sellingPrice: { type: 'number' },
        quantity: { type: 'number' },
        currentQuantity: { type: 'number' },
        actualQuantity: { type: 'number' },
        recieveQuantity: { type: 'number' },
        orderedQuantity: { type: 'number' },
        productCategoryName: 'String',
        productCategoryId: 'String',
        status: { type: 'number' },

    }],

    newItems: [],

    emailId: { type: 'string', required: true },

    orderAmount: { type: 'number', default: 0 },

    newOrderAmount: { type: 'number', default: 0 },

    status: { type: 'number', required: true }, // 0- received , 1- not rec

    receivedAt: { type: 'date' },

    createdAt: { type: 'date' },

    updatedAt: { type: 'date' },

    notes: { type: 'string'},

});




reorderSchema.statics.insertOrder = function(data, callback) {

    var itemsToAdded = _.filter(_.map(data.body.items, function(a) {

        if (a.quantity > 0) {
            return {
                itemId: { type: 'number', required: true },
                sellingprice: { type: 'number', required: true },
                // costPrice:{type: 'number', required : true},
                quantity: { type: 'number', required: true },
                subTotal: { type: 'number', required: true },
                actualQuantity: { type: 'number' }
            }

        } else {

        }
    }), null);



    var query = {
        sellerId: data.body.sellerId,
        items: itemsToAdded,
        emailId: { type: 'string', required: true },
        orderAmount: { type: 'number', required: true },
        status: { type: 'number', required: true },
    }
    ReOrder.create(query).exec(function(err, result) {

        callback(err, result)

    })


}





reorderSchema.statics.parseGetPurchase = function(dataa) {

    return {

        data: _.map(dataa, function(data) {

            return {
                "sellerId": data.sellerId,
                "date": data.createdAt,
                "receivedDate": data.receivedAt,
                "parlorId": data.parlorId,
                "sellerName": data.name,
                "categorySum": data.categorySum,
                "categoryName": data.categoryName,
                "emailId": data.emailId,
                "orderAmount": data.orderAmount,
                "newOrderAmount": data.newOrderAmount,
                "imageUrl": data.imageUrl,
                "status": data.status,
                "orderId": data._id,
                "items": _.map(data.items, function(t) {
                    return {
                        "itemId": t.itemId,
                        "itemName": t.itemName,
                        "currentItem": t.actualQuantity,
                        "productCategoryName": t.productCategoryName,
                        "productCategoryId": t.productCategoryId,
                        "actualQuantity": t.actualQuantity,
                        "orderedQuantity": t.orderedQuantity,
                        "recieveQuantity": t.recieveQuantity,
                        "editId": t._id
                    }

                })



            }
        })
    }





}


reorderSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();
    // change the updated_at field to current date
    this.updatedAt = currentDate;

    // if created_at doesn't exist, add to that field
    if (!this.createdAt)
        this.createdAt = currentDate;

    next();
});

var ReOrder = mongoose.model('reOrder', reorderSchema);

module.exports = ReOrder;