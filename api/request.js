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
			var regexCity = new RegExp(["^", city, "$"].join(""), "i");
			var regexState = new RegExp(["^", state, "$"].join(""), "i");

			let ret = db.collection('data').findOne({city: {'$regex': regexCity}, province: {'$regex': regexState}, country: "US"})
	      	ret.then(function(result){
	      		//console.log(result);
	      		resolve(result);
	      	})
			client.close();
		}); 
	})

}));


app.get('/allStateCovid', requestHandler(async (req) => {

	return new Promise(function(resolve, reject) {
	    MongoClient.connect(CONNECTION_URL, function (err, client) {
		  	if (err) throw err;
		  	var db = client.db(Data);

		  	ret = db.collection('data').aggregate([    
		    {
		        "$group": {
		            "_id": "$province",
		            "confirmed": { $sum: "$confirmed" },
			        "deaths": { $sum: "$deaths" },
			        "recovered": { $sum: "$recovered" },
			        "lastUpdate": {$last: "$lastUpdate"}
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

app.get('/stateCovid', requestHandler(async (req) => {
	const { state}  = req.query;
	var regexState = new RegExp(["^", state, "$"].join(""), "i");

	return new Promise(function(resolve, reject) {
	    MongoClient.connect(CONNECTION_URL, function (err, client) {
		  	if (err) throw err;
		  	var db = client.db(Data);

		  	ret = db.collection('data').aggregate([    
		  	{
		  		"$match": {
		  			"province" : regexState
		  		}
		  	},
		    {
		        "$group": {
		            "_id": "$province",
		            "confirmed": { $sum: "$confirmed" },
			        "deaths": { $sum: "$deaths" },
			        "recovered": { $sum: "$recovered" },
			        "lastUpdate": {$last: "$lastUpdate"}
		        }
		    }
			]).toArray(function(err, result){
				if (err) throw reject(err);
				//console.log(result)
	          	resolve(result);
			});
			client.close();
		});
	}); 
}));

app.get('/usCovid', requestHandler(async (req) => {

	return new Promise(function(resolve, reject) {
	    MongoClient.connect(CONNECTION_URL, function (err, client) {
		  	if (err) throw err;
		  	var db = client.db(Data);

		  	ret = db.collection('data').aggregate([    
		    {
		        "$group": {
		            "_id": "$country",
		            "confirmed": { $sum: "$confirmed" },
			        "deaths": { $sum: "$deaths" },
			        "recovered": { $sum: "$recovered" },
			        "lastUpdate": {$last: "$lastUpdate"}
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