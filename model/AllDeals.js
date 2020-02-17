/**
 * Service.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

   // grab the things we need
  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;



  var allDealsSchema = new Schema({

    name : { type: 'string', required : true },

    description : { type: 'string', required : true },

    shortDescription : {type : 'string', },

    menuPrice : { type: 'number', required : true },
    
    showOnApp : {type: 'boolean', default : true},

    hideOnMainPageApp : {type: 'boolean', default : false},

    category : { type: 'string', required : true },

    dealId : { type: 'number', required : true, unique: true },

    categoryIds : {type : [{ type: Schema.Types.ObjectId, ref: 'ServiceCategory' }], defaultsTo : [] },

    parlorTypes : {type : [], defaultsTo : [] },

     parlorTypesDetail : {

        type : [{
            
            cityId: { type : 'number',default :1},
            
            parlorPrice : {
              
              type : [{

                  type : {type : 'number'},
                  startAt : {type : 'number', default : 800},
                  percent : {type :'number', default : 50}

              }]
            }
        }
    ], defaultsTo : [] },

    genders : { type : [{ type: 'String'}], defaultsTo : [] },

    sort : { type: 'number', required : true },

    dealSort : { type: 'number', required : true },

    dealPrice : { type: 'number', required : true },

    dealPercentage : { type: 'number', required : true },

    startDate : {type : 'date', required : true},

    endDate : {type : 'date', required : true},

    hours : {type : 'string', required : true},

    tax : {type : 'number', required : true},

    newCombo : {

        type : [{

            serviceIds : [{type : Schema.ObjectId}],

            title : {type : 'String'},

            type : {type : 'String'}, // category, sub category, service
        }],
        defaultsTo : [],

    },


    weekDay : {type : 'number', required : true, defaultsTo : 1}, // 1- all days, 2 = weekday , 3 = weekend

    dealType : {

        name : { type : 'string', required : true, defaultsTo : 'dealPrice' },     // dealPrice/ frequency/ combo/ chooseOne/ chooseOnePer /loyalityPoints
        
        frequencyRequired : {type : 'number'},

        frequencyFree : {type : 'number'},

        loyalityPoints : {type : 'number'},

        price : {type : 'number', required : true},

      },

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

            parlorLatLongs : { 

                type : [{

                    cityId : {type : 'number' },

                    latlongs : { 

                      type : [{

                          latitude : {type : 'number' },

                          longitude : {type : 'number' },

                    }], defaultsTo : [] },

              }], defaultsTo : [] },
          }
          ], defaultsTo : []
      },


    couponCode : { type: 'string', defaultsTo : null},

    services : [{

              serviceCode : {type : 'number', required : true},
              
              name : {type : 'String', },

              parlorTypesDetail : {
                    type : [{
                        cityId: { type : 'number'},
                        parlorPrice : {
                          type : [{
                              type : {type : 'number'},
                              startAt : {type : 'number', default : 800},
                              percent : {type :'number', default : 50}
                          }]
                        }
                    }
                ], defaultsTo : [] },

          }],

    isDeleted : {type : 'boolean', default : false},

    checkPassed : {type : 'boolean', default : true},

    active : {type: 'number', default : 1},

    createdAt : { type: 'date' },

    updatedAt : { type: 'date' },

    allHairLength :{type:'boolean',default:false},
});

  
  allDealsSchema.statics.parse = function(d){
    return{
          name : d.name,
          description : d.description,
          menuPrice : d.menuPrice,
          category : d.category,
          dealId : d.dealId,
          sort : d.sort,
          dealSort : d.dealSort,
          dealPrice : d.dealPrice,
          dealPercentage : d.dealPercentage,
          startDate : d.startDate,
          endDate : d.endDate,
          hours : d.hours,
          gender : d.gender, // WM - unisex , M - male, F - female
          tax : d.tax,
          weekDay : d.weekDay, // 1- all days, 2 = weekday , 3 = weekend
          dealType : {
              name : d.dealType.name,     // dealPrice/ frequency/ combo/ chooseOne/ chooseOnePer /loyalityPoints
              frequencyRequired : d.dealType.frequencyRequired,
              frequencyFree : d.dealType.frequencyFree,
              loyalityPoints : d.dealType.loyalityPoints,
              price : d.dealType.price,
            },
          couponCode : d.couponCode,
          services : _.map(d.services, function(s){
              return {
                    serviceCode : s.serviceCode,
                    name : s.name,
                  };

          }), 
          active : 1,
    };
};


  //  on every save, add the date
  allDealsSchema.pre('save', function(next) {
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
  var AllDeals = mongoose.model('alldeals', allDealsSchema);

  // make this available to our users in our Node applications
  module.exports = AllDeals;
