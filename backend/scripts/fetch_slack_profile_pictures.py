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
applications = db.applications.find({'year': '2020', 'forms.meet_info': {'$exists': True}})
slack_client = slack.WebClient(token=os.environ['SLACK_OAUTH_ACCESS_TOKEN'])

for app in applications:
    user_email = app['user']['email']
    try:
        user_resp = slack_client.users_lookupByEmail(email=user_email)
    except slack.errors.SlackApiError:
        continue
    image_link = user_resp['user']['profile']['image_512']
    if image_link == app['forms']['meet_info']['profilePicture']:
        continue
    db.applications.update_one({
        '_id': app['_id']
    },{
        '$set': {
            'forms.meet_info.profilePicture': image_link
        }
    }, upsert=False)

client.close()
