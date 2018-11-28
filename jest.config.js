module.exports = {
    "transform": {
        "^.+\\.tsx?$": "ts-jest",
        "^.+\\.js$": "babel-jest",
        "^.+\\.svg$": "jest-svg-transformer"
    },
    "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node"
    ],
    "transformIgnorePatterns": [
        "<rootDir>/node_modules/(?!lodash-es)"
    ],
    "moduleNameMapper": {
        "^.+\\.(css|scss)$": "identity-obj-proxy"
    },
    "snapshotSerializers": [
        "enzyme-to-json/serializer"
    ],
    "moduleDirectories": [
        "node_modules",
        "scripts"
    ],
    "setupTestFrameworkScriptFile": "./src/setupTests.ts",
    "globals": {
        "MODE": "DEV",
        // "ENDPOINT_URL": "http://localhost:3000/",
        // COGNITO_USER_POOL_ID: process.env.COGNITO_USER_POOL_ID,
        // COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID,
        ENDPOINT_URL: process.env.ENDPOINT_URL,
        // COGNITO_ENDPOINT_URL: process.env.COGNITO_ENDPOINT_URL,
        // GA_TRACKING_ID: process.env.GA_TRACKING_ID
    }
};