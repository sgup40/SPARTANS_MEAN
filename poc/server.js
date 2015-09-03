var connect = require('connect'),
	serveStatic = require('serve-static'),
	query = require('connect-query'),
	app = connect(),
	storeFinder = require('./app/storeFinder.js');


app.use(query())
	.use('/api/searchStores', searchStores);

app.use(serveStatic(__dirname + '/public'));

app.listen(9999);


////

function searchStores(req, res) {
	var location = req.query.location || '';
	
	if (location.indexOf(',') == -1) {
		res.end('Invalid location param');
	}
	storeFinder.search(location.split(','), function (results) {
		if (!results) {
			console.log("RESULT UNDEFINED OR NULL");
			res.end(JSON.stringify({success: true, results: []}));
		}
		
		res.end(JSON.stringify({success: true, results: results}));
	});
}


