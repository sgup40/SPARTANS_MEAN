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
				callback(results.splice(0, 10));
			});
	
		});
	}
	
	return {
		search: search
	};
})();