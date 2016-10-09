var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());

var request = require('request');

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
  // console.log(request.body); //what Alexa sends us

  var query = 'justin timberlake carryout';

  request('https://itunes.apple.com/search?term='+encodeURIComponent(query)+'&limit=1&entity=song', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    // console.log(body) // Show the HTML for the Google homepage.
    var jsonParsed = JSON.parse(body);
    var previewUrl = jsonParsed['results'][0]['previewUrl'];
    console.log(jsonParsed['results'][0]['previewUrl']);

    res.json(previewUrl); //tell express to send the info back


    var response = {
            "version": "1.0",
            "response": {
                "shouldEndSession": false,
                "outputSpeech": {
                    "type": "SSML",
                    "ssml": "<speak>I said something!</speak>"
                }
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

app.listen(3000, function () {
});
