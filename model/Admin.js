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
var request = require('request');

var adminSchema = new Schema({

    emailId: { type: 'string', size: 50 },

    otherEmailId: { type: 'string', size: 50 },

    salonEmail: { type: 'string' },

    password: { type: 'string' },

    phoneNumber: { type: 'string', unique: true, required: true },

    otherPhoneNumber: { type: 'string' },

    firstName: { type: 'string', required: true },

    lastName: { type: 'string' },

    image: { type: 'string', default: 'https://organicthemes.com/demo/profile/files/2012/12/profile_img.png' },

    rating: { type: 'number', default: 4 },

    clientServed: { type: 'number', default: 0 },

    accessToken: { type: 'string' },

    role: { type: 'number', enum: [0, 1, 2, 3, 4, 5, 6, 7], required: true }, // 1 - admin, 2- Manager, 3 - Receptionist, 4 - Stylist, 5 - Helper, 6 - Masseuse, 7 - salon owner , 9- Assistant Manager , 8- Salon Head

    gender: { type: 'string', enum: ["M", "F"], size: 1, default: "M", required: true },

    age: { type: 'number', default: 0 },

    hairPost: { type: 'number', default: 0 },

    makeupPost: { type: 'number', default: 0 },

    breakHr: { type: 'number', default: 0 },

    position: { type: 'string' },

    type: { type: 'number', default: 1 }, //Type of employee 1 for full time 2 for commission based

    parlorId: { type: Schema.ObjectId, ref: 'parlor' },

    parlorIds: [{ type: Schema.ObjectId, ref: 'parlor' }], // applicable to parlor owner admin only

    workingTime: { type: 'array', defaultsTo: [] },

    holidays: { type: 'array', defaultsTo: [] },

    pages: { type: 'array', defaultsTo: [] },

    salary: { type: 'number', default: 0 },

    services: { type: 'array', defaultsTo: [] },

    streetLine1: { type: 'string' },

    streetLine2: { type: 'string' },

    active: { type: 'boolean', default : true },

    salonIncentive: { type: 'boolean', default : false },

    city: { type: 'string' },

    parlorType : { type: 'number' },

    joiningDate: { type: 'date' },

    addressProofFile: { type: 'string' },

    loginTime: { type: 'date' },

    logoutTime: { type: 'date' },

    createdAt: { type: 'date' },

    updatedAt: { type: 'date' },

    commission: [{
        amount: { type: 'number' },
        date: { type: 'date' },
        source: { type: 'String' }
    }],

    employeeFixedCommission: { type: 'number', default: 0 },

    date_of_birth: { type: 'date' },

    facebookPageId: { type: 'String' },

    facebookPageName: { type: 'String' },

    facebookPageToken: { type: 'String' },

    twitterAccessToken: { type: 'String' },

    twitterSecret: { type: 'String' },

    firebaseId: { type: "string" },
    
    firebaseIdIOS: { type: "string" },

    portfolioProfile: { type: 'string', default: "" },

    portfolioPosition: { type: 'array', defaultsTo: [] },

    portfolioRating: { type: 'number', default: 0 },

    portfolioPosts: { type: 'number', default: 0 },

    portfolioLikes: { type: 'number', default: 0 },

    portfolioDescription: { type: 'string' },

    accountNumber: { type: 'string' },

    ifscCode: { type: 'string' },

    razorPayAccountId: { type: 'string' , unique : true},   

    razorPayXAccountId: {type: 'string' , unique : true},

    razorPayXContactId: { type: 'string' , unique : true},
    
    oldRazorPayAccountId: { type: 'string' , unique : true},

    webhookObj : {},

    portfolioCollection: { type: 'array', defaultsTo: [] }, //either name or Id

    likedPosts: {
        type: [{
            userId: { type: Schema.ObjectId },
            postId: { type: 'string' }
        }],
        defaultsTo: []
    },

    accountNo: { type: 'string' },

    ifscCode: { type: 'string' },

    fullNameOnAccount: { type: 'string' },

    macAddress: { type: 'string' },

    avgBillValueThisMonth: { type: 'number', default: 0 },

    avgServicePerBillThisMonth: { type: 'number', default: 0 },

    sharedBillRatioThisMonth: { type: 'string', default: " " },

    avgBillValueLastMonth: { type: 'number', default: 0 },

    avgServicePerBillLastMonth: { type: 'number', default: 0 },

    sharedBillRatioLastMonth: { type: 'string', default: " " },

    categoryIds: { type: [] },

    artistId: { type: Schema.ObjectId },

    paymentMode: {type : 'number' }, //1-account , 2-paytm,

    paytmPhoneNumber : {type: 'string'},

    manualTransfer : {},

    accountDetailDate: {type: 'date'},

    paytmTransferObj : {},

});


