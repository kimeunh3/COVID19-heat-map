import requests
import json
from pymongo import MongoClient
from cred import username, password

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

	db = MongoClient('mongodb+srv://'+username+':'+password+'@coviddata-ulfup.mongodb.net/test?retryWrites=true&w=majority')
	collection = db.covid19.test

	locations = data['covid19Stats']

	for i in range(10):
		data = locations[i]
		update = collection.count_documents({'keyId': data['keyId']})
		if(update > 0):
			if (update < 2):
				collection.replace_one({'keyId': data['keyId']}, data)
			else:
				collection.delete_one({'keyId': data['keyId']})
		else:
			collection.insert_one(data)
	    
main()