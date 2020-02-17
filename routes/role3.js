'use strict'

var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var multer = require('multer');
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");
var ObjectId = mongoose.Types.ObjectId;
var async = require('async');
var multer = require('multer');
var fs = require('fs');
var request = require('request');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var fse = require('fs-extra');

var storage = multer.diskStorage({ //multers disk storage settings
    destination: function(req, file, cb) {
        cb(null, '../uploads/')
    },
    filename: function(req, file, cb) {
        var datetimestamp = Date.now();
        cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1])
    }
});
var upload = multer({ //multer settings
    storage: storage,
    fileFilter: function(req, file, callback) { //file filter
        if (['xls', 'xlsx'].indexOf(file.originalname.split('.')[file.originalname.split('.').length - 1]) === -1) {
            return callback(new Error('Wrong extension type'));
        }
        callback(null, true);
    }
}).single('file');

router.post('/createCustomer', function(req, res) {
    var user = User.getUserObj(req);
    var page = req.body.page;
    // sendOfferSms(user);
    console.log(user)
    User.findOne({ phoneNumber: user.phoneNumber }).exec(function(err, userFound) {
        if (userFound) {
            console.log("userFound");
            var parlors = _.filter(userFound.parlors, function(parlor) {
                return parlor.parlorId == req.session.parlorId;
            });
            if (parlors.length !== 0)
                return res.json(CreateObjService.response(true, 'User already registered for this parlor!'));
            else {
                userFound.parlors.push(user.parlors[0]);
                userFound.save(function(err) {
                    console.log("user found");
                    return res.redirect('/role3/customers');
                });
            }
        } else {
            User.find().count(function(err, count) {
                user.customerId = ++count;
                User.create(user, function(err, newUser) {
                    if (err) return res.json(CreateObjService.response(false, 'Form Validation!'));
                    else {
                        User.find({ 'parlors.parlorId': req.session.parlorId }).exec(function(err, users) {
                            console.log(err);
                            if (err) return res.json(CreateObjService.response(true, 'Error'));
                            else return res.json(CreateObjService.response(false, _.map(users, function(u) {
                                return User.parse(u, req.session.parlorId);
                            })));
                        });
                    }
                });
            });
        }
    });
});

router.get('/uploadMembershipForMonsoon1000Before', function(req, res) {
    var users =[{phoneNumber : "9910733128", credit : 36574},{phoneNumber : "9650919817", credit : 800},{phoneNumber : "9871004741", credit : 200},{phoneNumber : "9999990097", credit : 600},{phoneNumber : "9818689374", credit : 9555},{phoneNumber : "9891176888", credit : 800},{phoneNumber : "9929206010", credit : 800},{phoneNumber : "9582262226", credit : 800},{phoneNumber : "9999109936", credit : 800},{phoneNumber : "9971750916", credit : 800},{phoneNumber : "9811175699", credit : 600},{phoneNumber : "8076299899", credit : 800},{phoneNumber : "9867119967", credit : 800},{phoneNumber : "9818693580", credit : 400},{phoneNumber : "9638524257", credit : 600},{phoneNumber : "8527049004", credit : 883},{phoneNumber : "9873923492", credit : 600},{phoneNumber : "9315289551", credit : 800},{phoneNumber : "9805085914", credit : 800},{phoneNumber : "9717910606", credit : 800},{phoneNumber : "9811147877", credit : 200},{phoneNumber : "8920674800", credit : 600},{phoneNumber : "9971115836", credit : 200},{phoneNumber : "9999475324", credit : 1000},{phoneNumber : "9958826144", credit : 800},{phoneNumber : "9910665294", credit : 400},{phoneNumber : "9821903987", credit : 200},{phoneNumber : "9873342277", credit : 400},{phoneNumber : "9971711023", credit : 400},{phoneNumber : "9999435552", credit : 200},{phoneNumber : "9811587031", credit : 800},{phoneNumber : "8527007072", credit : 200},{phoneNumber : "9810743653", credit : 600},{phoneNumber : "9971364321", credit : 600},{phoneNumber : "9999359514", credit : 400},{phoneNumber : "9899007679", credit : 400},{phoneNumber : "9717887227", credit : 800},{phoneNumber : "9873146959", credit : 400},{phoneNumber : "9818507046", credit : 800},{phoneNumber : "7042697097", credit : 800},{phoneNumber : "9899845151", credit : 200},{phoneNumber : "9810100497", credit : 600},{phoneNumber : "9999801948", credit : 800},{phoneNumber : "9899419196", credit : 200},{phoneNumber : "9899981846", credit : 400},{phoneNumber : "8800865601", credit : 800},{phoneNumber : "9911601007", credit : 200},{phoneNumber : "8800803301", credit : 600},{phoneNumber : "9910155531", credit : 800},{phoneNumber : "9999369262", credit : 600},{phoneNumber : "9871657288", credit : 600},{phoneNumber : "9873865905", credit : 800},{phoneNumber : "9555766908", credit : 800},{phoneNumber : "9717772297", credit : 600},{phoneNumber : "9811773830", credit : 400},{phoneNumber : "9717316688", credit : 600},{phoneNumber : "8130559367", credit : 1000},{phoneNumber : "8860692939", credit : 400},{phoneNumber : "9910058970", credit : 400},{phoneNumber : "9811130903", credit : 800},{phoneNumber : "9891700002", credit : 400},{phoneNumber : "9810041706", credit : 600},{phoneNumber : "7982781981", credit : 400},{phoneNumber : "9999689487", credit : 600},{phoneNumber : "8860582299", credit : 600},{phoneNumber : "8800253888", credit : 709},{phoneNumber : "8368200848", credit : 800},{phoneNumber : "9810745364", credit : 400},{phoneNumber : "9810708756", credit : 400},{phoneNumber : "9818040958", credit : 600},{phoneNumber : "9873637737", credit : 400},{phoneNumber : "9811943898", credit : 600},{phoneNumber : "9873916894", credit : 400},{phoneNumber : "9910800733", credit : 200},{phoneNumber : "9818680735", credit : 400},{phoneNumber : "9953401400", credit : 200},{phoneNumber : "9205195563", credit : 800},{phoneNumber : "7831879667", credit : 400},{phoneNumber : "9811711624", credit : 800},{phoneNumber : "9811300540", credit : 400},{phoneNumber : "9891325152", credit : 600},{phoneNumber : "9818599712", credit : 800},{phoneNumber : "9899058733", credit : 800},{phoneNumber : "9911538007", credit : 400},{phoneNumber : "9811199666", credit : 600},{phoneNumber : "9810826096", credit : 200},{phoneNumber : "9312265921", credit : 400},{phoneNumber : "9910054812", credit : 800},{phoneNumber : "9560608263", credit : 800},{phoneNumber : "9871120000", credit : 600},{phoneNumber : "9911106008", credit : 800},{phoneNumber : "9958377003", credit : 400},{phoneNumber : "9717937127", credit : 200},{phoneNumber : "9667510627", credit : 800},{phoneNumber : "9818557445", credit : 600},{phoneNumber : "9654300039", credit : 200},{phoneNumber : "9899202166", credit : 200},{phoneNumber : "9810777592", credit : 600},{phoneNumber : "9818744559", credit : 400},{phoneNumber : "9582159977", credit : 800},{phoneNumber : "9891373791", credit : 600},{phoneNumber : "9650003385", credit : 400},{phoneNumber : "9910704692", credit : 600},{phoneNumber : "9999900043", credit : 400},{phoneNumber : "9899285538", credit : 400},{phoneNumber : "9818083376", credit : 600},{phoneNumber : "9810907379", credit : 400},{phoneNumber : "9999919572", credit : 400},{phoneNumber : "9899673071", credit : 400},{phoneNumber : "9619553325", credit : 5},{phoneNumber : "9910162881", credit : 800},{phoneNumber : "9810436622", credit : 600},{phoneNumber : "9654981613", credit : 600},{phoneNumber : "9654190006", credit : 200},{phoneNumber : "8447855706", credit : 200},{phoneNumber : "9650170331", credit : 200},{phoneNumber : "9899784807", credit : 400},{phoneNumber : "9910127107", credit : 200},{phoneNumber : "9811900389", credit : 200},{phoneNumber : "9999400323", credit : 800},{phoneNumber : "9599918323", credit : 400},{phoneNumber : "9899466664", credit : 200},{phoneNumber : "9899405566", credit : 600},{phoneNumber : "9654213462", credit : 200},{phoneNumber : "9971188105", credit : 400},{phoneNumber : "9632810034", credit : 400},{phoneNumber : "7303993064", credit : 400},{phoneNumber : "9899681888", credit : 400},{phoneNumber : "9811357169", credit : 400},{phoneNumber : "9810050974", credit : 400},{phoneNumber : "9818853887", credit : 600},{phoneNumber : "9205395697", credit : 800},{phoneNumber : "8810453208", credit : 200},{phoneNumber : "9971804989", credit : 800},{phoneNumber : "9560059111", credit : 600},{phoneNumber : "9953214737", credit : 200},{phoneNumber : "8527784427", credit : 1000},{phoneNumber : "8860022587", credit : 200},{phoneNumber : "9910303921", credit : 200},{phoneNumber : "9716000070", credit : 200},{phoneNumber : "8826719364", credit : 400},{phoneNumber : "9837035688", credit : 800},{phoneNumber : "8373912482", credit : 400},{phoneNumber : "9599930654", credit : 600},{phoneNumber : "9899620758", credit : 400},{phoneNumber : "9811970006", credit : 600},{phoneNumber : "9971378799", credit : 200},{phoneNumber : "9871051969", credit : 800},{phoneNumber : "9868333516", credit : 600},{phoneNumber : "9999558501", credit : 200},{phoneNumber : "9811058457", credit : 400},{phoneNumber : "9873000263", credit : 600},{phoneNumber : "9810290268", credit : 600},{phoneNumber : "9899793474", credit : 800},{phoneNumber : "9810302309", credit : 200},{phoneNumber : "9717069613", credit : 400},{phoneNumber : "9899694320", credit : 600},{phoneNumber : "9958790609", credit : 400},{phoneNumber : "9312245954", credit : 400},{phoneNumber : "8800195286", credit : 600},{phoneNumber : "9560661115", credit : 400},{phoneNumber : "9999103757", credit : 400},{phoneNumber : "9818399615", credit : 600},{phoneNumber : "9811100669", credit : 600},{phoneNumber : "9811300669", credit : 800},{phoneNumber : "9971164497", credit : 200},{phoneNumber : "9560575373", credit : 400},{phoneNumber : "8826814879", credit : 2373},{phoneNumber : "9910657983", credit : 200},{phoneNumber : "8860910788", credit : 200},{phoneNumber : "9717457481", credit : 400},{phoneNumber : "7838038490", credit : 800},{phoneNumber : "9999768899", credit : 400},{phoneNumber : "9821042529", credit : 600},{phoneNumber : "9999388195", credit : 600},{phoneNumber : "9810991188", credit : 200},{phoneNumber : "9871840164", credit : 500},{phoneNumber : "9811614546", credit : 200},{phoneNumber : "9953873173", credit : 600},{phoneNumber : "9811651107", credit : 400},{phoneNumber : "9999984359", credit : 600},{phoneNumber : "9540577071", credit : 600},{phoneNumber : "9810724628", credit : 600},{phoneNumber : "9811865006", credit : 200},{phoneNumber : "9891669772", credit : 570},{phoneNumber : "7873930781", credit : 200},{phoneNumber : "9582271931", credit : 800},{phoneNumber : "9868972806", credit : 400},{phoneNumber : "7838599129", credit : 200},{phoneNumber : "9212365890", credit : 600},{phoneNumber : "8800270285", credit : 800},{phoneNumber : "9205214866", credit : 200},{phoneNumber : "9953401400", credit : 2299},{phoneNumber : "9971515137", credit : 17939},{phoneNumber : "9810150553", credit : 7460},{phoneNumber : "9818525737", credit : 15310},{phoneNumber : "9818801697", credit : 11581},{phoneNumber : "9958465331", credit : 7130}];
    console.log(users.length)
    _.forEach(users, function(u, key){
        
        User.findOne({phoneNumber : u.phoneNumber}, {"activeMembership.parlorId" : 1}, function(er, user){
            let obj =  {
                "membershipWithTax" : false,
                "validTo" : new Date(2019, 10, 1),
                "membershipId" :ObjectId("5c20add9a94e5e7ebc066d36"),
                "parlorId" : user.activeMembership[0].parlorId,
                "name" : "Monsoon Card 1000 - Before",
                "type" : 1,
                "creditsLeft" : u.credit,
                "amount" : 10000
            };
        User.update({phoneNumber : u.phoneNumber}, {$push: { activeMembership: { $each: [ obj ], $position: 0 } } }, function(err, user){
            console.log(err);
            console.log("done", key);
        });
        });
    })
    res.json("done");
});

// 5c209894a94e5e7ebc00933a - 1000 - before
// 5c209894a94e5e7ebc00933a - 1000
// ObjectId("5c14cf5ca94e5e7ebc0a33c7") - 10000
// ObjectId("5c14d1fba94e5e7ebc0ad358") - 20000


router.get('/uploadMembershipForMonsoon', function(req, res) {
    var users =[{phoneNumber : "9910733128"},{phoneNumber : "9650919817"},{phoneNumber : "9871004741"},{phoneNumber : "9999990097"},{phoneNumber : "9818689374"},{phoneNumber : "9891176888"},{phoneNumber : "9929206010"},{phoneNumber : "9582262226"},{phoneNumber : "9999109936"},{phoneNumber : "9811702512"},{phoneNumber : "9971750916"},{phoneNumber : "9811175699"},{phoneNumber : "9711344638"},{phoneNumber : "8076299899"},{phoneNumber : "9867119967"},{phoneNumber : "9818693580"},{phoneNumber : "9638524257"},{phoneNumber : "8527049004"},{phoneNumber : "9873923492"},{phoneNumber : "9315289551"},{phoneNumber : "9711139733"},{phoneNumber : "9805085914"},{phoneNumber : "9717910606"},{phoneNumber : "9811147877"},{phoneNumber : "9958633397"},{phoneNumber : "8920674800"},{phoneNumber : "9971115836"},{phoneNumber : "9999475324"},{phoneNumber : "9958826144"},{phoneNumber : "9910665294"},{phoneNumber : "9821903987"},{phoneNumber : "9873342277"},{phoneNumber : "9971711023"},{phoneNumber : "9999435552"},{phoneNumber : "9811587031"},{phoneNumber : "8527007072"},{phoneNumber : "9810743653"},{phoneNumber : "9971364321"},{phoneNumber : "9999359514"},{phoneNumber : "9899007679"},{phoneNumber : "9717887227"},{phoneNumber : "9873146959"},{phoneNumber : "9818507046"},{phoneNumber : "7042697097"},{phoneNumber : "9899845151"},{phoneNumber : "9873020090"},{phoneNumber : "9212102750"},{phoneNumber : "9810100497"},{phoneNumber : "9999801948"},{phoneNumber : "9899419196"},{phoneNumber : "9899981846"},{phoneNumber : "8800865601"},{phoneNumber : "9911601007"},{phoneNumber : "8800803301"},{phoneNumber : "9910155531"},{phoneNumber : "9999369262"},{phoneNumber : "9871657288"},{phoneNumber : "9873865905"},{phoneNumber : "9555766908"},{phoneNumber : "9717772297"},{phoneNumber : "9811773830"},{phoneNumber : "9717316688"},{phoneNumber : "8130559367"},{phoneNumber : "8860692939"},{phoneNumber : "9910058970"},{phoneNumber : "9811130903"},{phoneNumber : "9891700002"},{phoneNumber : "9810041706"},{phoneNumber : "7982781981"},{phoneNumber : "9999689487"},{phoneNumber : "8860582299"},{phoneNumber : "8800253888"},{phoneNumber : "8368200848"},{phoneNumber : "9810745364"},{phoneNumber : "9873727704"},{phoneNumber : "9810708756"},{phoneNumber : "9560616159"},{phoneNumber : "9818040958"},{phoneNumber : "9873637737"},{phoneNumber : "9811943898"},{phoneNumber : "9873916894"},{phoneNumber : "9910800733"},{phoneNumber : "9818680735"},{phoneNumber : "9953401400"},{phoneNumber : "9205195563"},{phoneNumber : "9953688724"},{phoneNumber : "7831879667"},{phoneNumber : "9811711624"},{phoneNumber : "9711181088"},{phoneNumber : "9312082534"},{phoneNumber : "9811300540"},{phoneNumber : "9891325152"},{phoneNumber : "9818599712"},{phoneNumber : "9899058733"},{phoneNumber : "9911538007"},{phoneNumber : "9811199666"},{phoneNumber : "9711139733"},{phoneNumber : "9810826096"},{phoneNumber : "9899582868"},{phoneNumber : "9312265921"},{phoneNumber : "9910054812"},{phoneNumber : "8130691657"},{phoneNumber : "9560608263"},{phoneNumber : "9873409545"},{phoneNumber : "9999336141"},{phoneNumber : "9871120000"},{phoneNumber : "9999945911"},{phoneNumber : "9911106008"},{phoneNumber : "9958377003"},{phoneNumber : "9717937127"},{phoneNumber : "9667510627"},{phoneNumber : "9818557445"},{phoneNumber : "9810506188"},{phoneNumber : "9654300039"},{phoneNumber : "9810411764"},{phoneNumber : "9899202166"},{phoneNumber : "9810777592"},{phoneNumber : "9818744559"},{phoneNumber : "9582159977"},{phoneNumber : "9891373791"},{phoneNumber : "9999399724"},{phoneNumber : "9650003385"},{phoneNumber : "9711037574"},{phoneNumber : "9910704692"},{phoneNumber : "8800470862"},{phoneNumber : "9711733507"},{phoneNumber : "9999900043"},{phoneNumber : "9871030182"},{phoneNumber : "9899285538"},{phoneNumber : "9818083376"},{phoneNumber : "9810907379"},{phoneNumber : "9999919572"},{phoneNumber : "9899673071"},{phoneNumber : "9810921821"},{phoneNumber : "9811748490"},{phoneNumber : "9619553325"},{phoneNumber : "9899135297"},{phoneNumber : "9910702233"},{phoneNumber : "9582816899"},{phoneNumber : "9910162881"},{phoneNumber : "9810436622"},{phoneNumber : "9873376834"},{phoneNumber : "9654981613"},{phoneNumber : "9315435047"},{phoneNumber : "9654190006"},{phoneNumber : "8447855706"},{phoneNumber : "9650170331"},{phoneNumber : "9419024917"},{phoneNumber : "9899784807"},{phoneNumber : "9910127107"},{phoneNumber : "9811900389"},{phoneNumber : "9999400323"},{phoneNumber : "9599918323"},{phoneNumber : "9899466664"},{phoneNumber : "9899405566"},{phoneNumber : "9654213462"},{phoneNumber : "9811159043"},{phoneNumber : "9999558354"},{phoneNumber : "9971188105"},{phoneNumber : "9632810034"},{phoneNumber : "7303993064"},{phoneNumber : "9899681888"},{phoneNumber : "9873451228"},{phoneNumber : "9811357169"},{phoneNumber : "9810050974"},{phoneNumber : "9818853887"},{phoneNumber : "9923799377"},{phoneNumber : "9205395697"},{phoneNumber : "9990235033"},{phoneNumber : "8810453208"},{phoneNumber : "9953452452"},{phoneNumber : "9971804989"},{phoneNumber : "9560059111"},{phoneNumber : "9811721629"},{phoneNumber : "9953214737"},{phoneNumber : "9999094276"},{phoneNumber : "9717555071"},{phoneNumber : "8527784427"},{phoneNumber : "8860022587"},{phoneNumber : "8588810990"},{phoneNumber : "9910303921"},{phoneNumber : "9716000070"},{phoneNumber : "9711114950"},{phoneNumber : "8826719364"},{phoneNumber : "9837035688"},{phoneNumber : "9910773914"},{phoneNumber : "8373912482"},{phoneNumber : "9599930654"},{phoneNumber : "9899620758"},{phoneNumber : "9811970006"},{phoneNumber : "9899164265"},{phoneNumber : "9971378799"},{phoneNumber : "9373286191"},{phoneNumber : "9871051969"},{phoneNumber : "9868333516"},{phoneNumber : "9999558501"},{phoneNumber : "9811058457"},{phoneNumber : "9810311716"},{phoneNumber : "9873000263"},{phoneNumber : "9810290268"},{phoneNumber : "9910516222"},{phoneNumber : "9717111715"},{phoneNumber : "9899793474"},{phoneNumber : "9810038636"},{phoneNumber : "9717391331"},{phoneNumber : "9910085924"},{phoneNumber : "9810302309"},{phoneNumber : "9873582109"},{phoneNumber : "9582889075"},{phoneNumber : "9717069613"},{phoneNumber : "9971630752"},{phoneNumber : "9971006505"},{phoneNumber : "9899694320"},{phoneNumber : "9958790609"},{phoneNumber : "9312245954"},{phoneNumber : "8800195286"},{phoneNumber : "9810748060"},{phoneNumber : "9971770576"},{phoneNumber : "9560661115"},{phoneNumber : "9910268754"},{phoneNumber : "9999103757"},{phoneNumber : "8800656441"},{phoneNumber : "9871022811"},{phoneNumber : "9818399615"},{phoneNumber : "9717596100"},{phoneNumber : "9811100669"},{phoneNumber : "9811300669"},{phoneNumber : "9971164497"},{phoneNumber : "9560575373"},{phoneNumber : "8860005974"},{phoneNumber : "8826814879"},{phoneNumber : "9899972124"},{phoneNumber : "9899036727"},{phoneNumber : "9810709367"},{phoneNumber : "9811818912"},{phoneNumber : "9910657983"},{phoneNumber : "9911155803"},{phoneNumber : "8860556509"},{phoneNumber : "8860910788"},{phoneNumber : "9818832498"},{phoneNumber : "9717457481"},{phoneNumber : "7838038490"},{phoneNumber : "8447414443"},{phoneNumber : "9999768899"},{phoneNumber : "9821042529"},{phoneNumber : "9971210950"},{phoneNumber : "9999388195"},{phoneNumber : "9818742647"},{phoneNumber : "7838673392"},{phoneNumber : "9910177188"},{phoneNumber : "9810991188"},{phoneNumber : "9910348878"},{phoneNumber : "9871840164"},{phoneNumber : "9811614546"},{phoneNumber : "9899085444"},{phoneNumber : "9953873173"},{phoneNumber : "9811651107"},{phoneNumber : "9999984359"},{phoneNumber : "8800334045"},{phoneNumber : "9650400039"},{phoneNumber : "9818667445"},{phoneNumber : "9899361689"},{phoneNumber : "9540577071"},{phoneNumber : "9810203695"},{phoneNumber : "9810724628"},{phoneNumber : "9811189996"},{phoneNumber : "8800747740"},{phoneNumber : "9811866218"},{phoneNumber : "9811865006"},{phoneNumber : "9891669772"},{phoneNumber : "9910991188"},{phoneNumber : "7873930781"},{phoneNumber : "9999217243"},{phoneNumber : "9910548886"},{phoneNumber : "8527958527"},{phoneNumber : "9582271931"},{phoneNumber : "9868972806"},{phoneNumber : "7838599129"},{phoneNumber : "9999894948"},{phoneNumber : "9212365890"},{phoneNumber : "9555548585"},{phoneNumber : "8800270285"},{phoneNumber : "9811790020"},{phoneNumber : "9873099957"},{phoneNumber : "9205214866"},{phoneNumber : "9953401400"},{phoneNumber : "9971515137"},{phoneNumber : "9810150553"},{phoneNumber : "9818525737"},{phoneNumber : "9818801697"},{phoneNumber : "9958465331"}];
    _.forEach(users, function(u){
        let obj =  {
            "membershipWithTax" : false,
            "validTo" : new Date(2019, 10, 1),
            "membershipId" :ObjectId("5c209894a94e5e7ebc00933a"),
            "parlorId" : ObjectId("5c236251c3f2cf6c82c8bfb7"),
            "name" : "Monsoon Card 1000",
            "type" : 2,
            "creditsLeft" : 10000,
            "amount" : 1000
        };
        User.update({phoneNumber : u.phoneNumber}, {activeMembership : [obj]}, function(err, user){
            console.log(err);
            console.log("done");
        });
    })
    res.json("done");
});

