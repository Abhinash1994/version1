/**
 * Offer.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

  // grab the things we need
 var mongoose = require('mongoose');
 var Schema = mongoose.Schema;


 var membershipSchema = new Schema({

    name : { type: 'string', required: true },

    credits : { type: 'number', defaultsTo: 0 },

    price : { type: 'number', defaultsTo: 0, required : true },

    discount : { type: 'number', defaultsTo: 0 },

    menuDiscount : { type: 'number', defaultsTo: 0 },
    
    dealDiscount : { type: 'number', defaultsTo: 0 },

    validFor : { type: 'number', defaultsTo: 0 },

    freeThreading : {type : 'number', default : 0},

    freeHairCut : {type : 'number', default : 0},

    tax : { type: 'number', defaultsTo: 0 },
    
    active : { type: 'boolean', default: true },

    useOnlyMembership : { type: 'boolean', default: false }, // used for new membership which is used for particular salons only while on boarding

    code : { type: 'string', defaultsTo: 0 },

    isForMonsoonOnly : { type: 'boolean', defaultsTo: false },
    
    isForAll : { type: 'boolean', defaultsTo: false },

    type : { type: 'number', defaultsTo: 0 },  //1 =  Credit type, 2 = discount type

    discountPercentage : { type: [{

          department : {type : 'String' },

          categoryIds : [],

          days : {type : [{

              dayIndex : {type : 'Number'},

              discount : {type : 'Number'},

              dealDiscount : {type : 'Number'},
          }] 
        },
        }]},

    createdAt : { type: 'date' },

    updatedAt : { type: 'date' },

    membershipWithTax : {type: 'boolean', default : false},

  });

  membershipSchema.statics.parse =  function(d, parlorId){
          return {
              membershipId : d.id,
              name : d.name,
              code : d.code,
              credits : d.credits,
              validFor : d.validFor,
              membershipWithTax : d.membershipWithTax,
              discountPercentage : _.map(d.discountPercentage, function(p){
                  return {
                    dept : p.department,
                    days : p.days
                  }
              }),
              price : d.price,
              noOfCustomers : 0,
          };

  };

  membershipSchema.statics.getMembershipObj = function(req){
      return {
        parlorId : req.session.parlorId,
        name : req.body.name,
        credits : parseInt(req.body.credits),
        validFor : parseInt(req.body.validFor),
        discount : parseInt(req.body.discount),
        price : parseInt(req.body.price),
      };
  };


  membershipSchema.statics.createNewMembership = function(req, categories){
      var obj = {
        name : req.body.name,
        credits : parseInt(req.body.credits),
        validFor : parseInt(req.body.validFor),
        tax : parseFloat(req.body.tax),
        code : req.body.code,
        price : parseInt(req.body.price),
        type : parseInt(req.body.membershipType),
        discountPercentage : [],
      };

     _.forEach(req.body.percentage, function(p) {
        var dist = {
            department : p.dept,
            categoryIds : _.map(_.filter(categories, function(c){ return c.superCategory == p.dept } ), function(c){ return c.id;}),
            days : _.map(p.values, function(d, key){
              var indexOf = d.indexOf(",");
              return {
                  dayIndex : key,
                  dealDiscount : parseInt(d.substring(0, indexOf)),
                  discount : parseInt(d.substring(indexOf+1, d.length)),
              };
            })
        };
        obj.discountPercentage.push(dist);
     });
      return obj;
  };

  membershipSchema.statics.customerMembership = function(m, validDate, createdBy){
      var d = new Date();
      d.setMonth(d.getMonth() + m.validFor);
      return {
        membershipId : m.id,
        name : m.name,
        validFor : d,
        credits : parseInt(m.credits),
        type : parseInt(m.type),
        price : parseInt(m.price),
        discount : parseInt(m.discount),
        createAt : new Date(),
        createdBy : createdBy,
      };
  };




  //  on every save, add the date
  membershipSchema.pre('save', function(next) {
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
// membershipSchema.plugin(autoIncrement.plugin, 'Membership');
  var Membership = mongoose.model('Membership', membershipSchema);

  // make this available to our users in our Node applications
  module.exports = Membership;
