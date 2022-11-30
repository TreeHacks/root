'''This script updates the profilePicture field in the Mongo database with users' Slack profile pictures. The script
is intended to be run periodically with a cron job or similar. The script accesses MONGODB_URI and
SLACK_OAUTH_ACCESS_TOKEN environment variables.
'''

import os
import slack
from dotenv import load_dotenv
from pymongo import MongoClient, uri_parser

dotenv_path = '.env'
load_dotenv(dotenv_path)

mongo_uri = os.environ['MONGODB_URI']
client = MongoClient(mongo_uri, retryWrites=False);
uri_dict = uri_parser.parse_uri(mongo_uri)
db = client[uri_dict['database']]
applications = db.applications.find({'year': '2023', 'status': 'admission_confirmed'})
slack_client = slack.WebClient(token=os.environ['SLACK_OAUTH_ACCESS_TOKEN'])
count = 0

for app in applications:
    user_email = app['user']['email']
    try:
        user_resp = slack_client.users_lookupByEmail(email=user_email)
    except slack.errors.SlackApiError:
        continue
    image_link = user_resp['user']['profile']['image_192']
    if 'meet_info' in app['forms'] and 'profilePicture' in app['forms']['meet_info'] and image_link == app['forms']['meet_info']['profilePicture']:
        continue
    db.applications.update_one({
        '_id': app['_id']
    },{
        '$set': {
            'forms.meet_info.profilePicture': image_link
        }
    }, upsert=False)
    count += 1

print(count, "applications updated")
client.close()