router.get('/createCustomerForMonsoon', function(req, res) {
    var users =[{phoneNumber : "9910733128", name: "Aashi ,", gender : "F"},{phoneNumber : "9650919817", name: "Nisha .", gender : "F"},{phoneNumber : "9871004741", name: "sakshi jain", gender : "F"},{phoneNumber : "9999990097", name: "preeti kaul", gender : "F"},{phoneNumber : "9818689374", name: "Manju .", gender : "F"},{phoneNumber : "9891176888", name: "akriti puri", gender : "F"},{phoneNumber : "9929206010", name: "Pratiksha Prasad", gender : "F"},{phoneNumber : "9582262226", name: "Madhu Dalal", gender : "F"},{phoneNumber : "9999109936", name: "arya arya", gender : "F"},{phoneNumber : "9811702512", name: "Priyanka Mital", gender : "F"},{phoneNumber : "9971750916", name: "Neeru Mehta", gender : "F"},{phoneNumber : "9811175699", name: "Rajeev ..", gender : "F"},{phoneNumber : "9711344638", name: "Dimple .", gender : "F"},{phoneNumber : "8076299899", name: "Tarang .", gender : "F"},{phoneNumber : "9867119967", name: "Pooja Singh", gender : "F"},{phoneNumber : "9818693580", name: "Shubha Gandhi", gender : "F"},{phoneNumber : "9638524257", name: "Natasha Raina", gender : "F"},{phoneNumber : "8527049004", name: "Prerna Saini", gender : "F"},{phoneNumber : "9873923492", name: "Sachin Wadhwa", gender : "F"},{phoneNumber : "9315289551", name: "Shagun .", gender : "F"},{phoneNumber : "9711139733", name: "Pooja Pooja", gender : "F"},{phoneNumber : "9805085914", name: "meenakshi .,", gender : "F"},{phoneNumber : "9717910606", name: "Aastha Sharma", gender : "F"},{phoneNumber : "9811147877", name: "Bina Tirkha", gender : "F"},{phoneNumber : "9958633397", name: "NEERU MALL", gender : "F"},{phoneNumber : "8920674800", name: "Nirmala .", gender : "F"},{phoneNumber : "9971115836", name: "Virat Chaddha", gender : "F"},{phoneNumber : "9999475324", name: "Tulika ..", gender : "F"},{phoneNumber : "9958826144", name: "Raina .", gender : "F"},{phoneNumber : "9910665294", name: "Nitasha Kaul", gender : "F"},{phoneNumber : "9821903987", name: "Sheetal .", gender : "F"},{phoneNumber : "9873342277", name: "Poonam .", gender : "F"},{phoneNumber : "9971711023", name: "Sanjeeta Menon", gender : "F"},{phoneNumber : "9999435552", name: "Kansha .", gender : "F"},{phoneNumber : "9811587031", name: "Manjari .", gender : "F"},{phoneNumber : "8527007072", name: "Deepa Kochar", gender : "F"},{phoneNumber : "9810743653", name: "Geetika ..", gender : "F"},{phoneNumber : "9971364321", name: "Sawitri Joshi", gender : "F"},{phoneNumber : "9999359514", name: "puneet khurana", gender : "F"},{phoneNumber : "9899007679", name: "Vikas SHARMA", gender : "F"},{phoneNumber : "9717887227", name: "Pranita ,", gender : "F"},{phoneNumber : "9873146959", name: "Gunjan .", gender : "F"},{phoneNumber : "9818507046", name: "Sonal Malik", gender : "F"},{phoneNumber : "7042697097", name: "Pari .", gender : "F"},{phoneNumber : "9899845151", name: "Mansi Khatreja", gender : "F"},{phoneNumber : "9873020090", name: "Kanan Khera", gender : "F"},{phoneNumber : "9212102750", name: "NAMITA ARORA", gender : "F"},{phoneNumber : "9810100497", name: "Rachna Sharma", gender : "F"},{phoneNumber : "9999801948", name: "Garima .", gender : "F"},{phoneNumber : "9899419196", name: "navneet ...", gender : "F"},{phoneNumber : "9899981846", name: "Maneesh Taneja", gender : "F"},{phoneNumber : "8800865601", name: "swati rajpal", gender : "F"},{phoneNumber : "9911601007", name: "Shikha Patial", gender : "F"},{phoneNumber : "8800803301", name: "Aryan Malhotra", gender : "F"},{phoneNumber : "9910155531", name: "Pranjal Kaushik", gender : "F"},{phoneNumber : "9999369262", name: "Namrita .,", gender : "F"},{phoneNumber : "9871657288", name: "Brijesh Chaudhary", gender : "F"},{phoneNumber : "9873865905", name: "Manasbani ,", gender : "F"},{phoneNumber : "9555766908", name: "Aman ..", gender : "F"},{phoneNumber : "9717772297", name: "KAMAL NARANG", gender : "F"},{phoneNumber : "9811773830", name: "sarika dixit", gender : "F"},{phoneNumber : "9717316688", name: "Anuny Mr", gender : "F"},{phoneNumber : "8130559367", name: "Jaqub .", gender : "F"},{phoneNumber : "8860692939", name: "NUPUR KUMAR", gender : "F"},{phoneNumber : "9910058970", name: "KISHALAY .", gender : "F"},{phoneNumber : "9811130903", name: "SUKESH .", gender : "F"},{phoneNumber : "9891700002", name: "Dr. rajeev sharma", gender : "F"},{phoneNumber : "9810041706", name: "Uma Kant", gender : "F"},{phoneNumber : "7982781981", name: "PARESH BHANDARA", gender : "F"},{phoneNumber : "9999689487", name: "Vinamrata .", gender : "F"},{phoneNumber : "8860582299", name: "Ity Saxena", gender : "F"},{phoneNumber : "8800253888", name: "Akshay ,", gender : "F"},{phoneNumber : "8368200848", name: "Kartik .", gender : "F"},{phoneNumber : "9810745364", name: "Richa Hingorni", gender : "F"},{phoneNumber : "9873727704", name: "Sheetal Singh", gender : "F"},{phoneNumber : "9810708756", name: "Nandita Dubey", gender : "F"},{phoneNumber : "9560616159", name: "Asmita Verma", gender : "F"},{phoneNumber : "9818040958", name: "Mahuya .", gender : "F"},{phoneNumber : "9873637737", name: "Sachin Malik", gender : "F"},{phoneNumber : "9811943898", name: "Manisha Day", gender : "F"},{phoneNumber : "9873916894", name: "vidhushi narania", gender : "F"},{phoneNumber : "9910800733", name: "Justin .", gender : "F"},{phoneNumber : "9818680735", name: "Shally .", gender : "F"},{phoneNumber : "9953401400", name: "Archana .,", gender : "F"},{phoneNumber : "9205195563", name: "Vrishali .", gender : "F"},{phoneNumber : "9953688724", name: "Vinita ..", gender : "F"},{phoneNumber : "7831879667", name: "Isha Rana", gender : "F"},{phoneNumber : "9811711624", name: "Shweta Kaushik", gender : "F"},{phoneNumber : "9711181088", name: "ritu dimri", gender : "F"},{phoneNumber : "9312082534", name: "isha sar", gender : "F"},{phoneNumber : "9811300540", name: "Deepa Menon .", gender : "F"},{phoneNumber : "9891325152", name: "Puneet jain", gender : "F"},{phoneNumber : "9818599712", name: "Kanika .", gender : "F"},{phoneNumber : "9899058733", name: "shally bhutani", gender : "F"},{phoneNumber : "9911538007", name: "jai dagar", gender : "F"},{phoneNumber : "9811199666", name: "Kanhaiya Kumar", gender : "F"},{phoneNumber : "9711139733", name: "Pooja Pooja", gender : "F"},{phoneNumber : "9810826096", name: "Ranjeet Saxena", gender : "F"},{phoneNumber : "9899582868", name: "deepika sethi", gender : "F"},{phoneNumber : "9312265921", name: "Sangeeta Sinha", gender : "F"},{phoneNumber : "9910054812", name: "shilpi gautam", gender : "F"},{phoneNumber : "8130691657", name: "Puneet .", gender : "F"},{phoneNumber : "9560608263", name: "Shagun .", gender : "F"},{phoneNumber : "9873409545", name: "Neera .aa", gender : "F"},{phoneNumber : "9999336141", name: "Ashish Yadav", gender : "F"},{phoneNumber : "9871120000", name: "Prativha .", gender : "F"},{phoneNumber : "9999945911", name: "kavita .", gender : "F"},{phoneNumber : "9911106008", name: "Neeraj Patial", gender : "F"},{phoneNumber : "9958377003", name: "Gunjan ..", gender : "F"},{phoneNumber : "9717937127", name: "jyoti swarup", gender : "F"},{phoneNumber : "9667510627", name: "Sakshi ,", gender : "F"},{phoneNumber : "9818557445", name: "Shilpi Kumar", gender : "F"},{phoneNumber : "9810506188", name: "Aruna ,", gender : "F"},{phoneNumber : "9654300039", name: "SHARNEET KAUR", gender : "F"},{phoneNumber : "9810411764", name: "pooja sicri", gender : "F"},{phoneNumber : "9899202166", name: "Devesh Anand", gender : "F"},{phoneNumber : "9810777592", name: "Pooja Chandok", gender : "F"},{phoneNumber : "9818744559", name: "dr aman", gender : "F"},{phoneNumber : "9582159977", name: "NISHANT ..", gender : "F"},{phoneNumber : "9891373791", name: "Ramit Bhat", gender : "F"},{phoneNumber : "9999399724", name: "Monika .", gender : "F"},{phoneNumber : "9650003385", name: "Nivedita .", gender : "F"},{phoneNumber : "9711037574", name: "Pallavi ..", gender : "F"},{phoneNumber : "9910704692", name: "Nikita .", gender : "F"},{phoneNumber : "8800470862", name: "lata krishna", gender : "F"},{phoneNumber : "9711733507", name: "ANUBHA .", gender : "F"},{phoneNumber : "9999900043", name: "Dr. Aman .", gender : "F"},{phoneNumber : "9871030182", name: "kaveri singh", gender : "F"},{phoneNumber : "9899285538", name: "Sushmita .", gender : "F"},{phoneNumber : "9818083376", name: "kanchan kapur", gender : "F"},{phoneNumber : "9810907379", name: "SHIVANI RASTOGI", gender : "F"},{phoneNumber : "9999919572", name: "priti ojha", gender : "F"},{phoneNumber : "9899673071", name: "Ria Gandhi", gender : "F"},{phoneNumber : "9810921821", name: "TULIKA RAJPAL", gender : "F"},{phoneNumber : "9811748490", name: "Shalu Verma", gender : "F"},{phoneNumber : "9619553325", name: "mihika jindal", gender : "F"},{phoneNumber : "9899135297", name: "sonu bhalla", gender : "F"},{phoneNumber : "9910702233", name: "sonia verma", gender : "F"},{phoneNumber : "9582816899", name: "Monika ..", gender : "F"},{phoneNumber : "9910162881", name: "NIDHI vadlamani", gender : "F"},{phoneNumber : "9810436622", name: "Tushita T", gender : "F"},{phoneNumber : "9873376834", name: "monika mishra", gender : "F"},{phoneNumber : "9654981613", name: "Ritika Singh", gender : "F"},{phoneNumber : "9315435047", name: "nonita .", gender : "F"},{phoneNumber : "9654190006", name: "Nishu .", gender : "F"},{phoneNumber : "8447855706", name: "sandhya .", gender : "F"},{phoneNumber : "9650170331", name: "Isha .", gender : "F"},{phoneNumber : "9419024917", name: "RENU JAISWAL", gender : "F"},{phoneNumber : "9899784807", name: "devender kumar", gender : "F"},{phoneNumber : "9910127107", name: "Ujjyaini Roy", gender : "F"},{phoneNumber : "9811900389", name: "minakshi pradhakar", gender : "F"},{phoneNumber : "9999400323", name: "Pooja .", gender : "F"},{phoneNumber : "9599918323", name: "Pooja .", gender : "F"},{phoneNumber : "9899466664", name: "tina mathur", gender : "F"},{phoneNumber : "9899405566", name: "Apaksha .", gender : "F"},{phoneNumber : "9654213462", name: "Tushar Mukherjee", gender : "F"},{phoneNumber : "9811159043", name: "Atul Batra", gender : "F"},{phoneNumber : "9999558354", name: "aarja bhatachariya", gender : "F"},{phoneNumber : "9971188105", name: "Vilesh .", gender : "F"},{phoneNumber : "9632810034", name: "Christina .", gender : "F"},{phoneNumber : "7303993064", name: "Asmita Rajpurohit", gender : "F"},{phoneNumber : "9899681888", name: "mini balli", gender : "F"},{phoneNumber : "9873451228", name: "ritu jain", gender : "F"},{phoneNumber : "9811357169", name: "madhu beniwal", gender : "F"},{phoneNumber : "9810050974", name: "Shard Sharma", gender : "F"},{phoneNumber : "9818853887", name: "Zahid .", gender : "F"},{phoneNumber : "9923799377", name: "Poonam Bagga", gender : "F"},{phoneNumber : "9205395697", name: "Vaishanavi .", gender : "F"},{phoneNumber : "9990235033", name: "Prabha Poddar", gender : "F"},{phoneNumber : "8810453208", name: "Suman .", gender : "F"},{phoneNumber : "9953452452", name: "Jaipreet Kaur", gender : "F"},{phoneNumber : "9971804989", name: "surender sharma", gender : "F"},{phoneNumber : "9560059111", name: "sunita sharma", gender : "F"},{phoneNumber : "9811721629", name: "Reetika Johar", gender : "F"},{phoneNumber : "9953214737", name: "Aanandita ..", gender : "F"},{phoneNumber : "9999094276", name: "Parul Malik", gender : "F"},{phoneNumber : "9717555071", name: "Venus ...", gender : "F"},{phoneNumber : "8527784427", name: "NAMAN ..", gender : "F"},{phoneNumber : "8860022587", name: "Pankaj .", gender : "F"},{phoneNumber : "8588810990", name: "Rekha .", gender : "F"},{phoneNumber : "9910303921", name: "Divya Jain", gender : "F"},{phoneNumber : "9716000070", name: "Taruna ..", gender : "F"},{phoneNumber : "9711114950", name: "Shipra ,", gender : "F"},{phoneNumber : "8826719364", name: "Priyasha .", gender : "F"},{phoneNumber : "9837035688", name: "SEEM AGARWAAL.", gender : "F"},{phoneNumber : "9910773914", name: "anita ..", gender : "F"},{phoneNumber : "8373912482", name: "Aman Mathur", gender : "F"},{phoneNumber : "9599930654", name: "Joyti Verma", gender : "F"},{phoneNumber : "9899620758", name: "Rashmi VERMA", gender : "F"},{phoneNumber : "9811970006", name: "GAYETRI .", gender : "F"},{phoneNumber : "9899164265", name: "Renu Chabra", gender : "F"},{phoneNumber : "9971378799", name: "Neelakshi Sharma", gender : "F"},{phoneNumber : "9373286191", name: "Tejaswani .", gender : "F"},{phoneNumber : "9871051969", name: "alka singhai", gender : "F"},{phoneNumber : "9868333516", name: "Nalini Srivastava", gender : "F"},{phoneNumber : "9999558501", name: "ayesh bhatnager", gender : "F"},{phoneNumber : "9811058457", name: "Priyanka Rana", gender : "F"},{phoneNumber : "9810311716", name: "Raman Kumar", gender : "F"},{phoneNumber : "9873000263", name: "Amitoj .", gender : "F"},{phoneNumber : "9810290268", name: "Anil .", gender : "F"},{phoneNumber : "9910516222", name: "nitu ,", gender : "F"},{phoneNumber : "9717111715", name: "prerna razdan", gender : "F"},{phoneNumber : "9899793474", name: "ajesh ,", gender : "F"},{phoneNumber : "9810038636", name: "Sarita Chaitanvya", gender : "F"},{phoneNumber : "9717391331", name: "purnima anand", gender : "F"},{phoneNumber : "9910085924", name: "Cheryll Solomon", gender : "F"},{phoneNumber : "9810302309", name: "neelu khajuria", gender : "F"},{phoneNumber : "9873582109", name: "Suhaan Bhatri", gender : "F"},{phoneNumber : "9582889075", name: "Jiya Goel", gender : "F"},{phoneNumber : "9717069613", name: "Anshu Chauhan", gender : "F"},{phoneNumber : "9971630752", name: "upasna singh", gender : "F"},{phoneNumber : "9971006505", name: "MANJULA .", gender : "F"},{phoneNumber : "9899694320", name: "shilpi kaul", gender : "F"},{phoneNumber : "9958790609", name: "Ankur ..", gender : "F"},{phoneNumber : "9312245954", name: "Sameer Bhargav", gender : "F"},{phoneNumber : "8800195286", name: "Geetanjali Singh", gender : "F"},{phoneNumber : "9810748060", name: "Shivani muku", gender : "F"},{phoneNumber : "9971770576", name: "AMRITA SATHYARAM", gender : "F"},{phoneNumber : "9560661115", name: "SWATI ARORA", gender : "F"},{phoneNumber : "9910268754", name: "rachna sharma", gender : "F"},{phoneNumber : "9999103757", name: "Ekta .", gender : "F"},{phoneNumber : "8800656441", name: "parveen raheja", gender : "F"},{phoneNumber : "9871022811", name: "supriya CHOPRA", gender : "F"},{phoneNumber : "9818399615", name: "Vidya Mehata", gender : "F"},{phoneNumber : "9717596100", name: "Nidhi ..", gender : "F"},{phoneNumber : "9811100669", name: "Vikram .", gender : "F"},{phoneNumber : "9811300669", name: "Neelam .", gender : "F"},{phoneNumber : "9971164497", name: "Devo Bani", gender : "F"},{phoneNumber : "9560575373", name: "Tulika ..", gender : "F"},{phoneNumber : "8860005974", name: "yogita batra", gender : "F"},{phoneNumber : "8826814879", name: "Alka Tyagi", gender : "F"},{phoneNumber : "9899972124", name: "Palak .", gender : "F"},{phoneNumber : "9899036727", name: "harshali SINGH", gender : "F"},{phoneNumber : "9810709367", name: "Sachin .", gender : "F"},{phoneNumber : "9811818912", name: "akash saili", gender : "F"},{phoneNumber : "9910657983", name: "rashmi Chaudhary", gender : "F"},{phoneNumber : "9911155803", name: "Deeksha Birla", gender : "F"},{phoneNumber : "8860556509", name: "anjana shukla", gender : "F"},{phoneNumber : "8860910788", name: "Shipra Sharma", gender : "F"},{phoneNumber : "9818832498", name: "Avi Anand", gender : "F"},{phoneNumber : "9717457481", name: "Himanshi Dabas", gender : "F"},{phoneNumber : "7838038490", name: "Priya .", gender : "F"},{phoneNumber : "8447414443", name: "Priyanka Singh", gender : "F"},{phoneNumber : "9999768899", name: "Rahul ,", gender : "F"},{phoneNumber : "9821042529", name: "Anju .", gender : "F"},{phoneNumber : "9971210950", name: "shikha jamwal", gender : "F"},{phoneNumber : "9999388195", name: "Priyanka .", gender : "F"},{phoneNumber : "9818742647", name: "Pallavi ,", gender : "F"},{phoneNumber : "7838673392", name: "SUKANYA BORAH", gender : "F"},{phoneNumber : "9910177188", name: "ANUPAMA VENKATESH", gender : "F"},{phoneNumber : "9810991188", name: "rohit dahiya", gender : "F"},{phoneNumber : "9910348878", name: "Dinesh .", gender : "F"},{phoneNumber : "9871840164", name: "Madhur .", gender : "F"},{phoneNumber : "9811614546", name: "Kristeena .", gender : "F"},{phoneNumber : "9899085444", name: "neetu payal", gender : "F"},{phoneNumber : "9953873173", name: "Sanchy .", gender : "F"},{phoneNumber : "9811651107", name: "Rooma Kaveria", gender : "F"},{phoneNumber : "9999984359", name: "Himanshu ..", gender : "F"},{phoneNumber : "8800334045", name: "Khyati Mathur", gender : "F"},{phoneNumber : "9650400039", name: "Dr Sudhanshu", gender : "F"},{phoneNumber : "9818667445", name: "Paritosh ..", gender : "F"},{phoneNumber : "9899361689", name: "anuradha ghose", gender : "F"},{phoneNumber : "9540577071", name: "NIDHI .", gender : "F"},{phoneNumber : "9810203695", name: "Mansi mansi", gender : "F"},{phoneNumber : "9810724628", name: "priya KAPOOR", gender : "F"},{phoneNumber : "9811189996", name: "aman nangia", gender : "F"},{phoneNumber : "8800747740", name: "Shakshi ,", gender : "F"},{phoneNumber : "9811866218", name: "Yashpal Arora", gender : "F"},{phoneNumber : "9811865006", name: "prerna daga", gender : "F"},{phoneNumber : "9891669772", name: "Shiva ..", gender : "F"},{phoneNumber : "9910991188", name: "richa dahiya", gender : "F"},{phoneNumber : "7873930781", name: "Divya Khanna.", gender : "F"},{phoneNumber : "9999217243", name: "Jasleen kapoor", gender : "F"},{phoneNumber : "9910548886", name: "SANGEETA BHATACHARYA", gender : "F"},{phoneNumber : "8527958527", name: "parul mathur", gender : "F"},{phoneNumber : "9582271931", name: "Tanvi .", gender : "F"},{phoneNumber : "9868972806", name: "alka patil", gender : "F"},{phoneNumber : "7838599129", name: "Mitali .", gender : "F"},{phoneNumber : "9999894948", name: "japna gandhi", gender : "F"},{phoneNumber : "9212365890", name: "Himanshu ..", gender : "F"},{phoneNumber : "9555548585", name: "Ankit .", gender : "F"},{phoneNumber : "8800270285", name: "Manoj Kumar", gender : "F"},{phoneNumber : "9811790020", name: "JAIDEEP KAPOOR", gender : "F"},{phoneNumber : "9873099957", name: "Neetu ..", gender : "F"},{phoneNumber : "9205214866", name: "Himani .", gender : "F"},{phoneNumber : "9953401400", name: "Archana .,", gender : "F"},{phoneNumber : "9971515137", name: "ANITA MATPAL", gender : "F"},{phoneNumber : "9810150553", name: "Sanjeev Yadav", gender : "F"},{phoneNumber : "9818525737", name: "Mallika Gupta", gender : "F"},{phoneNumber : "9818801697", name: "Anshul Razdan", gender : "F"},{phoneNumber : "9958465331", name: "Monika Yadav", gender : "F"}];
    _.forEach(users, function(u){
        User.findOne({ phoneNumber: u.phoneNumber }).exec(function(err, userFound) {
            let user = {
                firstName: u.name,
                phoneNumber: u.phoneNumber,
                gender: u.gender,
                parlors: [{ parlorId: "5c236251c3f2cf6c82c8bfb7", createdBy: null, noOfAppointments: 0, createdAt: new Date(), updatedAt: new Date() }],
            };
            if (userFound) {
                console.log("userFound");
                var parlors = _.filter(userFound.parlors, function(parlor) {
                    return parlor.parlorId == req.session.parlorId;
                });
                if (parlors.length !== 0)
                    return res.json(CreateObjService.response(true, 'User already registered for this parlor!'));
                else {
                    userFound.parlors.push(user.parlors[0]);
                    userFound.save(function(err) {
                        console.log("user found");
                    });
                }
            }else {
                User.find().count(function(err, count) {
                    user.customerId = ++count;
                    User.create(user, function(err, newUser) {
                        if (err) console.log(err)
                        else console.log("done")
                    });
                });
            }
        });
    });
    res.json("done");
});

router.post('/sendOtpForSubscription', function(req, res) {
    User.findOne({ _id: req.body.userId }, { firstName: 1, subscriptionId: 1, phoneNumber: 1, subscriptionLoyality: 1 }, function(err, user) {
        if (user.subscriptionId) {
            Appointment.findOne({ _id: req.body.appointmentId }, { parlorName: 1 }, function(err, appointment) {
                var subscriptionType = user.subscriptionLoyality == 500 ? "Gold" : "Silver";
                var otp = Math.floor(Math.random() * 9000) + 1000;
                var url = getSmsUrlForOtp("BEUSLN", "Dear " + user.firstName + ", your OTP for transaction via your " + subscriptionType + " Subscription at " + appointment.parlorName + " is " + otp + ". See your detailed transaction history on your app.", [user.phoneNumber], "T", otp, 0),
                    http = require("http"),
                    response;
                request(url, function(error, response, body) {
                    if (error == null) {
                        User.update({ _id: req.body.userId }, { subscriptionOtp: otp }, function(er, f) {
                            return res.json(CreateObjService.response(false, 'Otp Sent!'));
                        })
                    }
                })
            });
        } else {
            return res.json(CreateObjService.response(true, 'Subscription Not Present!'));
        }
    });
});

router.post('/verifyOtpForSubscription', function(req, res) {
    userSubscription(req, function(err, message){
        return res.json(CreateObjService.response(err, message));
    })
});


function userSubscription(req, callback){
    console.log(req.body)
    Appointment.findOne({ _id: req.body.appointmentId, loyalitySubscription: 0 }, { appointmentStartTime: 1, loyalitySubscription: 1, subtotal: 1, tax: 1, loyalityPoints: 1, loyalityOffer: 1, paymentMethod: 1 }, function(err, appointment) {
        if (appointment) {
            User.findOne({ _id: req.body.userId }, { subscriptionId: 1, subscriptionOtp: 1, subscriptionLoyality: 1, subscriptionRedeemMonth: 1 }, function(err, user) {
                User.getSubscriptionLeftByMonthv4(req.body.userId, appointment.appointmentStartTime, user.subscriptionLoyality, function(reed) {
                    var redeemableLoyality = appointment.tax > 0 ? reed/1.18 : reed;
                    console.log(reed);
                    console.log("reed");
                    var pastRedeemed = 0;
                    var currentMonth = HelperService.getCurrentMonthNo();
                    if (user.subscriptionId) {

                        if (redeemableLoyality > 0) {

                            if (req.body.otp == user.subscriptionOtp || req.body.backend) {

                                var updateObj = {};
                                if (!updateObj.$push) updateObj.$push = {};
                                redeemableLoyality = appointment.subtotal - appointment.loyalityPoints > redeemableLoyality ? redeemableLoyality : appointment.subtotal - appointment.loyalityPoints;
                                var obj = {
                                    loyalityOffer: appointment.loyalityOffer + redeemableLoyality,
                                    loyalityPoints: appointment.loyalityPoints + redeemableLoyality,
                                };
                                var taxMultiplier = appointment.tax > 0 ? 1.18 : 1;
                                var payableAmount = Math.ceil((appointment.subtotal - appointment.loyalityPoints - redeemableLoyality) * taxMultiplier);
                                obj.payableAmount = payableAmount;
                                obj.tax = taxMultiplier == 1 ? 0 : ((payableAmount / taxMultiplier) * 0.18);
                                obj.loyalitySubscription = redeemableLoyality;
                                if (appointment.paymentMethod == 5) {
                                    obj.allPaymentMethods = [{ value: 10, name: 'beu', amount: payableAmount }];
                                }else{
                                    obj.allPaymentMethods = []
                                    obj.paymentMethod = 1
                                }
                                updateObj.$push.subscriptionRedeemHistory = {
                                    createdAt: new Date(),
                                    appointmentStartTime: appointment.appointmentStartTime,
                                    appointmentId: appointment.id,
                                    amount: redeemableLoyality,
                                };
                                Appointment.update({ _id: req.body.appointmentId }, obj, function(er, d) {
                                    User.update({ _id: req.body.userId }, updateObj, function(err, f) {
                                        return callback(false, 'Subscription Used!');
                                    });
                                });

                            } else {
                                return callback(true, 'Invalid Otp!');
                            }
                        } else {
                            return callback(true, 'Subscription Used For This Month!');
                        }
                    } else {
                        return callback(true, 'Subscription Not Present!');
                    }
                });
            });
        } else {
            return callback(true, 'Subscription Already Used on this appointment!');
        }
    });
}
function getSmsUrlForOtp(messageId, message, phoneNumbers, type, otp, retry) {
    return ParlorService.getSMSUrlForOtp(messageId, message, phoneNumbers, type, otp, retry);
}

router.get('/chapters', function(req, res) {
    Chapter.find({}, function(err, chapters) {
        return res.json(CreateObjService.response(false, _.map(chapters, function(c) { return { name: c.name, chapterId: c.id } })));
    });
});

router.get('/chapterTabs', function(req, res) {
    ChapterTab.find({ chapterId: req.query.chapterId }, function(err, chapterTabs) {
        return res.json(CreateObjService.response(false, _.map(chapterTabs, function(c) { return { title: c.title, tabId: c.id } })));
    });
});

router.get('/tabContent', function(req, res) {
    ChapterTab.findOne({ _id: req.query.tabId }, function(err, chapterTab) {
        return res.json(CreateObjService.response(false, { content: chapterTab.content, title: chapterTab.title }));
    });
});

router.post('/createNewCustomer', function(req, res) {
    var user = User.getUserObj(req);
    User.find().count(function(err, count) {
        user.customerId = ++count;
        User.create(user, function(err, newUser) {
            //sendOfferSms(newUser)
            if (err) return res.json(CreateObjService.response(false, 'Form Validation!'));
            else {
                return res.json(CreateObjService.response(false, User.parse(newUser, req.session.parlorId)));
            }
        });
    });
});