adminSchema.statics.getUserObj = function(req, callback) {
    var role = parseInt(req.body.role);
    if ([2, 3, 4, 5].indexOf(role) > -1) {
        Admin.updatePofoArtistId(req.body.phoneNumber, function(e) {
            console.log(e)
            return callback({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                phoneNumber: req.body.phoneNumber,
                password: req.body.password,
                gender: req.body.gender,
                parlorId: req.session.parlorId,
                salary: parseInt(req.body.salary),
                position: req.body.position,
                type: 1,
                employeeFixedCommission: req.body.employeeFixedCommission,
                joiningDate: req.body.joiningDate,
                role: role,
                artistId: e ? e : null
            });
        })
    } else return callback(null);
};


adminSchema.statics.parseUserObj = function(user) {
    return {
        firstName: user.firstName,
        lastName: user.lastName,
        emailId: user.emailId,
        phoneNumber: user.phoneNumber,
        password: user.password,
        gender: user.gender,
        breakHr: user.breakHr,
        age: user.age,
        salary: user.salary,
        position: user.position,
        type: user.type,
        employeeFixedCommission: user.employeeFixedCommission,
        joiningDate: user.joiningDate,
        streetLine1: user.streetLine1,
        streetLine2: user.streetLine2,
        city: user.city,
        accountNo: user.accountNo,
        ifscCode: user.ifscCode,
        fullNameOnAccount: user.fullNameOnAccount,
    };
};


adminSchema.statics.parseEditEmployee = function(req) {
    return {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        emailId: req.body.emailId,
        phoneNumber: req.body.phoneNumber,
        password: req.body.password,
        gender: req.body.gender,
        breakHr: parseInt(req.body.breakHr),
        age: parseInt(req.body.age),
        salary: parseInt(req.body.salary),
        position: req.body.position,
        type: parseInt(req.body.type),
        employeeFixedCommission: req.body.employeeFixedCommission,
        joiningDate: req.body.joiningDate,
        streetLine1: req.body.streetLine1,
        streetLine2: req.body.streetLine2,
        city: req.body.city,
        accountNo: req.body.accountNo,
        ifscCode: req.body.ifscCode,
        fullNameOnAccount: req.body.fullNameOnAccount,
    };
};

adminSchema.statics.getParlorIds = function(req, callback) {
    if (req.session.role == 7) {
        Admin.findOne({ _id: req.session.userId }, function(err, data) {
            return callback(data.parlorIds);
        });
    } else
        return callback([req.session.parlorId]);
};



adminSchema.statics.parse = function(user) {
    return {
        name: user.firstName + " " + user.lastName,
        emailId: user.emailId,
        active: user.active ? user.active : false,
        salonIncentive: user.salonIncentive ? user.salonIncentive : false,
        phoneNumber: user.phoneNumber,
        password: user.role != 2 && user.role != 4 ? user.password : '******',
        category: ConstantService.roles()[user.role].position,
        position: user.position,
        time: HelperService.parseTime(user.createdAt),
    };
};

/**
 * Create session
 */

adminSchema.statics.createSession = function(session, user) {
    session.userName = user.firstName;
    session.authenticated = true;
    session.userId = user.id;
    session.customerCareUserType = 1;
    session.parlorId = user.role == 7 ? user.parlorIds.length > 0 ? user.parlorIds[0] : [] : user.parlorId;
    session.parlorName = "";
    session.role = user.role;
    session.userTypeBeu = user.userTypeBeu;
    return session.parlorId;
};

adminSchema.statics.getUserObjApp = function(user) {
    return {
        userId: user.id,
        name: user.firstName + ' ' + (user.lastName != undefined ? user.lastName : ''),
        emailId: user.emailId,
        gender: user.gender,
        phoneNumber: user.phoneNumber,
        userType: user.userType,
        accessToken: user.phoneVerification == 1 ? user.accesstoken : '',
        phoneVerification: user.phoneVerification ? user.phoneVerification : 0,
        profilePic: user.profilePic ? user.profilePic : 'https://www.buira.net/assets/images/shared/default-profile.png',
    };
};


