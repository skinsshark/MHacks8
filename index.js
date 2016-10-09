var express = require('express');
var app = express();
var http = require('http');
var https = require('https');
var fs = require('fs');

var bodyParser = require('body-parser');
app.use(bodyParser.json());

var request = require('request');



app.get('/song.m4a', function(req, res){
  var externalReq = http.request({
       hostname: "a1126.phobos.apple.com",
       path: "/us/r1000/074/Music2/v4/d3/02/b6/d302b624-b97e-a55b-4035-e96a5cd63a5e/mzaf_726853883417276588.aac.m4a"
   }, function(externalRes) {
       res.setHeader("content-disposition", "attachment; filename=song.m4a");
       externalRes.pipe(res);
   });
   externalReq.end();
})

// respond with "hello world" when a GET request is made to the homepage
app.post('/', function(req, res) {
  if (req['body']['request']['type'] === "LaunchRequest" ) { //|| req['body']['request']['intent']['name']==="Start"){
    var response = {
            "version": "1.0",
            "response": {
                "shouldEndSession": false,
                "outputSpeech": {
                    "type": "SSML",
                    "ssml": "<speak>What lyrics do you want to hear?</speak>"
                }
            }
        } //what we want Alexa to respond with

        return res.json(response);
  }
  console.log(req['body']['request']);
  // var term = req.body.request.intent.slots.Song.value;
  var term = req['body']['request']['intent']['slots']['Song']['value'];

  //search url
  var spotifyURL ="https://api.spotify.com/v1/search?type=track&limit=1&q=";
  var googleURL="https://www.googleapis.com/customsearch/v1element?key=AIzaSyCVAXiUzRYsML1Pv6RwSG1gunmMikTzQqY&rsz=filtered_cse&num=10&hl=en&prettyPrint=true&source=gcsc&gss=.com&sig=33c7bfb92330999684a54e63dca8bb29&cx=015977173612723478991:ez8fvazfs9w&sort=&googlehost=www.google.com&oq=we%27ll%20never%20drink%20your%20medince&gs_l=partner.3...4757.17038.9.17148.42.30.12.0.0.0.336.3032.18j7j3j1.29.0.gsnos%2Cn%3D13...0.17021j47983047j44j3..1ac.1.25.partner..228.0.0.k052hMh-2YY&callback=google.search.Search.apiary5673&nocache=1475962889923&q=";


  request(googleURL+encodeURI(term), function(error, response, body) {

    var str =body.replace("// API callback",'').replace('google.search.Search.apiary5673(', '');
    str = str.slice(0,str.length-3);
    var json = JSON.parse(str);


    var resultsarr = json.results;
    var result = resultsarr[0].title.replace('<b>','').replace('</b>', '').replace('&#39;', "'").replace('LYRICS', '').replace('-', '');

    console.log(result);

    var query = result;

    request('https://itunes.apple.com/search?term='+encodeURIComponent(query)+'&limit=1&entity=song', function (error, response, body) {
      if (!error && response.statusCode == 200) {
        // console.log(body) // Show the HTML for the Google homepage.
        var jsonParsed = JSON.parse(body);
        var previewUrl = jsonParsed['results'][0]['previewUrl'];
        console.log(jsonParsed['results'][0]['previewUrl']);

        // res.json(previewUrl); //tell express to send the info back

        var response = {
          "version": "1.0",
          "shouldEndSession": true,
          "response": {
            // "outputSpeech": {
            //   "type": "PlainText",
            //   "text": "Playing your music...",
            // },
            "directives": [
              {
              "type": "AudioPlayer.Play",
              "playBehavior": "REPLACE_ALL",
              "audioItem": {
                "stream": {
                  // "url": previewUrl.replace("http://", "https://"),
                  "url": "https://mhacks8.tk/song.m4a",
                  "token": "hype",
                  // "expectedPreviousToken": "string",
                  "offsetInMilliseconds": 0
                }
              }
            }
          ]
        }
      } //what we want Alexa to respond with

        res.json(response); //tell express to send the info back
      } else {
        console.log(error);
        console.log(response);
        console.log(body);
      }
    })
  });
});

app.listen(3000, function () {
});

// const options = {
//  key: fs.readFileSync('/etc/letsencrypt/live/mhacks8.tk/privkey.pem'),
//  cert: fs.readFileSync('/etc/letsencrypt/live/mhacks8.tk/fullchain.pem')
// };
//
// var port = 443;
//
// var server = https.createServer(options, app).listen(port, function(){
//  console.log("Express server listening on port " + port);
// });