router.post('/createNewCustomerCrm', function(req, res) {
    var user = User.getUserObj(req);
    console.log(user)
    User.findOne({ phoneNumber: user.phoneNumber }).exec(function(err, userFound) {
        if (userFound) {
            console.log("userFound");
            var parlors = _.filter(userFound.parlors, function(parlor) {
                return parlor.parlorId == req.session.parlorId;
            });
            if (parlors.length !== 0)
                return res.json(CreateObjService.response(true, 'User already registered for this parlor!'));
            else {
                userFound.parlors.push(user.parlors[0]);
                User.update({phoneNumber : req.body.phoneNumber}, {parlors : userFound.parlors}, function(errm, f){
                    User.findOne({phoneNumber : req.body.phoneNumber}, function(err, newUser){
                        return res.json(CreateObjService.response(false, User.parse(newUser, req.session.parlorId)));
                    })
                });
            }
        } else {
            User.find().count(function(err, count) {
                user.customerId = ++count;
                User.create(user, function(err, newUser) {
                    if (err) return res.json(CreateObjService.response(false, 'Form Validation!'));
                    else {
                        return res.json(CreateObjService.response(false, User.parse(newUser, req.session.parlorId)));
                    }
                });
            });
        }
    });
});

router.post('/sendPayNotification', function(req, res) {
    Appointment.sendPayNotification(req, function() {
        return res.json(CreateObjService.response(false, 'Notification Sent'));
    });
});

router.post('/changeAppointmentTime', function(req, res) {
    console.log("parlorIdddddddd==================",req.session.parlorId)
    // Parlor.findOne({_id:req.session.parlorId},{closingTime :1 , openingTime:1},function(err,parlor){
        // var openingTime = new Date(parlor.openingTime);
        // var closingTime = new Date(parlor.closingTime);
    var date = new Date();
    if (new Date(req.body.startAts).getTime() >= date.getTime()) {
        // if((new Date(req.body.startAts).getTime() >= date.getTime())&& (new Date(req.body.startAts).getTime() >= openingTime.getTime())&&(new Date(req.body.startAts).getTime() < closingTime.getTime())){
        var query = { _id: req.body.appointmentId};
        if(new Date(req.body.startAts).getMonth() != new Date().getMonth())query.loyalitySubscription = 0 ;
        Appointment.update(query, { appointmentStartTime: req.body.startAts }, function(err, d) {
            console.log(err)
            console.log(d)
            return res.json(CreateObjService.response(false, 'Successfully Updated'));
        });
    }else{
            console.log("error")
            return res.json(CreateObjService.response(false, 'Incorrect Time'));
        }
    // })
});


router.get('/customer', function(req, res) {
    User.findOne({ _id: req.query.userId, 'parlors.parlorId': req.session.parlorId }, function(err, user) {

        return res.json(CreateObjService.response(false, { user: User.parseUserObj(user) }));

    });
});


router.post('/uploadCustomer', function(req, res) {
    var exceltojson; //Initialization
    console.log(req.file)
    upload(req, res, function(err) {
        if (err) {
            console.log("yesssssss")
            res.json({ error_code: 1, err_desc: err });
            return;
        }
        /** Multer gives us file info in req.file object */
        if (!req.file) {
            res.json({ error_code: 1, err_desc: "No file passed" });
            return;
        }
        //start convert process
        /** Check the extension of the incoming file and
         *  use the appropriate module
         */
        if (req.file.originalname.split('.')[req.file.originalname.split('.').length - 1] === 'xlsx') {
            exceltojson = xlsxtojson;
        } else {
            exceltojson = xlstojson;
        }
        try {
            exceltojson({
                input: req.file.path, //the same path where we uploaded our file
                output: null, //since we don't need output.json
                lowerCaseHeaders: true
            }, function(err, result) {

                if (err) {
                    return res.json({ error_code: 1, err_desc: err, data: null });
                }
                var users = [];
                _.forEach(result, function(r) {

                    if (r.mobile != "" && r.name != "") {

                        var user = getUserObj(r, req);
                        User.findOne({ phoneNumber: user.phoneNumber }).exec(function(err, userFound) {
                            if (userFound) {
                                console.log(userFound);
                                var parlors = _.filter(userFound.parlors, function(parlor) {
                                    return parlor.parlorId + "" == req.session.parlorId + "";
                                });
                                if (parlors.length !== 0) {
                                    _.forEach(userFound.parlors, function(p) {
                                        if (p.parlorId + "" == req.session.parlorId + "") {
                                            p.advanceCredits = user.parlors[0].advanceCredits;
                                        }
                                    });
                                    userFound.save(function(err) {
                                        // console.log("user saved");
                                        // return res.redirect('/role3/customers');
                                    });
                                } else {
                                    userFound.parlors.push(user.parlors[0]);
                                    // userFound.loyalityPoints = 0;
                                    userFound.save(function(err) {
                                        // console.log("user saved2";
                                        // return res.redirect('/role3/customers');
                                    });
                                }
                            } else {

                                User.find().count(function(err, count) {
                                    user.customerId = ++count;
                                    User.create(user, function(err, newUser) {
                                        console.log(err);
                                        if (err) return res.json(CreateObjService.response(false, 'Form Validation!'));
                                    });
                                });
                            }
                        });
                    }

                });
                res.json({ error_code: 0, err_desc: null, data: result });
            });
        } catch (e) {
            res.json({ error_code: 1, err_desc: "Corupted excel file" });
        }
    });
});

function getUserObj(r, req) {
    var name = r.name.split(" ");
    return {
        firstName: _.capitalize(name[0]),
        lastName: name.length > 0 ? getRemaninig(name) : null,
        emailId: null,
        phoneNumber: r.mobile,
        gender: "F",
        parlors: [{
            parlorId: req.session.parlorId,
            createdBy: req.session.userId,
            noOfAppointments: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            // advanceCredits: parseInt(r.amount),
            advanceCredits: 0,
            oldAdvanceCredits: 0
        }],
        streetLine1: null,
        streetLine2: null,
        city: null,
        loyalityPoints: 0
    };
}

function getRemaninig(name) {
    var n = "";
    _.forEach(name, function(b, key) {
        if (key != 0 && key != 1) n += " ";
        if (key != 0) n += _.capitalize(b);
    });
    return n;
}


router.post('/customAdditionsReport', function(req, res){
    // Appointment
    console.log(req.body)
    Appointment.find({appointmentStartTime : {$gt : new Date(req.body.startDate), $lt : new Date(req.body.endDate)} ,parlorId : req.session.parlorId, "services.newAdditions" : {$gt : 0}, status : 3}).sort({appointmentStartTime : -1}).exec( function(err, appointments){
        let data = _.map(appointments, function(a){
            let totalAdditions = 0;
            _.forEach(a.services, function(s){
                if(s.newAdditions > 0)totalAdditions += (s.newAdditions * s.quantity)
            })
            return{
                name : a.client.name,
                appointmentId : a.id,
                phoneNumber : a.client.phoneNumber,
                appointmentDate : a.appointmentStartTime,
                services : _.map(a.services, function(s){ return {name : s.name, addtions : s.newAdditions, quantity : s.quantity}}),
                totalAdditions : totalAdditions,
                payableAmount : a.payableAmount,
            }
        })
        console.log(data)
        res.json(data)
    })
});

router.get('/getPriceRangeForSubscriptionPrice', function(req, res){
    return res.json(CreateObjService.response(false, ConstantService.getPriceRangeForSubscriptionPrice()));
});

router.post('/uploadService', function(req, res) {
    var exceltojson; //Initialization
    upload(req, res, function(err) {
        if (err) {
            res.json({ error_code: 1, err_desc: err });
            return;
        }
        /** Multer gives us file info in req.file object */
        if (!req.file) {
            res.json({ error_code: 1, err_desc: "No file passed" });
            return;
        }
        //start convert process
        /** Check the extension of the incoming file and
         *  use the appropriate module
         */
        if (req.file.originalname.split('.')[req.file.originalname.split('.').length - 1] === 'xlsx') {
            exceltojson = xlsxtojson;
        } else {
            exceltojson = xlstojson;
        }
        try {
            exceltojson({
                input: req.file.path, //the same path where we uploaded our file
                output: null, //since we don't need output.json
                lowerCaseHeaders: true,
            }, function(err, result) {
                result = removeTrailingSpaces(result);
                if (err) {
                    return res.json({ error_code: 1, err_desc: err, data: result });
                }
                var supercategory = _.uniq(_.map(result, 'category'));
                var supercategories = [];
                _.forEach(supercategory, function(s) {
                    if (s != "") supercategories.push({ "name": s });
                });
                SuperCategory.create(supercategories, function(err, superCat) {
                    var categories = [];
                    _.forEach(superCat, function(supc) {
                        var newData = _.filter(result, (function(r) {
                            return r.category == supc.name;
                        }));
                        var category = _.uniq(_.map(newData, 'sub'));
                        _.forEach(category, function(s) {
                            categories.push({ "name": s, "superCategory": supc.name, "sort": 1 });
                        });
                    });
                    ServiceCategory.create(categories, function(err, caties) {
                        var priceId = 1;
                        var services = [],
                            parlorServices = [],
                            previousName = "",
                            previousGender = "",
                            service = {},
                            parlorService = {};
                        _.forEach(result, function(r, key) {
                            if (r.name != "") {
                                if (previousName != (r.name + r.gender)) {
                                    if (key != 0) {
                                        services.push(JSON.parse(JSON.stringify(service)));
                                        parlorServices.push(JSON.parse(JSON.stringify(parlorService)));
                                    }
                                    service.name = r.name;
                                    service.serviceCode = r.serviceCode;
                                    service.prices = [];
                                    service.prices.push({
                                        priceId: priceId,
                                        additions: [],
                                        name: r.stylist,
                                        createdAt: new Date(),
                                    });
                                    parlorService = JSON.parse(JSON.stringify(service));
                                    parlorService.prices[0].commission = 0;
                                    parlorService.prices[0].commissionDividedInTo = 0;
                                    parlorService.prices[0].price = calculateNewPriceForStylist(r.price, r.percentage);
                                    parlorService.prices[0].additions = getAdditionValues(r, r.price);
                                    parlorService.prices[0].tax = r.tax;
                                    parlorService.prices[0].estimatedTime = r.duration;
                                    parlorService.prices[0].percentageDifference = r.percentage;
                                    parlorService.prices[0].employees = [];
                                } else {
                                    service.prices.push({
                                        priceId: priceId,
                                        name: r.stylist,
                                        createdAt: new Date(),
                                    });
                                    parlorService.prices.push({
                                        priceId: priceId,
                                        name: r.stylist,
                                        commission: 0,
                                        commissionDividedInTo: 0,
                                        price: calculateNewPriceForStylist(r.price, r.percentage),
                                        tax: r.tax,
                                        percentageDifference: r.percentage,
                                        estimatedTime: r.duration,
                                        employees: [],
                                        additions: getAdditionValues(r, r.price, r.percentage),
                                        createdAt: new Date(),
                                    });
                                }
                                _.forEach(caties, function(cat) {
                                    if (cat.name == r.sub) {
                                        service.categoryId = cat.id;
                                        service.gender = r.gender == "W" ? "F" : "M";
                                        service.subTitle = r.subtitle;
                                        parlorService.categoryId = cat.id;
                                        parlorService.gender = r.gender == "W" ? "F" : "M";
                                        parlorService.subTitle = r.subtitle;
                                        parlorService.basePrice = r.price;
                                    };
                                });
                                previousName = r.name + r.gender;
                                priceId++;
                            }

                        });
                        services.push(JSON.parse(JSON.stringify(service)));
                        parlorServices.push(JSON.parse(JSON.stringify(parlorService)));
                        Service.create(services, function(err, newServices) {
                            newServices.forEach(function(s, key) {
                                parlorServices[key].serviceId = s.id;
                            });
                            Parlor.update({ name: "Test" }, { services: parlorServices }, function(err, data) {
                                res.json({ error_code: 0, err_desc: err, data: parlorServices });
                            });
                        });
                    });
                });
            });
        } catch (e) {
            res.json({ error_code: 1, err_desc: "Corupted excel file" });
        }
    });
});

function nearest(n, v) {
    n = n / v;
    n = Math.round(n) * v;
    return n;
}

function getAdditionValues(r, price) {
    var data = [];
    if (r.additionType == 'thickness') {
        data.push({
            name: 'Length',
            types: [
                { name: 'Normal - Short', percentageDifference: r.add1, additions: calculateNewPrice(price, r.add1) },
                { name: 'Normal - Medium', percentageDifference: r.add2, additions: calculateNewPrice(price, r.add2) },
                { name: 'Normal - Long', percentageDifference: r.add3, additions: calculateNewPrice(price, r.add3) },
                {
                    name: 'Normal - Extra Long',
                    percentageDifference: r.add4,
                    additions: calculateNewPrice(price, r.add4)
                },
                { name: 'Normal - XXL', percentageDifference: r.add5, additions: calculateNewPrice(price, r.add5) },
                { name: 'Thick - Short', percentageDifference: r.add6, additions: calculateNewPrice(price, r.add6) },
                { name: 'Thick - Medium', percentageDifference: r.add7, additions: calculateNewPrice(price, r.add7) },
                { name: 'Thick - Long', percentageDifference: r.add8, additions: calculateNewPrice(price, r.add8) },
                { name: 'Thick - Extra Long', percentageDifference: r.add9, additions: calculateNewPrice(price, r.add9) },
                { name: 'Thick - XXL', percentageDifference: r.add10, additions: calculateNewPrice(price, r.add10) },
            ]
        });
    } else if (r.additionType == 'shampoo lenth') {
        data.push({
            name: 'Shampoo Length',
            types: [{ name: 'Normal', percentageDifference: 0, additions: 0 }, {
                name: 'XL & XXL',
                percentageDifference: r.add1,
                additions: calculateNewPrice(price, r.add1)
            }]
        });
    } else if (r.additionType == 'upstyling') {
        data.push({
            name: 'Upstyling',
            types: [{ name: 'Basic', percentageDifference: 0, additions: 0 }, {
                name: 'Semi',
                percentageDifference: r.add2,
                additions: calculateNewPrice(price, r.add2)
            }, { name: 'Advance', percentageDifference: r.add3, additions: calculateNewPrice(price, r.add3) }]
        });
    } else if (r.additionType == 'color length') {
        data.push({
            name: 'Color Length',
            types: [{ name: 'Upto 1 Inch', percentageDifference: 0, additions: 0 }, {
                name: 'Above 1 Inch',
                percentageDifference: r.add2,
                additions: calculateNewPrice(price, r.add2)
            }]
        });
    }
    return data;
}

function calculateNewPriceForStylist(price, percentage) {
    return nearest(parseInt(parseInt(price) + (price * percentage) / 100), 50);
}

function calculateNewPrice(price, percentage) {
    return nearest(parseInt((price * percentage) / 100), 50);
}

function removeTrailingSpaces(result) {
    var name, gender, subTitle, category, sub, duration, price, tax, additiontype;
    var data = _.map(result, function(r) {
        var newGender = r.gender.replace(/^[ ]+|[ ]+$/g, '');
        var newName = r.name.replace(/^[ ]+|[ ]+$/g, '');
        var newSubTitle = r.subtitle.replace(/^[ ]+|[ ]+$/g, '');
        var newCategory = r.category.replace(/^[ ]+|[ ]+$/g, '');
        var newSub = r.sub.replace(/^[ ]+|[ ]+$/g, '');
        var newDuration = r.duration.replace(/^[ ]+|[ ]+$/g, '');
        var newPrice = r.price.replace(/^[ ]+|[ ]+$/g, '');
        var newTax = r.tax.replace(/^[ ]+|[ ]+$/g, '').substr(0, r.tax.indexOf('%'));
        var newAdditionType = r.additiontype.replace(/^[ ]+|[ ]+$/g, '').toLowerCase();

        if (newGender != "") gender = newGender;
        if (newGender != "") name = newName;
        if (newGender != "") sub = newSubTitle;
        if (newGender != "") category = newCategory;
        if (newGender != "") sub = newSub;
        if (newGender != "") duration = newDuration;
        if (newGender != "") price = newPrice;
        if (newGender != "") tax = newTax;
        if (newGender != "") additiontype = newAdditionType;
        return {
            gender: newGender == "" ? gender : newGender,
            serviceCode: r.sno,
            name: newName == "" ? name : newName,
            subtitle: newSubTitle == "" ? subTitle : newSubTitle,
            category: newCategory == "" ? category : newCategory,
            sub: newSub == "" ? sub : newSub,
            duration: newDuration == "" ? duration : newDuration,
            price: newPrice == "" ? price : newPrice,
            tax: newTax == "" ? tax : newTax,
            stylist: r.stylist.replace(/^[ ]+|[ ]+$/g, ''),
            percentage: parseFloat(r.percentage) / 10 ? parseFloat(r.percentage) / 10 : 0,
            additionType: newGender == "" ? additiontype : newAdditionType,
            add1: parseFloat(r.add1) / 10 ? parseFloat(r.add1) / 10 : 0,
            add2: parseFloat(r.add2) / 10 ? parseFloat(r.add2) / 10 : 0,
            add3: parseFloat(r.add3) / 10 ? parseFloat(r.add3) / 10 : 0,
            add4: parseFloat(r.add4) / 10 ? parseFloat(r.add4) / 10 : 0,
            add5: parseFloat(r.add5) / 10 ? parseFloat(r.add5) / 10 : 0,
            add6: parseFloat(r.add6) / 10 ? parseFloat(r.add6) / 10 : 0,
            add7: parseFloat(r.add7) / 10 ? parseFloat(r.add7) / 10 : 0,
            add8: parseFloat(r.add8) / 10 ? parseFloat(r.add8) / 10 : 0,
            add9: parseFloat(r.add9) / 10 ? parseFloat(r.add9) / 10 : 0,
            add10: parseFloat(r.add10) / 10 ? parseFloat(r.add10) / 10 : 0,
        };

    });
    data = _.filter(data, function(d) {
        return !_.isEmpty(d);
    });
    return data;
}

function getCorrectIndex(name) {
    var i = name.indexOf('(');
    if (i != -1) return i;
    i = name.indexOf('[');
    if (i != -1) return i;
    return name.length;
}

router.post('/sendDailyReportEmail', function(req, res) {
    var nodemailer = require('nodemailer');
    Admin.find({ role: { $in: [2, 7] } }, { _id: 1 }).exec(function(err, admin) {
        for (var p = 0; p < admin.length; p++) {
            Admin.findOne({ _id: admin[p]._id }, {
                phoneNumber: 1,
                emailId: 1,
                parlorId: 1,
                parlorIds: 1
            }).exec(function(err, em) {
                var _id = "";
                // if(em.parlorIds.length>0) {
                //     _id = em.parlorIds[0];
                // }else{
                _id = em.parlorId;
                // }
                // var num = em.phoneNumber;
                var num = ["8010178215", "8826345311"];
                var emailId = "";
                if (em.emailId) {
                    emailId = ["shailendra@beusalons.com", "nikita@beusalons.com"];
                }
                if (_id == req.session.parlorId) {
                    var date = new Date();
                    var query = { _id: "587088445c63a33c0af62727" };
                    Appointment.dailyReport(query, date, function(err, data) {
                        var result = data.reports;
                        var date2 = '<h4>' + new Date().toDateString() + '</h4>';
                        var table1 = "";
                        var appoint = "";
                        appoint += '<h4>Appointments:' + data.totalAppointments + '</h4>';
                        for (var i = 0; i < result.length; i++) {
                            var parName = '';
                            parName += '<h4>' + result[i].parlorName + ' | ' + result[i].parlorAddress + '</h4>';
                            table1 += '<tr><td>' + result[i].unit + '</td><td>' + result[i].totalRevenue + '</td><td>' + result[i].totalTax + '</td></tr>';
                        }
                        var records = data.payment;
                        var table2 = "";
                        for (var j = 0; j < records.length; j++) {
                            table2 += '<tr><td>' + records[j].mode + '</td><td>' + records[j].amount + '</td></tr>';
                        }
                        var records1 = data.customers;
                        var table3 = "";
                        for (var n = 0; n < records1.length; n++) {
                            table3 += '<tr><td>' + records1[n].type + '</td><td>' + records1[n].number + '</td><td>' + records1[n].services + '</td><td>' + records1[n].amount + '</td></tr>';
                        }
                        var records2 = data.redemption;
                        var table4 = "";
                        for (var k = 0; k < records2.length; k++) {
                            table4 += '<tr><td>' + records2[k].mode + '</td><td>' + records2[k].amount + '</td></tr>';
                        }
                        var records3 = data.employee;
                        var table5 = "";
                        for (var l = 0; l < records3.length; l++) {
                            table5 += '<tr><td>' + records3[l].name + '</td><td>' + records3[l].totalRevenueEmp + '</td></tr>';
                        }
                        var records4 = data.status;
                        var table6 = "";
                        for (var m = 0; m < records4.length; m++) {
                            table6 += '<tr><td>' + records4[m].type + '</td><td>' + records4[m].number + '</td></tr>';
                        }

                        function sendEmail() {
                            var transporter = nodemailer.createTransport('smtps://reports@beusalons.com:beusalons@123@smtp.gmail.com');
                            var mailOptions = {
                                from: 'reports@beusalons.com', // sender address
                                to: [emailId], // list of receivers
                                html: '<html><head><style>table, th, td{border: 1px solid gray; border-collapse: collapse;text-align:center;}</style></head><body><div style="background-color:#DFDFDF;height:20%;"><div style="float:left;width:200px;margin-top: 2%;margin-left:2%;margin-bottom: 2%;zoom:1.2;"><img src="https://www.monsoonsalon.com/emailler/images/beu-logo.png" width="150" alt="Beu salons"/></div><div style="float:right;width:200px;margin-top: 2%;margin-left:2%;margin-bottom: 2%;"><address><p style="line-height:5px;">' + parName + ' </p><p style="line-height:5px;">' + date2 + ' </p><p style="line-height:5px;">' + appoint + ' </p></address></div></div><div style="margin-top:15px"><table style="width:100%"> <tr><th style="background:#DFDFDF;height:40px;">Total Summary</th><th style="background:#DFDFDF;height:40px;">Amount</th> </tr><tr><td>Total Collection Today</td><td>' + Math.round(data.totalCollectionToday) + '</td></tr><tr><td>Total Revenue</td><td>' + Math.round(data.totalRevenueToday) + '</td></tr><tr><td>Total Sale</td><td>' + Math.round(data.totalSalesToday) + '</td></tr><tr><td>Total Advance Added</td><td>' + data.totalAdvanceAdded + '</td></tr></table></div><div style="margin-top:15px"><h3 style="text-align:center;color:#696969">Department Report</h3><table style="width:100%"> <tr><th style="background:#DFDFDF;height:40px;">Business Unit</th><th style="background:#DFDFDF;height:40px;">Total Revenue</th> <th style="background:#DFDFDF;height:40px;">Total Tax</th> </tr>' + table1 + '</table></div><div style="margin-top:15px"><h3 style="text-align:center;color:#696969">Collection</h3><table style="width:100%"> <tr><th style="background:#DFDFDF;height:40px;">Mode</th><th style="background:#DFDFDF;height:40px;">Amount</th> </tr>' + table2 + '</table></div><div style="margin-top:15px"><h3 style="text-align:center;color:#696969">Redemption Distribution</h3><table style="width:100%"> <tr><th style="background:#DFDFDF;height:40px;">Redemption Type</th><th style="background:#DFDFDF;height:40px;">Total Revenue</th> </tr>' + table4 + '</table></div><div style="margin-top:15px"><h3 style="text-align:center;color:#696969">Employee Distribution<h3><table style="width:100%"> <tr><th style="background:#DFDFDF;height:40px;">Therapist Name</th><th style="background:#DFDFDF;height:40px;">Total Revenue</th> </tr>' + table5 + '</table></div><div style="margin-top:15px"><h3 style="text-align:center;color:#696969">Customer Detail</h3><table style="width:100%"> <tr><th style="background:#DFDFDF;height:40px;">Type of Customer</th><th style="background:#DFDFDF;height:40px;">Number</th><th style="background:#DFDFDF;height:40px;">Services</th><th style="background:#DFDFDF;height:40px;">Amount</th> </tr>' + table3 + '</table></div><div style="margin-top:15px"><h3 style="text-align:center;color:#696969">Appointment Status</h3><table style="width:100%"> <tr><th style="background:#DFDFDF;height:40px;">Cancelled</th><th style="background:#DFDFDF;height:40px;">Completed</th> </tr>' + table6 + '</table></div></body></html>',
                                subject: 'Daily Summary' // Subject line
                            };
                            // transporter.sendMail(mailOptions, function (error, info) {
                            //    if (error)
                            //        console.log(error);
                            //     else
                            //         // console.log('Message sent: ' + info.response);
                            //     return res.json(CreateObjService.response(false, "Mail sent successfully!"));
                            // });
                        }

                        sendEmail();
                    });
                }
            });
        }
    });
})

router.post('/report/daily', function(req, res) {
    var date = req.body.date
    var query = {};
    console.log(req.body.parlorId )
    /*console.log(req.session.parlorId)
    if (typeof req.session.parlorId != 'string') {
        Admin.findOne({ _id: req.session.userId }, function(err, id) {
            console.log(query)
            query = { _id: req.body.parlorId }
            console.log(query)

            Appointment.dailyReport(query, date, function(err, data) {
                return res.json(CreateObjService.response(false, data));
            })
        })
    } else if (req.session.parlorId) {*/
        query = { _id: req.body.parlorId }
        Appointment.dailyReport(query, date, function(err, data) {
            return res.json(CreateObjService.response(false, data));
        })
    // }

});



router.post('/subscriptionSoldBySalon', function(req, res) {

    if (typeof req.session.parlorId != 'string') {
        Parlor.find({active: true}, {name:1, address2:1, parlorType:1} , function(err , parlors){
            var finalData =[]
            async.each(parlors , function(par , call){
                SubscriptionSale.subscriptionSoldBySalon(par.id , function(err , subscriptions){
                    if(!err && subscriptions.length>0){
                        _.forEach(subscriptions, function(subs){
                            subs.parlorName = par.name +' - '+ par.address2,
                            subs.parlorId = par._id
                        });
                        finalData.push(subscriptions);
                        call();
                    }
                    else
                        call();
                })  
            }, function all(){
                 return res.json(CreateObjService.response(false , finalData))
            })
        })
    } else if (req.session.parlorId) {
            
            SubscriptionSale.subscriptionSoldBySalon(req.session.parlorId , function(err , subscriptions){
                if(!err && subscriptions.length>0)
                    return res.json(CreateObjService.response(false , subscriptions))
                else
                    return res.json(CreateObjService.response(true , 'No Subscriptions Sold Yet!'))
            })        
            
    }

});


