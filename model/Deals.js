/**
 * Service.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

   // grab the things we need
  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;



  var dealsSchema = new Schema({

    name : { type: 'string', required : true },

    description : { type: 'string', required : true },

    shortDescription : {type : 'string', },

    menuPrice : { type: 'number', required : true },

    category : { type: 'string', required : true },

    dealId : { type: 'number', required : true },

    sort : { type: 'number', required : true },

    categoryIds : {type : [{ type: Schema.Types.ObjectId, ref: 'ServiceCategory' }], defaultsTo : [] },

    genders : { type : [{ type: 'String'}], defaultsTo : [] },

    dealSort : { type: 'number' },

    dealPrice : { type: 'number', required : true },

    dealPercentage : { type: 'number', required : true },

    startDate : {type : 'date', required : true},

    endDate : {type : 'date', required : true},

    hours : {type : 'string', required : true},

    tax : {type : 'number', required : true},

    weekDay : {type : 'number', required : true, default : 1}, // 1- all days, 2 = weekday , 3 = weekend

    slabId : {type : Schema.ObjectId, default : null},

    newCombo : {

        type : [{

            serviceIds : [{type : Schema.ObjectId}],

            title : {type : 'String'},

            type : {type : 'String'}, // category, sub category, service
        }],
        defaultsTo : [],

    },

    type : {type : 'String', default : ''},

    brands : { type : [{

            brandId : {type : Schema.ObjectId},

            ratio : {type : 'number' },

            name : {type : 'String' },

            products : { 

                type : [{

                    ratio : {type : 'number' },

                    name : {type : 'String'},

                    productId : {type : Schema.Types.ObjectId, ref : 'ServiceProduct'},

              }], defaultsTo : [] },
          }
          ], defaultsTo : []
      },

    dealType : {

        name : { type : 'string', required : true, default : 'dealPrice' },     // dealPrice/ frequency/ combo/ chooseOne/ chooseOnePer /loyalityPoints / newCombo
        
        frequencyRequired : {type : 'number'},

        frequencyFree : {type : 'number'},

        loyalityPoints : {type : 'number'},

        price : {type : 'number', required : true},

      },

    couponCode : { type: 'string', default : null},

    parlorId : { type: Schema.Types.ObjectId, ref: 'parlor' },

    services : [{

              serviceCode : {type : 'number', required : true},
              
              name : {type : 'String', },
          }],

    isDeleted : {type : 'boolean', default : false},

    checkPassed : {type : 'boolean', default : true},

    checkMessage : {type : 'string', default : ""},

    active : {type: 'number', default : 1},

    showOnApp : {type: 'boolean', default : true},

    allHairLength :{type:'boolean',default:false},

    createdAt : { type: 'date' },

    updatedAt : { type: 'date' },

    parlorTypes :[]
});

dealsSchema.statics.checkDeals = function(dealId, parlor, services, callback){
    Deals.findOne({_id : dealId}, {'dealType.name' : 1, services : 1, newCombo : 1, parlorId : 1} ,function(err, deal){
      if(deal){
            if(parlor){
                    var response = Deals.checkDealsService(parlor, deal, services);
                    Deals.update({_id : dealId}, response, function(e, d){
                        return callback({checkPassed : response.checkPassed, checkMessage : response.checkMessage});
                    });

            }else{
                return callback({checkPassed : true, checkMessage : ""});
            }
      }else{
                return callback({checkPassed : true, checkMessage : ""});
      }
          
      });
};

dealsSchema.statics.checkDealsService = function(parlor, deal, services){
  var checkPassed = true;
  var checkMessage = "";
  if(deal.dealType.name != 'newCombo'){
      var count = 0;
      _.forEach(deal.services, function(service){
          if(_.filter(parlor.services, function(s){ return s.serviceCode == service.serviceCode})[0]){
              count ++;
          }else{
              checkMessage += (service.name +"("+ service.serviceCode + "), ");
          }
      });
      if(count != deal.services.length && deal.dealType.name == 'combo')checkPassed = false;
      else if(count == 0)checkPassed = false;
  }else{
      _.forEach(deal.newCombo, function(newC){
          var count2 = 0;
          _.forEach(newC.serviceIds, function(serviceId){
            var f = _.filter(parlor.services, function(s){ return s.serviceId + ""  == serviceId + "" })[0];
              if(f){
                  if(newC.type == 'subCategory' && (!f.prices[0].brand || (f.brand && f.prices[0].brands.length == 0))){
                      checkMessage += (newC.title+"("+_.filter(services, function(ser){ return ser.id + "" == serviceId + "" })[0].serviceCode + "), " );
                      count2 --;
                  }
                  count2 ++;
              }else{
                  checkMessage += (newC.title+"("+_.filter(services, function(ser){ return ser.id + "" == serviceId + "" })[0].serviceCode + "), " );
              }
          })
          if(newC.serviceIds.length != count2)checkPassed = false; 
      });
  }
  return {checkPassed : checkPassed, checkMessage : checkMessage};
}

  dealsSchema.statics.parseDealsForMultipleParlors = function(deals, services,allDeals){
      return {
          name : deals[0].name,
          description : deals[0].description,
          shortDescription : deals[0].shortDescription,
          categoryIds : deals[0].categoryIds,
          genders : deals[0].genders,
          parlorTypes : deals[0].parlorTypes,
          parlorTypesDetail : allDeals[0].parlorTypesDetail,
          parlors : _.map(deals, function(d){
            return{
              dealId : d.id,
              menuPrice : d.menuPrice,
              dealPrice : d.dealPrice,
              dealPercentage : d.dealPercentage,
              startDate : d.startDate,
              endDate : d.endDate,
              price : d.dealType.price,
              parlorId : d.parlorId,
              brands : d.brands,
              checkPassed : d.checkPassed,
              checkMessage : d.checkMessage,
            };
          }),
          category : deals[0].category,
          dealId : deals[0].dealId,
          brands : deals[0].brands,
          sort : deals[0].sort,
          hours : deals[0].hours,
          dealSort : deals[0].dealSort,
          weekDay : deals[0].weekDay,
          tax : deals[0].tax,
          dealType : {
              name : deals[0].dealType.name,
              frequencyRequired : deals[0].dealType.frequencyRequired,
              frequencyFree : deals[0].dealType.frequencyFree,
              loyalityPoints : deals[0].dealType.loyalityPoints,
          },
          couponCode : deals[0].couponCode,
          services : _.map(deals[0].services, function(s){
            var service =  _.filter(services, function(ser){ return ser.serviceCode == s.serviceCode})[0];
            return{
              name : s.name,
              gender : service ? service.gender : null,
              serviceCode : s.serviceCode
            };
          }),
          active : deals[0].active,
          allHairLength : deals[0].allHairLength,
          isDeleted : deals[0].isDeleted,
      };
  };


dealsSchema.statics.createNewObj = function(req, count){
      var data = [];
      _.forEach(req.body.parlors, function(parlor){
          data.push({
            name : req.body.name,
            description : req.body.description,
            shortDescription : req.body.shortDescription,
            menuPrice : parlor.menuPrice,
            categoryIds : req.body.categoryIds,
            active : req.body.active,
            isDeleted : req.body.isDeleted,
            genders : req.body.genders,
            parlorTypes : [],
            dealPrice : parlor.dealPrice,
            dealPercentage : parlor.dealPercentage,
            startDate : new Date(2016, 6, 21),
            endDate : new Date(2021, 6, 21),
            dealSort : req.body.dealSort,
            category : req.body.category,
            dealId : count,
            sort : req.body.sort,
            newCombo : _.map(req.body.newCombo || [], function(newCombo){
                return {
                    serviceIds : newCombo.serviceIds,
                    title : newCombo.title,
                    type : newCombo.type,
                }
            }),
            hours : 'All',
            weekDay : parseInt(req.body.weekDay), // 1- all days, 2 = weekday , 3 = weekend
            tax : 18,
            dealType : {
                name : req.body.dealType.name,
                frequencyRequired : req.body.dealType.frequencyRequired || null,
                frequencyFree : req.body.dealType.frequencyFree || null,
                loyalityPoints : req.body.dealType.loyalityPoints || null,
                price : parlor.price,
              },
            couponCode : req.body.couponCode,
            parlorId : parlor.parlorId,
            services : getServices(req.body.services),
          });
      });
      return data;
  };

  dealsSchema.statics.createNewDealObjForParlor = function(req, deal){
    return {
            name : deal.name,
            description : deal.description,
            shortDescription : deal.shortDescription,
            menuPrice : req.body.menuPrice,
            categoryIds : deal.categoryIds,
            active : deal.active,
            isDeleted : deal.isDeleted,
            genders : deal.genders,
            parlorTypes : deal.parlorTypes,
            dealPrice : req.body.dealPrice,
            dealPercentage : req.body.dealPercentage,
            startDate : req.body.startDate,
            endDate : req.body.endDate,
            dealSort : deal.dealSort,
            category : deal.category,
            allHairLength : deal.allHairLength,
            dealId : deal.dealId,
            sort : deal.sort,
            newCombo : deal.newCombo,
            hours : 'All',
            weekDay : parseInt(deal.weekDay), // 1- all days, 2 = weekday , 3 = weekend
            tax : 18,
            dealType : {
                name : deal.dealType.name,
                frequencyRequired : deal.dealType.frequencyRequired || null,
                frequencyFree : deal.dealType.frequencyFree || null,
                loyalityPoints : deal.dealType.loyalityPoints || null,
                price : req.body.price,
              },
            couponCode : deal.couponCode,
            parlorId : req.body.parlorId,
            services : deal.services,
            brands: deal.brands,
          };
  }

  dealsSchema.statics.newDealObjUpdate = function(deal, parlorId){
    return {
            name : deal.name,
            description : deal.description,
            shortDescription : deal.shortDescription,
            menuPrice : deal.menuPrice,
            categoryIds : deal.categoryIds,
            active : deal.active,
            isDeleted : deal.isDeleted,
            genders : deal.genders,
            parlorTypes : deal.parlorTypes,
            dealPrice : deal.dealPrice,
            dealPercentage : deal.dealPercentage,
            startDate : deal.startDate,
            showOnApp : deal.showOnApp,
            endDate : deal.endDate,
            dealSort : deal.dealSort,
            category : deal.category,
            dealId : deal.dealId,
            sort : deal.sort,
            newCombo : deal.newCombo,
            hours : 'All',
            weekDay : parseInt(deal.weekDay), // 1- all days, 2 = weekday , 3 = weekend
            tax : 18,
            dealType : {
                name : deal.dealType.name,
                frequencyRequired : deal.dealType.frequencyRequired || null,
                frequencyFree : deal.dealType.frequencyFree || null,
                loyalityPoints : deal.dealType.loyalityPoints || null,
                price : deal.dealType.price,
              },
            couponCode : deal.couponCode,
            parlorId : parlorId,
            services : deal.services,
            brands: deal.brands,
          };
  }


function getServices(services){
  return _.map(services, function(s){
      return {
        serviceCode : s.serviceCode,
        name : s.name,
      };
  });
};

  dealsSchema.statics.removeTrailingSpaces = function(result){
    var data = _.map(result, function(r){
          if(r.name){
            return {
                name : r.name.replace(/^[ ]+|[ ]+$/g,''),
                description : r.description.replace(/^[ ]+|[ ]+$/g,''),
                category : r.category.replace(/^[ ]+|[ ]+$/g,''),
                menuPrice : r.menuprice.replace(/^[ ]+|[ ]+$/g,'').replace(',',''),
                dealPrice : r.dealprice.replace(/^[ ]+|[ ]+$/g,''),
                sort : parseInt(r.sort.replace(/^[ ]+|[ ]+$/g,'')),
                dealId : parseInt(r.dealid.replace(/^[ ]+|[ ]+$/g,'')),
                dealPrice : r.dealprice.replace(/^[ ]+|[ ]+$/g,''),
                dealPercentage : parseInt(r.dealpercentage.replace(/^[ ]+|[ ]+$/g,'').substr(0, r.dealpercentage.indexOf('%'))),
                startDate : r.startdate.replace(/^[ ]+|[ ]+$/g,''),
                endDate : r.enddate.replace(/^[ ]+|[ ]+$/g,''),
                hours : r.hours.replace(/^[ ]+|[ ]+$/g,''),
                day : getWeekDay(r.day.replace(/^[ ]+|[ ]+$/g,'')),
                flatPrice : parseInt(r.flatprice.replace(/^[ ]+|[ ]+$/g,'')),
                discountPercentage : parseInt(r.discountpercentage.replace(/^[ ]+|[ ]+$/g,'').substr(0, r.discountpercentage.indexOf('%'))),
                frequency : getReal(r.frequency.replace(/^[ ]+|[ ]+$/g,'')),
                combo : getReal(r.combo.replace(/^[ ]+|[ ]+$/g,'')),
                loyalityPoints : getReal(r.loyalitypoints.replace(/^[ ]+|[ ]+$/g,'')),
                loyalityCondition : getReal(r.loyalitycondition.replace(/^[ ]+|[ ]+$/g,'')),
                services : r.services.replace(/^[ ]+|[ ]+$/g,''),
                couponCode : getReal(r.couponcode.replace(/^[ ]+|[ ]+$/g,'')),
            };
          }
    });
    data = _.filter(data, function(d){ return !_.isEmpty(d); });
    return data;
  };


function getWeekDay(s){
  if(s.toUpperCase() == "ALL DAYS")return 1;
  if(s.toUpperCase() == "WEEKDAY")return 2;
  if(s.toUpperCase() == "WEEKEND")return 3;
};


function getReal(s){
  if(s.toUpperCase() == "NO")return null;
  else return s;
};



dealsSchema.statics.getActiveDeals = function(parlorId, time ,callback){
        Deals.find({parlorId : parlorId, active : 1, weekDay : { $in : HelperService.getDealActiveDayCode(time) }, startDate : { $lt : new Date()}, endDate : { $gt : new Date()}}).sort('sort').exec(function(err, deals){
            return callback(deals);
        });
};



dealsSchema.statics.getActiveDeals2 = function(parlorId, time ,callback){
        Deals.find({parlorId : parlorId, active : 1, weekDay : { $in : HelperService.getDealActiveDayCode(time) }, startDate : { $lt : new Date()}, endDate : { $gt : new Date()}}, {dealId : 1,brands : 1, "dealType.price" : 1, menuPrice : 1, name : 1, "dealType.name" : 1,"services.serviceCode" : 1, dealPrice : 1 }).sort('sort').exec(function(err, deals){
            return callback(deals);
        });
};


dealsSchema.statics.getActiveDeals3 = function(parlorId, time , serviceCodes ,callback){
        Deals.find({parlorId : parlorId, active : 1, weekDay : { $in : HelperService.getDealActiveDayCode(time) }, startDate : { $lt : new Date()}, endDate : { $gt : new Date()}}, {newCombo : 1, slabId : 1, dealId : 1,brands : 1, "dealType.price" : 1, menuPrice : 1, name : 1, "dealType.name" : 1,"services.serviceCode" : 1, dealPrice : 1 }).sort('sort').exec(function(err, deals){
            return callback(deals);
        });
};


dealsSchema.statics.parse = function(s){
      return {
          dealId : s.id,
          name : s.name,
          sort : s.sort,
          shortDescription : s.shortDescription ? s.shortDescription : s.description,
          brands : s.brands,
          category : s.category,
          categoryIds : s.categoryIds,
          genders : s.genders,
          parlorTypes : s.parlorTypes,
          active : s.active,
          isDeleted : s.isDeleted,
          dealIdParlor : s.dealId,
          description : s.description,
          menuPrice : s.menuPrice,
          dealPrice : s.dealPrice,
          tax : s.tax,
          dealPercentage : s.dealPercentage,
          dealSort : s.dealSort,
          weekDay : s.weekDay,
          dealType : s.dealType,
          services : _.map(s.services, function(ser){ return {serviceCode : ser.serviceCode, name : ser.name }; }),
          couponCode : s.couponCode,
      };
};



dealsSchema.statics.parseForCrm = function(s){
      return {
          dealId : s.id,
          name : s.name,
          sort : s.sort,
          shortDescription : s.shortDescription ? s.shortDescription : s.description,
          brands : s.brands,
          category : s.category,
          categoryIds : s.categoryIds,
          genders : s.genders,
          parlorTypes : s.parlorTypes,
          active : s.active,
          isDeleted : s.isDeleted,
          dealIdParlor : s.dealId,
          description : s.description,
          menuPrice : s.menuPrice,
          dealPrice : s.dealPrice,
          tax : s.tax,
          dealPercentage : s.dealPercentage,
          dealSort : s.dealSort,
          weekDay : s.weekDay,
          dealType : s.dealType,
          services : _.map(s.services, function(ser){ return {serviceCode : ser.serviceCode, name : ser.name }; }),
          couponCode : s.couponCode,
          checkPassed : s.checkPassed,
          checkMessage : s.checkMessage,
      };
};



dealsSchema.statics.parseForApp = function(s){
      return {
          dealId : s.id,
          name : s.name,
          sort : s.sort,
          shortDescription : s.shortDescription ? s.shortDescription : s.description,
          // brands : s.brands,
          category : s.category,
          categoryIds : s.categoryIds,
          genders : s.genders,
          parlorTypes : s.parlorTypes,
          active : s.active,
          isDeleted : s.isDeleted,
          dealIdParlor : s.dealId,
          description : s.description,
          menuPrice : parseInt(s.menuPrice),
          dealPrice : parseInt(s.dealPrice),
          tax : s.tax,
          dealPercentage : s.dealPercentage,
          dealSort : s.dealSort,
          weekDay : s.weekDay,
          dealType : s.dealType,
          services : _.map(s.services, function(ser){ return {serviceCode : ser.serviceCode, name : ser.name }; }),
          couponCode : s.couponCode,
      };
  };

  
  dealsSchema.statics.parseForParlor = function(s){
      return {
          dealId : s.id,
          name : s.name,
          sort : s.sort,
          shortDescription : s.shortDescription ? s.shortDescription : s.description,
          brands : _.filter(_.filter(s.brands, function(brand){ return brand.ratio}), function(b, k){return k<2}),
          category : s.category,
          categoryIds : s.categoryIds,
          genders : s.genders,
          parlorTypes  : s.parlorTypes,
          active : s.active,
          isDeleted : s.isDeleted,
          dealIdParlor : s.dealId,
          description : s.description,
          menuPrice : parseInt(s.menuPrice),
          dealPrice : parseInt(s.dealPrice),
          tax : s.tax,
          dealPercentage : s.dealPercentage,
          dealSort : s.dealSort,
          weekDay : s.weekDay,
          dealType : s.dealType,
          services : _.map(s.services, function(ser){ return {serviceCode : ser.serviceCode, name : ser.name }; }),
          couponCode : s.couponCode,
      };
  };

  //  on every save, add the date
  dealsSchema.pre('save', function(next) {
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
  var Deals = mongoose.model('deals', dealsSchema);

  // make this available to our users in our Node applications
  module.exports = Deals;
