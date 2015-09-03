var MongoClient = require('mongodb').MongoClient;
	
module.exports = (function (){
	
	function search(location, callback) {
		
		// Connect to the db
		MongoClient.connect("mongodb://localhost:27017/mnsStores", function(err, db) {
			var cursor,
				results = [];
			
			// db connection error
			if(err) {
				console.log("Error: ", err);
			}
			/*
			cursor = db.collection('Stores').find({coord:{$geoNear:{$geometry:{type:"Point",coordinates:[51.498682,-0.021823]},$maxDistance:40000, spherical: true}}});
				
			cursor.each(function(err, doc) {
				if (err) {
					console.log('ERRRRR');
					db.close();
				};
				
				if (doc != null) {
					results.push(doc);
				} else {
					callback(results);
					db.close();
				}
			});

			*/
			console.log('>>>>>>', location);
			console.log('>>>>>>', [51.506420135498047,-0.12721000611782074]);
			
			db.command({
				geoNear:"Stores",
				near:{type:"Point", coordinates:[parseFloat(location[0]), parseFloat(location[1])]}, 
				spherical:true
			}, function(err, result){
				if (err) {
					console.log('ERR');
					db.close();
				}
				
				if (!result.results || result.results.length == 0)  {
					callback([]);
					db.close();					
				}
				
				for (var i=0; i<result.results.length; i++) {
					results.push(result.results[i].obj);
				}
								
				db.close();
				callback(results);
			});
	
		});
	}
	
	return {
		search: search
	};
})();