router.get('/discountOnPurchase', function(req, res) {

    DisountOnPurchase.find({ parlorId: req.session.parlorId }, function(err, data) {

        if (err) {
            console.log(err)
            res.send(CreateObjService.response(true, err))
        } else {
            res.send(CreateObjService.response(false, data))
        }
    })



})

router.post('/report/revenue', function(req, res) {
    var query = {};
    if (typeof req.session.parlorId != 'string') {
        Admin.findOne({ _id: req.session.userId }, function(err, id) {
            // console.log(id.parlorIds[0])
            query = { _id: req.body.parlorId }
            Appointment.revenueReport(query, req, function(err, data) {
                return res.json(CreateObjService.response(false, data));
            })
        })
    } else if (req.session.parlorId) {
        query = { _id: req.session.parlorId }
        Appointment.revenueReport(query, req, function(err, data) {
            return res.json(CreateObjService.response(false, data));
        })
    }
});

router.post('/report/employee', function(req, res) {
    var query = {};
    /*if (typeof req.session.parlorId != 'string') {
        Admin.findOne({ _id: req.session.userId }, function(err, id) {
            query = { _id: req.body.parlorId }
            Appointment.employeeReport(query, req, function(err, data) {
                return res.json(CreateObjService.response(false, data));
            })
        })
    } else if (req.session.parlorId) {*/
        query = { _id: req.body.parlorId }
        Appointment.employeeReport(query, req, function(err, data) {
            return res.json(CreateObjService.response(false, data));
        })
    // }
});

router.post('/report/service', function(req, res) {
    var query = {};
    if (typeof req.session.parlorId != 'string') {
        Admin.findOne({ _id: req.session.userId }, function(err, id) {
            query = { _id: id.parlorIds[0] }
            Parlor.serviceReport(query, function(err, data) {
                return res.json(CreateObjService.response(false, data));
            })
        })
    } else if (req.session.parlorId) {
        query = { _id: req.session.parlorId }
        Parlor.serviceReport(query, function(err, data) {
            return res.json(CreateObjService.response(false, data));
        })
    }
});

router.post('/report/collection', function(req, res) {
    var query = {};
    /*if (typeof req.session.parlorId != 'string') {
        Admin.findOne({ _id: req.session.userId }, function(err, id) {
            query = { _id: req.body.parlorId }
            Appointment.collectionReport(query, req, function(err, data) {
                return res.json(CreateObjService.response(false, data));
            })
        })
    } else if (req.session.parlorId) {*/
        query = { _id: req.body.parlorId }
        Appointment.collectionReport(query, req, function(err, data) {
            return res.json(CreateObjService.response(false, data));
        })
    // }
});


router.post('/couponCodeListing', function(req, res) {
    var d = [];
    var c = req.body.couponCode;
    if (c) {
        Offer.findOne({ code: c }).exec(function(err, code) {
            if (code) {
                var query2 = { couponCode: c };
                Appointment.find(query2).exec(function(err, app) {
                    console.log("appointment",app)
                    if (app.length) {
                        var data = {
                            parlorName: app[0].parlorName,
                            parlorAddress: app[0].parlorAddress,
                            couponCode: app[0].couponCode,
                            amount: app[0].payableAmount,
                            clientName: app[0].client.name,
                            clientNumber: app[0].client.phoneNumber,
                            services: [],
                            appointmentStartTime: (app[0].appointmentStartTime).toDateString()
                        };
                        if(app[0].status==1)data.message="Appointment is booked"
                        else if(app[0].status==2)data.message="Appointment is Cancelled"
                        else if(app[0].status==3)data.message="Appointment is Completed"

                        _.forEach(app[0].services, function(ser) {
                            data.services.push({ service: ser.name })
                        });
                        return res.json(CreateObjService.response(false, data));
                    } else{
                        if(code.active)
                        return res.json(CreateObjService.response(true, "Coupon exists but not used. Use the code to book an appointment."))
                        else{
                            Offer.update({ code: req.body.couponCode }, { active: true }, function(err, updated) {
                                if (!err)
                                     return res.json(CreateObjService.response(true, "Coupon exists but not used. Use the code to book an appointment."))
                                else
                                    res.json(true,'Contact Support')
                            })
                            
                        }
                    }
                });
            } else{
                return res.json(CreateObjService.response(true, "Coupon does not exist!"));
            }
                
        })
    } else {
        var startDate = req.body.startDate;
        var endDate = req.body.endDate;
        var query = {};
        if (req.session.parlorId) {
            query = {
                parlorId: req.session.parlorId,
                status: 3,
                couponCode: { $regex: "BEU" },
                appointmentStartTime: {
                    $gte: HelperService.getDayStart(startDate),
                    $lt: HelperService.getDayEnd(endDate)
                }
            };
        } else if (req.body.parlorId) {
            var parlorIds = req.body.parlorId ? req.body.parlorId : [];
            if (parlorIds.length == 0) query = {
                parlorId: { $ne: null },
                couponCode: { $regex: "BEU" },
                appointmentStartTime: {
                    $gte: HelperService.getDayStart(startDate),
                    $lt: HelperService.getDayEnd(endDate)
                }
            };
            else query = {
                parlorId: { $in: parlorIds },
                status: 3,
                couponCode: { $regex: "BEU" },
                appointmentStartTime: {
                    $gte: HelperService.getDayStart(startDate),
                    $lt: HelperService.getDayEnd(endDate)
                }
            };
        }
        var async = require('async');
        Appointment.find(query).exec(function(err, appointments) {
            async.parallel([
                function(done) {
                    async.each(appointments, function(appointment, callback) {
                        Appointment.couponCodeListing(appointment, function(err, data) {
                            d.push(data);
                            callback();
                        })
                    }, done);
                }
            ], function allTaskCompleted() {
                console.log('done');
                console.log(d)
                if (d) return res.json(CreateObjService.response(false, d));
                else return res.json(CreateObjService.response(true, "Invalid Coupon"))
            });
        });
    }
});


router.post('/activateCoupon', function(req, res) {
    Offer.update({ code: req.body.couponCode }, { active: true }, function(err, updated) {
        if (!err)
            res.json("Activated")
        else
            res.json('there is some error')
    })
})

//weekly report for parlors alike admin, from role1
router.post('/report/weeklyReport', function(req, res) {
    var month = req.body.month;
    var d = [];
    var query = { _id: req.session.userId };
    Admin.findOne(query).exec(function(err, empl) {
        var async = require('async');
        Parlor.find({ _id: empl.parlorIds }).exec(function(err, parlors) {
            async.series([
                function(done) {
                    async.each(parlors, function(parlor, callback) {
                        Appointment.weeklyReport(parlor, month, function(err, data) {
                            d.push(data);
                            console.log("getting data success for " + parlor.name + " for month" + month);
                            callback();
                        })
                    }, done);
                }
            ], function allTaskCompleted() {
                console.log('done');
                return res.json(d);
            });
        });
    });
});

router.post('/incentiveModel', function(req, res) {
    Incentive.findOne({ parlorId: req.session.parlorId }).exec(function(err, incentives) {

        var incentive = [];
        _.forEach(incentives.categories, function(inc) {

            incentive.push({
                name: inc.categoryName,
                incentive: inc.incentives,
                categoryId: inc.categoryId
            });
        });

        res.json(incentive)
    });
});

//employeeIncentive report for parlors alike admin, from role1
router.post('/report/empIncentiveReport', function(req, res) {

    var d = [];
    var startDate = req.body.startDate ? new Date(req.body.startDate) : new Date(2017, 0, 1, 23, 59, 59);
    var endDate = req.body.endDate ? new Date(req.body.endDate) : new Date(2017, 1, 22, 23, 59, 59);
    var startDate = HelperService.getCurrentMonthStart(startDate)
    var endDate = HelperService.getCustomMonthEndDate(endDate.getFullYear(), endDate.getMonth()+1)
    var query = { _id: req.session.userId };
    
    Admin.findOne(query).exec(function(err, empl) {
        var async = require('async');
        Admin.find({ parlorId: empl.parlorIds}).exec(function(err, employees) {
            async.series([
                function(done) {
                    async.each(employees, function(employee, callback) {
                        console.log(employee.firstName);
                        Appointment.employeeIncentiveReport(employee, startDate, endDate, function(err, data) {
                            d.push(data);
                            console.log("getting data success for " + employee.firstName);
                            callback();
                        })
                    }, done);
                }
            ], function allTaskCompleted() {
                console.log('done');
                return res.json(d);
            });
        });
    });
});

//employeePerformance report for parlors alike, from role1
router.post('/report/empSegmentReport', function(req, res) {
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var query = { _id: req.session.userId };
    var d = [];
    Admin.findOne(query).exec(function(err, empl) {
        console.log(empl)
        var async = require('async');
        Admin.find({ parlorId: empl.parlorIds, active: true }).exec(function(err, employees) {
            async.series([
                function(done) {
                    async.each(employees, function(employee, callback) {
                        console.log(employee.firstName);
                        Appointment.employeeSegmentReport(employee, startDate, endDate, function(err, data) {
                            d.push(data);
                            console.log("getting data success for " + employee.firstName);
                            callback();
                        })
                    }, done);
                }
            ], function allTaskCompleted() {
                console.log('done');
                return res.json(d);
            });
        });
    })
});


//employeeSegment report for parlors alike admin, from role1
router.post('/report/empPerformanceReport', function(req, res) {
    var query = { _id: req.session.userId };
    var d = [];
    var month = req.body.month;
    Admin.findOne(query).exec(function(err, empl) {
        var async = require('async');
        Admin.find({ parlorId: empl.parlorIds, active: true }).exec(function(err, employees) {
            async.series([
                function(done) {
                    async.each(employees, function(employee, callback) {
                        console.log(employee.firstName);
                        Appointment.employeePerformanceReport(employee, month, function(err, data) {
                            d.push(data);
                            console.log("getting data success for " + employee.firstName);
                            callback();
                        })
                    }, done);
                }
            ], function allTaskCompleted() {
                console.log('done');
                return res.json(d);
            });
        });
    })
});


router.get('/socket', function(req, res, next) {
    var io = req.io;
    console.log(next);
    io.sockets.emit('orderReceived', {
        message: "It looks like you have a new order !!"
    });
    io.sockets.on('connection', function(socket) {
        console.log("connection made");

    });
})


//service report for parlors alike admin, from role1
router.post('/report/serviceReport', function(req, res) {
    var startDate = req.body.startDate ? req.body.startDate : new Date(2017, 0, 1, 23, 59, 59);
    var endDate = req.body.endDate ? req.body.endDate : new Date(2017, 0, 22, 23, 59, 59);
    var query = { _id: req.session.userId };
    Admin.findOne(query).exec(function(err, empl) {
        SuperCategory.find({}, function(err, superCat) {
            ServiceCategory.find({}).sort({ sort: 1 }).exec(function(err, categories) {
                Service.find({}, function(err, services) {
                    Parlor.find({ _id: empl.parlorIds }, { _id: 1, name: 1 }, function(err, parlors) {
                        console.log(parlors)
                        Appointment.serviceReportForAdmin(services, parlors, startDate, endDate, function(err, data) {
                            var objects = _.map(categories, function(ca) {
                                var categoriesObj = _.filter(data, function(d) {
                                    return d.categoryId + "" == ca.id + ""
                                });
                                return {
                                    category: ca.name,
                                    superCategory: ca.superCategory,
                                    categoryId: ca.id,
                                    values: categoriesObj,
                                    count: _.sum(_.map(categoriesObj, function(c) {
                                        return c.count
                                    })),
                                    revenue: _.sum(_.map(categoriesObj, function(c) {
                                        return c.revenue
                                    })),
                                    parlors: _.map(parlors, function(p) {
                                        return {
                                            parlorId: p.id,
                                            count: calculateByParlor(categoriesObj, p.id),
                                            revenue: calculateByParlorRevenue(categoriesObj, p.id)
                                        };
                                    })
                                };
                            });
                            var reqData = _.chain(objects)
                                .groupBy('superCategory')
                                .map(function(val, key) {
                                    return {
                                        name: key,
                                        values: val,
                                        parlors: _.map(parlors, function(p) {
                                            return {
                                                parlorId: p.id,
                                                count: calculateByParlorDept(val, p.id),
                                                revenue: calculateByParlorRevenueDept(val, p.id),
                                            };
                                        }),
                                        count: _.sum(_.map(val, function(v) {
                                            return v.count
                                        })),
                                        revenue: _.sum(_.map(val, function(v) {
                                            return v.revenue
                                        })),
                                    };
                                })
                                .value();
                            return res.json(reqData);
                        });
                    });
                });
            });
        });
    });
});


function calculateByParlor(services, parlorId) {
    var count = 0;
    _.forEach(services, function(s) {
        var p = _.filter(s.parlors, function(sp) {
            return sp.parlorId + "" == parlorId + ""
        })[0];
        if (p) count += p.count;
    });
    return count;
};

function calculateByParlorDept(services, parlorId) {
    var count = 0;
    _.forEach(services, function(s) {
        var p = _.filter(s.parlors, function(sp) {
            return sp.parlorId + "" == parlorId + ""
        })[0];
        if (p) count += p.count;
    });
    return count;
};

function calculateByParlorRevenueDept(services, parlorId) {
    var count = 0;
    _.forEach(services, function(s) {
        var p = _.filter(s.parlors, function(sp) {
            return sp.parlorId + "" == parlorId + ""
        })[0];
        if (p) count += p.revenue;
    });
    return count;
};

function calculateByParlorRevenue(services, parlorId) {
    var count = 0;
    _.forEach(services, function(s) {
        var p = _.filter(s.parlors, function(sp) {
            return sp.parlorId + "" == parlorId + ""
        })[0];
        if (p) count += p.revenue;
    });
    return count;
};


router.post('/report/empAttendance', function(req, res) {
    
    if(req.body.eId){
        var sdate = HelperService.getDayStart(req.body.startDate);
        var edate = HelperService.getDayEnd(req.body.endDate);
        var eid = req.body.eId;
        var query = { "employeeId": { $regex: eid }, "time": { $gte: sdate, $lt: edate } }
        attendanceFunction(query, function(d){
             res.json(CreateObjService.response(d.status, d.data));
        })
    }else{
        var sdate = HelperService.getCustomMonthStartDate(req.body.year , req.body.month)
        var edate = HelperService.getMonthEndDate(req.body.year , req.body.month)

        var finalData = [];
        Admin.find({parlorId : req.session.parlorId}, function(err, employees){
            async.each(employees , function(emp , c){
                var query = { "employeeId": { $regex: emp._id.toString() }, "time": { $gte: sdate, $lt: edate } }
                    attendanceFunction(query, function(d){
                        if(d.data != null){

                            finalData.push({employeeId : emp._id , name : emp.firstName, attendace : d.data})
                        }
                        c() 
                    })
            }, function all(){
                console.log(finalData.length)
                res.json(CreateObjService.response(false, finalData));
            })
        })
    }


});


function attendanceFunction(query , call){
    var att = [];
    var data = { shifts: [] };
    var sendData ={};
    var final = [];
    var shifts = [];
     Attendance.aggregate([{ $match: query }, { $sort: { time: 1 } }, {
        $group: {
            _id: {
                $dateToString: {
                    format: "%Y-%m-%d",
                    date: "$time"
                }
            },
            data: { $push: { time: "$time", centerId: "$centerId" } }
        }
    }]).exec(function(err, result) {
        if (result.length > 0) {
            _.map(result, function(d) {
                var obj = { "from": '', "to": '', "centerName": '' };
                for (var i = 0; i < d.data.length; i++) {
                    if (i % 2 == 0) {
                        obj.from = d.data[i].time;
                        obj.centerName = d.data[i].centerId
                        if (d.data.length > 1) {
                        } else {
                            att.push(obj);
                        }
                    } else if (i % 2 == 1) {
                        obj.to = d.data[i].time;
                        att.push(obj);
                        obj = { "from": '', "to": '', "centerName": '' };
                    }
                }
                final.push({ date: d._id, "shifts": att })
                att = []
            });
            var finalData = _.sortBy(final, function(l) {
                return l.date
            })
            sendData.message =false, 
            sendData.data = finalData;
            call(sendData)
        } else {
            sendData.message =true, 
            sendData.data = finalData;
            call(sendData)
        }

    });
}

// router.post('/report/empAttendance', function(req, res) {

//     var sdate = HelperService.getDayStart(req.body.startDate);
//     var edate = HelperService.getDayEnd(req.body.endDate);

//     var att = [];
//     var data = { shifts: [] };

//     var final = [];
//     var shifts = [];
//     var eid = req.body.eId;
//     // var  query= {"centerId":"kabi122018","employeeId":"588a10ebf8169604955dce95","time":{$gte:sdate,$lt:edate}}
//     var query = { "employeeId": { $regex: eid }, "time": { $gte: sdate, $lt: edate } }

//         // Attendance.find(query).sort({time:1}).exec(function (err,result) {
//         // { employeeId : "1111111111" }
//     Attendance.aggregate([{ $match: query }, { $sort: { time: 1 } }, {
//         $group: {
//             _id: {
//                 $dateToString: {
//                     format: "%Y-%m-%d",
//                     date: "$time"
//                 }
//             },
//             data: { $push: { time: "$time", centerId: "$centerId" } }
//         }
//     }]).exec(function(err, result) {

//         // res.json(result)

//         if (result.length > 0) {

//             _.map(result, function(d) {


//                 console.log("------------->", d)

//                 // console.log(d.data)
//                 var obj = { "from": '', "to": '', "centerName": '' };


//                 for (var i = 0; i < d.data.length; i++) {


//                     if (i % 2 == 0) {
//                         obj.from = d.data[i].time;
//                         obj.centerName = d.data[i].centerId
//                         if (d.data.length > 1) {

//                         } else {
//                             att.push(obj);
//                         }
//                         // att.push({"from":d.data[i].time}) ;
//                     } else if (i % 2 == 1) {
//                         console.log("in 2", d.data[i].time)

//                         obj.to = d.data[i].time;
//                         // att.push({"to":d.data[i].time});
//                         att.push(obj);
//                         obj = { "from": '', "to": '', "centerName": '' };

//                     }

//                     console.log("<<<<<<<<<<<<<<<", att)

//                     // shifts.push(att)

//                 }

//                 final.push({ date: d._id, "shifts": att })
//                 att = []

//             });
//             var finalData = _.sortBy(final, function(l) {
//                 return l.date
//             })


//             res.json(CreateObjService.response(false, finalData));
//         } else {


//             res.json(CreateObjService.response(true, finalData));
//         }

//     });


// });

router.post('/attendance', function(req, res) {
    Appointment.employeeAttendance(req, function(err, data) {
        return res.json(CreateObjService.response(false, data));
    })
});

router.get('/employee', function(req, res) {
    Admin.findOne({ _id: req.query.userId, 'parlorId': req.session.parlorId }, function(err, user) {
        return res.json(CreateObjService.response(false, { user: Admin.parseUserObj(user) }));
    });
});

router.post('/customers', function(req, res) {
    User.find({ 'parlors.parlorId': req.session.parlorId }, { loyalityPoints: 1, firstName: 1, lastName: 1, phoneNumber: 1 }, function(err, users) {

        if (err) return res.json(CreateObjService.response(true, 'Error'));
        else return res.json(CreateObjService.response(false, _.map(users, function(u) {
            return User.parseShort(u, req.session.parlorId);
        })));

        // if (err) return res.json(CreateObjService.response(true, 'Error'));
        // else {
        //      var d= []
        //      async.each(users, function(user , callback) {
        //         var obj ={};
        //             obj.name = user.firstName + " " + (user.lastName || ""),
        //             obj.userId = user.id,
        //             obj.phoneNumber = user.phoneNumber,
        //             obj.loyalityPoints = user.loyalityPoints,
        //         Appointment.aggregate([{$match : {parlorId : ObjectId(req.session.parlorId) , status : 3 , 'client.id' : ObjectId(user.id)}} ,
        //             {$project : {payableAmount : 1,services :'$services.name' ,clientId: "$client.id",date: {'$dateToString': {format: '%m/%d/%Y', date: '$appointmentStartTime'}}}},
        //             {$group : {_id:"$clientId" , date :{$last :"$date"} , services :{$push:"$services"}}},],function(err,agg){

        //                  console.log(agg.length)
        //                     if(agg.length != 0){
        //                         obj.lastApptDate = agg[0].date,
        //                         obj.services = agg[0].services[0],


        //                         d.push(obj)
        //                         callback();
        //                     }else{
        //                         d.push(obj)
        //                         callback();
        //                     }

        //         })
        //       },function allTaskCompleted(){
        //         return res.json(CreateObjService.response(false, d));
        //       })
        //      console.log(d)

        // }
    });
});


router.get('/appointmentHome', function(req, res) {
    Appointment.getAppointmentHome(req, function(err, data) {
        if (err) return res.json(CreateObjService.response(true, 'Error'));
        else return res.json(CreateObjService.response(false, data));
    });
});

router.post('/customer', function(req, res) {
    if (req.body.phoneNumber) {
        User.findOne({
            phoneNumber: req.body.phoneNumber,
            // $and: [{ firebaseId: { $eq: null } }, { firebaseIdIOS: { $eq: null } }]
        }, function(err, user) {
            // if (user && localVar.isServer()) {
            // if (user) {
            //     sendOfferSms(user,req.body.subtotal,req.body.noOfService);

            //     // sendOfferSms(user);
            // }
            // console.log(req.body.phoneNumber)
            // console.log(user);
            Parlor.findOne({_id : req.session.parlorId}, {tax : 1}, function(err, parlor){
                User.getActiveMembership(req.body.phoneNumber, function(u) {
                    // ParlorService.sendCheckInNotificationCrm(u.id, req.session.parlorId)
                    u.parlors = _.filter(u.parlors, function(p) {
                        return p.parlorId + "" == req.session.parlorId + "";
                    });
                    // if (u.parlors.length > 0) {
                        if (u.activeMembership.length > 0) {
                            u.activeMembership[0].membershipId = u.activeMembership[0].membershipId.id;
                            _.forEach(u.activeMembership, function(ur){
                                if(ur.membershipWithTax)ur.creditsLeft = parseInt(ur.creditsLeft * 1/(1 + parlor.tax/100));
                            });
                        }
                        u.activeMemberships = u.activeMembership;
                        var reqUser = User.parse(u, req.session.parlorId);
                        var date = new Date();
                        Appointment.find({
                            'client.id': reqUser.userId,
                            status: { $in: [3, 4] },
                            appointmentStartTime: { $gte: HelperService.getCurrentMonthFirstDate(), $lt: HelperService.getCurrentMonthLastDate() }
                        }).count(function(err, count) {
                            Appointment.find({
                                'client.id': reqUser.userId,
                                status: 3,
                                serviceRevenue : {$gt: 0}
                            }, {"services.name" : 1, appointmentStartTime : 1, payableAmount : 1, "services.employees" : 1}).exec(function(err, pastAppointments) {
                                console.log(pastAppointments)
                                reqUser.pastAppointments = pastAppointments;
                                reqUser.subscriptionId = user.subscriptionId;
                                reqUser.checked = count < 6 || req.body.phoneNumber == "9971120758" || req.body.phoneNumber == "9250651411" ? 1 : 0;
                                reqUser.zeroCompletedAppointments = false;
                                reqUser.clientHasApp = ((user.firebaseId && user.firebaseId != null && user.firebaseId != '') || (user.firebaseIdIOS && user.firebaseIdIOS != null && user.firebaseIdIOS != '')) ? true : false;
                                return res.json(CreateObjService.response(false, reqUser));
                            });
                        });
                    // } else return res.json(CreateObjService.response(true, 'User not found'));
                });
            });
        });

    } else if (req.body.userId) {
        User.findOne({ _id: req.body.userId, 'parlors.parlorId': req.session.parlorId }, function(err, user) {

            if (err) return res.json(CreateObjService.response(true, 'Error'));
            else if (user) {

                let user2 = User.parse(user, req.session.parlorId);
                user2.subscriptionId = user.subscriptionId;
                Appointment.find({
                    'client.id': user.userId,
                    parlorId: req.session.parlorId
                }, function(err, appointments) {
                    user2.appointments = appointments;
                    // user.clientHasApp = ((user.firebaseId && user.firebaseId != null && user.firebaseId != '') || (user.firebaseIdIOS && user.firebaseIdIOS != null && user.firebaseIdIOS != '')) ? true : false;
                    return res.json(CreateObjService.response(false, user2));
                });
            }
        });
    }
});


router.get('/getPersonalCouponDetail', function(req, res) {
     SalonPersonalCoupon.findOne({parlorId : req.session.parlorId, startDate : {$lt : new Date()}, endDate : {$gt : new Date()}, active : true, couponCode : req.query.couponCode}, function(err, c){
            let data = {
                    couponCode : c.couponCode,
                    description : c.description,
                    percentOff : c.percentOff,
                    maxOff : c.maxOff,
                };
            return res.json(CreateObjService.response(false, data));
    });
});

router.get('/registerSocket', function(req, res) {
    var updateObj = { $push: { socketId: req.query.socketId } };
    // console.log(updateObj);
    Parlor.update({ _id: req.session.parlorId }, updateObj, function(er, c) {
        console.log('Successfully updated');
        // console.log(c);
        var socketId = req.query.socketId;
        if (io.sockets.connected[socketId] != null) {
            io.sockets.connected[socketId].emit('messages', { data: "Event response by particular user " });
        }
        //This is handle by current connected client
        res.json({ status: 'Updated' });
    });
});

