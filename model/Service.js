/**
 * Service.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var serviceSchema = new Schema({

    name: { type: 'string', required: true },

    affiliateServiceOnly: { type: 'boolean', default: false },

    ownerId: { type: Schema.Types.ObjectId, default : null},

    inventoryItemId: { type: Schema.Types.ObjectId, default : null},

    inventoryItemQunatity: { type: 'number', default : 1},

    nameOnApp: { type: 'string', required: true },

    serviceCode: { type: 'number', required: true },

    subTitle: { type: 'string', defaultsTo: "" },

    subCategoryId: { type: Schema.Types.ObjectId, ref: 'ServiceCategory' },

    subCategoryIdSort: { type: 'number', default: 0 },

    tag: { type: 'string', defaultsTo: "" },

    isAvailableForHomeService: { type: 'boolean', default: false },

    gstDescription: { type: 'string', },

    gstNumber: { type: 'string', },

    gender: { type: 'string', required: true },

    sort: { type: 'number', defaultsTo: 1 },

    dontShowInApp: { type: 'boolean', default: false },

    isDeleted: { type: 'boolean', defaultsTo: false },

    upgrades: { type: [{ type: Schema.Types.ObjectId }] },

    recommendedProducts: { type: [{ type: Number }] },

    serviceTips: {

        type: [{

            link: { type: 'string', },

            description: { type: 'string', required: true },

            createdAt: { type: 'date' },

            updatedAt: { type: 'date' },

        }],
        defaultsTo: []
    },

    upgradeType: { type: 'String', default: null }, //brand, subCategory, service

    categoryId: { type: Schema.Types.ObjectId, ref: 'ServiceCategory' },

    description: { type: 'string', },

    estimatedTime: { type: 'number' },

    prices: {

        type: [{

            priceId: { type: 'number', required: true },

            name: { type: 'String', },

            parlorTypes: { type: [], defaultsTo: [] },

            brand: {

                title: { type: 'String' },

                brands: {
                    type: [{

                        name: { type: 'String' },

                        brandId: { type: Schema.ObjectId },

                        maxSaving: { type: 'boolean', default: false },

                        popularChoice: { type: 'boolean', default: false },

                        productTitle: { type: 'String', default: null },

                        // lowest: { type: 'number' },

                        lowest: { type: [], defaultsTo: [] },

                        // saveUpto: { type: 'number' },

                        saveUpto: { type: [], defaultsTo: [] },

                        parlorTypes: { type: [], defaultsTo: [] },

                        products: {

                            type: [{

                                name: { type: 'String' },

                                popularChoice: { type: 'boolean', default: false },

                                maxSaving: { type: 'boolean', default: false },

                                productId: { type: Schema.Types.ObjectId, ref: 'ServiceProduct' },

                                parlorTypes: { type: [], defaultsTo: [] },

                            }],
                            defaultsTo: []
                        },

                    }],
                    defaultsTo: []
                },
            },

            additions: {

                type: [{
                    name: { type: 'String' },

                    types: [{ type: 'String' }]

                }],
                defaultsTo: []
            },

            createdAt: { type: 'date' },

            updatedAt: { type: 'date' },

        }],
        defaultsTo: []
    },

    createdAt: { type: 'date' },

    updatedAt: { type: 'date' },

    serviceRepeatDay :{ type: 'number' , defaultsTo : 30},

    repeatDaysInterval :{ type: 'number' , defaultsTo : 7},

    notificationContent :{ type: 'string' , default :""},

    notificationTitle :{ type: 'string', default : ""},

    smsContent : { type: 'string' , default:""}

});

serviceSchema.statics.serviceByCategoryId = function(categoryId, callback) {
    Service.find({ categoryId: categoryId }).exec(function(err, services) {
        services = _.map(services, function(s) {
            return Service.parse(s);
        });
        return callback(err, services);
    });
};

serviceSchema.statics.parse = function(s) {
    return {
        serviceId: s.id,
        name: s.name,
        nameOnApp: s.nameOnApp,
        isDeleted: s.isDeleted,
        dontShowInApp: s.dontShowInApp,
        serviceCode: s.serviceCode,
        subtitle: s.subTitle,
        tag: s.tag,
        gstNumber: s.gstNumber,
        gstDescription: s.gstDescription,
        sort: s.sort,
        subCategoryId: s.subCategoryId,
        upgrades: s.upgrades,
        upgradeType: s.upgradeType,
        prices: s.prices,
        gender: s.gender,
        time: HelperService.parseTime(s.createdAt),
        description: s.description,
        estimatedTime: s.estimatedTime,
        ServiceRepeatDate : s.serviceRepeatDay,
        ServiceRepeatContent : s.notificationContent,
        ServiceRepeatTitle : s.notificationTitle,
        ServiceRepeatSms : s.smsContent,
        repeatDaysInterval : s.repeatDaysInterval,
        tip1 : s.serviceTips.length>0 ? s.serviceTips[0].description : "",
        tip2 : s.serviceTips.length>1 ? s.serviceTips[1].description : "",
        tip3 : s.serviceTips.length>2 ? s.serviceTips[2].description : "",
        tip4 : s.serviceTips.length>3 ? s.serviceTips[3].description : "",
        tip5 : s.serviceTips.length>4 ? s.serviceTips[4].description : "",
        tip1Url : s.serviceTips.length>0 ? s.serviceTips[0].link : "",
        tip2Url : s.serviceTips.length>1 ? s.serviceTips[1].link : "",
        tip3Url : s.serviceTips.length>2 ? s.serviceTips[2].link : "",
        tip4Url : s.serviceTips.length>3 ? s.serviceTips[3].link : "",
        tip5Url : s.serviceTips.length>4 ? s.serviceTips[4].link : "",
    };
};

serviceSchema.statics.getNewService = function(service, count) {
    var obj = {
        name: service.name,
        gstNumber: service.gstNumber,
        gstDescription: service.gstDescription,
        isDeleted: service.isDeleted,
        inventoryItemId : service.inventoryItemId,
        upgrades: service.upgrades,
        upgradeType: service.upgradeType,
        subCategoryId: service.subCategoryId,
        subTitle: service.subtitle ? service.subtitle : "",
        tag: service.tag ? service.tag : "",
        prices: service.prices,
        sort: service.sort ? service.sort : 1,
        nameOnApp: service.nameOnApp ? service.nameOnApp : '',
        dontShowInApp: service.dontShowInApp ? service.dontShowInApp : false,
        description: service.description,
        estimatedTime: service.estimatedTime,
        serviceRepeatDay : service.ServiceRepeatDate,
        notificationContent : service.ServiceRepeatContent,
        notificationTitle : service.ServiceRepeatTitle,
        smsContent : service.ServiceRepeatSms,
        repeatDaysInterval : service.repeatDaysInterval
    };
    _.forEach(obj.prices, function(p) {
        if (!p.priceId) {
            count++;
            p.priceId = count;
            p.createdAt = new Date();
            p.additions = [];
            var thickness = service.thickness ? p.additions.push(Service.getThicknessObj()) : [];
            var colorLength = service.colorLength ? p.additions.push(Service.getColorLengthObj()) : [];
            var upstyling = service.upstyling ? p.additions.push(Service.getUpstylingObj()) : [];
            var shampooLength = service.shampooLength ? p.additions.push(Service.getShampooLengthObj()) : [];
        }
    });
    return obj;
};
serviceSchema.statics.getColorLengthObj = function() {
    return {
        name: 'Color Length',
        types: ['Upto 1 Inch', 'Above 1 Inch'],
    };
};


serviceSchema.statics.getUpstylingObj = function() {
    return {
        name: 'Upstyling',
        types: ['Basic', 'Semi', 'Advance'],
    };
};



serviceSchema.statics.getShampooLengthObj = function() {
    return {
        name: 'Shampoo Length',
        types: ['Normal', 'XL & XXL'],
    };
};


serviceSchema.statics.getNewAdditionObj = function(additions) {
    return _.map(additions, function(a) {
        return {
            name: a.name,
            types: _.map(a.types, function(l) {
                return {
                    name: l,
                    additions: 0,
                    percentageDifference: 0,
                };
            }),
        }
    });
};


serviceSchema.statics.getNewBrandsObj = function(brand, parlorBrand) {
    console.log(parlorBrand);
    console.log('0-----------------');
    var obj = {
        title: brand.title,
        brands: _.map(brand.brands, function(brand) {
            var po = _.filter(parlorBrand.brands, function(p) { return p.brandId + "" == "" + brand.brandId })[0];
            return {
                name: brand.name,
                brandId: brand.brandId,
                productTitle: brand.productTitle,
                ratio: po ? po.ratio : 0,
                products: _.map(brand.products, function(pro) {
                    if (!po) {
                        po = {};
                        po.products = [];
                    }
                    var product = _.filter(po.products, function(prod) { return prod.productId + "" == "" + pro.productId })[0];
                    return {
                        name: pro.name,
                        productId: pro.productId,
                        ratio: product ? product.ratio : 0,
                    };
                })
            };
        }),
    };
    return obj;
};


serviceSchema.statics.getThicknessObj = function() {
    return {
        name: 'Length',
        types: ['Normal - Short', 'Normal - Medium', 'Normal - Long', 'Normal - Extra Long', 'Normal - XXL', 'Thick - Short', 'Thick - Medium', 'Thick - Long', 'Thick - Extra Long', 'Thick - XXL'],
    };
};

//  on every save, add the date
serviceSchema.pre('save', function(next) {
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
var Service = mongoose.model('service', serviceSchema);

// make this available to our users in our Node applications
module.exports = Service;