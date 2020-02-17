var express = require('express');
var router = express.Router();
const fs = require('fs');
const readline = require('readline');
const google = require('googleapis');
var request = require('request');
var parser = require('xml2js').parseString;
var GoogleContacts = require('google-contacts-api');

var contacts = new GoogleContacts({ token : 'ya29.GltCB8kPivdxMNqJHU89dA0V8aquU4Epmc8f8iX1qYvrfYtf5LqafZvgZKg8JkwHhhjxlMYvep8NBbSZJYIPC7kZn_IAldZe70lXG5oBv351hwNMhqSoPyCx8HRk' });

console.log(contacts)

contacts.getContacts(function(err, contacts) {
    if(err){console.log(err)}
    console.log(contacts)
});

const SCOPES = ['https://www.google.com/m8/feeds/','https://www.googleapis.com/auth/contacts.readonly'];

const TOKEN_PATH = 'token.json';


// fs.readFile('credentials.json', (err, content) => {
//     if (err) return console.log('Error loading client secret file:', err);
//     // Authorize a client with credentials, then call the Gmail API.
//     authorize(JSON.parse(content), listLabels);
// });

function authorize(credentials, callback) {
    console.log(credentials)
    const {client_secret, client_id, redirect_uris} = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
    });
}


function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return console.error('Error retrieving access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
            if (err) return console.error(err);
            console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

function listLabels(oAuth2Client){
    fs.readFile('contactapi.xml',"utf8",(err,data)=>{
        console.log(oAuth2Client.credentials.access_token)
        // parser(data, (err,result)=>{if(err)console.log(err)
        //     else console.log(result)});
        var options = {
            url: 'https://www.google.com/m8/feeds/contacts/megha9673@gmail.com/full',
            method: 'POST',
            headers: {
                'Content-type': 'application/atom+xml',
                'GData-Version': '3.0',
                'Authorization': 'Bearer ' + oAuth2Client.credentials.access_token
            },
            raw: data
        };
    
        request(options, function(err, res1, body) {
            if (err)
                return console.log(err)
            console.log(body)
        });
    })
}

router.get('/test',(req,res)=>{
    res.json({message:'done'})
})

router.get('/getToken',(req,res)=>{
    console.log('worked')
    res.json({message:'done'})
})

module.exports = router;