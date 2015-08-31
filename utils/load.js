var MongoClient = require('mongodb').MongoClient,
	fs = require('fs');
// Connect to the db
MongoClient.connect("mongodb://root:password@127.0.0.1:27017/admin", function(err, db) {
	
	var collection = null,
		collectionName = 'Stores',
		DATA_FILE_PATH = './data_files';
	
	// db connection error
	if(err) {
		console.log("Error: ", err);
	}
  
	// drop / create new collection
	db.collection(collectionName).drop();
	db.createCollection(collectionName, function(err, collection){
		if (err) throw err;
		loadCollectionData();
	});
  
	/*
	* load data to stores collection
	*/
	function loadCollectionData() {
		var dataFileList = fs.readdirSync(DATA_FILE_PATH) || [],
			dataFile,
			documents;
			
		while (dataFileList.length) {
			dataFile = dataFileList.pop();
			documents = loadDocumentsFromFile(dataFile);
			addDocuments(documents);
		}
	}
	/*
	* load data to stores collection
	*/
	function loadDocumentsFromFile(dataFile) {
		var results = null;
		if (/\.json$/.test(dataFile)) {
			results = JSON.parse(fs.readFileSync(DATA_FILE_PATH + '/' + dataFile, 'utf8'));
			return results.d.results || [];
		}
		return [];
	}
	
	
	function addDocuments(documents) {
		var document;
		
		while (documents.length) {
			document = documents.pop();
			
			if (document.Latitude && document.Longitude) {
				document.coord =  { 
					type: "Point",
					coordinates: [document.Latitude, document.Longitude] 
				}
				
				console.log('ADDING DATA TO DB : ', collectionName, document.StoreName);
				db.collection(collectionName).insert(document, function(err, records) {
					if (err) {
						console.log('ERROR: ');
						console.log(err);	
					}

					if (records) {
						console.log('RECORD: ');
						console.log(records);	
					}
				});

			}
		}
	}
	
/***
BACKUP: 
	mongodump --host localhost --port 27017 --db db_name
	mongodump --host localhost --port 27017
RESTORE: 
	mongorestore --host localhost --port 27017 --db **** dump/db_name
	mongorestore --host localhost --port 27017  dump
	
	
GEO SEARCH
	london: 51.506420135498047,-0.12721000611782074
	canary wharf: 51.498682,-0.021823
QUERIES:
	db.Stores.find({coord:{$geoNear:{$geometry:{type:"Point",coordinates:[51.506420135498047,-0.12721000611782074]},$maxDistance:40000, spherical: true}}}, {StoreName: 1})
	
	db.Stores.find({coord:{near:{$geometry:{type:"Point",coordinates:[51.506420135498047,-0.12721000611782074]},$maxDistance:40000}}}, {StoreName: 1})
	db.Stores.find({coord:{$geoNear:{$geometry:{type:"Point",coordinates:[51.498682,-0.021823]},$maxDistance:40000, spherical: true}}}, {StoreName: 1})
	
	db.runCommand({
		geoNear:"Stores",
		near:{type:"Point",coordinates:[51.506420135498047,-0.12721000611782074]}, 
		spherical:true
	});
	
	db.Stores.ensureIndex( { coord: "2dsphere" } )
	query to identify the stores
	https://spatial.virtualearth.net/REST/v1/data/4e8a01395c414eea9d0918deba863a69/mcfpprod/MNSStore?$filter=MarkForDelete+ne+true+AND+ShowStoreInfo+eq+true&$format=json&$select=__Distance,Latitude,Longitude,AddressLine1,AddressLine2,AddressLine3,City,Country,PostalCode,COH_Monday,COH_Tuesday,COH_Wednesday,COH_Thursday,COH_Friday,COH_Saturday,COH_Sunday,SAPStoreId,StoreName,StoreAliasName,StoreStatus,Phone,Facilities,Services,Departments,SOH_1,SOH_2,SOH_3,SOH_4,SOH_5,SOH_6,SOH_7,SOH_8,SOH_9,SOH_10,SOH_11,SOH_12,SOH_13,SOH_14,SOH_15,SOH_16,SOH_17,SOH_18,SOH_19,SOH_20,SOH_21,SOH_22,SOH_23,SOH_24,SOH_25,SOH_26,SOH_27,SOH_28,SOH_29,SOH_30&$top=800&jsonp=STORE_FINDER_SEARCH_SUCCESS&key=AoI5L4WpRLlkmSlzDs4N9M6uJgb1QMRJdOHnALo0hcUUHQKFCtC0OPoEbOoUI4TL&spatialFilter=nearby(51.50642013549805,-0.12721000611782074,40)
	***/
});
