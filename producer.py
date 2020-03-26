'''
	covid19API:
		https://rapidapi.com/KishCom/api/covid-19-coronavirus-statistics
	Kafka documentations:
		https://towardsdatascience.com/kafka-python-explained-in-10-lines-of-code-800e3e07dad1
'''

import requests
import json
from kafka import KafkaProducer
from kafka.errors import KafkaError
from time import sleep

def main():

	url = "https://covid-19-coronavirus-statistics.p.rapidapi.com/v1/stats"

	querystring = {"country":"USA"}

	headers = {
	    'x-rapidapi-host': "covid-19-coronavirus-statistics.p.rapidapi.com",
	    'x-rapidapi-key': "eeb8bc67e9msh54a2855b4a23cb9p18ffc2jsn9a8ca3526ae6"
	    }

	response = requests.request("GET", url, headers=headers, params=querystring)
	err, statusCode, msg, data = json.loads(response.text)['error'], json.loads(response.text)['statusCode'], json.loads(response.text)['message'], json.loads(response.text)['data']

	if err is 'True' or statusCode != 200 or msg != 'OK':
		print("connection failed")
		return -1

	locations = data['covid19Stats']

	producer = KafkaProducer(bootstrap_servers=['localhost:9092'],
	                         value_serializer=lambda x: 
	                         json.dumps(x).encode('utf-8'))

	for i in range(len(locations)):
		#print(locations[i])
		data = locations[i]
		producer.send('covid19', value=data)
		sleep(5)

	return 0

main()

