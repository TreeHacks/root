import os
import slack
from dotenv import load_dotenv
from pymongo import MongoClient

dotenv_path = '.env'
load_dotenv(dotenv_path)
client = MongoClient(os.environ['MONGODB_URI']);
db = client['heroku_2r7kmznv']
applications = db.applications.find()
slack_client = slack.WebClient(token=os.environ['SLACK_OAUTH_ACCESS_TOKEN'])

for app in applications:
    if 'meet_info' in app['forms']:
        user_email = app['user']['email']
        user_resp = slack_client.users_lookupByEmail(email=user_email)
        image_link = user_resp['user']['profile']['image_192']

client.close()
