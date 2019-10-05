const commonConfig = {
    "globals": {
        "MODE": "DEV",
        ENDPOINT_URL: "/api"
    },
    "transform": {
        "^.+\\.tsx?$": "ts-jest",
        "^.+\\.js$": "babel-jest",
        "^.+\\.svg$": "jest-svg-transformer"
    },
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node"
    ]
};
module.exports = {
    "projects": [
        {
            ...commonConfig,
            "name": "frontend",
            "testMatch": [
                "<rootDir>/src/**/__tests__/**/*.[jt]s?(x)"
            ],
            "setupFilesAfterEnv": ["./src/setupTests.ts"],
            "moduleNameMapper": {
                "^.+\\.(css|scss|png|ico)$": "identity-obj-proxy",
            },
            "snapshotSerializers": [
                "enzyme-to-json/serializer"
            ]
        },
        {
            ...commonConfig,
            "name": "backend",
            "testEnvironment": "node",
            "globalSetup": "./backend/setupMongo.js",
            "globalTeardown": "./backend/teardownMongo.js",
            "testMatch": [
                "<rootDir>/backend/**/__tests__/**/*.[jt]s?(x)"
            ]
        },
    ]
};