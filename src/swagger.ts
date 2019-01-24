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
      "AdminInfo": {
        "type": "object",
        "properties": {
          "transportation": {
            "type": "object",
            "properties": {
              "type": { "type": "string" },
              "amount": { "type": "number" }
            }
          }
        }
      },
      "Review": {
        "type": "object",
        "properties": {
          "isBeginner": { "type": "boolean" }
        }
      },
      "JudgeReview": {
        "type": "object",
        "properties": {
          "user": {
            "_id": { "type": "string" },
            "email": { "type": "string" }
          }
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
              "transportation": { "$ref": "#/components/schemas/Transportation" }
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
          "status": { "$ref": "#/components/schemas/Status" },
          "type": {
            type: "string",
            enumValues: ["is", "oos", "stanford"]
          },
          "sponsor_optout": {
            type: "boolean"
          }
        }
      },
      "Transportation": {
        "type": "object",
        "properties": {
          "address": { "type": "object" },
          "vendor": { "type": "string" },
          "receipt": { "type": "string" },
          "accept": { "type": "boolean" }
        }
      },
      "Judge": {
        "type": "object",
        "properties": {
          "_id": {"type": "string"},
          "email": {"type": "string"},
          "verticals": {
            "type": "array",
            "items": {"type": "string"}
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
        "parameters": [
          {
            "in": "query",
            "name": "page",
            "schema": {
              "type": "integer"
            },
            "description": "Page number"
          },
          {
            "in": "query",
            "name": "pageSize",
            "schema": {
              "type": "integer"
            },
            "description": "Page size"
          },
          {
            "in": "query",
            "name": "filter",
            "schema": {
              "type": "string"
            },
            "description": "Filter query. Must be a JSON-serialized string of an array of objects such as {'a': 'b'}"
          },
          {
            "in": "query",
            "name": "sort",
            "schema": {
              "type": "string",
            },
            "description": "Sort query. Must be a JSON-serialized string of an array of objects such as {'a': 1} (ascending) or {'a': -1} (descending)."
          },
          {
            "in": "query",
            "name": "project",
            "schema": {
              "type": "string",
            },
            "description": "Projection query. Must be a JSON-serialized string of an array of objects such as {'a': 1, 'b': 0}"
          }
        ],
        "responses": {
          "200": {
            "description": "User list response (does not resolve the resume field to a URL)",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "count": { "type": "integer" },
                    "results": {
                      "type": "array",
                      "items": { "$ref": "#/components/schemas/Application" }
                    }
                  }
                }
              }
            }
          },
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
    "/users/{userId}/transportation": {
      "get": {
        "summary": "Get transportation info",
        "description": "Used by applicants",
        "responses": {
          "200": {
            "description": "User transportation info response",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/Transportation" }
              }
            }
          }
        }
      },
      "put": {
        "summary": "Update transportation info",
        "description": "",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/Transportation" }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "nModified": { "type": "integer" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/users/{userId}/transportation/submit": {
      "post": {
        "summary": "Submit transportation info",
        "description": "",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/Transportation" }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "nModified": { "type": "integer" }
                  }
                }
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
        "description": "Used only by admins",
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
    "/users/{userId}/status/confirm": {
      "post": {
        "summary": "Confirm admission",
        "description": "Used by applicants. Status must already be STATUS.ADMITTED.",
        "requestBody": {
          "content": {
            "application/json": {
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
    "/users/{userId}/status/decline": {
      "post": {
        "summary": "Decline admission",
        "description": "Used by applicants. Status must already be STATUS.ADMISSION_CONFIRMED or STATUS.ADMITTED.",
        "requestBody": {
          "content": {
            "application/json": {
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
    "/users_bulkchange": {
      "post": {
        "summary": "Bulk change application status",
        "description": "Bulk change application statuses by sending in a list of IDs.",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "ids": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    }
                  },
                  "status": { "type": "string" }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "nModified": { "type": "integer" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/users_resumes": {
      "post": {
        "summary": "Bulk download resumes",
        "description": "Bulk download resumes as a zip by sending in a list of IDs.",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "ids": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    }
                  },
                  "status": { "type": "string" }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Response",
            "content": {
              "application/zip": {
                "schema": {
                  "description": "Zip file of all resumes"
                }
              }
            }
          }
        }
      }
    },
    "/review/leaderboard": {
      "get": {
        "tags": ["review"],
        "summary": "Get review leaderboard",
        "description": "List of reviewers, ranked.",
        "responses": {
          "200": {
            "description": "Response",
            "content": {
              "application/json": {
                "schema": { "type": "object" }
              }
            }
          }
        }
      }
    },
    "/review/stats": {
      "get": {
        "tags": ["review"],
        "summary": "Get review stats",
        "description": "Returns number of applications remaining to be removed.",
        "responses": {
          "200": {
            "description": "Response",
            "content": {
              "application/json": {
                "schema": { "type": "object" }
              }
            }
          }
        }
      }
    },
    "/review/rate": {
      "post": {
        "tags": ["review"],
        "summary": "Rate review.",
        "description": ".",
        "responses": {
          "200": {
            "description": "Response",
            "content": {
              "application/json": {
                "schema": { "type": "object" }
              }
            }
          }
        }
      }
    },
    "/review/next_application": {
      "get": {
        "tags": ["review"],
        "summary": "Get review next application",
        "description": ".",
        "responses": {
          "200": {
            "description": "Response",
            "content": {
              "application/json": {
                "schema": { "type": "object" }
              }
            }
          }
        }
      }
    },
    "/hacks": {
      "get": {
        "tags": ["hacks"],
        "summary": "Get list of hacks.",
        "description": "Accessible to both judges and admins. Also available to hackers, but hackers can't see the reviews.",
        "parameters": [
          {
            "in": "query",
            "name": "page",
            "schema": {
              "type": "integer"
            },
            "description": "Page number"
          },
          {
            "in": "query",
            "name": "pageSize",
            "schema": {
              "type": "integer"
            },
            "description": "Page size"
          },
          {
            "in": "query",
            "name": "filter",
            "schema": {
              "type": "string"
            },
            "description": "Filter query. Must be a JSON-serialized string of an array of objects such as {'a': 'b'}"
          },
          {
            "in": "query",
            "name": "sort",
            "schema": {
              "type": "string",
            },
            "description": "Sort query. Must be a JSON-serialized string of an array of objects such as {'a': 1} (ascending) or {'a': -1} (descending)."
          },
          {
            "in": "query",
            "name": "project",
            "schema": {
              "type": "string",
            },
            "description": "Projection query. Must be a JSON-serialized string of an array of objects such as {'a': 1, 'b': 0}"
          }
        ],
        "responses": {
          "200": {
            "description": "Hack list response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "count": { "type": "integer" },
                    "results": {
                      "type": "array",
                      "items": { "type": "object" }
                    }
                  }
                }
              }
            }
          },
        },
      }
    },
    "/hacks_import": {
      "post": {
        "tags": ["hacks"],
        "summary": "Import hacks from devpost csv.",
        "description": "Only accessible to admins.",
        "responses": {
          "200": {
            "description": "Response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "items": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "title": { "type": "string" },
                          "url": { "type": "string" },
                          "description": { "type": "string" },
                          "video": { "type": "string" },
                          "website": { "type": "string" },
                          "file_url": { "type": "string" },
                          "desired_prizes": { "type": "array", "items": { "type": "string" } },
                          "submitter_screen_name": { "type": "string" },
                          "submitter_first_name": { "type": "string" },
                          "submitter_last_name": { "type": "string" },
                          "submitter_email": { "type": "string" }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/hacks/{hackId}": {
      "patch": {
        "tags": ["hacks"],
        "summary": "Edit hack info. Can set title, table, assign judges.",
        "description": ".",
        "responses": {
          "200": {
            "description": "Response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object"
                }
              }
            }
          }
        }
      },
      "delete": {
        "tags": ["hacks"],
        "summary": "Delete hack. Only available to admins.",
        "description": ".",
        "responses": {
          "200": {
            "description": "Response"
          }
        }
      }
    },
    "/judges": {
      "get": {
        "tags": ["judges"],
        "summary": "Get list of judges.",
        "description": "Accessible to only judges.",
        "parameters": [
          {
            "in": "query",
            "name": "page",
            "schema": {
              "type": "integer"
            },
            "description": "Page number"
          },
          {
            "in": "query",
            "name": "pageSize",
            "schema": {
              "type": "integer"
            },
            "description": "Page size"
          },
          {
            "in": "query",
            "name": "filter",
            "schema": {
              "type": "string"
            },
            "description": "Filter query. Must be a JSON-serialized string of an array of objects such as {'a': 'b'}"
          },
          {
            "in": "query",
            "name": "sort",
            "schema": {
              "type": "string",
            },
            "description": "Sort query. Must be a JSON-serialized string of an array of objects such as {'a': 1} (ascending) or {'a': -1} (descending)."
          },
          {
            "in": "query",
            "name": "project",
            "schema": {
              "type": "string",
            },
            "description": "Projection query. Must be a JSON-serialized string of an array of objects such as {'a': 1, 'b': 0}"
          }
        ],
        "responses": {
          "200": {
            "description": "Judge list response",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "count": { "type": "integer" },
                    "results": {
                      "type": "array",
                      "items": { "$ref": "#/components/schemas/Judge" }
                    }
                  }
                }
              }
            }
          },
        },
      }
    },
    "/judges/{judgeId}": {
      "patch": {
        "tags": ["judges"],
        "summary": "Edit judge info.",
        "description": "Available only to admins.",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": { "$ref": "#/components/schemas/Judge" }
            }
          }
        },
        "responses": {
          "200": {
            "description": "User application info response",
            "content": {
              "application/json": {
                "schema": { "$ref": "#/components/schemas/Judge" }
              }
            }
          }
        }
      }
    },
    "/judging/rate": {
      "post": {
        "tags": ["judging"],
        "summary": "Rate hack. Only available to judges (judges can rate *any* hack).",
        "description": ".",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "hack_id": { "type": "number" },
                  "creativity": { "type": "number" },
                  "technicalComplexity": { "type": "number" },
                  "socialImpact": { "type": "number" },
                  "comments": { "type": "string" }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Response"
          }
        }
      }
    },
    "/judging/next_hack": {
      "get": {
        "tags": ["judging"],
        "summary": "Get next hack. Only available to judges. (Does not return reviews property)",
        "description": ".",
        "responses": {
          "200": {
            "$ref": "Hack"
          }
        }
      }
    },
    "/judging/leaderboard": {
      "get": {
        "tags": ["judging"],
        "summary": "Get list of judges and their stats. Accessible only to admins.",
        "description": ".",
        "responses": {
          "200": {
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "_id": { "type": "string" },
                      "count": { "type": "number" }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/judging/stats": {
      "get": {
        "tags": ["judging"],
        "summary": "Get stats of hacks remaining.",
        "description": ".",
        "responses": {
          "200": {
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "results": {
                      "type": "object",
                      "properties": {
                        "num_remaining": { "type": "number" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
  }
}

export default swagger;