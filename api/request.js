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
	let output = null

    MongoClient.connect(CONNECTION_URL, function (err, client) {
	  if (err) throw err;

	  var db = client.db(Data);

	  db.collection('data').findOne({city: city, province: state, country: "US"}, function (findErr, result) {
	    if (findErr) throw findErr;
	    console.log(result);
	    output = result;
	    client.close();
	  });
	}); 

  	return sendJsonResponse(output);
}));

app.get('/stateCovid', requestHandler(async (req) => {
	let output = "hello world"

	/*let states = ['Alabama','Alaska','American Samoa','Arizona','Arkansas','California','Colorado','Connecticut','Delaware',
	'District of Columbia','Federated States of Micronesia','Florida','Georgia','Guam','Hawaii','Idaho','Illinois','Indiana',
	'Iowa','Kansas','Kentucky','Louisiana','Maine','Marshall Islands','Maryland','Massachusetts','Michigan','Minnesota','Mississippi',
	'Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota',
	'Northern Mariana Islands','Ohio','Oklahoma','Oregon','Palau','Pennsylvania','Puerto Rico','Rhode Island','South Carolina',
	'South Dakota','Tennessee','Texas','Utah','Vermont','Virgin Island','Virginia','Washington','West Virginia','Wisconsin','Wyoming']

	let output = [];

    MongoClient.connect(CONNECTION_URL, function (err, client) {
	  if (err) throw err;

	  var db = client.db(Data);

	  // TO DO: find positive, deaths by state
	  for (var i = 0; i < cars.length; i++) {
		  db.collection('data').findOne({city: city, province: state}, function (findErr, result) {
		    if (findErr) throw findErr;
		    console.log(result);
		    output = result;
		    client.close();
		  });
	  }
	}); */

  	return output;
}));


module.exports = app;