router.post('/services', function(req, res) {
    Admin.find({ parlorId: req.session.parlorId, active: true }, { active: 1 }, function(err, parlorEmployees) {
        Parlor.findOne({ _id: req.session.parlorId }).exec(function(err, parlor) {
            ServiceCategory.find().exec(function(err, categories) {
                Service.find({ownerId : null}, { isDeleted: 1, id: 1, name: 1, gender: 1, subTitle: 1, inventoryItemId : 1 }, function(err, realServices) {
                    var itemIds = [];
                    _.forEach(realServices, function(s){if(s.inventoryItemId)itemIds.push(s.inventoryItemId)});
                    ParlorItem.find({parlorId : req.session.parlorId, inventoryItemId : {$in : itemIds}}, {actualUnits : 1, inventoryItemId : 1}, function(er, pItems){
                        var data = [];
                        _.map(categories, function(category) {
                            var parlorServices = _.filter(parlor.services, { 'categoryId': category._id });
                            var serviceByCategory = [];
                            _.forEach(realServices, function(s) {
                                _.forEach(parlorServices, function(parlorservice) {
                                    if (parlorservice.serviceId + "" == s.id + "") {
                                        if (!s.isDeleted) {
                                            parlorservice.name = s.name;
                                            parlorservice.serviceDiscount = 0;
                                            parlorservice.gender = s.gender;
                                            parlorservice.subTitle = s.subTitle;
                                            if(!s.inventoryItemId){
                                                serviceByCategory.push(parlorservice);
                                            }else{
                                                console.log("in items--------------------------------");
                                                console.log(s.inventoryItemId);
                                                console.log(pItems);
                                                let invItem = _.filter(pItems, function(pI){ return pI.inventoryItemId + "" == s.inventoryItemId + ""})[0];
                                                console.log(invItem);
                                                if(invItem && invItem.actualUnits > 0){
                                                    serviceByCategory.push(parlorservice);
                                                }
                                            }
                                        }
                                    }
                                });
                            });
                            var cat = ServiceCategory.parse(category);
                            _.forEach(serviceByCategory, function(rs) {
                                _.forEach(rs.prices, function(price) {
                                    var employees = [];
                                    _.forEach(price.employees, function(e) {
                                        if (_.filter(parlorEmployees, function(pe) { return pe.id + "" == e.userId + "" })[0]) {
                                            if(!_.filter(employees, function(em){return em.userId + "" == e.userId})[0]){
                                                employees.push(e);
                                            }
                                        }
                                    });
                                    price.employees = employees;
                                    if (price.brand) {
                                        if (price.brand.brands) {
                                            price.brand.brands = _.filter(price.brand.brands, function(brand) {
                                                brand.products = _.filter(brand.products, function(pro) {
                                                    return pro.ratio != 0;
                                                });
                                                return brand.ratio != 0 && brand.brandId + "" != "5935644800868d2da81bb91b";
                                            });
                                        }
                                    }
                                });
                            });
                            cat.services = serviceByCategory;
                            if (serviceByCategory.length > 0) data.push(cat);
                        });
                        var reqData = [];
                        SuperCategory.find({}, function(err, supercategories) {
                            _.forEach(supercategories, function(s) {
                                var categoryBySuper = _.filter(data, { 'superCategory': s.name });
                                if (categoryBySuper.length > 0) reqData.push({ name: s.name, categories: categoryBySuper });
                            });
                            return res.json(CreateObjService.response(false, reqData));
                        });
                    }); 
                });
            });
        });
    });
});

router.post('/employees', function(req, res) {
    Admin.findOne({ _id: req.session.userId }, function(err, user) {
        var query = {};
        if (typeof req.session.parlorId == 'string') query = { parlorId: req.session.parlorId };
        else query = { parlorId: { $in: user.parlorIds } };
        Admin.find(query).sort({ role: -1 }).exec(function(err, users) {
            if (err) return res.json(CreateObjService.response(true, 'Error in connecting database'));
            else return res.json(CreateObjService.response(false, _.map(users, function(u) {
                var obj = Admin.parse(u);
                obj.userId = u.id;
                return obj;
            })));
        });
    });
});

router.post('/employeesByParlor', function(req, res) {
        Admin.find({parlorId : req.body.parlorId}).sort({ role: -1 }).exec(function(err, users) {
            if (err) return res.json(CreateObjService.response(true, 'Error in connecting database'));
            else return res.json(CreateObjService.response(false, _.map(users, function(u) {
                var obj = Admin.parse(u);
                obj.userId = u.id;
                return obj;
            })));
    });
});

//  Get list of employess available on appointment Date
router.post('/presentEmployees', function(req, res) { //appointmentDate
    Admin.findOne({ _id: req.session.userId, active: true }, function(err, user) {
        var query = {};
        if (typeof req.session.parlorId == 'string') query = { parlorId: req.session.parlorId, active: true };
        else query = { parlorId: { $in: user.parlorIds }, active: true };
        console.log(query);
        Parlor.findOne({ _id: req.session.parlorId }, { attendanceWorking: 1 }, function(err, parlor) {
            Admin.find(query).sort({ role: -1 }).exec(function(err, users) {
                if (err) return res.json(CreateObjService.response(true, 'Error in connecting database'));
                else {
                    var empIds = _.map(users, function(u) {
                        return u.id + ""
                    });
                    Attendance.find({
                        employeeId: { $in: empIds },
                        createdAt: { $gt: HelperService.getTodayStart() }
                    }, function(err, attendances) {
                        if (parlor.attendanceWorking) {
                            console.log("herer");
                            users = _.filter(users, function(u) {
                                return _.filter(attendances, function(a) {
                                    return a.employeeId == u.id + ""
                                })[0];
                            });
                        }
                        var data = _.map(users, function(u) {
                            console.log("---------------------");
                            var obj = Admin.parse(u);
                            obj.userId = u.id;
                            return obj;
                        });
                        return res.json(CreateObjService.response(false, data));
                    });
                }

            });
        });
    });
});


router.post('/newAppointment', function(req, res) {
    Admin.find({ $or: [{ parlorIds: req.session.parlorId }, { parlorId: req.session.parlorId }], role: { $in: [2, 7] } }, { firebaseId: 1 }, function(err, admins) {
        var firebaseIds = [];
        _.forEach(admins, function(e) { firebaseIds.push(e.firebaseId); });
        if (req.body.data.appointmentId) {
            Appointment.findOne({ _id: req.body.data.appointmentId }, function(err, appt) {

                User.findOne({ _id: appt.client.id }, function(err, user) {
                    var parlorFound = _.some(user.parlors, function(p) {
                        return p.parlorId + "" == appt.parlorId;
                    });
                    if (!parlorFound) {
                        var newP = {
                            parlorId: appt.parlorId,
                            createdBy: req.session.userId,
                            noOfAppointments: 0,
                            createdAt: new Date(),
                            updatedAt: new Date()
                        };
                        User.update({ _id: appt.client.id }, { $push: { 'parlors': newP } }, function(err, updte) {
                            Appointment.createNewAppointment(req, function(d) {
                                // notificationData(req.body.data , firebaseIds)
                                return res.json(d);
                            });
                        });
                    } else {
                        Appointment.createNewAppointment(req, function(d) {
                            Appointment.refundLoyalityPoints(appt.client.id, appt, 0, function(err, g) {
                                // notificationData(req.body.data , firebaseIds)

                                return res.json(d);
                            });
                        });
                    }
                });
            });
        } else {
            Appointment.createNewAppointment(req, function(d) {
                // notificationData(req.body.data , firebaseIds)
                if(req.body.data.isSubscriptionAppointment){
                    req.body.appointmentId = d.data.appointmentId
                    req.body.userId = d.data.client.id
                    req.body.backend = 1
                    userSubscription(req, function(err, message){
                        return res.json(CreateObjService.response(err, message));
                    })
                }else{
                    return res.json(d);
                }
            });
        }
    });
});

function notificationData(data, firebaseIds) {
    console.log("ayyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy---------------")
    var services = _.map(data.services, function(ser) { return ser.name })

    var message = 'A New Appointment Has Been Booked With Services: ' + services.toString();
    var notiData = {
        type: "appointmentBooked",
        title: "Appointment has been booked",
        body: message
    }

    console.log(notiData)
    console.log(firebaseIds)
    _.forEach(firebaseIds, function(firebaseId) {

        //     ParlorService.sendIonicNotificationToMany(f , notiData , function () {
        //     // callback();
        // });
    })
};



router.post('/sendShortUrlSms', function(req, res) {
    console.log("sendShortUrlSms")
    console.log("reg.body.subtotal", req.body)
    var googl = require('goo.gl');
    googl.setKey('AIzaSyDNWjua5ndmlEt4GH9e50odpl64x0TxBj8');
    var apptId = req.body.appointmentId;

    User.findOne({ phoneNumber: req.body.phoneNumber }, function(err, user) {
        Appointment.findOne({_id: apptId} , {parlorId : 1} , function(err , app){
            Parlor.findOne({_id: app.parlorId}, {earlyBirdOfferPresent: 1, earlyBirdOfferType:1} , function(err , parlor){
                var offerPresent = (parlor.earlyBirdOfferPresent == true) ? parlor.earlyBirdOfferPresent : false;
                var offerType = (parlor.earlyBirdOfferPresent == true) ? parlor.earlyBirdOfferType : 0;
                if(!user.subscriptionId){
                    var url = "https://beusalons.app.link/a/key_live_lftOr7qepHyQDI7uVSmpCkndstebwh0V?page=pay&appt=" + apptId
                    googl.shorten(url)
                        .then(function(shortUrl) {
                        console.log(shortUrl)
                            // if (user && localVar.isServer()) {
                            //     sendOfferSms(user,req.body.subtotal,req.body.noOfService ,shortUrl);
                            // }
                        sendOfferSms(user, req.body.subtotal, req.body.noOfService, "https://goo.gl/pAbKpm" , offerPresent , offerType);

                        res.json(url)
                    })
                    .catch(function(err) {
                        console.error(err.message);
                        res.json("error")
                    });
                }else{
                   res.json('done') 
                }
            })
        })          
    })
});


