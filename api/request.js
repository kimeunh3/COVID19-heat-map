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

	  db.collection('data').findOne({city: city, province: state}, function (findErr, result) {
	    if (findErr) throw findErr;
	    console.log(result);
	    output = result;
	    client.close();
	  });
	}); 

  	return sendJsonResponse(output);
}));

module.exports = app;