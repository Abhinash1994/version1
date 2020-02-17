
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var recommendSchema = new Schema({
    services:{type:
        [{
            serviceId: {type: Schema.ObjectId},

            serviceCode: {type: 'number'}

        }],defaultsTo:[]
    },

    days : {type : 'number'},

    descriptionNotification : {type : 'string'},

    descriptionSMS : {type : 'string'},

    createdAt : { type : 'date', default: Date.now() }
});


recommendSchema.statics.getNewObjRecomm =  function(req){
    return {
        days : req.body.days,
        descriptionNotification : req.body.description,
        descriptionSMS : req.body.sms,
        services: _.map(req.body.serviceCode, function (service) {
            return{
                serviceCode : service,
                serviceId: service.serviceId
            }
        })

    };

};

//  on every save, add the date
recommendSchema.pre('save', function(next) {
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

var Recommendation = mongoose.model('recommendation', recommendSchema);


module.exports = Recommendation;