function sendOfferSms(user, subtotal, noOfService, url , offerPresent , offerType) {
    console.log("sendOfferSms")
    console.log("user.firstName" ,user.firstName)
    var oName = user.firstName.substring(0, user.firstName.indexOf(' '));
    console.log("oName" ,oName)

    var name = oName.replace(/\w\S*/g, function(txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
    console.log(name)
    var typeSubscription = (offerPresent == true) ? "Early Bird Subscription Offer" : "Be U Salons Subscription";
    var subsAmount = (offerType == 0)? '1699' : ((offerType == 1) ? '699' : '1199');
    // function sendOfferSms(user) {
    var message = "",
        newAmount = 0,
        loyalityPoints = 0;
    // var message = "Hello " + user.firstName + "! Get 100% Cashback On Your 1 st Digital Payment & 50% Cashback On 1 st Cash Payment Through The App. Download http://onelink.to/bf45qf";
    // var message = "Hello " + user.firstName + "! Get 100% Cashback On Your 1 st Digital Payment & 50% Cashback On 1 st Cash Payment Through The App. Download "+url+"";

    if (subtotal < 300) {
        newAmount = 300 - subtotal;
        // message = "Hello " + name + "! Save Rs. 50 by shopping more of amount Rs. " + Math.round(newAmount) + " and pay through App. Download " + url + "";
        // message = "Hello " + name + "! SAVE Rs. 200 on this appointment through Be U Salons Subscription. Pay Rs. 899 & get services worth Rs. 200/month FREE, for 1 year. Buy NOW " + url + "";
        message = "Hello " + name + "! SAVE Rs. 500 on this appointment through "+typeSubscription+". Pay Rs. "+subsAmount+" & get services worth Rs. 500/month FREE, for 1 year. Buy NOW " + url + "";

    } else if (subtotal > 300 && subtotal < 800) {
        var extraAmount = 800 - subtotal;
        newAmount = (subtotal * 0.05) + 50;
        // message = "Hello " + name + "! Save Rs. " + Math.round(newAmount) + " by shopping more of amount Rs. " + Math.round(extraAmount) + " and pay through App. Shop through the Family Wallet and get upto 20% extra. Download " + url + "";
        message = "Hello " + name + "! SAVE Rs. 500 on this appointment through "+typeSubscription+". Pay Rs. "+subsAmount+" & get services worth Rs. 500/month FREE, for 1 year. Buy NOW " + url + "";

    } else if (subtotal > 800 && subtotal < 5000) {
        if (subtotal <= 1000) loyalityPoints = (5000 / subtotal);
        else if (subtotal < 2000) loyalityPoints = (subtotal * 0.05);
        else if (subtotal < 5000) loyalityPoints = (subtotal * 0.1);
        newAmount = (subtotal * 0.05) + loyalityPoints;
        if (noOfService < 4) {

            var newService = ((4 - noOfService) == 1) ? "1 more service" : "" + (4 - noOfService) + " more services";
            // message = "Hello " + name + "! Save Rs. " + Math.round(newAmount) + " by shopping " + newService + " and pay through App. Shop through the Family Wallet and get upto 20% extra. Download " + url + "";
            message = "Hello " + name + "! SAVE Rs. 500 on this appointment through "+typeSubscription+". Pay Rs. "+subsAmount+" & get services worth Rs. 500/month FREE, for 1 year. Buy NOW " + url + "";
        } else

        // message = "Hello " + name + "! Save Rs. " + Math.round(newAmount) + " by paying through App. Shop through the Family Wallet and get upto 20% extra. Download " + url + "";
            message = "Hello " + name + "! SAVE Rs. 500 on this appointment through "+typeSubscription+". Pay Rs. "+subsAmount+" & get services worth Rs. 500/month FREE, for 1 year. Buy NOW " + url + "";

    } else if (subtotal > 5000 && subtotal < 10000) {
        newAmount = (subtotal * 0.07) + (subtotal * 0.20);
        // message = "Hello " + name + "! Save Rs. " + Math.round(newAmount) + " by paying through App. Shop through the Family Wallet and get upto 20% extra. Download " + url + "";
        message = "Hello " + name + "! SAVE Rs. 500 on this appointment through "+typeSubscription+". Pay Rs. "+subsAmount+" & get services worth Rs. 500/month FREE, for 1 year. Buy NOW " + url + "";

    } else if (subtotal > 10000 && subtotal < 100000) {
        newAmount = (subtotal * 0.1) + (subtotal * 0.25);;
        // message = "Hello " + name + "! Save Rs. " + Math.round(newAmount) + " by paying through App. Shop through the Family Wallet and get upto 20% extra. Download " + url + "";

        message = "Hello " + name + "! SAVE Rs. 500 on this appointment through "+typeSubscription+". Pay Rs. "+subsAmount+" & get services worth Rs. 500/month FREE, for 1 year. Buy NOW " + url + "";


    }
    var usermessage = Appointment.newUserSms(user.phoneNumber, message);
    console.log("message", message)
    Appointment.sendSMS(usermessage, function(e) {
        console.log("fdone");
    });
}


router.post('/addEmployee', function(req, res) {
    if (req.body.appointmentId) {
        Appointment.findOne({ _id: req.body.appointmentId }, function(err, appt) {
            User.findOne({ _id: appt.client.id }, function(err, user) {
                var parlorFound = _.some(user.parlors, function(p) {
                    return p.parlorId + "" == appt.parlorId;
                });
                if (!parlorFound) {
                    var newP = {
                        parlorId: appt.parlorId,
                        createdBy: req.session.userId,
                        noOfAppointments: 0,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    };
                    User.update({ _id: appt.client.id }, { $push: { 'parlors': newP } }, function(err, updte) {
                        Appointment.addEmployeeToAppointment(req, appt, function(d) {
                            return res.json(d);
                        });
                    });
                } else {
                    Appointment.addEmployeeToAppointment(req, appt, function(d) {
                        return res.json(d);
                    });
                }
            });
        });
    }
});


router.post('/newAppointmentCoupon', function(req, res) {
    Appointment.checkCoupon(req, function(err, newObj) {
        return res.json(CreateObjService.response(false, newObj));
    });
});

router.post('/newAppointmentMembership', function(req, res) {
    Appointment.checkMembership(req, function(err, newObj) {
        console.log("newObj", newObj)
        return res.json(CreateObjService.response(false, newObj));
    });
});


router.put('/newAppointment', function(req, res) {
    Appointment.changeStatus(req, function(err, status) {
        
        return res.json(CreateObjService.response(false, status));
    });
});

router.post('/changePaymentMethod', function(req, res) {
    Appointment.changePaymentMethod(req, function(err, status) {
        return res.json(CreateObjService.response(false, status));
    });
});

router.post('/changeQuantityInAppointment', function(req, res) {
    Appointment.findOne({ _id: req.body.appointmentId }, function(err, appointment) {
        var realServices = [];
        _.forEach(appointment.superSetServices, function(s) {
            _.forEach(req.body.services, function(ser) {
                if (ser.serviceId == s.serviceId + "") {
                    if (ser.quantity != 0) {
                        realServices.push(Appointment.reinitAppointmentService(s, ser.quantity));
                    }
                }
            });
        });
        Appointment.update({ _id: req.body.appointmentId }, { services: realServices }, function(err, d) {
            return res.json(CreateObjService.response(false, "Done"));
        });
    });
});


router.get('/appointment', function(req, res) {
    var startDate = req.query.startDate;
    var endDate = req.query.endDate;
    console.log(req.query)
    console.log(endDate)
    var page = req.query.page;
    var query = {
        parlorId: req.session.parlorId,
        $or: [{ "employees.0": { "$exists": true } }, { appointmentType: { $ne: 3 } }, { $and: [{ 'services': { $size: 0 } }, { buySubscriptionId: { $ne: null } }] }]

    };
    Parlor.findOne({ _id: req.session.parlorId }, { tax: 1 }, function(err, parlor) {
        if (startDate) {
            var startTime = new Date(startDate);
            var endTime = new Date(endDate);
            console.log(startTime, endTime);
            query.appointmentStartTime = { $gt: startTime, $lt: endTime };
        }
        else if(req.query.allPages){
            query.status = 3;
        }
         else {
            query.status = { $in: [1, 4] };
            // query.appointmentStartTime = {$lt: HelperService.get2HrsAfter()};
        }
        if (page) {
            var perPage = 25;
            var queryR = { parlorId: req.session.parlorId, status: 3 };
            if (req.query.name) {
                queryR = { 'client.name': new RegExp(req.query.name, 'i'), parlorId: req.session.parlorId, status: 3 };
            }
            if (req.query.appointmentId) {
                queryR.parlorAppointmentId = req.query.appointmentId;
            }
            if (startDate) {
                var startTime = startDate;
                var endTime = endDate;
                queryR.appointmentStartTime = { $gt: HelperService.getDayStart(startTime), $lt: HelperService.getDayStart(endDate) };
            }
            var sort = { appointmentEndTime: -1 };
            console.log("queryR",queryR);
            Appointment.find(queryR).count(function(err, count) {
                console.log(count)
                console.log(perPage)
                var totalPage = Math.ceil(count / perPage);
                console.log(totalPage)
                Appointment.find(queryR).sort(sort).limit(perPage).skip(perPage * (page - 1)).exec(function(err, data) {
                    if (err) return res.json(CreateObjService.response(true, 'Error in getting previous appointments'))
                    else
                        var dataa = [];
                    async.each(data, function(appt, cb) {
                        Beu.findOne({ _id: appt.closedBy }, function(err, found) {
                            console.log(err)
                            console.log("found")

                            if (found) {
                                appt.closedByName = "Be U"
                                dataa.push(appt)
                                cb()
                            } else {

                                appt.closedByName = "Salon"
                                dataa.push(appt)
                                cb()
                            }
                        })

                    }, function(done) {
                        console.log("ALl DONE")
                        return res.json(CreateObjService.response(false, {
                            appointments: Appointment.parseArray2(dataa, parlor.tax),
                            totalPage: totalPage
                        }));

                    })

                });
            });

        }else {
            Appointment.find(query).sort({ appointmentStartTime: -1 }).exec(function(err, data) {
                if (err) return res.json(CreateObjService.response(true, 'Error in getting previous appointments'));
                else return res.json(CreateObjService.response(false, Appointment.parseArray2(data, parlor.tax)));
            });
        }
    });
});

router.get('/appointmentFromApp', function(req, res) {
    var query = {
        parlorId: req.session.parlorId,
        bookingMethod: { $ne: 1 },
        status: 1,
        $and: [{ "employees.0": { "$exists": false } }, { appointmentType: 3 }, { 'services.0': { "$exists": true } }]
    };
    //And this is handle by particular client
    Parlor.findOne({ _id: req.session.parlorId }, { tax: 1 }, function(err, parlor) {
        Appointment.find(query).sort({ appointmentStartTime: -1 }).exec(function(err, data) {
            if (err) return res.json(CreateObjService.response(true, 'Error in getting previous appointments'));
            else return res.json(CreateObjService.response(false, Appointment.parseArray2(data, parlor.tax)));
        });
    });
});

router.get('/serviceAnalytics', function(req, res) {
    Appointment.getServiceHome(req, function(err, data) {
        if (err) return res.json(CreateObjService.response(true, 'Error in getting previous appointments'));
        else return res.json(CreateObjService.response(false, data));
    });
});

router.post('/marketing/target', function(req, res) {
    var customerType = req.body.customerType;
    var apptCount = req.body.apptCount ? req.body.apptCount : 99999999;
    var lastApptDate = req.body.lastApptDate;
    var userQuery = {};
    // userQuery['parlors.parlorId'] = req.session.parlorId;
    var pid = [req.session.parlorId];
    User.find(userQuery, function(err, allUsers) {
        var users = [];
        _.forEach(allUsers, function(u) {
            u = User.parse(u, req.session.parlorId);
            if (customerType) {
                if (customerType == "two") {
                    if (u.membership.validUpTo) users.push(u);
                } else if (customerType == "three") {
                    if (!u.membership.validUpTo) users.push(u);
                } else {
                    users.push(u);
                }
            } else {
                users.push(u);
            }
        });
        if (apptCount) {
            users = _.filter(users, function(u) {
                return u.noOfAppointments < apptCount;
            });
        }
        if (lastApptDate) {
            users = _.filter(users, function(u) {
                if (u.lastAppointmentDate) return u.lastAppointmentDate.getTime() - lastAppointmentDate.getTime() > 0;
            });
        }
        return res.json(CreateObjService.response(false, { users: users, customerTarget: users.length }));
    });
});

/*router.post('/marketing/target', function (req, res) {
 var customerType = req.body.customerType;
 var apptCount = req.body.apptCount;
 var lastApptDate = req.body.lastApptDate;
 var lastDate = Date.parse(lastApptDate);
 console.log("lastdate", lastDate);
 var userQuery = {};
 //userQuery.parlorId = req.session.parlorId;
 var pid = ["57863fba2377bf5a72a51a0a"];
 userQuery['parlors.parlorId'] = {
 '$in': pid
 };

 if (customerType == "two") {  // member
 userQuery['parlors.membership'] = {
 '$exists': true,
 '$not': {
 '$size': 0
 }
 };
 }
 else if (customerType == "three") { // non-member
 userQuery['parlors.membership'] = {
 '$exists': false
 };
 }

 var resp = {};
 var membershipData = {};
 var nameData = {};
 var phoneData = {};
 User.find(userQuery, function (err, users) {
 if (err) return res.json(CreateObjService.response(true, err));
 else {
 console.log('users', users);
 _.forEach(users, function (user) {
 nameData[user._id] = user.firstName + " " +(user.lastName || "");
 phoneData[user._id] = user.phoneNumber || "";
 _.forEach(user.parlors, function (parlor) {
 if (parlor.parlorId == pid[0]) {
 if (parlor.membership) {
 var expires = parlor.membership.expiresOn;
 expires = Date.parse(expires);
 expires = new Date(expires).toUTCString();
 membershipData[user._id] = parlor.membership.name + ' (' + expires + ')';
 }
 }
 });
 });
 resp.customerTarget = users.length;
 var userIds = _.map(users, '_id');
 getAggregateResult(userIds, pid, false, undefined, function(err, data) {
 if (err) console.log(err);
 var apptCountFiltered = _.filter(data, function(d) {
 return (d.count <= apptCount);
 });
 var userIds2 = _.map(apptCountFiltered, '_id');
 resp.apptCountTarget = userIds.length;
 getAggregateResult(userIds2, pid, true, lastDate, function (err1, data1) {
 if (err) console.log(err);
 resp.lastApptTarget = data1.length;
 resp.users = [];
 _.forEach(data1, function (user) {
 resp.users.push({
 id: user._id,
 name: nameData[user._id],
 appointmentCount: user.count,
 membership: membershipData[user._id],
 lastAppointmentDate: user.data[0]._id
 });
 });
 return res.json(CreateObjService.response(false, resp));
 });
 });
 }
 });
 });*/

router.get('/smsRemaining', function(req, res) {
    Parlor.findOne({ _id: req.session.parlorId }, function(err, parlor) {
        return res.json(CreateObjService.response(false, { smsRemaining: parlor.smsRemaining }));
    });
});


router.post('/sendSms', function(req, res) {
    var parlorId = req.session.parlorId || req.body.parlorId;
    Parlor.findOne({ _id: parlorId }, function(err, parlor) {
        console.log([req.session.parlorId, req.body.parlorId])
            // console.log()
        var url = getActiveConnectUrl(req.body.message, req.body.numbers),
            http = require("http"),
            response;
        var calculateSmsCreditToBeUsed = calculateSmsCreditUsed(req.body.message, req.body.numbers.length);
        if (calculateSmsCreditToBeUsed < parlor.smsRemaining) {
            http.get(url, function(res2) {
                res2.on("data", function(chunk) {
                    response = chunk;
                });
                res2.on("end", function() {
                    Sms.saveSms(parlor, {
                        smsType: req.body.type == "P" ? 2 : 1,
                        creditUsed: calculateSmsCreditToBeUsed,
                        parlorId: req.session.parlorId,
                        phoneNumbers: req.body.numbers,
                        message: req.body.message,
                        otp: req.body.otp
                    }, function(err, remains) {
                        return res.json(CreateObjService.response(false, {
                            smsUsed: calculateSmsCreditToBeUsed,
                            smsRemaining: remains
                        }));
                    });
                });
            }).on('error', function(e) {
                return res.json(CreateObjService.response(true, 'Error in sending sms'));
            });
        } else {
            return res.json(CreateObjService.response(true, 'Not enough SMS Credits, required more = ' + getSMSCreditReqMore(calculateSmsCreditToBeUsed, parlor.smsRemaining)));
        }
    });
});

router.post('/sendSmsOtp', function(req, res) {
    var parlorId = req.session.parlorId || req.body.parlorId;
    Appointment.findOne({ _id: req.body.appointmentId }, { noOfTimeOtpSend: 1 }, function(err, appointment) {
        if (appointment.noOfTimeOtpSend < 3) {
            var noOfTimeOtpSend = appointment.noOfTimeOtpSend + 1;
            Parlor.findOne({ _id: parlorId }, function(err, parlor) {
                console.log([req.session.parlorId, req.body.parlorId])
                var url = getSmsUrlForOtp(parlor.smscode, req.body.message, req.body.numbers, req.body.type, req.body.otp, req.body.retry),
                    http = require("http"),
                    response;
                var calculateSmsCreditToBeUsed = calculateSmsCreditUsed(req.body.message, req.body.numbers.length);
                if (calculateSmsCreditToBeUsed < parlor.smsRemaining) {
                    request(url, function(error, response, body) {
                        if (error == null) {
                            Sms.saveSms(parlor, {
                                smsType: req.body.type == "P" ? 2 : 1,
                                creditUsed: calculateSmsCreditToBeUsed,
                                parlorId: req.session.parlorId,
                                phoneNumbers: req.body.numbers,
                                message: req.body.message,
                                otp: req.body.otp
                            }, function(err, remains) {
                                Appointment.update({ _id: req.body.appointmentId }, { noOfTimeOtpSend: noOfTimeOtpSend }, function(Er, d) {
                                    return res.json(CreateObjService.response(false, {
                                        smsUsed: calculateSmsCreditToBeUsed,
                                        smsRemaining: remains
                                    }));
                                });
                            });
                        } else {
                            return res.json(CreateObjService.response(true, 'Error in sending sms'));
                        }
                    });
                } else {
                    return res.json(CreateObjService.response(true, 'Not enough SMS Credits, required more = ' + getSMSCreditReqMore(calculateSmsCreditToBeUsed, parlor.smsRemaining)));
                }
            });
        } else {
            return res.json(CreateObjService.response(true, 'Otp Limit Exceeded!'));
        }

    });
});

function getSMSCreditReqMore(credit, smsRemaining) {
    return smsRemaining ? credit - smsRemaining : credit;
}

function calculateSmsCreditUsed(message, noOfPhoneNumbers) {
    return Math.ceil(message.length / SMScount) * noOfPhoneNumbers;
}

function getSmsUrl(messageId, message, phoneNumbers, type) {
    return ParlorService.getSMSUrl(messageId, message, phoneNumbers, type);
}

function getSmsUrlForOtp(messageId, message, phoneNumbers, type, otp, retry) {
    return ParlorService.getSMSUrlForOtp(messageId, message, phoneNumbers, type, otp, retry);
}

function getAggregateResult(userIds, parlorIds, withDate, lastDate, callback) {
    var m = {};
    var pids = [];
    _.forEach(parlorIds, function(pid) {
        pids.push(mongoose.Types.ObjectId(pid));
    })

    m['$match'] = {
        'client.id': {
            '$in': userIds
        },
        'parlorId': {
            '$in': pids
        }
    };
    if (withDate === true) {
        m['$match']['appointmentStartTime'] = {
            '$lt': new Date(lastDate)
        }
    };
    Appointment.aggregate([
        m,
        {
            "$group": {
                "_id": {
                    "y": "$client.id",
                    "z": "$appointmentStartTime"
                },
                "aggregate": {
                    "$sum": 1
                }
            }
        },
        {
            "$sort": {
                "_id.z": -1
            }
        },
        {
            "$group": {
                "_id": "$_id.y",
                "data": {
                    "$push": {
                        "_id": "$_id.z",
                        "data": "$aggregate"
                    }
                },
                "count": {
                    "$sum": "$aggregate"
                }
            }
        }
    ], function(err, data) {
        callback(err, data);
    });
}


router.get('/getPackages', function(req, res) {
    var allComboCodes = []
    var allparlorCodes = []
    var parlorServices = []
    var parlorServices2 = []
    var newParlorServices = []
    var comboArray = []
    var finalArray = []


    Deals.find({ "dealType.name": "combo", dealId: 27, parlorId: "587088445c63a33c0af62727" }, function(err, deals) {
        // console.log(deals)

        Parlor.findOne({ _id: "587088445c63a33c0af62727" }, { services: 1 }, function(err, parlor) {
            console.log(deals.length)
            _.forEach(deals, function(deal) {
                var tempDeals = []
                _.forEach(deal.services, function(deal1) {

                    tempDeals.push(deal1.serviceCode)

                })

                _.forEach(parlor.services, function(ps) {
                    if (tempDeals.indexOf(ps.serviceCode) > -1) {

                        if (ps.prices.length > 0) {
                            Deals.aggregate({ $unwind: "$services" }, {
                                $match: {
                                    $or: [{ "dealType.name": "chooseOne" }, { "dealType.name": "chooseOnePer" }, { "dealType.name": "dealPrice" }],
                                    parlorId: ObjectId("587088445c63a33c0af62727"),
                                    "services.serviceCode": ps.serviceCode
                                }
                            }, function(err, filteredDeal) {
                                console.log("filtered deal" + filteredDeal)
                                if (filteredDeal.length > 0) {
                                    if (ps.prices[0].brand.brands.length > 0) {
                                        if (filteredDeal[0].brands.length > 0) {
                                            var dealBrandIds = [];
                                            filteredDeal[0].brands.forEach(function(brand) {
                                                dealBrandIds.push((brand.brandId).toString())
                                            })
                                        }
                                        var brandArray = []

                                        _.forEach(ps.prices[0].brand.brands, function(br) {

                                            var brandIndex = dealBrandIds.indexOf((br.brandId).toString())
                                            console.log(brandIndex)
                                            console.log(br.brandId)
                                            console.log(dealBrandIds)
                                            if (br.products.length > 0) {
                                                if (filteredDeal[0].brands[brandIndex].products.length > 0) {
                                                    var dealProductIds = [];
                                                    filteredDeal[0].brands[brandIndex].products.forEach(function(product) {
                                                        dealProductIds.push(product.productId)
                                                    })
                                                }
                                                var productArray = [];
                                                _.forEach(br.products, function(p) {

                                                    var productIndex = dealProductIds.indexOf(p.productId)
                                                    var price2 = ps.prices[0].price * p.ratio
                                                    if (productIndex > -1) {
                                                        price2 = filteredDeal[0].brands[brandIndex].products[productIndex].ratio * filteredDeal[0].dealType.price
                                                    }
                                                    if (p.ratio != 0) {

                                                        productArray.push({
                                                            productId: p.productId,
                                                            name: p.name,
                                                            price: price2
                                                        })
                                                    }

                                                })
                                            }
                                            if (br.ratio != 0) {
                                                var price1 = ps.prices[0].price * br.ratio
                                                if (brandIndex > -1)
                                                    price1 = filteredDeal[0].brands[brandIndex].ratio * filteredDeal[0].dealType.price
                                                    // console.log("produc array here", productArray)
                                                brandArray.push({

                                                    brandId: br.brandId,
                                                    brandPrice: price1,
                                                    brandName: br.name,
                                                    products: productArray

                                                })
                                                productArray = [];

                                            }
                                        })
                                        parlorServices.push({
                                            serviceCode: ps.serviceCode,
                                            serviceName: ps.name,
                                            categoryId: ps.categoryId,
                                            serviceId: ps.serviceId,
                                            actualPrice: ps.prices[0].price,
                                            brands: brandArray,


                                        })
                                    } else {
                                        var price = ps.prices[0].price;
                                        if (filteredDeal[0].brands.length == 0) {
                                            price = filteredDeal[0].dealType.price
                                        }
                                        parlorServices.push({
                                            serviceCode: ps.serviceCode,
                                            serviceName: ps.name,
                                            categoryId: ps.categoryId,
                                            serviceId: ps.serviceId,
                                            actualPrice: price,
                                            brands: [],
                                        })
                                    }
                                }
                                comboArray.push(parlorServices)
                                parlorServices = [];
                                console.log(comboArray)
                                res.json(comboArray)
                            })
                        }
                    }
                })



            })
        })




        var groupedBycategory = []
        var dealPackage = []

        ServiceCategory.find({}, function(err, result) {

            _.forEach(result, function(cat) {

                _.forEach(finalArray, function(fa) {
                    _.forEach(fa.categoryIds, function(dc) {
                        if ((cat._id).toString() == (dc).toString()) {


                            dealPackage.push(fa)
                        }

                    })

                })


                groupedBycategory.push({ categoryId: cat._id, categoryName: cat.name, packages: dealPackage })
                dealPackage = []

            })


            // res.json(groupedBycategory)
        })


    })
})




router.get('/newPackagesApi', function(req, res) {

    var ids = [0, 1]
    var combosArray = []

    Deals.find({ parlorId: req.session.parlorId, 'dealType.name': { $nin: ['combo', 'newCombo'] } }).sort('dealId').exec(function(err, deals) {
        ServiceCategory.find({}, function(err, categories) {
            var categoryIds = _.map(categories, function(c) { return ObjectId(c.id); });
            AggregateService.parlorService(req.session.parlorId, categoryIds, null, true, function(results) {
                AggregateService.newComboDeals(null, req.session.parlorId, function(combos) {
                    var data = [];
                    _.forEach(combos, function(combo) {
                        combo.selectors = _.map(combo.selectors, function(c) {
                            return ParlorService.getServiceSelectors(c.services, 'newCombo', c.title, c.type, 'Select Service', 1);
                        });
                        data.push(ParlorService.populatePackagePrice(combo, deals, results));
                    });
                    data = _.map(data, function(d) {
                        return {
                            dealId: d.dealId,
                            dealType: d.dealType,
                            slabId: d.slabId,
                            name: d.name,
                            gender: d.gender,
                            description: d.description,
                            menuPrice: d.menuPrice,
                            dealPrice: d.dealPrice,
                            weekDay: d.weekDay,
                            dealsCategory: d.dealsCategory,
                            selectors: d.selectors,
                        };
                    });

                    AggregateService.dealsByDepartment(["M", "F"], categoryIds, req.session.parlorId, true, function(comboDeals) {
                        comboDeals = ParlorService.parseDealsHomePage(comboDeals, true, 1);
                        _.forEach(comboDeals, function(c) {
                            _.forEach(c.deals, function(d) {
                                data.push(ParlorService.populatePackagePrice(d, deals, results))
                            });
                        });


                        var supercategories = []
                        SuperCategory.find({}, function(err, superCat) {
                            _.forEach(superCat, function(s) {
                                supercategories.push({
                                    "id": s._id,
                                    "name": s.name,
                                    "package": []
                                })
                            })



                            ServiceCategory.find({}, function(err, category) {
                                _.forEach(data, function(deal) {
                                    var superCat = []
                                    _.forEach(deal.dealsCategory, function(dealcat) {

                                        _.forEach(category, function(cat) {
                                            if ((dealcat).toString() == (cat._id).toString()) {

                                                if (superCat.indexOf(cat.superCategory) > -1) {
                                                    //
                                                } else {
                                                    superCat.push(cat.superCategory)
                                                    var index = _.findIndex(supercategories, { "name": cat.superCategory })
                                                        // console.log(supercategories[index])
                                                    supercategories[index].package.push(deal)
                                                }

                                            }

                                        })



                                    })

                                })
                                return res.json(CreateObjService.response(false, supercategories));

                            })


                        })


                    });

                });
            });
        });
    });
})

// ---------------------slabs----------------------------------------------

router.get('/getDealSlabs', function(req, res) {


    Slab.find({}, function(err, result) {

        if (err) {
            res.json(CreateObjService.response(true, err))
        } else {
            res.json(CreateObjService.response(false, result))

        }

    })



})

router.post('/createDealSlabs', function(req, res) {

    console.log("running")


    console.log(req.body)

    if (req.body.ranges.length > 0) {



        Slab.create({
            ranges: req.body.ranges
        }, function(err, result) {

            res.json(CreateObjService.response(false, "slab created"))

        })



    } else {

        res.json(CreateObjService.response(true, "empty array"))


    }

})

router.get('/getPackages2', function(req, res) {
    var allComboCodes = []
    var allparlorCodes = []
    var parlorServices = []
    var parlorServices2 = []
    var newParlorServices = []
    var comboArray = []
    var finalArray = []


    Deals.find({ "dealType.name": "combo", dealId: 27, parlorId: "587088445c63a33c0af62727" }, function(err, deals) {
        // console.log(deals)

        Parlor.findOne({ _id: "587088445c63a33c0af62727" }, { services: 1 }, function(err, parlor) {

            console.log(deals.length)
            _.forEach(deals, function(deal) {


                var tempDeals = []
                _.forEach(deal.services, function(deal1) {

                    tempDeals.push(deal1.serviceCode)

                })
                console.log(tempDeals)
                _.forEach(parlor.services, function(ps) {
                    if (tempDeals.indexOf(ps.serviceCode) > -1) {
                        if (ps.prices.length > 0) {
                            if (ps.prices[0].brand.brands.length > 0) {
                                var brandArray = []
                                var productArray = []

                                _.forEach(ps.prices[0].brand.brands, function(br) {

                                    if (br.products.length > 0) {

                                        _.forEach(br.products, function(p) {

                                            if (p.ratio != 0) {
                                                productArray.push({
                                                    productId: p.productId,
                                                    name: p.name,
                                                    price: ps.prices[0].price * p.ratio
                                                })
                                            }

                                        })

                                    }

                                    if (br.ratio != 0) {

                                        // console.log("produc array here", productArray)
                                        brandArray.push({

                                            brandId: br.brandId,
                                            brandPrice: ps.prices[0].price * br.ratio,
                                            brandName: br.name,
                                            products: productArray

                                        })

                                    }


                                })


                                parlorServices.push({
                                    serviceCode: ps.serviceCode,
                                    serviceName: ps.name,
                                    categoryId: ps.categoryId,
                                    serviceId: ps.serviceId,
                                    actualPrice: ps.prices[0].price,
                                    brands: brandArray,


                                })


                            } else {

                                parlorServices.push({
                                    serviceCode: ps.serviceCode,
                                    serviceName: ps.name,
                                    categoryId: ps.categoryId,
                                    serviceId: ps.serviceId,
                                    actualPrice: ps.prices[0].price,
                                    brands: [],


                                })
                            }
                        }

                        Deals.aggregate({ $unwind: "$services" }, {
                            $match: {
                                $or: [{ "dealType.name": "chooseOne" }, { "dealType.name": "chooseOnePer" }, { "dealType.name": "dealPrice" }],
                                parlorId: ObjectId("587088445c63a33c0af62727"),
                                "services.serviceCode": ps.serviceCode
                            }
                        }, function(err, filteredDeal) {




                            if (filteredDeal.length > 0) {
                                if (filteredDeal[0].hasOwnProperty('brands')) {
                                    // console.log(filteredDeal[0].brands)


                                    _.forEach(filteredDeal[0].brands, function(dsb) {
                                        _.forEach(ps.brands, function(psb, key2) {

                                            if ((psb.brandId).toString() == (dsb.brandId).toString()) {
                                                // console.log((psb.brandId).toString(),(dsb.brandId).toString())

                                                _.forEach(dsb.products, function(dsbp) {

                                                    _.forEach(psb.products, function(psbp, key3) {

                                                        if ((psbp.productId).toString() == (dsbp.productId).toString()) {

                                                            // console.log(deal.dealPrice, dsbp.ratio)
                                                            parlorServices[0].brands[key2].products[key3].price = filteredDeal[0].dealPrice * dsbp.ratio

                                                        }

                                                    })

                                                })

                                                console.log(filteredDeal[0].dealPrice, dsb.ratio)
                                                parlorServices[0].brands[key2].brandPrice = filteredDeal[0].dealPrice * dsb.ratio


                                            }

                                        })


                                    })

                                    // if (deal.brands.length == 0 && ps.brands.length == 0) {
                                    //     parlorServices[0].actualPrice = deal.dealPrice
                                    //     // console.log(parlorServices[0].actualPrice)
                                    // }

                                }


                            }


                        })

                        comboArray.push(parlorServices[0])
                    }


                })







            })









            res.json(comboArray)





            var groupedBycategory = []
            var dealPackage = []

            ServiceCategory.find({}, function(err, result) {

                _.forEach(result, function(cat) {

                    _.forEach(finalArray, function(fa) {
                        _.forEach(fa.categoryIds, function(dc) {
                            if ((cat._id).toString() == (dc).toString()) {


                                dealPackage.push(fa)
                            }

                        })

                    })


                    groupedBycategory.push({ categoryId: cat._id, categoryName: cat.name, packages: dealPackage })
                    dealPackage = []

                })


                // res.json(groupedBycategory)
            })


        })
    })

})

// -----------------------------------aadhaar--------------------------------------




router.post('/aadhharSendOtp', function(req, res) {

    console.log(req.body)
    var uid = req.body.uid

    var options = {
        url: 'https://signzy.tech/api/v2/patrons/5904361015f127161175f3ee/aadhaaresigns',
        method: 'POST',
        headers: {
            'Authorization': '2caJQ8yUxzNNpROf7Gs97tSnFM6t7jRBP3OJLJB4KCheFzNXPsdqd0HEi4yjxx2U',
            'Content-Type': 'application/json'
        },

        "form": {
            "request": "otp",

            "essentials": {

                "uid": uid

            }
        }

    };

    request(options, function(err, res1, body) {
        if (err)
            return console.log(err)
        var json = JSON.parse(body);


        console.log(json);
        res.json(CreateObjService.response(false, json));

    });


})

router.post('/aadhaarVerifyOtp', function(req, res) {


    Parlor.findOne({ _id: req.session.parlorId }, { name: 1, address: 1 }, function(err, parlor) {


        var filename = parlor.name + '@' + parlor.address + '$' + new Date().toDateString()
        console.log(filename)

        console.log("addhaar details", req.body)

        var options = {
            url: 'https://signzy.tech/api/v2/patrons/5904361015f127161175f3ee/aadhaaresigns',
            method: 'POST',
            headers: {
                'Authorization': 'pnqm7s28X5cTBTG81RsVGN0tfyvxX7rk9lvKqpeLbu4IxhbjHDsfUcrEWNAAsUNO'
            },
            form: {


                "request": "sign",

                "essentials": {

                    "uid": req.body.uid,

                    "reason": "to test esign feature",

                    "name": req.body.name,

                    "url": req.body.path,

                    "otp": req.body.otp

                }

            }

        };

        request(options, function(err, res1, body) {
            if (err)
                return console.log(err)
            var json = JSON.parse(body);
            console.log("console", json);
            console.log("consoleeeeeeeeeeeeeeeeeeeeeeeeee", json.result.result);

            request({ url: json.result.result }, function(err, response, body) {


                var file = fs.createReadStream('./uploads/doodle.pdf');
                var stat = fs.statSync('./uploads/doodle.pdf');
                console.log(stat.size)

                var options1 = {
                    url: 'https://www.googleapis.com/oauth2/v4/token',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    form: {
                        "client_id": "577956605134-7fei99avbe1264u4h9rd2hmp7u4qkfft.apps.googleusercontent.com",
                        "client_secret": 'HJrJRB2VjMidi1aCRQu0RQ5k',
                        "refresh_token": '1/SaRrhMSyzecWTqs2eIxSIeF8gX4YY-wNwVBomuVYu3_wZiQTsCUIgm3J4FXG5JJO',
                        "grant_type": 'refresh_token'
                    }

                };

                request(options1, function(err, res1, body) {
                    if (err)
                        return console.log(err)
                    var json = JSON.parse(body);

                    var accessToken = json.access_token
                    var options2 = {
                        'url': 'https://www.googleapis.com/upload/drive/v2/files?uploadType=multipart',

                        'method': 'POST',

                        'headers': {
                            'Authorization': 'Bearer ' + accessToken,
                            'Content-Type': 'application/pdf',
                            'Content-Length': stat
                        },
                        'multipart': [{
                                'Content-Type': 'application/json; charset=UTF-8',
                                'body': JSON.stringify({
                                    'name': filename,
                                    'title': filename,

                                })
                            },
                            {
                                'Content-Type': 'application/pdf',
                                'name': 'my.pdf',
                                'body': file
                            }
                        ]


                    };

                    request(options2, function(err, res1, body) {
                        if (err)
                            return console.log(err)
                        var json = JSON.parse(body);

                        ParlorMou.create({
                            fileUrl: json.webContentLink,
                            parlorId: parlor._id,
                        }, function(err, created) {
                            if (err) {
                                console.log(err)
                                res.json(CreateObjService.response(true, err));

                            } else {
                                var options3 = {
                                    'url': 'https://www.googleapis.com/drive/v3/files/' + json.id + '/permissions',

                                    'method': 'POST',

                                    'headers': {
                                        'Authorization': 'Bearer ' + accessToken,
                                        'Content-Type': 'application/json'

                                    },
                                    "body": JSON.stringify({
                                        "role": 'reader',
                                        "type": 'anyone'
                                    }),
                                    // "json": true,


                                };

                                request(options3, function(err, res1, body) {
                                    if (err)
                                        return console.log(err)
                                    var json = JSON.parse(body);
                                    console.log(json);
                                    fse.remove('./uploads/aadhaar', function() {
                                        if (err) return console.error(err)

                                        console.log('deleted success!') // I just deleted my entire HOME directory.
                                        Parlor.update({ _id: req.session.parlorId }, { $set: { unsignedMouStatus: true } }, function(err, result) {
                                            res.json(json)
                                        })

                                    })


                                });


                            }

                        })

                    });


                });


            }).pipe(fs.createWriteStream('./uploads/doodle.pdf'))


        });

    })
})

router.post('/aadhaarVerifyOtp1', function(req, res) {


    Parlor.findOne({ _id: req.session.parlorId }, { name: 1, address: 1 }, function(err, parlor) {


        var filename = parlor.name + '@' + parlor.address + '$' + new Date().toDateString()
        console.log(filename)

        console.log("addhaar details", req.body)

        var options = {
            url: 'https://signzy.tech/api/v2/patrons/5904361015f127161175f3ee/aadhaaresigns',
            method: 'POST',
            headers: {
                'Authorization': '2caJQ8yUxzNNpROf7Gs97tSnFM6t7jRBP3OJLJB4KCheFzNXPsdqd0HEi4yjxx2U'
            },
            form: {


                "request": "sign",

                "essentials": {

                    "uid": req.body.uid,

                    "reason": "to test esign feature",

                    "name": req.body.name,

                    "url": req.body.path,

                    "otp": req.body.otp

                }

            }

        };

        request(options, function(err, res1, body) {
            if (err)
                return console.log(err)
            var json = JSON.parse(body);
            console.log(json);
            res.json(json)


            request({ url: req.body.path }, function(err, response, body) {


                var file = fs.createReadStream('./uploads/doodle.pdf');
                var stat = fs.statSync('./uploads/doodle.pdf');
                console.log(stat.size)

                var options1 = {
                    url: 'https://www.googleapis.com/oauth2/v4/token',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    form: {
                        "client_id": "577956605134-7fei99avbe1264u4h9rd2hmp7u4qkfft.apps.googleusercontent.com",
                        "client_secret": 'HJrJRB2VjMidi1aCRQu0RQ5k',
                        "refresh_token": '1/SaRrhMSyzecWTqs2eIxSIeF8gX4YY-wNwVBomuVYu3_wZiQTsCUIgm3J4FXG5JJO',
                        "grant_type": 'refresh_token'
                    }

                };

                request(options1, function(err, res1, body) {
                    if (err)
                        return console.log(err)
                    var json = JSON.parse(body);

                    var accessToken = json.access_token
                    var options2 = {
                        'url': 'https://www.googleapis.com/upload/drive/v2/files?uploadType=multipart',

                        'method': 'POST',

                        'headers': {
                            'Authorization': 'Bearer ' + accessToken,
                            'Content-Type': 'application/pdf',
                            'Content-Length': stat
                        },
                        'multipart': [{
                                'Content-Type': 'application/json; charset=UTF-8',
                                'body': JSON.stringify({
                                    'name': filename,
                                    'title': filename,

                                })
                            },
                            {
                                'Content-Type': 'application/pdf',
                                'name': 'my.pdf',
                                'body': file
                            }
                        ]


                    };

                    request(options2, function(err, res1, body) {
                        if (err)
                            return console.log(err)
                        var json = JSON.parse(body);

                        ParlorMou.create({
                            fileUrl: json.webContentLink,
                            parlorId: parlor._id,
                        }, function(err, created) {
                            if (err) {
                                res.json(CreateObjService.response(true, err));

                            } else {
                                var options3 = {
                                    'url': 'https://www.googleapis.com/drive/v3/files/' + json.id + '/permissions',

                                    'method': 'POST',

                                    'headers': {
                                        'Authorization': 'Bearer ' + accessToken,
                                        'Content-Type': 'application/json'

                                    },
                                    "body": JSON.stringify({
                                        "role": 'reader',
                                        "type": 'anyone'
                                    }),
                                    // "json": true,


                                };

                                request(options3, function(err, res1, body) {
                                    if (err)
                                        return console.log(err)
                                    var json = JSON.parse(body);
                                    console.log(json);
                                    fse.remove('./uploads/aadhaar', function() {
                                        if (err) return console.error(err)

                                        console.log('deleted success!') // I just deleted my entire HOME directory.
                                        res.json(json)
                                    })


                                });


                            }

                        })

                    });


                });


            }).pipe(fs.createWriteStream('./uploads/doodle.pdf'))


        });

    })
})


router.post('/getParlorMous', function(req, res) {

    var parlorId = req.session.parlorId

    ParlorMou.find({ parlorId: parlorId }).sort({ createdAt: -1 }).exec(function(err, mou) {
        if (err) {
            res.json(CreateObjService.response(true, err));

        } else {
            res.json(CreateObjService.response(false, mou));

        }

    })


});

router.get('/getUnsignedParlorMous', function(req, res) {

    var parlorId = req.session.parlorId
    console.log(parlorId)

    Parlor.findOne({ _id: parlorId, unsignedMouStatus: true }).exec(function(err, parlor) {
        if (err) {
            res.json(CreateObjService.response(true, err));

        } else {
            if (parlor) {
                res.json(CreateObjService.response(false, parlor.unsignedMou));
            } else {
                res.json(CreateObjService.response(true, "MoU already signed or no MoU Found"));
            }

        }

    })
});

router.post('/searchOtp', function(req, res) {
    var phoneNumber = req.body.phoneNumber;
    var data = {};
    Otp.find({ phoneNumber: phoneNumber }).sort({ createdAt: -1 }).limit(1).exec(function(err, otps) {
        data.date = (otps[0].createdAt).toDateString(),
            data.otp = otps[0].otp,
            data.status = otps[0].used

        return res.json(CreateObjService.response(false, data));
    })
})

router.post('/getAuthorisedPayment', function(req, res) {
    var request = require('request');
    var RAZORPAY_KEY = localVar.getRazorKey();
    var RAZORPAY_APP_SECRET = localVar.getRazorAppSecret();
    var Razorpay = require('razorpay');
    var instance = new Razorpay({
        key_id: RAZORPAY_KEY,
        key_secret: RAZORPAY_APP_SECRET
    });
    var d = [];
    var async = require('async');
    var date = new Date()
    instance.payments.all({
        from: parseInt(HelperService.getDayStart(date).getTime() / 1000),
        to: parseInt(HelperService.getDayEnd(date).getTime() / 1000),
        count: 100,
    }).then((response) => {
        // console.log(response)
        console.log("Start Date", HelperService.getDayStart(date));
        console.log("End Date", HelperService.getDayEnd(date));
        console.log("StartTime", parseInt(HelperService.getDayStart(date).getTime() / 1000));
        console.log("endTime", parseInt(HelperService.getDayEnd(date).getTime() / 1000));
        async.parallel([
            function(done) {
                async.each(response.items, function(item, callback) {
                    // console.log(item)
                    if (item.status == "authorized") {
                        console.log(item.notes.appointmentId);
                        Appointment.findOne({ _id: item.notes.appointmentId }, function(err, appointment) {
                            if (appointment) {
                                if (appointment.parlorId == req.session.parlorId) {
                                    console.log(appointment)
                                    d.push(appointment);
                                }
                            }
                            callback();
                        });
                    } else {
                        callback();
                    }
                }, done);
            }
        ], function allTaskCompleted() {
            console.log('done');
            return res.json(d);
        });
    }).catch((error) => {
        console.log(error);
    });

    // if(req.session.parlorId.id == 4444){

    // }else{

    // }
    // AuthorizedPayment.find({})
});


// router.post('/searchCutomerActivity' ,function(req,res){
//     var
// });

router.post('/salonPerformanceReport', function(req, res) {

});


router.post('/managerPerformanceReport', function(req, res) {

});


router.post('/salonConvertAppointment', function(req, res) {
    if (req.body.apptId) {
        Appointment.update({ _id: req.body.apptId }, { $set: { updatedAt: new Date(), appBooking: 2, allPaymentMethods: [], paymentMethod: 1, status: 1, isPaid: false, bookingMethod: 2 } }, function(err, update) {
            if (update) {
                res.json(CreateObjService.response(false, update))
            } else {
                res.json(CreateObjService.response(true, update))
            }
        })
    } else {
        Appointment.find({ "client.phoneNumber": req.body.phoneNumber, status: 0, parlorId: req.session.parlorId }).sort({ createdAt: -1 }).exec(function(err, appts) {
            var data = [];
            _.forEach(appts, function(app) {
                var arr = {};
                arr.apptId = app._id,
                    arr.status = app.status,
                    arr.paymentMethod = app.paymentMethod,
                    arr.payableAmount = app.payableAmount,
                    arr.parlorName = app.parlorName,
                    arr.createdAt = app.createdAt,
                    arr.appointmentStartTime = app.appointmentStartTime.toDateString(),
                    arr.services = _.map(app.services, function(s) { return s.name })

                data.push(arr)
            });
            return res.json(CreateObjService.response(false, data));
        })
    }
});

router.post('/discountOnPurchase', function(req, res) {
    var query = { parlorId: req.body.parlorId }
    if (req.body.parlorId == null) {
        query = { parlorId: req.session.parlorId }
    }
    DisountOnPurchase.find(query, function(err, result) {
        if (err) {
            console.log(err);
            res.json(CreateObjService.response(true, err))
        } else {
            console.log(result)
            res.json(CreateObjService.response(false, result))

        }


    })

})




router.post('/monthlySettlement', function(req, res) {


    var date = new Date(req.body.date)
    var parlorId = req.body.parlorId;
    var startDate = new Date(date.getFullYear(), parseInt(date.getMonth()), 1);
    var endDate = new Date(date.getFullYear(), parseInt(date.getMonth() + 1), 1);
    console.log(startDate)
    console.log(endDate)
    console.log(parlorId)

    var query = [

        { $match: { "parlorId": ObjectId(parlorId), startDate: { $gte: startDate, $lt: endDate } } },
        { $sort: { period: 1 } },
        {
            $group: {
                _id: null,
                serviceRevenue: { $sum: "$serviceRevenue" },
                netPayable: { $sum: "$netPayable" },
                productRevenue: { $sum: "$productRevenue" },
                collectedByAffiliates: { $sum: "$collectedByAffiliates" },
                collectedByApp: { $sum: "$collectedByApp" },
                totalCollectionByParlor: { $sum: "$totalCollectionByParlor" },
                collectedByLoyalityPoints: { $sum: "$collectedByLoyalityPoints" },
                managementFee: { $last: "$amountCollectedTillDate" },
                "refundOnErp": { $sum: "$refundOnErp" },
                "refundFirstAppDigital": { $sum: "$refundFirstAppDigital" },
                "refundAppDigitalCash": { $sum: "$refundAppDigitalCash" },
                "refundAppDigitalOnline": { $sum: "$refundAppDigitalOnline" },
            }
        }
    ];
    SettlementReport.aggregate(query, function(err, sett) {

        Parlor.findOne({ _id: ObjectId(parlorId) }, {
            gstNumber: 1,
            panNo: 1,
            address: 1,
            address2: 1,
            bankName: 1,
            branchName: 1,
            bankBeneficiaryName: 1,
            accountNo: 1,
            ifscCode: 1,
        }, function(err, parlor) {

            if (err) {
                res.json(CreateObjService.response(true, err))
            } else {

                res.json(CreateObjService.response(false, { sett: sett, parlor: parlor }))



            }

        })





    })
});



router.post('/employeeWiseInvoiceReport', function(req, res) {

    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
        Appointment.aggregate([{
                $match: {
                    status: 3,
                    invoiceId: { $ne: null },
                    parlorId: ObjectId(req.body.parlorId),
                    appointmentStartTime: { $gte: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate) }
                }
            },
            {
                $unwind : "$services",
            },
            {
                $project: {
                    payableAmount: 1,
                    serviceName: "$services.name",
                    serviceCategoryId: "$services.categoryId",
                    serviceQuantity: "$services.quantity",
                    employees : "$services.employees",
                    date: { '$dateToString': { format: '%m/%d/%Y', date: '$appointmentStartTime' } },
                    // {$cond: { if: { $eq: [ "$gender", "M" ] }, then: "$maleImage", else: "$femaleImage" }}
                    subtotal: {$cond: { if: { $eq: [ "$services.discountMedium", "frequency" ] }, then: "$services.price", else: "$services.subtotal" }},
                    loyalityPoints: "$services.loyalityPoints",
                    name: "$client.name",
                    invoiceId: 1,
                    payment: "$allPaymentMethods",
                    membership: "$membershipDiscount",
                    advanceCredits: "$advanceCredits",
                    month: { $month: "$appointmentStartTime" },
                    creditUsed: 1,
                }
            },
            {
                $unwind : "$employees",
            },
            {
                $project:{
                    employeeName :"$employees.name",
                    employeeId :"$employees.employeeId",
                    employeeDistribution :"$employees.distribution",
                    payableAmount : 1,
                    net : { $subtract: ["$subtotal", "$loyalityPoints"] },
                    serviceName : 1,
                    serviceCategoryId : 1,
                    serviceQuantity : 1,
                    date : 1,
                    subtotal : 1,
                    loyalityPoints : 1,
                    name : 1,
                    invoiceId : 1,
                    payment : 1,
                    membership : 1,
                    advanceCredits : 1,
                    month : 1,
                    creditUsed : 1,
                }
            },
            {
                $lookup: {
                    from : "servicecategories",
                    localField : "serviceCategoryId",
                    foreignField : "_id",
                    as : "category",
                }
            },
            {
                $group: {
                    _id: null,
                    dates: {
                        $push: {
                            month: "$month",
                            date: "$date",
                            invoiceId: "$invoiceId",
                            name: "$name",
                            categoryName : { $arrayElemAt: [ "$category.name", 0 ] },
                            departmentName : { $arrayElemAt: [ "$category.superCategory", 0 ] },
                            serviceName : "$serviceName",
                            serviceQuantity : "$serviceQuantity",
                            employeeName : "$employeeName",
                            employeeId : "$employeeId",
                            employeeDistribution : "$employeeDistribution",
                            price: "$subtotal",
                            loyality: "$loyalityPoints",
                            net: "$net",
                            total: "$payableAmount",
                            paymentMode: "$payment",
                            type: { $cond: { if: { $gt: ["$membership", 0] }, then: "membership", else: "advanceCredits" } },
                            advanceCredits: "$advanceCredits",
                            creditUsed: "$creditUsed"
                        }
                    }
                }
            }
        ]).exec(function(err, aggregate) {
            if (err) {
                res.json(CreateObjService.response(true, err))
            } else {
                aggregate[0].dates.forEach(function(d, key){
                    d.sno = key+1;
                });
                res.json(CreateObjService.response(false, aggregate[0].dates))
            }
        })
});

router.post('/salonWisePersonalCouponReport', function(req, res) {
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    Appointment.aggregate([{
            $match: {
                status: 3,
                invoiceId: { $ne: null },
                personalCouponCode: { $ne: null },
                parlorId: ObjectId(req.body.parlorId),
                appointmentStartTime: { $gte: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate) }
            }
        },
        {
            $project: {
                payableAmount: 1,
                services: 1,
                products: 1,
                date: { '$dateToString': { format: '%m/%d/%Y', date: '$appointmentStartTime' } },
                subtotal: 1,
                loyalityPoints: 1,
                name: "$client.name",
                invoiceId: 1,
                personalCouponCode : 1,
                payment: "$allPaymentMethods",
                membership: "$membershipDiscount",
                advanceCredits: "$advanceCredits",
                month: { $month: "$appointmentStartTime" },
                net: { $subtract: ["$subtotal", "$loyalityPoints"] },
                serviceCount: { $size: "$services" },
                productCount: { $size: "$products" },
                creditUsed: 1,
            }
        },
        {
            $group: {
                _id: null,
                dates: {
                    $push: {
                        month: "$month",
                        date: "$date",
                        invoiceId: "$invoiceId",
                        name: "$name",
                        price: "$subtotal",
                        loyality: {$ceil : "$loyalityPoints"},
                        net: "$net",
                        couponCode : "$personalCouponCode",
                        total: "$payableAmount",
                        paymentMode: "$payment",
                        membership: "$membershipDiscount",
                        advanceCredits: "$advanceCredits",
                        type: { $cond: { if: { $gt: ["$membership", 0] }, then: "membership", else: "advanceCredits" } },
                        advanceCredits: "$advanceCredits",
                        service: "$serviceCount",
                        product: "$productCount",
                        creditUsed: "$creditUsed"
                    }
                }
            }
        }
    ]).exec(function(err, aggregate) {
        if (err) {
            res.json(CreateObjService.response(true, err))
        } else {
            console.log(aggregate)
            res.json(CreateObjService.response(false, aggregate[0].dates))
        }
    })
});

