const swagger = {
  "openapi": "3.0.0",
  "info": {
    "title": "TreeHacks API",
    "description": "API used for [TreeHacks](https://www.treehacks.com/), Stanford's annual hackathon.",
    "version": "0.0.1"
  },
  "securityScheme": {
    "type": "http",
    "scheme": "bearer",
    "bearerFormat": "JWT",
  },
  "servers": [
    {
      "url": "https://api.treehacks.com",
      "description": "Production"
    },
    {
      "url": "https://api.dev.treehacks.com",
      "description": "Dev"
    }
  ],
  "components": {
    "schemas": {
      "Status": {
        type: "string",
        default: "incomplete",
        enumValues: ["incomplete", "submitted", "admitted", "waitlisted", "rejected", "admission_confirmed", "admission_declined"]
      },
      "ApplicationInfo": {
        "type": "object",
        "properties": {
          "university": { "type": "string" }
        }
      },
      "AdditionalInfo": {
        "type": "object",
        "properties": {
          "bus_confirmed_spot": { "type": "boolean" }
        }
      },
      "AdminInfo": {
        "type": "object",
        "properties": {
          "transportation": {
            "type": "object",
            "properties": {
              "method": {"type": "string"},
              "bus_name": {"type": "string"}
            }
          },
          "reimbursement_amount": { type: "number", default: null }
        }
      },
      "Review": {
        "type": "object",
        "properties": {
          "isBeginner": { "type": "boolean" }
        }
      },
      "Application": {
        "type": "object",
        "properties": {
          "_id": { "type": "string" },
          "forms": { // can only be modified by user/editors
            "type": "object",
            "properties": {
              "application_info": { "$ref": "#/components/schemas/ApplicationInfo" },
              "additional_info": { "$ref": "#/components/schemas/AdditionalInfo" }
            }
          },
          "admin_info": { "$ref": "#/components/schemas/AdminInfo" }, // Only editable by admin.
          "reviews": {
            "type": "array",
            "items": { "$ref": "#/components/schemas/Review" }
          }, // each review can only be modified by the reviewer who made it.
          "user": {
            "type": "object",
            "properties": {
              "name": { "type": "string" },
              "email": { "type": "string" }
            }
          },
          "status": {"$ref": "#/components/schemas/Status"},
          "type": {
            type: "string",
            enumValues: ["is", "oos", "stanford"]
          }
        }
      }
    }
  },
  "paths": {
    "/users": {
      "get": {
        "summary": "Get list of users/applications",
        "description": "Used for admins to view all users",
        "responses": {
          "200": {
            "description": "User list response"
          }
        }
      }
    },
    "/users_stats": {
      "get": {
        "summary": "Get user stats",
        "description": "Used for adminss",
        "responses": {
          "200": {
            "description": "User stats response"
          }
        }
      }
    },
    "/users/{userId}": {
      "get": {
        "summary": "Get full user and application information",
        "description": "Used for admins to view all details of a user",
        "responses": {
          "200": {
            "description": "User all details response",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/Application" }
              }
            }
          }
        }
      }
    },
    "/users/{userId}/application_info": {
      "get": {
        "summary": "Get application info",
        "description": "Used by applicants",
        "responses": {
          "200": {
            "description": "User application info response",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/ApplicationInfo" }
              }
            }
          }
        }
      },
      "put": {
        "summary": "Update application info",
        "description": "Used by applicants",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/ApplicationInfo" }
            }
          }
        },
        "responses": {
          "200": {
            "description": "User application info response",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/ApplicationInfo" }
              }
            }
          }
        }
      }
    },
    "/users/{userId}/application_info/submit": {
      "post": {
        "summary": "Submit application",
        "description": "Submit application. This endpoint checks to make sure that all required fields in the application are complete, then sends a confirmation email. No request body.",
        "responses": {
          "200": {
            "description": "User application info response",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/ApplicationInfo" }
              }
            }
          }
        }
      }
    },
    "/users/{userId}/additional_info": {
      "get": {
        "summary": "Get additional info",
        "description": "Used by applicants",
        "responses": {
          "200": {
            "description": "User additional info response",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/AdditionalInfo" }
              }
            }
          }
        }
      },
      "put": {
        "summary": "Update additional info",
        "description": "Used by applicants",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/AdditionalInfo" }
            }
          }
        },
        "responses": {
          "200": {
            "description": "User additional info response",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/AdditionalInfo" }
              }
            }
          }
        }
      }
    },
    "/users/{userId}/admin_info": {
      "put": {
        "summary": "Update admin info",
        "description": "Used by admins",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/AdminInfo" }
            }
          }
        },
        "responses": {
          "200": {
            "description": "User admin info response",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/AdminInfo" }
              }
            }
          }
        }
      }
    },
    "/users/{userId}/status": {
      "get": {
        "summary": "Get status",
        "description": "Used by applicants",
        "responses": {
          "200": {
            "description": "User status response",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/Status" }
              }
            }
          }
        }
      },
      "put": {
        "summary": "Update status",
        "description": "Used by applicants (to a limited extent, accept/reject their selection) and otherwise by admins",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/Status" }
            }
          }
        },
        "responses": {
          "200": {
            "description": "User status response",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/Status" }
              }
            }
          }
        }
      }
    },
    "/users/{userId}/review_info": {
      "get": {
        "summary": "Get review info",
        "description": "Get only review info which the current user has reviewed.",
        "responses": {
          "200": {
            "description": "User review response",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/ReviewInfo" }
              }
            }
          }
        }
      },
      "put": {
        "summary": "Update review info",
        "description": "Used by reviewers to update their OWN reviews.",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/ReviewInfo" }
            }
          }
        },
        "responses": {
          "200": {
            "description": "User review info response",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/ReviewInfo" }
              }
            }
          }
        }
      }
    }
  }
}

export default swagger;