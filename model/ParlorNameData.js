var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var parlorNameDataSchema = new Schema({

    createdAt : { type : 'date'},

    updatedAt : { type : 'date'},

    parlorId  : { type : Schema.ObjectId},

    parlorName : { type : 'string'},

    parlorAddress1 : { type : 'string'},

    parlorAddress2 : { type : 'string'},

    stateName : { type : 'string'},

    tax : { type : 'number'},

    geoLocation: {

        type: [Number], // [<longitude>, <latitude>]

        index: '2dsphere' // create the geospatial index
    },

    active : { type : 'Boolean' },

    parlorType : { type : 'number'},

    latitude : { type : 'number'},

    longitude : { type : 'number'},

    cityId  : {type : 'number'}

});


//  on every save, add the date
parlorNameDataSchema.pre('save', function(next) {
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

var ParlorNameData = mongoose.model('parlornamedata', parlorNameDataSchema);
module.exports = ParlorNameData;