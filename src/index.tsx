import React from 'react';
import ReactDOM from 'react-dom';
import App from "./App";
import Auth from "@aws-amplify/auth";
import API from "@aws-amplify/api";
import { I18n } from "@aws-amplify/core";
import store from "./store";
import {Provider} from "react-redux";

declare var MODE: string;
declare var ENDPOINT_URL: string;
declare var COGNITO_USER_POOL_ID: string;
declare var COGNITO_CLIENT_ID: string;

const asyncLocalStorage = {
    setItem: function (key, value) {
        return Promise.resolve().then(function () {
            localStorage.setItem(key, value);
        });
    },
    getItem: function (key) {
        return Promise.resolve().then(function () {
            return localStorage.getItem(key) || "anonymous";
        });
    }
};
export const custom_header = async () => { 
    try {
        return { Authorization: (await Auth.currentSession()).getIdToken().getJwtToken() }
    }
    catch (e) {
        console.warn(e, "Defaulting to stored JWT in localStorage...");
        // Get JWT from SAML.
        return { Authorization: await asyncLocalStorage.getItem("jwt") } 
    }
}
Auth.configure({
    region: 'us-east-1',
    userPoolId: COGNITO_USER_POOL_ID,
    userPoolWebClientId: COGNITO_CLIENT_ID,
    mandatorySignIn: false
});
API.configure({
    endpoints: [
        {
            name: "treehacks",
            endpoint: ENDPOINT_URL,
            custom_header: custom_header
        }
    ]
});

const authScreenLabels = {
    en: {
        'Sign Up': 'Create new account',
        'Sign Up Account': 'New member? Create a new account',
        'Sign In Account': 'Sign In'
    }
};

I18n.setLanguage('en');
I18n.putVocabularies(authScreenLabels);

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('main'));