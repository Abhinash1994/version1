
/**
 * Admin.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;

var beuSchema = new Schema({

    emailId: { type: 'string', size: 50 },

    password: { type: 'string', required: true },  

    settlementOtp : { type : 'number'},

    latitude: { type: 'number' },

    longitude: { type: 'number' },

    phoneNumber: { type: 'string', unique: true, required: true },

    accessToken: { type: 'string' },

    firstName: { type: 'string', required: true },

    lastName: { type: 'string' },
    
    parlorId: { type: 'string' },

    role: { type: 'number', enum: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11,12, 13], required: true }, // 1- main admin, 2 - hr , 3 - operation, 4 - sales, 6 - trainner, 9 - cashier, 11 - finanance, 12-executive , 10- Marketing, 13-  external customer care

    type : { type : 'number', default : 1}, //2 = subscription, 3 = appointment for customer care 

    target : {type : 'number', default : 0},

    parlorIds: [{ type: Schema.ObjectId, ref: 'parlor' }], // applicable for trainner

    beuIds: [{ type: Schema.ObjectId, ref: 'beu' }], // applicable for
    
    customerCareTeamMembers: { type: [{userId : {type : Schema.ObjectId}}, {name : {type : String}}] }, // applicable for

    createdAt: { type: 'date' },

    updatedAt: { type: 'date' },

    firebaseId: { type: "string" },

    firebaseIdIOS: { type: "string" },
    
    myProfilePic: { type: "string" },

    settlementOtp : { type : 'number'},

    active: {type: 'boolean', default : true},

});

beuSchema.statics.getUserObj = function(req) {
    return {
        emailId: req.body.emailId,
        password: req.body.password,
        phoneNumber: req.body.phoneNumber,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        role: parseInt(req.body.role),
        parlorIds: req.body.parlorIds || [],
        beuIds: [],
    };
};


beuSchema.statics.createSession = function(session, user) {
    session.userName = user.firstName;
    session.authenticated = true;
    session.userId = user.id;
    session.parlorId = '';
    session.parlorName = "";
    session.role = user.role;
    session.customerCareUserType = user.type;
    session.userTypeBeu = 1;
};



beuSchema.statics.parse = function(user) {
    return {
        emailId: user.emailId,
        password: user.password,
        phoneNumber: user.phoneNumber,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        parlorIds: user.parlorIds,
        beuIds: user.beuIds,
        userId: user.id,
    };
};

// on every save, add the date
beuSchema.pre('save', function(next) {
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
// beuSchema.plugin(autoIncrement.plugin, 'admin');

var Beu = mongoose.model('beu', beuSchema);

// make this available to our users in our Node applications
module.exports = Beu;