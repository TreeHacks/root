import request from "supertest";
import { Query } from "mongoose";
import { projectAllowedApplicationFields } from "../utils/file_plugin";
import { IApplication } from "../models/Application.d";

describe('projectAllowedApplicationFields', () => {

  test('don\'t change query for admin', () => {
    let query = new Query<IApplication>();
    query.setOptions({"treehacks:groups": ["admin", "sponsor"]});
    query.setQuery({"a":"b"});
    projectAllowedApplicationFields.call(query);
    expect(query.getQuery()).toEqual({"a":"b"});
  });

  test('modify query for sponsor', () => {
    let query = new Query<IApplication>();
    query.setOptions({"treehacks:groups": ["sponsor"]});
    query.setQuery({"a":"b"});
    projectAllowedApplicationFields.call(query);
    expect(query.getQuery()).not.toEqual({"a":"b"});
  });
  
});
