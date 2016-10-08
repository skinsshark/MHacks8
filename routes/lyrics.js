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
	var url ="https://cse.google.com/cse?cx=partner-pub-1936238606905173%3A1nb2rugz238&cof=FORID%3A10&q=all+boys+and+girls+sing&sa=Search+Lyrics&siteurl=http%3A%2F%2Fsongwordsearch.com%2F&ad=n9&num=10&rurl=http%3A%2F%2Fsongwordsearch.com%2Fsearch.php%3Fcx%3Dpartner-pub-1936238606905173%253A1nb2rugz238%26cof%3DFORID%253A10%26q%3Dall%2Bboys%2Band%2Bgirls%2Bsing%26sa%3DSearch%2BLyrics%26siteurl%3Dhttp%253A%252F%252Fsongwordsearch.com%252F#gsc.tab=0&gsc.q=all%20boys%20and%20girls%20sing&gsc.page=1"
	

	request(url, function(error, response, body) {
		
		console.log(body);
		$ = cheerio.load(body);
	
		console.log($('.list-search', 'body'));
	//  res.send(test);
	});
 	//res.render('index', { title: 'Express' });
});

module.exports = router;
