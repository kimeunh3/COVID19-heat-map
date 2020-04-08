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
   
   2. install Kafka and Zookeeper
   
   3. start Zookeeper and Kafka server (inside the kafka root directory)
   
      `bin/zookeeper-server-start.sh config/zookeeper.properties`
      
      `bin/kafka-server-start.sh config/server.properties`
      
   4. establish connection to the MongoAtlas Database
   
   4-1. create cred.py and in the kafka root folder and populate with `username:<MongoDBusername> password=<MongoDBpassword> `
   
   5. run kafka producer and consumer
   
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
   
   4. test endpoints cityCovid and stateCovid
	
   ex. go to postman and try GET `http://localhost:3120/cityCovid/?city=Denver&state=Colorado`
   
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
	
	
   ex. go to postman and try GET `http://localhost:3120/cityCovid/?city=Denver&state=Colorado`
   
	`{
	   "_id": "Colorado",
	   "confirmed": 2207,
	   "deaths": 46,
	   "recovered": 0,
	}`
	
	
	
   ### Run Frontend

   1. run `npm install`
   
   2. run `npm start`
   

  
