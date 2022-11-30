"""
This script parses all submitted applications' resumes and generates tags for each user. These tags are stored in mongo
"""

from pyresparser import ResumeParser
from pymongo import MongoClient, uri_parser
import io
import os
import json
import requests
import boto3


def parse_resume(resume):
    """
    pyresparser checks for the filetype based on the "name" attribute of the BytesIO Object.
    This attribute is not passed from the request data, so add a dummy name using the MIME from the request.
      - make sure the content-type is properly set for each request
      - only allow .pdf and .docx extensions
    """
    resume.name = "resume.pdf"
    parsed = ResumeParser(resume).get_extracted_data()

    tags = []
    for key in ("skills", "company_names"):
        tags += parsed[key] if parsed[key] else []

    return tags


def get_resume(key):
    s3 = boto3.resource("s3")
    bucket = os.getenv("AWS_S3_BUCKET")
    obj = s3.Object(bucket_name=bucket, key=key)
    stream = io.BytesIO()
    obj.download_fileobj(stream)
    return stream


if __name__ == "__main__":
    mongo_uri = os.environ["MONGODB_URI"]
    client = MongoClient(mongo_uri, retryWrites=False)
    uri_dict = uri_parser.parse_uri(mongo_uri)
    db = client[uri_dict["database"]]
    applications = db.applications.find({"year": "2023", "status": "submitted"})
    for app in applications:
        if "resume" in app["forms"]["application_info"]:
            resume_key = app["forms"]["application_info"]["resume"]
            print(app["_id"])
            print
            resume = get_resume(resume_key)
            tags = parse_resume(resume)
            print(tags)
            db.applications.update_one(
                {"_id": app["_id"]}, {"$set": {"tags": tags}}, upsert=False
            )