router.post('/salonWiseInvoiceReport', function(req, res) {
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    Appointment.aggregate([{
            $match: {
                status: 3,
                invoiceId: { $ne: null },
                parlorId: ObjectId(req.body.parlorId),
                appointmentStartTime: { $gte: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate) }
            }
        },
        {
            $project: {
                payableAmount: 1,
                services: 1,
                products: 1,
                date: { '$dateToString': { format: '%m/%d/%Y', date: '$appointmentStartTime' } },
                subtotal: 1,
                loyalityPoints: 1,
                name: "$client.name",
                invoiceId: 1,
                payment: "$allPaymentMethods",
                membership: "$membershipDiscount",
                advanceCredits: "$advanceCredits",
                month: { $month: "$appointmentStartTime" },
                net: { $subtract: ["$subtotal", "$loyalityPoints"] },
                serviceCount: { $size: "$services" },
                productCount: { $size: "$products" },
                creditUsed: 1,
            }
        },
        {
            $group: {
                _id: null,
                dates: {
                    $push: {
                        month: "$month",
                        date: "$date",
                        invoiceId: "$invoiceId",
                        name: "$name",
                        price: "$subtotal",
                        loyality: {$ceil : "$loyalityPoints"},
                        net: "$net",
                        total: "$payableAmount",
                        paymentMode: "$payment",
                        membership: "$membershipDiscount",
                        advanceCredits: "$advanceCredits",
                        type: { $cond: { if: { $gt: ["$membership", 0] }, then: "membership", else: "advanceCredits" } },
                        advanceCredits: "$advanceCredits",
                        service: "$serviceCount",
                        product: "$productCount",
                        creditUsed: "$creditUsed"
                    }
                }
            }
        }
    ]).exec(function(err, aggregate) {
        if (err) {
            res.json(CreateObjService.response(true, err))
        } else {
            console.log(aggregate)
            res.json(CreateObjService.response(false, aggregate[0].dates))
        }
    })
});

router.post('/appCashDigitalPaymentAppointments', function(req, res) {
    console.log(req.body)
    var query = {};
    if (req.session.parlorId.id == 4444) {
        var parlorIds = req.body.parlorIds ? req.body.parlorIds : [];
        query = { $match: { status: 3, appointmentStartTime: { $gte: HelperService.getDayStart(req.body.startDate), $lt: HelperService.getDayEnd(req.body.endDate) }, appointmentType: 3, appBooking: 2 } };
        if (req.body.paymentMode == 5) {
            query.$match.paymentMethod = { $in: [5, 10] }
        }
        if (req.body.paymentMode == 1) {
            console.log(req.body.paymentMethod)
            query.$match.paymentMethod = { $nin: [5, 10] }
        }
        if (req.body.minRange < 8000) {
            console.log(req.body.maxRange)
            query.$match.loyalityPoints = { $gte: req.body.minRange, $lt: req.body.maxRange }
        }
        if (req.body.minRange == 8000) {
            query.$match.loyalityPoints = { $gte: req.body.minRange }
        }
        if (parlorIds.length > 0) {
            var parl = [];
            _.forEach(parlorIds, function(p) {
                var pp = ObjectId(p);
                parl.push(pp)
            })
            query.$match.parlorId = { $in: parl }
        }

    } else {
        console.log("asddsadsa0909090")
        query = { $match: { parlorId: ObjectId(req.body.parlorId), status: 3, appointmentStartTime: { $gte: HelperService.getDayStart(req.body.startDate), $lt: HelperService.getDayEnd(req.body.endDate) }, appointmentType: 3, appBooking: 2 } };
        if (req.body.paymentMode == 5) {
            query.$match.paymentMethod = { $in: [5, 10] }
        }
        if (req.body.paymentMode == 1) {
            query.$match.paymentMethod = { $nin: [5, 10] }
        }
        if (req.body.minRange < 8000) {
            query.$match.loyalityPoints = { $gte: req.body.minRange, $lt: req.body.maxRange }
        }
        if (req.body.minRange == 8000) {
            query.$match.loyalityPoints = { $gte: req.body.minRange }
        }
    }

    console.log(query)

    Appointment.aggregate([query,
        {
            $project: {
                totalAmount: { $add: ["$subtotal", "$tax"] },
                date: { '$dateToString': { format: '%m/%d/%Y', date: '$appointmentStartTime' } },
                freePointsUsed: "$loyalityPoints",
                paymentMethod: { $cond: { if: { $eq: ["$paymentMethod", 5] }, then: "Be U App", else: "Be U Cash" } },
                freePointsRedemeed: { $subtract: ["$loyalityPoints", "$loyalityOffer"] },
                freeServicePoints: "$loyalityOffer",
                allPaymentMethods: 1,
                clientName: "$client.name",
                parlorName: 1,
                parlorAddress: 1
            }
        }, {
            $sort: {
                date: 1
            }
        }
    ]).exec(function(err, agg) {
        console.log(err)
        if (err) {
            return res.json(CreateObjService.response(true, "Something is Wrong "));
        } else {
            return res.json(CreateObjService.response(false, agg));
        }
    })
});

router.post('/report/membershipSold', function(req, res, next) {
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var parlorIds = req.body.parlorIds ? req.body.parlorIds : [];
    parlorIds = _.map(parlorIds, function(p){return ObjectId(p)});
    var data = [];
    MembershipSale.find({parlorId : {$in : parlorIds}, createdAt: { $gte: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate) } }, { price: 1, createdAt: 1, credits: 1, userId: 1, paymentMethod:1, employees:1 , expiryDate:1, membershipId:1, parlorId : 1 }, function(err, memSales) {
            console.log(err);
            async.each(memSales , function(mem , call){
                Membership.findOne({_id : mem.membershipId}, {name : 1, validFor : 1}, function(err, membership){
                    Parlor.findOne({_id : mem.parlorId}, {name : 1, address2 : 1}, function(err, parlor){
                         User.findOne({_id : mem.userId}, {firstName : 1, phoneNumber : 1, activeMembership : 1}, function(err, user){
                            Appointment.find({"client.id" : mem.userId, appointmentStartTime : {$gt : mem.createdAt}, status : 3, creditUsed : {$gt : 0}}, {appointmentStartTime : 1, creditUsed : 1, "services.name" : 1, subtotal : 1, payableAmount : 1}, function(er, appointments){
                                var obj = {
                                    price : mem.price,
                                    credits : mem.credits,
                                    date : mem.createdAt.toDateString(),
                                    createdAt : mem.createdAt,
                                    employees : mem.employees,
                                    paymentMethod : mem.paymentMethod,
                                    clientName : user.firstName,
                                    parlorName : parlor.name,
                                    parlorAddress : parlor.address2,
                                    membershipName : membership.name,
                                    clientNo : user.phoneNumber,
                                    appointments : appointments,
                                    expiryDate : membership.validFor,
                                    activeMembership : user.activeMembership
                                };
                                data.push(obj);
                                call();
                            });
                         });  
                     });  
                });  
            }, function all(){
                    console.log("done");
                     data =  _.sortBy(data, function(t) {

                        return t.createdAt.getTime() * -1
                    })
                    res.json(data);
            })
});
});

router.post('/newWeeklyReport', function(req, res) {
    console.log(req.body)
    var d = [];
    var parlorId;
    if (req.body.parlorId) {
        parlorId = req.body.parlorId
    } else {
        parlorId = req.session.parlorId
    }

    console.log(req.session.parlorId)

    console.log("startDate", HelperService.getDayStart(req.body.startDate))
    console.log("startDate", new Date(req.body.endDate).getDate())
    var endDate = HelperService.getTimeByMonthYear(new Date(req.body.endDate).getDate(), new Date(req.body.endDate).getMonth(),new Date(req.body.endDate).getFullYear())
    console.log("endDate", endDate)
    Parlor.findOne({ _id: parlorId }, { L1: 1 }, function(err, parlor) {
        Appointment.aggregate([{ $match: {
                     status: 3, 
                     parlorId: ObjectId(parlorId), 
                     appointmentStartTime: { $gte: HelperService.getDayStart(req.body.startDate), $lte: HelperService.getDayEnd(endDate) } } 
                 },
            {
                $project: {
                    week: { $week: '$appointmentStartTime' },
                    parlorName: 1,
                    parlorAddress2: 1,
                    paymentMethod: 1,
                    services: { $size: "$services" },
                    parlorId: 1,
                    serviceRevenue: 1,
                    productRevenue: 1,
                    totalRevenue: { $add: ["$serviceRevenue", "$productRevenue"] },
                    loyalityPoints: 1,
                    payableAmount: 1,
                    loyalityOffer: 1
                }
            },
            {
                $group: {
                    _id: { week: "$week" },
                    count: { $sum: 1 },
                    parlorName: { $first: "$parlorName" },
                    parlorAddress2: { $first: "$parlorAddress2" },
                    serviceRevenue: { $sum: "$serviceRevenue" },
                    services: { $sum: "$services" },
                    productRevenue: { $sum: "$productRevenue" },
                    totalRevenue: { $sum: "$totalRevenue" }
                }
            },
            {
                $project: {
                    week: 1,
                    count: "$count",
                    services: "$services",
                    parlorName: "$parlorName",
                    parlorAddress2: "$parlorAddress2",
                    serviceRevenue: "$serviceRevenue",
                    productRevenue: "$productRevenue",
                    totalRevenue: "$totalRevenue",
                    avgBill: { $divide: ["$services", "$count"] },
                    avgTicketSize: { $divide: ["$serviceRevenue", "$count"] }
                }
            },
            { $sort: { week: 1 } }
        ], function(err, agg1) {
            console.log(err)
            console.log(agg1.length)
            async.each(agg1, function(a, cb) {
                console.log(a)
                var endDate = HelperService.getWeekToDate(req.body.year, a._id.week);
                var startDate = HelperService.getCustomWeekStart(endDate)
                a.weekDate = startDate.toDateString() + "-" + endDate.toDateString();
                a.weekStart = startDate;
                a.weeklyRevenueTarget = Math.ceil((parlor.L1) / 4);

                a.appCash = { count: 0, amount: 0 }, a.appDigital = { count: 0, amount: 0 }, a.freeHairCut = { count: 0, amount: 0 }, a.freeWaxing = { count: 0, amount: 0 },
                    a.otherFreeService = { count: 0, amount: 0 }, a.newCustomer = { count: 0, amount: 0 }, a.oldCustomer = { count: 0, amount: 0 }, a.purchaseOrder = { count: 0, amount: 0 },
                    a.luckyDraw = { count: 0, amount: 0 }, a.familyWallet = { count: 0, amount: 0 }, a.departmentData = [], a.salonCashBack = 0, a.freeBieEarning = 0, a.totalBeuEarning = 0;

                Appointment.aggregate([
                    { $match: { status: 3, parlorId: ObjectId(parlorId), appointmentStartTime: { $gt: HelperService.getDayStart(startDate), $lte: HelperService.getDayEnd(endDate) } } },
                    { $unwind: "$services" },
                    { $project: { apptId: "$_id", name: "$services.name", serviceId: "$services.serviceId", price: "$services.price", quantity: "$services.quantity", categoryId: '$services.categoryId' } },
                    { $lookup: { from: "servicecategories", localField: "categoryId", foreignField: "_id", as: "serviceCategory" } },
                    { $project: { apptId: 1, serviceId: 1, name: 1, categoryId: 1, price: 1, quantity: 1, sort: { $arrayElemAt: ["$serviceCategory.sort", 0] }, supercategory: { $arrayElemAt: ["$serviceCategory.name", 0] } } },

                    {
                        $group: {
                            _id: { serviceId: "$serviceId" },
                            price: { $sum: "$price" },
                            count: { $sum: 1 },
                            supercategory: { $first: "$supercategory" },
                            sort: { $first: "$sort" },
                            name: { $first: "$name" }
                        }
                    },
                    { $group: { _id: { supercategory: "$supercategory" }, sort: { $first: "$sort" }, supercategory: { $first: "$supercategory" }, price: { $sum: "$price" }, count: { $sum: "$count" } } }, { $sort: { sort: 1 } }
                ], function(err, agg2) {

                    a.departmentData.push(agg2);

                    SettlementReport.aggregate([
                        { $match: { parlorId: ObjectId(parlorId), createdAt: { $gt: HelperService.getDayStart(startDate), $lte: HelperService.getDayEnd(endDate) } } },
                        { $project: { week: { $week: "$createdAt" }, freeBieEarning: "$collectedByLoyalityPoints", salonCashBack: { $add: ["$refundOnErp", "$refundFirstAppCash", "$refundFirstAppDigital", "$refundAppDigitalCash", "$refundAppDigitalOnline"] } } },
                        { $group: { _id: { week: "$week" }, salonCashBack: { $sum: "$salonCashBack" }, freeBieEarning: { $sum: "$freeBieEarning" } } }
                    ], function(err, settleAgg) {

                        Appointment.find({ status: 3, parlorId: parlorId, appointmentStartTime: { $gt: HelperService.getDayStart(startDate), $lte: HelperService.getDayEnd(endDate) } }, { paymentMethod: 1, appBooking: 1, appointmentType: 1, payableAmount: 1, serviceRevenue: 1, productRevenue: 1, "services.discountMedium": 1, "services.serviceCode": 1, "services.dealPriceUsed": 1, 'client.noOfAppointments': 1,loyalitySubscription:1, loyalityPoints:1, loyalityOffer:1 }, function(err, appts) {

                            Appointment.aggregate([
                                    { $match: { appointmentStartTime: { $gt: HelperService.getDayStart(startDate), $lte: HelperService.getDayEnd(endDate) }, status: 3, parlorId: ObjectId(parlorId) } },
                                    {
                                        $project: {
                                            week: { $week: "$appointmentStartTime" },
                                            clientId: '$client.id',
                                            clientAppt: '$client.noOfAppointments',
                                            revenue: { $add: ['$serviceRevenue', '$productRevenue'] }
                                        }
                                    },
                                    { $group: { _id: '$clientId', week: { $first: "$week" }, clientId: { $first: "$clientId" }, revenue: { $sum: "$revenue" }, clientAppt: { $first: "$clientAppt" } } },
                                    { $group: { _id: "$week", client: { $push: { clientAppt: "$clientAppt", revenue: "$revenue" } } } }
                                ],
                                function(err, customerAgg) {
                                    // ActiveMembership.find({'history.0.parlorId' : parlorId , 'history.0.appointmentDate' :{$gt : HelperService.getDayStart(startDate), $lte:HelperService.getDayEnd(endDate)} , "paymentMethods.value": 10},function(err,aMSales){
                                    // var userIds = _.filter(aMSales , function(a){return a.userId});  
                                    // MembershipSale.find({userId : {$in:[userIds]} ,  createdAt: { $gt: HelperService.getDayStart(startDate), $lt: HelperService.getDayEnd(endDate)}},{price:1,createdAt:1,credits:1},function(err,memSales){

                                    // ReOrder.find({parlorId : parlorId , createdAt : {$gt : HelperService.getDayStart(startDate), $lte:HelperService.getDayEnd(endDate)}},function(err,pos){

                                    // LuckyDrawDynamic.find({parlorId : parlorId ,status:0, createdAt : {$gt : HelperService.getDayStart(startDate), $lte:HelperService.getDayEnd(endDate)}},function(err,luckyDraw){
                                    _.forEach(appts, function(appt) {
                                            _.forEach(appt.services, function(serv) {

                                                if (serv.discountMedium == "frequency" && serv.dealPriceUsed == true && (serv.serviceCode == 52 || serv.serviceCode == 202)) {
                                                    a.freeHairCut.count++;
                                                    a.freeHairCut.amount += appt.loyalityOffer/2;
                                                } else if (serv.discountMedium == "frequency" && serv.dealPriceUsed == true && serv.serviceCode == 502) {
                                                    a.freeWaxing.count++;
                                                    a.freeWaxing.amount += appt.loyalityOffer/2;
                                                } else {
                                                    a.otherFreeService.count++;
                                                    a.otherFreeService.amount += appt.loyalityOffer/2;
                                                }

                                            })
                                            if (appt.client.noOfAppointments == 0) {
                                                a.newCustomer.count++;
                                                a.newCustomer.amount += (appt.serviceRevenue + appt.productRevenue)
                                            } else {
                                                a.oldCustomer.count++;
                                                a.oldCustomer.amount += (appt.serviceRevenue + appt.productRevenue)
                                            }
                                            if (appt.paymentMethod != 5 && appt.paymentMethod != 10 && appt.appBooking == 2 && appt.appointmentType == 3) {
                                                a.appCash.count++;
                                                a.appCash.amount += (appt.serviceRevenue + appt.productRevenue)
                                            } else if (appt.appointmentType == 3 && (appt.paymentMethod == 5 || appt.paymentMethod == 10)){
                                                a.appDigital.count++;
                                                a.appDigital.amount += (appt.serviceRevenue + appt.productRevenue)
                                            }
                                        })
                                        // if(memSales && memSales.length > 1 ){
                                        //     for(var i=0;i<memSales.length;i++){
                                        //         a.familyWallet.count++;
                                        //         a.familyWallet.amount += memSales[i+1].price;
                                        //         }
                                        // }
                                        // _.forEach(aMSales , function(am){
                                        //        a.familyWallet.count++;
                                        //        a.familyWallet.amount += am.price;
                                        //    });
                                        // _.forEach(pos , function(po){
                                        //        a.purchaseOrder.count++;
                                        //        a.purchaseOrder.amount += po.orderAmount;
                                        //    });
                                        //  _.forEach(luckyDraw , function(ld){
                                        //        a.luckyDraw.count++;
                                        //        a.luckyDraw.amount += ld.amount;
                                        //    });

                                    // _.forEach(customerAgg , function(cAA){
                                    //     if(cAA._id == a._id.week){
                                    //         _.forEach(cAA.client , function(cl){
                                    //             if(cl.clientAppt == 0){
                                    //                 console.log("aayaaa")
                                    //                 a.newCustomer.count++;
                                    //                 a.newCustomer.amount += cl.revenue;
                                    //             }
                                    //             else {
                                    //                 a.oldCustomer.count++;
                                    //                 a.oldCustomer.amount += cl.revenue;
                                    //             }
                                    //         })
                                    //     }
                                    // });
                                    _
                                    _.forEach(settleAgg, function(sA) {
                                        console.log("sA._id.week", sA._id.week)
                                        console.log("a._id.week", a._id.week)
                                        if (sA._id.week == a._id.week) {
                                            a.salonCashBack = Math.ceil(sA.salonCashBack);
                                            a.freeBieEarning = Math.ceil(sA.freeBieEarning);
                                            a.totalBeuEarning = Math.ceil(sA.salonCashBack + sA.freeBieEarning)
                                        }
                                    })

                                    d.push(a)
                                    cb();
                                    // })
                                    // })
                                    // })
                                })
                        })
                    })
                })

            }, function allTaskCompleted() {
                // res.json(d)


                res.json(d.sort(function(a, b) {
                    a = new Date(a.weekStart);
                    b = new Date(b.weekStart);
                    return a > b ? 1 : a < b ? -1 : 0;
                }))

            })

        })

    })
})


