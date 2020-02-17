/**
 * Created by Nikita on 2/20/2017.
 */
/**
 * Created by Nikita on 2/18/2017.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;


var salonMasterMenuSchema = new Schema({

    createdAt: { type: 'date' },

    updatedAt: { type: 'date' },

    dealId : { type : 'number'},

    dealName : { type : 'string'},

    parlorType : {type : 'number', default : 0},

    categoryId : { type: Schema.Types.ObjectId, ref: 'ServiceCategory' },

    cityId1 : {
        p1 : {type : 'number', default : 50000},
        p2 : {type : 'number', default : 50000},
        p3 : {type : 'number', default : 50000},
        p4 : {type : 'number', default : 50000},
        p5 : {type : 'number', default : 50000},
        p6 : {type : 'number', default : 50000},
        p7 : {type : 'number', default : 50000},
        p8 : {type : 'number', default : 50000},
    },

    cityId2 : {
        p1 : {type : 'number', default : 50000},
        p2 : {type : 'number', default : 50000},
        p3 : {type : 'number', default : 50000},
        p4 : {type : 'number', default : 50000},
        p5 : {type : 'number', default : 50000},
        p6 : {type : 'number', default : 50000},
        p7 : {type : 'number', default : 50000},
        p8 : {type : 'number', default : 50000},
    },
});




salonMasterMenuSchema.statics.getNewObj =  function(dealId, dealName, parlorType, prices){
    return {
            dealId : dealId,
            dealName : dealName,
            parlorType : parlorType,
            cityId1 : {
                p1 : prices[0].p1,
                p2 : prices[0].p2,
                p3 : prices[0].p3,
                p4 : prices[0].p4,
                p5 : prices[0].p5,
                p6 : prices[0].p6,
                p7 : prices[0].p7,
                p8 : prices[0].p8,
            },
            cityId2 : {
                p1 : prices[1].p1,
                p2 : prices[1].p2,
                p3 : prices[1].p3,
                p4 : prices[1].p4,
                p5 : prices[1].p5,
                p6 : prices[1].p6,
                p7 : prices[1].p7,
                p8 : prices[1].p8,
            }
    };

};


// on every save, add the date
salonMasterMenuSchema.pre('save', function(next) {
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

var SalonMasterMenu = mongoose.model('salonMasterMenu', salonMasterMenuSchema);
// make this available to our users in our Node applications

module.exports = SalonMasterMenu;
