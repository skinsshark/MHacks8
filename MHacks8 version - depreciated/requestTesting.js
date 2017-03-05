  var googleURL = "https://www.googleapis.com/customsearch/v1element?key=AIzaSyCVAXiUzRYsML1Pv6RwSG1gunmMikTzQqY&num=10&hl=en&sig=33c7bfb92330999684a54e63dca8bb29&cx=015977173612723478991:ez8fvazfs9w&q=";
var searchTerm = "i think she's clever cause she prevents people from dying"

var request = require('request');

request(googleURL + encodeURI(searchTerm), function(err, res, body){
	console.log("ERR", err);
	console.log("RES", res);
	console.log("BODY", body);
	    var json = JSON.parse(body);


            var resultsarr = json.results;

            console.log("RESULTS PRE PROCESSED", resultsarr[0].title)
            var result = resultsarr[0].title.replace('<b>', '').replace('</b>', '').replace('&#39;', "'").replace('LYRICS', '').replace('-', '');

            while(result.indexOf('</b>') != -1 || result.indexOf('<b>') != -1 ){
                result = result.replace('<b>', '').replace('</b>', '');
            }

            console.log("RESULT", result)
})