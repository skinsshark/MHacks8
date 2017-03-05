var express = require('express');
var router = express.Router();
var request = require("request");

/* GET home page. */
router.get('/search', function(req, res, next) {
	var term = req.query.term;

	//search url
	var spotifyURL ="https://api.spotify.com/v1/search?type=track&limit=1&q=";
	var googleURL="https://www.googleapis.com/customsearch/v1element?key=AIzaSyCVAXiUzRYsML1Pv6RwSG1gunmMikTzQqY&rsz=filtered_cse&num=10&hl=en&prettyPrint=true&source=gcsc&gss=.com&sig=33c7bfb92330999684a54e63dca8bb29&cx=015977173612723478991:ez8fvazfs9w&sort=&googlehost=www.google.com&oq=we%27ll%20never%20drink%20your%20medince&gs_l=partner.3...4757.17038.9.17148.42.30.12.0.0.0.336.3032.18j7j3j1.29.0.gsnos%2Cn%3D13...0.17021j47983047j44j3..1ac.1.25.partner..228.0.0.k052hMh-2YY&callback=google.search.Search.apiary5673&nocache=1475962889923&q=";


	request(googleURL+encodeURI(term), function(error, response, body) {

		var str =body.replace("// API callback",'').replace('google.search.Search.apiary5673(', '');
		str = str.slice(0,str.length-3);
		var json = JSON.parse(str);


		var resultsarr = json.results;
		var result = resultsarr[0].title.replace('<b>','').replace('</b>', '').replace('&#39;', "'").replace('LYRICS', '');

		console.log(spotifyURL+encodeURI(result));
		console.log(spotifyURL+result);

		request(spotifyURL+result, function(error, response, body){

			spotifyJSON = JSON.parse(body);
			trackid =spotifyJSON.tracks.items[0].id;
			trackname = spotifyJSON.tracks.items[0].name;
			artist = spotifyJSON.tracks.items[0].artists[0].name;

			track={trackid: trackid, trackname: trackname, artist: artist};
			res.jsonp(track);
		});
	});
});

module.exports = router;
