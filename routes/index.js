
'use strict'

var express = require('express');
var router = express.Router();

// GET home page


// GET home page

/* GET website home page. */
router.get('/sitemap', function(req, res, next) {
	var path  = require('path');
    res.sendFile('beusitemap.xml', { root: path.join(__dirname, '../public/website') });
});

router.get('/crm', function(req, res, next) {
    var session = {};
    if(!req.session.authenticated){session.role = 0; session.userName = ""; session.parlorName = ""; }
    else session = req.session;
    return res.render('index', { title: 'BeU Salons', session : session, pages : [] });
});

router.get('/oldWebsite', function(req, res, next) {
    var path  = require('path');
    res.sendFile('index.html', { root: path.join(__dirname, '../public/website') });
});

router.get('*', function(req, res, next) {
    var path  = require('path');
    // res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.sendFile('index.html', { root: path.join(__dirname, '../public/build') });
});



router.get('/mWebsite', function(req, res, next) {
    var path  = require('path');
    res.sendFile('index.html', { root: path.join(__dirname, '../public/build') });
});

router.get('/mWebsite/*', function(req, res, next) {
	var path  = require('path');
    res.sendFile('index.html', { root: path.join(__dirname, '../public/build') });
});

// app.get('/alpha', (req, res) => res.sendFile(__dirname + '/public/index.html'))


// router.get('*', function(req, res, next) {
// 	var path  = require('path');
// 	console.log("DSAdsasdadsa");
//     res.sendFile('index.html', { root: path.join(__dirname, '../public/website') });
// });
module.exports = router;
