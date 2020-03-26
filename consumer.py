'''
	Kafka documentations:
		https://towardsdatascience.com/kafka-python-explained-in-10-lines-of-code-800e3e07dad1
'''
from kafka import KafkaConsumer
from pymongo import MongoClient
import pymongo
from json import loads
from cred import username, password


consumer = KafkaConsumer(
    'covid19',
     bootstrap_servers=['localhost:9092'],
     auto_offset_reset='earliest',
     enable_auto_commit=True,
     group_id='my-group',
     value_deserializer=lambda x: loads(x.decode('utf-8')))

db = MongoClient('mongodb+srv://'+username+':'+password+'@coviddata-ulfup.mongodb.net/test?retryWrites=true&w=majority')
collection = db.covid19.data

for message in consumer:
    message = message.value
    update = collection.count_documents({'keyId': message['keyId']})
    if(update > 0):
        if (update < 2):
            collection.replace_one({'keyId': message['keyId']}, message)
        else:
            collection.delete_one({'keyId': message['keyId']})
    else:
        collection.insert_one(message)
    