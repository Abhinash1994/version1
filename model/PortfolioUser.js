/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var portUserSchema = new Schema({

    emailId: { type: 'string', size: 50 },

    firebaseId: { type: 'string', default: null },

    firebaseIdIOS: { type: 'string', default: null },

    customerId: { type: 'number' },

    credits: { type: 'number', default: 0 },

    firstTimeVerified: { type: 'number', default: 0 },

    accesstoken: { type: 'String', default: "dsasdasda" },

    profilePic: { type: 'String', default: "https://www.buira.net/assets/images/shared/default-profile.png" },

    password: { type: 'string' },

    phoneNumber: { type: 'string', unique: true, required: true },

    phoneVerification: { type: 'number', default: 0 },

    realOtp: { type: 'number' },

    restrictPortfolio: { type: 'array', defaultsTo: [] },

    registerLatitude: { type: 'number', default: 0 },

    latitude: { type: 'number', default: 0 },

    registerLongitude: { type: 'number', default: 0 },

    longitude: { type: 'number', default: 0 },

    firstName: { type: 'string', required: true },

    lastName: { type: 'string', default: '' },

    userType: { type: 'Boolean' },

    gender: { type: 'string', enum: ["M", "F"], size: 1, default: "M" },

    streetLine1: { type: 'string', default: '' },

    streetLine2: { type: 'string', default: '' },

    googleId: { type: 'string' },

    mobile: { type: 'number', default: 0 },

    facebookId: { type: 'string' },

    city: { type: 'string' },

    createdAt: { type: 'date' },

    updatedAt: { type: 'date' },

    androidVersion: { type: 'string', default: null },

    iosVersion: { type: 'string', default: null },
    portfolioPosts: { type: 'number', default: 0 },
    portfolioProfile: { type: 'string', default: "" },

    portfolioPosition: { type: Schema.ObjectId, ref: 'port_tags', default: null },

    portfolioRating: { type: 'number', default: 0 },


    portfolioLikes: { type: 'number', default: 0 },

    portfolioDescription: { type: 'string' },
    portfolioCollection: { type: 'array', defaultsTo: [] }, //either name or Id

    likedPosts: {
        type: [{
            userId: { type: Schema.ObjectId },
            postId: { type: 'string' }
        }],
        defaultsTo: []
    },

});

portUserSchema.statics.getUserObj = function(req) {
    return {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        emailId: req.body.emailId,
        phoneNumber: req.body.phoneNumber,
        gender: req.body.gender,
        streetLine1: req.body.streetLine1,
        streetLine2: req.body.streetLine2,
        city: req.body.city
    };
};


portUserSchema.statics.parseEditUser = function(req) {
    return {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        emailId: req.body.emailId,
        phoneNumber: req.body.phoneNumber,
        gender: req.body.gender,
        streetLine1: req.body.streetLine1,
        streetLine2: req.body.streetLine2,
        city: req.body.city
    };
};

portUserSchema.statics.parseUserObj = function(user) {
    return {
        firstName: user.firstName,
        lastName: user.lastName,
        emailId: user.emailId,
        phoneNumber: user.phoneNumber,
        gender: user.gender,
        userType: user.userType,
        credits: user.credits,
        streetLine1: user.streetLine1,
        streetLine2: user.streetLine2,
        city: user.city
    };
};


portUserSchema.statics.getUserObjApp = function(user) {
    return {
        portfolioId: user.id,
        name: user.firstName + ' ' + (user.lastName != undefined ? user.lastName : ''),
        emailId: user.emailId,
        portfolioPosition: user.portfolioPosition,
        gender: user.gender,
        phoneNumber: user.phoneNumber,
        userType: user.userType,
        accessToken: user.phoneVerification == 1 ? user.accesstoken : '',
        phoneVerification: user.phoneVerification ? user.phoneVerification : 0,
        profilePic: user.profilePic ? user.profilePic : 'https://www.buira.net/assets/images/shared/default-profile.png',
    };
};


portUserSchema.statics.createNew = function(data, callback) {
        PortfolioUser.create(data, function(err, doc) {
            callback(err, doc);
        });
    }
    //  on every save, add the date
portUserSchema.pre('save', function(next) {
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
// portUserSchema.plugin(autoIncrement.plugin, 'user');

var PortfolioUser = mongoose.model('portfolioUser', portUserSchema);

// make this available to our users in our Node applications
module.exports = PortfolioUser;