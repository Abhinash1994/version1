var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var userCart = new Schema({
    
    userId : {type : Schema.ObjectId, default : null},

    parlorId : {type : Schema.ObjectId, default : null},

    services : {type : [{

        code : { type : 'number'},

        quantity : { type : 'number'},

        time : {type : 'date'},

    }], defaultsTo : []},

    lastServiceAddTime: { type: 'date' },

    status: { type: 'number', default : 0 },

    createdAt : {type : 'date'},

    lastNotificationDate : {type : 'date'},

});




// on every save, add the date
userCart.pre('save', function (next) {
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
var UserCart = mongoose.model('usercart', userCart);
module.exports = UserCart;