# Description: Uploads organizers to the database from a JSON file. 
# This script is intended to be run as a one-off job.

import os
import json
import pandas as pd
from pymongo import MongoClient, uri_parser
from dotenv import load_dotenv

dotenv_path = '.env'
load_dotenv(dotenv_path)

def get_organizers():
    data = pd.read_csv('./backend/scripts/organizers/organizers.csv')
    return data

if __name__ == "__main__":
    mongo_uri = os.environ.get("MONGODB_URI")
    client = MongoClient(mongo_uri, retryWrites=False)
    uri_dict = uri_parser.parse_uri(mongo_uri)

    db = client[uri_dict["database"]]
    o = get_organizers()

    # NOTE: This will overwrite organizers collection
    # Refactor to a single query if JSON is large (N+1)
    for organizer in o.to_dict(orient="records"):
        payload = {
            "status": "admission_confirmed",
            "forms": {
                "meet_info": {
                    "showProfile": True,
                    "isOrganizer": True,
                    "profileDesc": f"{organizer['Team']} Team" if organizer["Team"] else "Treehacks Organizer"
                },
                "application_info": {
                    "first_name": organizer["First Name"],
                    "last_name": organizer["Last name"],
                }
            },
            "user": {
                "email": organizer["Email"],
                "id": organizer["Email"],
            },
            "year": "2023"
        }
        print("uploading", organizer["Email"])
        db.applications.update_one(
            {"user.email": organizer["Email"]}, {"$set": payload}, upsert=True
        )