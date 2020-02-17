
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;


var flashCouponSchema = new Schema({

    createdAt: { type: 'date' },

    updatedAt: { type: 'date' },

    parlors :{

        type: [{
                parlorId : { type: Schema.ObjectId , required: true},

                parlorName : {type : 'string'},
                name : {type : 'string'},

                currentCount : {type : 'number' ,default : 0},

                maximumCount : {type: 'number' , default : 0},
            }],

        defaultsTo: []
    },

    ambience :{

        type: [],

        defaultsTo: []
    },

    dealId : {type : 'number', },
    
    serviceCodes :{

        type: [{
                serviceId : { type: Schema.ObjectId , required: true},

                departmentId : { type: Schema.ObjectId, default : null},
                
                categoryId : { type: Schema.ObjectId, default : null},
                
                brandId : { type: Schema.ObjectId, default : null},

                productId : { type: Schema.ObjectId, default : null},

                serviceCode : {type : 'number' ,default : 0},

                price : {type : 'number' ,default : 0},

                serviceName : {type : 'string' ,default : 0},
            }],

        defaultsTo: []
    },

    description:{type : 'string' , required : true},

    couponTitle:{type : 'string' , required : true},

    gender :{type : 'string' }, // M, F

    menuPrice: {type : 'number', default : 0},
    
    dealPrice: {type : 'number', default : 0},

    cityPrice :{

        type: [{
                cityId : {type: 'number'},

                price : {type : 'number'}
            }],

        defaultsTo: []
    },

    code : {type: 'string' , required : true},

    active : {type: 'boolean' , default : false},

    starts_at :{type: 'date'},

    expires_at :{type: 'date'},

    currentCount : {type : 'number' ,default : 0},

    maximumCount : {type: 'number' , default : 0},

    offPercentage : {type: 'number' , default :0},

    imageUrl : {type: 'string', default : "" },

    websiteImageUrl : {type: 'string', default : "" },

    existingDeal : {type : 'boolean'},

});


flashCouponSchema.statics.getFlashCarousel = function(callback) {
    var query ={ };
        if(localVar.isServer())query.active = true;
        else query.active = false;
    FlashCoupon.find(query, function(err, coupons2){
        return callback( _.map(coupons2, function(c){
            return {
                couponCode : c.code,
                expires_at : c.expires_at,
                serviceCodes : c.serviceCodes,
                menuPrice : c.menuPrice,
                imageUrl : c.imageUrl,
            };
        }));
    });
};


flashCouponSchema.statics.getServiceCodeAndPrice = function(f, cityId) {
    var data = [];
        _.forEach(f.serviceCodes, function(s){
            var price = FlashCoupon.getPriceByCityId(f.cityPrice, cityId);
            data.push({
                serviceCode : s.serviceCode,
                brandId : s.brandId,
                productId : s.productId,
                price : price
            });
        });
    return data;
};

flashCouponSchema.statics.getPriceByCityId = function(cityPrice, cityId) {
    var price = cityPrice[0].price;
    var p = _.filter(cityPrice, function(p){ return p.cityId == cityId})[0];
    if(p)price = p.price;
    return price;
}


flashCouponSchema.pre('save', function(next) {
    
    var currentDate = new Date();
    this.role = parseInt(this.role);
    this.updatedAt = currentDate;
    if (!this.createdAt)
        this.createdAt = currentDate;

    next();
});

var FlashCoupon = mongoose.model('flashcoupon', flashCouponSchema);

module.exports = FlashCoupon;
