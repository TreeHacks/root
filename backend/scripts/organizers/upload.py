# Description: Uploads organizers to the database from a JSON file. 
# This script is intended to be run as a one-off job.

import os
import json
from pymongo import MongoClient, uri_parser
from dotenv import load_dotenv

dotenv_path = '.env'
load_dotenv(dotenv_path)

def get_organizers():
    with open ('./backend/scripts/organizers/organizers.json', 'r') as myfile:
        data=myfile.read()
        return json.loads(data)

if __name__ == "__main__":
    mongo_uri = os.environ.get("MONGODB_URI")
    client = MongoClient(mongo_uri, retryWrites=False)
    uri_dict = uri_parser.parse_uri(mongo_uri)

    db = client[uri_dict["database"]]
    o = get_organizers()

    # NOTE: This will overwrite organizers collection
    # Refactor to a single query if JSON is large (N+1)
    for organizer in o["organizers"]:
        payload = {
            "status": "admission_confirmed",
            "forms": {
                "meet_info": {
                    "showProfile": True,
                    "isOrganizer": True,
                    "profileDesc": organizer["team"] if organizer["team"] else "Treehacks Organizer"
                },
                "application_info": {
                    "first_name": organizer["firstName"],
                    "last_name": organizer["lastName"],
                }
            },
            "user": {
                "email": organizer["email"],
                "id": organizer["email"],
            },
            "year": "2023"
        }
        db.applications.update_one(
            {"user.email": organizer["email"]}, {"$set": payload}, upsert=False
        )
