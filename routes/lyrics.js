var express = require('express');
var router = express.Router();
var request = require("request");
var cheerio = require('cheerio');

/* GET home page. */
router.get('/search', function(req, res, next) {
	console.log(req.query.term);
	var term = req.query.term;
	console.log(typeof(term));

	//search url
	var url ="http://api.musixmatch.com/ws/1.1/track.search?apikey=a1583a3ec43dc2a4f4850d111da66cca&q_lyrics="+term;

	request(url, function(error, response, body) {

		//console.log(body);
		console.log(typeof(body));
		var json = JSON.parse(body);
		console.log(json);


		var resultsarr = json.message.body.track_list;
		var tracksarr = [];
		for(var i=0; i<resultsarr.length; i++){
			console.log(resultsarr[i].track.track_name);

			console.log(resultsarr[i].track.artist_name);

			console.log(resultsarr[i].track.track_spotify_id);
			console.log(" ");


			if (resultsarr[i].track.track_spotify_id != ""){

							tracksarr.push({trackname: resultsarr[i].track.track_name,
											artistname: resultsarr[i].track.artist_name,
											spotifyid: resultsarr[i].track.track_spotify_id});
			}
		}

		res.jsonp(tracksarr);

		//res.end();
		//console.log();
		// $ = cheerio.load(body);

		// console.log($('.list-search', 'body'));
	//  res.send(test);
	});
 	//res.render('index', { title: 'Express' });
});

module.exports = router;
