const express = require('express');
const app = express();
var constants = require('./constants');
const requestHandler = require('./requestHandler.js')
const { sendJsonResponse } = require('./responseHelper.js');

const {username, password} = require('./constants')

const MongoClient = require("mongodb").MongoClient;
const CONNECTION_URL = "mongodb+srv://"+username+":"+password+"@coviddata-ulfup.mongodb.net/test?retryWrites=true&w=majority";
const Data = "covid19";


app.get('/countyCovid', requestHandler(async (req) => {
	const { county, state}  = req.query;

	return new Promise(function(resolve, reject) {
	    MongoClient.connect(CONNECTION_URL, async function (err, client) {
			if (err) throw err;
			var db = client.db(Data);

			var regexCounty = new RegExp(["^", county, "$"].join(""), "i");
			var regexState = new RegExp(["^", state, "$"].join(""), "i");

			let ret = db.collection('data').findOne({city: {'$regex': regexCounty}, province: {'$regex': regexState}, country: "US"})
	      	ret.then(function(result){
	      		//console.log(result);
	      		resolve(result);
	      	})

			/*let re = new RegExp([county, ", ", state].join(""), "i");

	      	let ret = db.collection('data').findOne({keyId: {'$regex': re}})
	      	ret.then(function(result){
	      		//console.log(result);
	      		resolve(result);
	      	})*/
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
		    	"$match":{
				    "$and":[
				      {"city": { $not: /^Out of.*/ }},
				      {"city": { $not: /^Unassigned.*/ }},
				      {"city": { $not: /^MDOC.*/ }},
				      {"city": { $not: /^FCI.*/ }},
				      //{"lastUpdate": "2020-04-24 03:30:50"}

				    ]
				 }
			},
			{
		        "$group": {
		            "_id": "$province",
		            "confirmed": { $sum: "$confirmed" },
			        "deaths": { $sum: "$deaths" },
			        "recovered": { $sum: "$recovered" },
			      	"active":  { $sum: "$active" },
			        "lastUpdate": {$last: "$lastUpdate"}
		        }
		    },
		    {
		    	"$project": {
		    		"_id": 1,
		    		"confirmed": 1,
		    		"deaths": 1,
		    		"recovered": 1,
		    		"active": 1,
		    		"lastUpdate": 1
		    	}
		    },
		    {
		  		"$sort": {
			        "lastUpdate": -1
		        }

		  	}, 
			]).toArray(function(err, result){
				if (err) throw reject(err);
				//console.log("allState: ", result[0])
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
		  		"$match":{
				    "$and":[
				      {"city": { $not: /^Out of.*/ }},
				      {"city": { $not: /^Unassigned.*/ }},
				      {"city": { $not: /^MDOC.*/ }},
				      {"city": { $not: /^FCI.*/ }},
				      {"province" : regexState}
				    ]
				 }
		  	},
		    {
		        "$group": {
		            "_id": "$province",
		            "confirmed": { $sum: "$confirmed" },
			        "deaths": { $sum: "$deaths" },
			        "recovered": { $sum: "$recovered" },
			        "active": {$sum: "$active"},
			        "lastUpdate": {$last: "$lastUpdate"},
			        "numCounty" : {$sum: 1}
		        }
		    },
		    {
		    	"$project": {
		    		"_id": 1,
		    		"confirmed": 1,
		    		"deaths": 1,
		    		"recovered": 1,
		    		"active": 1,
		    		"lastUpdate": 1,
		    		"numCounty": 1,
		    	}
		    },
		    {
		  		"$sort": {
			        "lastUpdate": -1
		        }

		  	},
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
		    	"$match":{
				    "$and":[
				      {"city": { $not: /^Out of.*/ }},
				      {"city": { $not: /^Unassigned.*/ }},
				      {"city": { $not: /^MDOC.*/ }},
				      {"city": { $not: /^FCI.*/ }},
				    ]
				 }
			},
			{
		        "$group": {
		            "_id": "$country",
		            "confirmed": { $sum: "$confirmed" },
			        "deaths": { $sum: "$deaths" },
			        "recovered": { $sum: "$recovered" },
			        "active":  { $sum: "$active" },
			        "lastUpdate": {$last: "$lastUpdate"}
		        }
		    },
		    {
		    	"$project": {
		    		"_id": 1,
		    		"confirmed": 1,
		    		"deaths": 1,
		    		"recovered": 1,
		    		"active": 1,
		    		"lastUpdate": 1
		    	}
		    },
		    {
		  		"$sort": {
			        "lastUpdate": -1
		        }

		  	},
			]).toArray(function(err, result){
				if (err) throw reject(err);
				//console.log("allState: ", result[0])
	          	resolve(result);
			});
			client.close();
		});
	}); 

}));


app.get('/suggestions', requestHandler(async (req) => {
	const { county, state}  = req.query;
	if (state === 'undefined'){
		return new Promise(function(resolve, reject) {
	    MongoClient.connect(CONNECTION_URL, function (err, client) {
			if (err) throw err;
			var db = client.db(Data);
			var regexCounty = new RegExp(["^", county].join(""), "i");

			//console.log(regexCounty)

			let ret = db.collection('data').find({city: {'$regex': regexCounty}, country: "US"}).limit(5).toArray(function(err, result) {
			  //console.log(result);
			  resolve(result)
			});

			client.close();
		}); 
	})
	}else{
		return new Promise(function(resolve, reject) {
	    MongoClient.connect(CONNECTION_URL, function (err, client) {
			if (err) throw err;
			var db = client.db(Data);
			var regexCounty = new RegExp(["^", county].join(""), "i");
			var regexState = new RegExp(["^", state].join(""), "i");

			let ret = db.collection('data').find({city: {'$regex': regexCounty}, province: {'$regex': regexState}, country: "US"}).limit(5).toArray(function(err, result) {
			  //console.log(result);
			  resolve(result)
			});

			client.close();
		}); 
	})

	}

}));



module.exports = app;