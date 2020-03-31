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
   
   3. start Zookeeper and Kafka server
   
      `bin/zookeeper-server-start.sh config/zookeeper.properties`
      
      `bin/kafka-server-start.sh config/server.properties`
      
   4. establish connection to the MongoAtlas Database
   
   5. run kafka producer and consumer
   
       `python producer.py`
       
       `python consumer.py`
       
       
       
   ### Create Backend
   
   1. run `npm install`
   
   1-2. If Error: Cannot find module 'express', try `npm install express`
   
   2. run `npm start`
   
   3. test endpoints ex. http://localhost:3120/cityCovid/?city=<city>&state=<state>
	
	
	
   ### Create Frontend



  
