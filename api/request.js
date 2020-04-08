const express = require('express');
const app = express();
var constants = require('./constants');
const requestHandler = require('./requestHandler.js')
const { sendJsonResponse } = require('./responseHelper.js');

const {username, password} = require('./constants')

const MongoClient = require("mongodb").MongoClient;
const CONNECTION_URL = "mongodb+srv://"+username+":"+password+"@coviddata-ulfup.mongodb.net/test?retryWrites=true&w=majority";
const Data = "covid19";


app.get('/cityCovid', requestHandler(async (req) => {
	const { city, state}  = req.query;
	return new Promise(function(resolve, reject) {
	    MongoClient.connect(CONNECTION_URL, async function (err, client) {
			if (err) throw err;
			var db = client.db(Data);

			ret = db.collection('data').findOne({city: city, province: state, country: "US"})
			.then(function(err, result) {
	        	if (err) throw reject(err);
	          	resolve(result);
	      	})
			client.close();
		}); 
	})

}));


app.get('/stateCovid', requestHandler(async (req) => {

	return new Promise(function(resolve, reject) {
	    MongoClient.connect(CONNECTION_URL, function (err, client) {
		  	if (err) throw err;
		  	var db = client.db(Data);

		  	ret = db.collection('data').aggregate([    
		    {
		        "$group": {
		            "_id": "$province",
		            "confirmed": { $sum: "$confimed" },
			        "deaths": { $sum: "$deaths" },
			        "recovered": { $sum: "$recovered" }
		        }
		    }
			]).toArray(function(err, result){
				if (err) throw reject(err);
	          	resolve(result);
			});
			client.close();
		});
	}); 
}));


module.exports = app;