adminSchema.statics.updatePofoArtistId = function(phoneNumber, callback) {
    console.log(phoneNumber)
    var request = require('request');

    request.get('http://pofo.io/portfolio/getArtistId?phoneNumber=' + phoneNumber + '', function(err, response, body) {
    // request.get('http://localhost:4000/portfolio/getArtistId?phoneNumber=' + phoneNumber + '', function(err, response, body) {
        var data = {};
        if (!err) {
            data = JSON.parse(response.body);
            if (data.success == false)
                return callback('')

            else{
                console.log(data.data)
                return callback(data.data)
            }
        } else {
            return callback(true)
        }

    });
}

var RAZORPAY_KEY = localVar.getRazorKey();
var RAZORPAY_APP_SECRET = localVar.getRazorAppSecret();
var request = require('request');

adminSchema.statics.createRazorPayAccountId = function(userId){
    Admin.findOne({_id: userId, razorPayAccountId:{$exists: false}}, { _id: 1,ifscCode:1, firstName:1, accountNo:1, lastName:1 , parlorId:1, accountNumber :1}, function(err, employee) {
        if(!err){
            var Razorpay = require('razorpay');
            var auth = new Buffer(localVar.getRazorKey() + ':' + localVar.getRazorAppSecret()).toString('base64');

            var accountNo = employee.accountNo ? employee.accountNo : employee.accountNumber;

            if(employee.lastName == "." || employee.lastName == " " || employee.lastName == null)employee.lastName = "";
            var employeeName = employee.firstName + " " +employee.lastName;
            var random = Math.floor(Math.random() * 9000) + 1000;
            var uri='https://api.razorpay.com/v1/beta/accounts'
            var employeeData={
                "name": employeeName,
                "email":employee.firstName+random+"beu@gmail.com",
                "tnc_accepted":1,
                "account_details":{
                    "business_name":employeeName,
                    "business_type":"individual"
                },
                "bank_account":{
                    "ifsc_code":employee.ifscCode,
                    "beneficiary_name":employeeName,
                    "account_type":"saving",
                    "account_number": accountNo
                } ,
                "notes" :{
                    employeeId : employee.id
                }
            }
            request({
                uri:uri ,
                form: employeeData,
                method: 'POST',
                headers: {
                    'Authorization' : 'Basic ' + auth,
                    "Content-type": "application/json"
                }
              }, function (err, response, body) {
                
                if(!err){
                    var myObj = JSON.parse(response.body);
                    if(myObj.error && myObj.error.code === "BAD_REQUEST_ERROR"){
                        console.log('Error in creating accountId')
                    }else{
                        console.log(response.body)
                        Admin.update({_id: employee.id}, {razorPayAccountId : myObj.id , accountDetailDate : new Date()} , function(err , update){
                           console.log('AccountId created successfully')
                        })
                    }
                }else{
                    console.log('Error in creating accountId')
                }
              });
        }else{
            console.log('Error in creating accountId')
        }
    });
};


adminSchema.statics.addFundAccountToContactId = function(contactIdRazorPay , bankBeneficiaryName, ifscCode, accountNo, callback){
    console.log(ifscCode)
    var reqObj ={
                "contact_id" : contactIdRazorPay,
                account_type : 'bank_account',
                "details": {
                    "name": bankBeneficiaryName,
                    "ifsc": ifscCode,
                    "account_number": accountNo,
                    // "bank_name" : bankName
                }
              };
     request({
            url: "https://api.razorpay.com/v1/fund_accounts", //URL to hit
            method: 'POST',
            headers :{
                'Content-Type':'application/json',
            },
            'auth': {
                'user': RAZORPAY_KEY,
                'pass' : RAZORPAY_APP_SECRET
              },
            body : JSON.stringify(reqObj)
        }, function(error, re, body) {
            console.log(body)
            let data = JSON.parse(body);
            return callback(data)
        });
};


adminSchema.statics.createRazorPayXContactId = function(employeeId , parlorId, phoneNumber, employeeName, callback){
    request({
           url: "https://api.razorpay.com/v1/contacts", //URL to hit
           method: 'POST',
           headers :{
               'Content-Type':'application/json',
           },
           'auth': {
               'user': RAZORPAY_KEY,
               'pass' : RAZORPAY_APP_SECRET
             },
           body : JSON.stringify({
               name : employeeName,
               type : 'vendor',
               reference_id : employeeId,
               notes : {
                   parlorId : parlorId,
                   phoneNumber : phoneNumber,
               }
             })
       }, function(error, re, body) {
           console.log(error)
           console.log(body)
           let b = JSON.parse(body);
           return callback(b.id)
       });
};

// on every save, add the date
adminSchema.pre('save', function(next) {
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
// adminSchema.plugin(autoIncrement.plugin, 'admin');

var Admin = mongoose.model('owner', adminSchema);

// make this available to our users in our Node applications
module.exports = Admin;