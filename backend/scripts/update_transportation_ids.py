'''This script updates the transportation_status field based on the values in the bus_update.csv in the same directory.
This script is intended to be run as a one-off job.
'''

import os
from dotenv import load_dotenv
from pymongo import MongoClient, uri_parser

dotenv_path = '.env'
load_dotenv(dotenv_path)

mongo_uri = os.environ['MONGODB_URI']
client = MongoClient(mongo_uri, retryWrites=False);
uri_dict = uri_parser.parse_uri(mongo_uri)
db = client[uri_dict['database']]
applications = db.applications.find({'year': '2020'})

ids_to_transportation = {}
count = 0

with open('backend/scripts/bus_update.csv') as csvfile:
    for line in csvfile:
        line_data = line.strip().split(',')
        ids_to_transportation[line_data[0]] = line_data[1]

for app in applications:
    user_id = str(app['_id'])
    if user_id not in ids_to_transportation:
        continue
    print(app)
    if 'transportation' not in app['admin_info'] or app['admin_info']['transportation']['id'] == ids_to_transportation[user_id]:
        continue
    db.applications.update_one({
        '_id': app['_id']
    },{
        '$set': {
            'admin_info.transportation.id': ids_to_transportation[user_id]
        }
    }, upsert=False)
    count += 1

print(count, "applications updated")
client.close()