router.post('/parlorImages', function(req, res) {
    console.log("----------------------------", req.body.appImageUrl)
    var appImageUrl = req.body.appImageUrl
    Parlor.update({ _id: req.session.parlorId }, { $push: { images: { $each: [{ imageUrl: "", appImageUrl: appImageUrl }] } } }, function(err, parlorImages) {
        if (parlorImages) {
            res.json("Successfully updated")
        } else {
            res.json("There is some error")
        }
    })
});


// router.get('/getLedger',function(req,res){

// var multi = req.body.multi;
// var parlorId;

// if(multi){
//     parlorId=req.body.parlorId

// }else{
//     parlorId=req.session.parlorId
// }

// //  SettlementReport.find({parlorId:parlorId,startDate:{$gte:}},function(err,set){




// //  })   



// })


router.post('/salonSubscription', function(req, res) {
    
    var query = {} , parlorId = "";
    if(req.session.userTypeBeu == 1){
        if(req.body.parlorId)query._id = req.body.parlorId;
        // query = {}
    }
    else if(typeof req.session.parlorId == 'string'){
        query._id = req.session.parlorId; 
        parlorId = req.session.parlorId
    };
    console.log(query)
    Parlor.find(query , {name: 1,address2 :1, address :1}, function( err , parlors){
        console.log(parlors.length)
            let data = []
            let other =[];
            let apptSubs = [];
            async.each(parlors , function(parlor , cb){
            
                  async.parallel([
                        function(callback){
                            SubscriptionSale.getSubscriptionSoldBySalon(req.body.startDate, req.body.endDate ,parlor.id, function(err , subscriptions){
                                other = subscriptions;
                                callback(null);
                            })
                        },
                        function(callback){
                            console.log("userType" ,req.session.userTypeBeu)
                            SubscriptionSale.getSubscriptionSoldBySalonWithAppt(req.body.startDate, req.body.endDate , parlor.id, req.session.userTypeBeu, function(err , subsAppt){
                                apptSubs = subsAppt;
                                callback(null);
                            })
                        }
                    ], function(err , results){
             
                        _.forEach(other , function(o){
                            o.purchaseSalon = parlor.name +' - '+ parlor.address2
                            data.push(o)
                        })
                        _.forEach(apptSubs , function(a){
                            
                            data.push(a)
                        })

                        // var count = d.length;
                        cb()
                        
                    })
              }, function allDone(){
                    return res.json(CreateObjService.response(false, {subscriptions : data , count : data.length}));
              })
  
    })
});

router.get('/getDataForLedger', function(req, res) {
    console.log(req.query.parlorId);
    var parlorId = "";
    if (req.query.parlorId!='1') {
        console.log("heres")
        parlorId = req.query.parlorId
    } else {
        req.query.parlorId = req.session.parlorId;
        parlorId=req.session.parlorId;
        console.log("heres salon vala")

    }
    // var parlorId = "587088445c63a33c0af62727"
    console.log(parlorId)
    console.log("hit")
    var date = new Date(req.query.date)
    var m = date.getMonth()
    var y = date.getFullYear();
    var startDate = HelperService.getFirstDateOfMonth(y, m);
    var endDate = HelperService.getLastDateOfMonth1(y, m);
    console.log(startDate)
    console.log(endDate)
    var query = {
        parlorId: ObjectId(parlorId),
        startDate: { $gte: new Date(startDate), $lt: new Date(endDate) }
    }

    console.log(query)
    console.log(y)
    console.log(m)
    SettlementReport.find(query, function(err, Settlement) {
        DisountOnPurchase.findOne({ discountPaid: { $ne: null }, parlorId: parlorId, purchase: null, createdAt: { $gte: HelperService.getFirstDateOfMonth(y, m), $lte: HelperService.getLastDateOfMonth1(y, m) } }, function(err, discount) {

            // var disStar
            var newObj = {};
            console.log(err)
            if (discount) {
                var neww_d = new Date(discount.createdAt);
                newObj['discountPaid'] = discount.discountPaid
                var disdate = new Date(discount.createdAt);
                var mm = disdate.getMonth() - 1;
                var yy = disdate.getFullYear();
                var startDateDis = HelperService.getFirstDateOfMonth(yy, mm);
                var endDateDis = HelperService.getLastDateOfMonth(yy, mm);

                newObj['startDate'] = startDateDis;
                newObj['endDate'] = endDateDis;
                console.log("newwwwwwwww", neww_d.getMonth())

                newObj['matchDate'] = new Date(neww_d.setMonth(neww_d.getMonth()));
                newObj['paymentDate'] = discount.createdAt;
            }
            Gsttransfer.find({ parlorId: req.query.parlorId, createdAt: { $gte: HelperService.getFirstDateOfMonth(y, m), $lte: HelperService.getLastDateOfMonth1(y, m) } }, function(err, transfer) {
                SubsTransfer.find({ parlorId: req.query.parlorId, createdAt: { $gte: HelperService.getFirstDateOfMonth(y, m), $lte: HelperService.getLastDateOfMonth1(y, m) } }, function(err, substransfer) {

                    console.log(err)
                    console.log(transfer)
                    var newObj2 = {};
                    var newObj3 = {};

                    if (transfer.length > 0) {

                        var transdate = new Date(transfer[0].createdAt);
                        var mmm = transdate.getMonth() - 1;
                        var yyy = transdate.getFullYear();
                        var startDatetrans = HelperService.getFirstDateOfMonth(yy, mm);
                        var endDatetrans = HelperService.getLastDateOfMonth(yy, mm);
                        newObj2['startDate'] = startDatetrans;
                        newObj2['endDate'] = endDatetrans;
                        newObj2['amount'] = transfer[0].amount;
                        newObj2['paymentDate'] = transfer[0].paymentDate;
                        newObj2['createdAt'] = transfer[0].time ? transfer[0].time : transfer[0].createdAt;
                    }
                    if (substransfer.length > 0) {

                        var substransdate = new Date(substransfer[0].createdAt);
                        var mmm = substransdate.getMonth() - 1;
                        var yyy = substransdate.getFullYear();
                        var startDatetranss = HelperService.getFirstDateOfMonth(yy, mm);
                        var endDatetranss = HelperService.getLastDateOfMonth(yy, mm);
                        newObj3['startDate'] = startDatetranss;
                        newObj3['endDate'] = endDatetranss;
                        newObj3['amount'] = substransfer[0].amount;
                        newObj3['paymentDate'] = substransfer[0].paymentDate;
                        newObj3['createdAt'] = substransfer[0].time ? substransfer[0].time : substransfer[0].createdAt;
                    }

                    var data = {
                        settlement: Settlement,
                        Discount: newObj,
                        gstAmountTransfer: transfer.length > 0 ? newObj2 : [],
                        subsAmountTransfer: substransfer.length > 0 ? newObj3 : []
                    }
                    res.json(CreateObjService.response(false, data))

                }).sort({ $natural: -1 }).limit(1);
            }).sort({ $natural: -1 }).limit(1);
        });
    }).sort({ startDate: 1 });

})

router.get('/getSettlementMonthlyInvoice', function(req, res) {
    var query = { parlorId: req.session.parlorId };
    if(req.query.month)query.month = parseInt(req.query.month);
    if(req.query.year)query.year = parseInt(req.query.year);
    SettlementMonthlyInvoice.findOne(query , function(err , invoice){
        if(invoice)
            return res.json(CreateObjService.response(false, invoice)) 
        else
            return res.json(CreateObjService.response(true , 'The Invoice for this month does not exist'));
    }); 
});

router.get('/getsongList' , function(req, res){
    var arr =[ { "songId" : "1","name" : "Despacito ft. Daddy Yankee","songUrl":"https://s3.ap-south-1.amazonaws.com/songsforbeu/55+flo+rida+right+ro.mp3"},
                {"songId" : "2","name" : "song 2","songUrl":"https://s3.ap-south-1.amazonaws.com/songsforbeu/Atif+Aslam+new+song+2015.mp3"},
                {"songId" : "3","name" : "song 3","songUrl":"https://s3.ap-south-1.amazonaws.com/songsforbeu/Avicii+-+Broken+Arrows.mp3"},
                {"songId" : "4","name" : "song 4","songUrl":"https://s3.ap-south-1.amazonaws.com/songsforbeu/Bezubaan__ABCD__-_Mohit_Chauhan_-190Kbps__MP3Kh.mp3"}, 
                {"songId" : "5","name" : "song 5","songUrl":"https://s3.ap-south-1.amazonaws.com/songsforbeu/Bruno-Mars-Treasure.mp3"}]
    return res.json(CreateObjService.response(false , arr));
})


router.get('/salonSupportReport', function(req, res) {
    var query = {};
    console.log("session" ,req.query.parlorId)
    if (req.query.parlorId) query.parlorId = req.query.parlorId;
    if (req.query.month.length> 0) {
        query.usageMonth ={ $in : req.query.month }
    };
    if (req.query.year) query.usageYear = req.query.year;
console.log("query" , query)
    SalonSupportData.find(query, function(err, salonSupport) {
        if(salonSupport){
            var data = {currentAmountUsage: 0 , currentMonthUsageAllowed: 0, royalityAmount: 0 , supportProvided: 0, projectedRevenue: 0, 
                supportTypes: [
                                
                                {
                                    supportCategoryId: "5b07c343885fca10041b35b5",
                                    supportTypeName: "Be U Clients",
                                    supportCategoryName: "Be U Driven Support",
                                    totalUsageAllowed: 0,
                                    previousBalance: 0,
                                    usageThisMonth: 0,
                                },
                                {
                                    supportCategoryId: "5b07c358885fca10041b35b6",
                                    supportTypeName: "Discount",
                                    supportCategoryName: "Salon Driven Support",
                                    totalUsageAllowed: 0,
                                    previousBalance: 0,
                                    usageThisMonth: 0,
                                },
                                 {
                                    supportCategoryId: "5b07c358885fca10041b35b6",
                                    supportTypeName: "Loyality",
                                    supportCategoryName: "Salon Driven Support",
                                    totalUsageAllowed: 0,
                                    previousBalance: 0,
                                    usageThisMonth: 0,
                                }
                        ]};
            _.forEach(salonSupport , function(sal){
                data.currentAmountUsage += sal.currentAmountUsage;
                data.currentMonthUsageAllowed += sal.currentMonthUsageAllowed;
                data.royalityAmount += sal.royalityAmount;
                data.supportProvided += sal.supportProvided;
                data.projectedRevenue += sal.projectedRevenue;

                _.forEach(sal.supportTypes , function(supp){
                        if(supp.supportTypeName == "Be U Clients"){
                            data.supportTypes[0].totalUsageAllowed += supp.totalUsageAllowed;
                            data.supportTypes[0].previousBalance += supp.previousBalance;
                            data.supportTypes[0].usageThisMonth += supp.usageThisMonth;
                        }
                        if(supp.supportTypeName == "Discount"){
                            data.supportTypes[1].totalUsageAllowed += supp.totalUsageAllowed;
                            data.supportTypes[1].previousBalance += supp.previousBalance;
                            data.supportTypes[1].usageThisMonth += supp.usageThisMonth;
                        }
                        if(supp.supportTypeName == "Loyality"){
                            data.supportTypes[2].totalUsageAllowed += supp.totalUsageAllowed;
                            data.supportTypes[2].previousBalance += supp.previousBalance;
                            data.supportTypes[2].usageThisMonth += supp.usageThisMonth;
                        }
                })
            })

        res.json(CreateObjService.response(false, data));
        console.log("salon data", data)
        } else{
            res.json(CreateObjService.response(false, 'no data found'));
        console.log("salon data", data)
        }
    })

});


router.get('/cancelledAppointmentDetail' , function( req, res){
    Appointment.find({parlorId : req.session.parlorId , status :2, mode : 3}, {payableAmount :1, cancelComment :1, 'client.name' : 1, 'client.phoneNumber' :1, 'services.name' :1}, function( err , appointments){
        if(!err)
            res.json(CreateObjService.response(false , appointments));
        else
            res.json(CreateObjService.response(true , 'No data found'));

    })
});


router.post('/subscriptionFromSalon' , function(req, res){
    console.log("req.body.amount", req.body.amount)
    if(req.body.amount == 1699 || req.body.amount == 1199 || req.body.amount == 699 || req.body.amount == 199){
        let subscriptionId = (req.body.amount == 899) ? 2: 1;
        let phoneNumber = req.body.phoneNumber;
            User.findOne({phoneNumber : phoneNumber}, function(err, userFound){
                if(userFound && (!userFound.subscriptionId || userFound.subscriptionId == 0 || userFound.subscriptionId == null)){
                   
                    SubscriptionSale.createSubscriptionAppointment(req.session.parlorId, subscriptionId,req.body.amount, null, 3, userFound, req.body.paymentMethod, function(err , d){

                        Appointment.addSubscriptionToUser(req.session.parlorId, userFound.id, userFound.createdAt, { id: "salon"+req.session.parlorId+ (new Date().getTime()) }, req.body.amount,'SALON',  'salon', function(r) {
                            if(r){
                                SubscriptionSale.update({userId : userFound.id}, {paymentMethod : req.body.paymentMethod} , function(err, update){
                                    if(req.body.amount == 1699 || req.body.amount == 1199 || req.body.amount == 699 || req.body.amount == 199){
                                        LuckyDrawDynamic.onSalonSubscription(req.body.employees , req.session.parlorId , userFound.firstName)
                                    }
                                    return res.json(CreateObjService.response(false, 'Subscription Added Successfully'));
                                })
                            }
                        });
                    })
                }else if(userFound && (userFound.subscriptionId == 1 || userFound.subscriptionId == 2)){
                    if(HelperService.getNoOfDaysDiff(new Date(), userFound.subscriptionBuyDate)> 330){
                        SubscriptionSale.createSubscriptionAppointment(req.session.parlorId, subscriptionId,req.body.amount, null, 3, userFound, req.body.paymentMethod, function(err , d){

                            Appointment.addSubscriptionToUser(req.session.parlorId, userFound.id, userFound.createdAt, { id: "salon"+req.session.parlorId+ (new Date().getTime()) }, req.body.amount,'BEURENEW',  'salon', function(r) {
                                if(r){
                                    SubscriptionSale.update({userId : userFound.id}, {paymentMethod : req.body.paymentMethod} , function(err, update){
                                        if(req.body.amount == 1699){
                                            LuckyDrawDynamic.onSalonSubscription(req.body.employees , req.session.parlorId , userFound.firstName)
                                        }
                                        return res.json(CreateObjService.response(false, 'Subscription Added Successfully'));
                                    })
                                }
                            });
                        })    
                    }else{
                        return res.json(CreateObjService.response(true, 'Subscription Already Present'));
                    }
                }
                else{
                    User.find().count(function(err, count) {
                        let user = SubscriptionSale.createUserForSubscription({phoneNumber : phoneNumber , emailId: req.body.emailId , firstName : req.body.firstName, gender : req.body.gender});
                        user.customerId = ++count;
                        User.create(user, function(err, newUser) {
                            if (err) return res.json(CreateObjService.response(true, 'There is some error'));
                            else {

                                SubscriptionSale.createSubscriptionAppointment(req.session.parlorId, subscriptionId, req.body.amount, null, 3, newUser, req.body.paymentMethod, function(err , d){

                                    Appointment.addSubscriptionToUser(req.session.parlorId, newUser.id, newUser.createdAt, { id: "salon"+req.session.parlorId+ (new Date().getTime()) }, req.body.amount, 'SALON',  'salon', function(r) {
                                        if(r){
                                            SubscriptionSale.update({userId : newUser.id}, {paymentMethod : req.body.paymentMethod} , function(err, update){
                                                if(req.body.amount == 1699){
                                                    LuckyDrawDynamic.onSalonSubscription(req.body.employees , req.session.parlorId, newUser.firstName)
                                                }
                                                return res.json(CreateObjService.response(false, 'Subscription Added Successfully'));
                                            })
                                        }
                                    });
                                })
                            }
                        });
                    });
                }
            })       
    }else{
        res.json('done')
    }
    
});


router.get('/getSubscriptionPriceInSalon' , function(req, res){
    Parlor.findOne({_id: req.session.parlorId}, {earlyBirdOfferType:1, earlyBirdOfferPresent:1} , function(err, parlor){
        if(parlor.earlyBirdOfferPresent == true){
            let earlyBirdOfferAmount = (parlor.earlyBirdOfferType ==1) ? 699 : 1199
            return res.json(CreateObjService.response(false , {price : earlyBirdOfferAmount}));
        }
        else
            return res.json(CreateObjService.response(false , {price : 1699}));
    })
})

router.post('/settlementLedger' , function(req, res){
    if (typeof req.session.parlorId != 'string') {
        SettlementLedger.findOne({parlorId: req.body.parlorId , month : (req.body.month +1) , year : req.body.year},{parlorName:1 , month:1, previousDues:1, previousMonthRoyalty:1, totalRecoverable:1, monthWiseDetail:1,monthlyTCS:1,monthlyTDS:1,quarterSettlementAmount:1,productDiscount:1,gstDeduction:1}, function(err , ledgerData){
            return res.json(CreateObjService.response(false , ledgerData));
        })
    } else if (req.session.parlorId) {
        SettlementLedger.findOne({parlorId: req.session.parlorId , month : (req.body.month +1) , year : req.body.year},{parlorName:1 , month:1, previousDues:1, previousMonthRoyalty:1, totalRecoverable:1, monthWiseDetail:1,monthlyTCS:1,monthlyTDS:1,quarterSettlementAmount:1,productDiscount:1,gstDeduction:1}, function(err , ledgerData){
            return res.json(CreateObjService.response(false , ledgerData));
        })
    }
    
})



router.post('/appointmentSearchUser', function(req, res) {
    Appointment.find({ "client.phoneNumber": req.body.apptPhoneNumber, status: { $in: [1, 2, 3, 4] } }, {
        otp:1,
        parlorAddress2: 1,
        status: 1,
        payableAmount: 1,
        appointmentType:1,
        'services.name': 1,
        'services.discountMedium': 1,
        appointmentStartTime: 1,
        couponLoyalityPoints: 1,
        couponLoyalityCode: 1,
        parlorName: 1,
        parlorId:1,
        loyalityPoints: 1,
        loyalitySubscription: 1,
        creditUsed: 1,
        membersipCreditsLeft: 1, subscriptionAmount :1,
        loyalityOffer: 1, bookingMethod : 1, paymentMethod :1,
        employees :1,
        appointmentType :1, 
        productRevenue:1, 
        bookingMethod: 1, latitude: 1, longitude: 1, 
        serviceRevenue: 1, mode: 1, appBooking: 1, client: 1, couponCode: 1
    }).sort({appointmentStartTime:-1}).exec(function(err, appts) {
        console.log(err)
        User.findOne({ "phoneNumber": req.body.apptPhoneNumber }, { creditsHistory: 1 }, function(err, user) {
            var data = [];
            async.each(appts, function(app , call) {

            Parlor.findOne({_id: app.parlorId}, {geoLocation :1} , function(err , parl){

            var isBeUClient = 'No' , insideSalon = 'No';
                    if(app.latitude == null)app.latitude = 0;
                    if(app.longitude == null)app.longitude = 0;

                    if ( app.appointmentType == 3 || app.couponCode || app.mode==5 || app.mode == 7 || app.mode == 9) {
                        
                        var distance = HelperService.getDistanceBtwCordinates1(parl.geoLocation[1], parl.geoLocation[0], app.latitude, app.longitude)
                        
                        if ((distance >= 0.05 && app.appointmentType == 3) || app.mode == 5 || app.couponCode || app.mode == 7 || app.mode == 9) {
                            
                            if (app.client.noOfAppointments == 0 || app.couponCode) isBeUClient = "Yes"
                        } else if(distance < 0.05 && app.appointmentType == 3) {
                            insideSalon = 'Yes';
                        }
                    }
                var arr = {};
                    arr.clientNoOfAppointments = app.client.noOfAppointments,
                    arr.appointmentId = app._id,
                    arr.insideSalon = insideSalon,
                    arr.isBeUClient = isBeUClient,
                    arr.otp = app.otp,
                    arr.status = app.status,
                    arr.employees = _.map(app.employees , function(emp){return emp.name}),
                    arr.payableAmount = app.payableAmount,
                    arr.services = app.services,
                    arr.creditUsed = app.creditUsed,
                    arr.membersipCreditsLeft = app.membersipCreditsLeft,
                    arr.parlorName = app.parlorName + "-" + app.parlorAddress2,
                    arr.loyalityPoints = app.loyalityPoints,
                    arr.subscriptionLoyalityPoints = app.loyalitySubscription,
                    arr.freeServiceLoyality = app.loyalityOffer - app.loyalitySubscription,
                    arr.couponLoyalityPoints = app.couponLoyalityPoints,
                    arr.couponLoyalityCode = (app.couponLoyalityCode == "REFER30") ? "REFER25" : app.couponLoyalityCode,
                    arr.appointmentStartTime = app.appointmentStartTime.toLocaleString(),
                    arr.appointmentStartAt = app.appointmentStartTime.getTime(),
                    arr.subscriptionAmount = app.subscriptionAmount,
                    arr.paymentMethod = (app.appointmentType == 3 && (app.paymentMethod == 5 || app.paymentMethod == 10)) ? 'Online' : ((app.appointmentType == 3 && (app.paymentMethod != 5 || app.paymentMethod != 10))  ? 'App-cash' : (app.paymentMethod == 11 ? 'Affiliate' :'Cash')),

                    _.forEach(user.creditsHistory, function(cH) {
                        if (cH.source != null) {
                            if ((cH.source).toString() == (app._id).toString()) {
                                if (cH.reason == "100% cashback" || cH.reason == "50% cashback" || cH.reason == "10% cashback" || cH.reason == "200% cashback") {
                                    arr.cashBack = cH.amount;
                                }
                            }
                        }
                    });
                    data.push(arr)
                    call();
                })
            }, function all(){

                data = _.sortBy(data, 'appointmentStartAt').reverse()

                return res.json(CreateObjService.response(false, data));
            });
        })
    })
});


router.post('/searchUserForReviews', function(req, res) {
    var query = {};
    if (req.body.phoneNumber) {
        query = { phoneNumber: req.body.phoneNumber }
    } else if (req.body.name) {
        query = { firstName: { $regex: req.body.name } }
    } else if (req.body.emailId) {
        query = { emailId: { $regex: req.body.emailId } }
    }
    User.findOne(query, {
        freeHairCutBar: 1,
        firstName: 1,
        phoneNumber: 1,
        freeServices: 1,
        emailId: 1,
        loyalityPoints: 1,
        referalLoyalityPoints: 1,
        createdAt: 1,
        creditsHistory: 1,
        referCode: 1,
        referCodeBy: 1,
        isCorporateUser: 1,
        corporateEmailId: 1,
        subscriptionValidity: 1,
        subscriptionBuyDate :1,
        subscriptionRedeemMonth: 1,
        subscriptionRedeemHistory: 1,
        subscriptionId: 1,
        subscriptionReferalHistory: 1,
        gender: 1,
        subscriptionBuyDate: 1,
    }, function(err, user) {

        var data = [];
        // _.forEach(users, function(user) {
        var arr = {
            clientName: user.firstName,
            clientNumber: user.phoneNumber,
            emailId: user.emailId,
            gender: user.gender,
            loyaltyPoints: user.loyalityPoints,
            referralLoyaltyPoints: user.referalLoyalityPoints,
            createdAt: user.createdAt.toDateString(),
            freeService: user.freeServices,
            referCode: user.referCode,
            freeHairCutBar: user.freeHairCutBar,
            corporateEmailId: (user.isCorporateUser == true) ? user.corporateEmailId : "",
            totalReferal: 0,
            referals: []
        };

        if (user.subscriptionId) {

            var cycleData = ParlorService.getSubscriptionStartEndDate(user.subscriptionBuyDate, user.subscriptionValidity);
            var thisMonthCycle = cycleData.monthlyBalanceStart.toDateString()+' - '+cycleData.monthlyBalanceEnd.toDateString();

            arr.subscriptionValidity = user.subscriptionValidity;
            arr.subscriptionCycle = thisMonthCycle;
            arr.subscriptionIdType = (user.subscriptionId == 1) ? "GOLD" : "SILVER"
            arr.subscriptionRedeemMonth = (user.subscriptionRedeemMonth.month == -1) ? 'No Redemption Made' : (user.subscriptionRedeemMonth.month);
            arr.subscriptionRedeemAmount = (user.subscriptionRedeemMonth.month == -1) ? 'No Redemption Made' : user.subscriptionRedeemMonth.amount
            arr.subscriptionReferal = user.subscriptionReferalHistory.length
            arr.subscriptionRedeemHistory = []
            arr.subscriptionBuyDate = user.subscriptionBuyDate ? user.subscriptionBuyDate.toDateString() : "";
            if (user.subscriptionRedeemHistory.length > 0) {
                var subsRefer = [];
                _.forEach(user.subscriptionRedeemHistory, function(sub) {
                   
                    var subsObj = {};
                    subsObj.date = sub.appointmentStartTime.toDateString();
                    subsObj.amount = sub.amount;

                    subsRefer.push(subsObj)
                })
                arr.subscriptionRedeemHistory = subsRefer;
            }
        } else {
            arr.subscriptionIdType = 'No Subsctiption'
        }
        _.forEach(user.creditsHistory, function(cR) {
            if (cR.reason == "Referal") {
                arr.totalReferal++;
            }
        });
        data.push(arr)
            // });
        return res.json(CreateObjService.response(false, data));
    })
});


module.exports = router;