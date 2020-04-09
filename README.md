# COVID19-heat-map
Objective: To create a web application which displays real-time statistics of COVID19 cases and deaths for cities in America.

Ashley Kim ashleykim0506@gmail.com

EunHye Kim


## Credits:

COVID19 API:
    KishCom
		https://rapidapi.com/KishCom/api/covid-19-coronavirus-statistics
		
Kafka documentations
		https://towardsdatascience.com/kafka-python-explained-in-10-lines-of-code-800e3e07dad1
 
 
    
## Steps to Reproduce:

  ### Connect API, Kafka, and MongoAtlas Database
  
   1. clone or download the repo
   
   2. start Zookeeper and Kafka server in the kafka root folder (kafka/kafka_2.11-1.0.0)
   
      `bin/zookeeper-server-start.sh config/zookeeper.properties`
      
      `bin/kafka-server-start.sh config/server.properties`
      
      
       or (if you want kafka and zookeeper to run in the background)
       
       
      `bin/zookeeper-server-start.sh -daemon config/zookeeper.properties`
			
      `bin/kafka-server-start.sh -daemon config/server.properties`
      
      
   3. establish connection to the MongoAtlas Database
   
   3-1. create cred.py in the kafka root folder and populate with `username=<MongoDBusername> password=<MongoDBpassword> `
   
   4. run kafka producer and consumer
   
       `python producer.py`
       
       `python consumer.py`
       
       
       
   ### Run Backend
   
   1. create RapidAPI username and password https://rapidapi.com/
   
   1-2. Create constants.js in the api root folder and populate with
   
   	`module.exports = Object.freeze({
	    username: <rapidAPI username>,
	    password: <rapidAPI password>
	});`
	
   
   2. run `npm install`
   
   2-1. If Error: Cannot find module 'express', try `npm install express`
   
   3. run `npm start`
   
   4. test endpoints (cityCovid, allStateCovid, stateCovid, usCovid)
	
   ex. go to Postman and try GET `http://localhost:3120/cityCovid/?city=Denver&state=Colorado`
   
	`{
	    "_id": "5e7d495e865bf2d33157dd20",
	    "city": "Denver",
	    "province": "Colorado",
	    "country": "US",
	    "lastUpdate": "2020-03-25 23:33:19",
	    "keyId": "Denver, Colorado, US",
	    "confirmed": 214,
	    "deaths": 3,
	    "recovered": 0
	}`
	
	
   ex. go to Postman and try GET `http://localhost:3120/allStateCovid`
   
	`[{
	   "_id": "Colorado",
	   "confirmed": 2207,
	   "deaths": 46,
	   "recovered": 0,
	   "lastUpdate": "2020-03-25 23:33:19"
	},
	{"_id": "Michigan",
	   "confirmed": 20093,
	   "deaths": 866,
	   "recovered": 0,
	   "lastUpdate": "2020-03-25 23:33:19",
	},
	...]`
	
  ex. go to Postman and try GET `http://localhost:3120/stateCovid/?state=Colorado`
   
	`{
	   "_id": "Colorado",
	   "confirmed": 2207,
	   "deaths": 46,
	   "recovered": 0,
	   "lastUpdate": "2020-03-25 23:33:19"
	}`
	
  ex. go to Postman and try GET `http://localhost:3120/usCovid`
   
	`{
	   "_id": "US",
	   "confirmed": 398260,
	   "deaths": 12794,
	   "recovered": 21763,
	   "lastUpdate": "2020-03-25 23:33:19"
	}`
	
	
   ### Run Frontend

   1. run `npm install`
   
   2. run `npm start`
   

  
