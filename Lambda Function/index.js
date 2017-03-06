const Alexa = require('alexa-sdk');
var request = require('request');

const APP_ID = "amzn1.ask.skill.b5515151-6578-45c8-ac58-8780865e6d53";

const responses = {
    ASK_MESSAGE: "Sing me some lyrics.",
    STOP_MESSAGE: 'Goodbye!',
    PAUSE_MESSAGE: "Anomia paused",
    RESUME_INTENT: "Anomia resumed",
    HELP_MESSAGE: "Sing some lyrics to me, and I will find the song for you.",
    SEARCH_ERROR: 'Either you must suck at singing, or I\'m just bad at listening. I couldn\'t find the song you were trying to sing',
    SEARCH_CONNECTION_ERROR: "Sorry, an error occured while I was searching for that song",
    SPOTIFY_ERROR: "I wasn't able to find a recording of that song",
    SPOTIFY_CONNECTION_ERROR: "Sorry, an error occured while I was searching for that song's recording",
    UNHANDLED_ERROR: "Speak up dude. I can't understand you.",
    SONG_FOUND: "I found the song: ",
}

//search url
var spotifyURL = "https://api.spotify.com/v1/search?type=track&limit=1&q=";
var googleURL = "https://www.googleapis.com/customsearch/v1element?key=AIzaSyCVAXiUzRYsML1Pv6RwSG1gunmMikTzQqY&num=10&hl=en&sig=33c7bfb92330999684a54e63dca8bb29&cx=015977173612723478991:ez8fvazfs9w&q=";

const handlers = {
    'LaunchRequest': function() {
        console.log("LAUNCH REQUEST RECEIVED", this.event);
        this.emit(':ask', responses.ASK_MESSAGE, responses.ASK_MESSAGE);
    },
    'GetSongIntent': function() {
        console.log("GET SONG INTENT RECEIVED", this.event);
        var speechOutput = this.event.request.intent.slots.Song.value;

        console.log("speechoutput", speechOutput);

        var alexaIntent = this;

        //what we want Alexa to respond with
        request(googleURL + encodeURI(speechOutput), function(err, resp, body) {

            if (err) {
                console.log("ERROR WHILE SEARCHING FOR SONG", error)
                alexaIntent.emit(":tell", responses.SEARCH_CONNECTION_ERROR)
            }

            try {

                console.log("RESPONSE FROM GOOGLE RECEIVED", resp, body);
                //find the first song that matches the search term, parse it and clean up the text
                var result = JSON.parse(body).results[0].title;
                while (result.indexOf('</b>') != -1 || result.indexOf('<b>') != -1 || result.indexOf('&#39;') != -1 || result.indexOf('LYRICS') != -1) {
                    result = result.replace('<b>', '').replace('</b>', '').replace('&#39;', "'").replace('LYRICS', '');
                }

                console.log("FOUND A SONG FROM GOOGLE SUCCESSFULLY", result);
                alexaIntent.response.speak(responses.SONG_FOUND + result);

                request(spotifyURL + encodeURI(result), function(err, resp, body) {

                    if(err){
                        console.log("ERROR FROM SPOTIFY API", err);
                        alexaIntent.response.speak(responses.SPOTIFY_CONNECTION_ERROR + result);
                        alexaIntent.emit(':responseReady');
                    }

                    try {
                        console.log("RESPONSE FROM SPOTIFY RECEIVED", resp, body);

                        var bodyJSON = JSON.parse(body);
                        var streamingURL = bodyJSON.tracks.items[0].preview_url;

                        console.log("STREAMING URL FOUND", streamingURL);

                        alexaIntent.response.audioPlayerPlay("REPLACE_ALL", streamingURL, "token", null, 0);
                        alexaIntent.emit(':responseReady');

                    } catch (err) {
                        console.log("ERROR WHILE TRYING TO FIND SPOTIFY URL", err);

                        alexaIntent.response.speak(responses.SONG_FOUND + result + ", but " + responses.SPOTIFY_ERROR);
                        alexaIntent.emit(':responseReady');

                    }
                });
            } catch (err) {
                console.log("ERROR WHILE SEARCHING OR PARSING SONG RESULT", err, body);
                alexaIntent.response.speak( responses.SEARCH_ERROR);
                alexaIntent.emit(':responseReady');
            }
        });


    },
    'AMAZON.HelpIntent': function() {
        console.log("HELP INTENT RECEIVED", this.event);
        this.emit(':ask', responses.HELP_MESSAGE, responses.HELP_MESSAGE);
    },
    'AMAZON.CancelIntent': function() {
        console.log("CANCEL INTENT RECEIVED", this.event);
        this.response.audioPlayerStop();
        this.emit(':tell', responses.STOP_MESSAGE);
    },
    'AMAZON.StopIntent': function() {
        console.log("STOP INTENT RECEIVED", this.event);
        this.response.audioPlayerStop();
        this.emit(':tell', responses.STOP_MESSAGE);
    },
    'AMAZON.PauseIntent' : function(){
        console.log("PAUSE INTENT RECEIVED", this.event);

        this.response.audioPlayerStop();
        this.emit(':tell', responses.PAUSE_MESSAGE);
    },
    'AMAZON.ResumeIntent' : function(){
        console.log("RESUME INTENT RECEIVED", this.event);
        this.emit(':tell', responses.RESUME_INTENT);
    },
    'SessionEndedRequest': function() {
        console.log("SESSION END INTENT RECEIVED", this.event);
        this.response.audioPlayerStop();
        this.emit(':tell', responses.STOP_MESSAGE);
    },
    'Unhandled': function() {
        this.emit(':tell', responses.UNHANDLED_ERROR);
    }
};

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
