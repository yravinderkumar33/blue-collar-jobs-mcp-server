const config = {
  companies: [
    {
      id: "company-a",
      search: {
        api: {
          url: process.env.COMPANY_A_URL || "http://localhost:3000/api/jobs/search",
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          data: {
            "request": {}
          }
        },
        schema: {
          "$schema": "http://json-schema.org/draft-07/schema#",
          "title": "Generated schema for Root",
          "type": "object",
          "properties": {
            "_id": {
              "type": "string"
            },
            "jobId": {
              "type": "string"
            },
            "title": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "category": {
              "type": "string"
            },
            "jobType": {
              "type": "string"
            },
            "company": {
              "type": "object",
              "properties": {
                "name": {
                  "type": "string"
                },
                "description": {
                  "type": "string"
                },
                "industry": {
                  "type": "string"
                }
              },
              "required": [
                "name",
                "description",
                "industry"
              ]
            },
            "location": {
              "type": "object",
              "properties": {
                "address": {
                  "type": "string"
                },
                "city": {
                  "type": "string"
                },
                "state": {
                  "type": "string"
                },
                "country": {
                  "type": "string"
                },
                "postalCode": {
                  "type": "string"
                },
                "latitude": {
                  "type": "number"
                },
                "longitude": {
                  "type": "number"
                }
              },
              "required": [
                "address",
                "city",
                "state",
                "country",
                "postalCode",
                "latitude",
                "longitude"
              ]
            },
            "requirements": {
              "type": "object",
              "properties": {
                "experienceInYears": {
                  "type": "number"
                },
                "gender": {
                  "type": "string"
                },
                "education": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                },
                "certifications": {
                  "type": "array",
                  "items": {}
                },
                "skills": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                },
                "languages": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                },
                "assetsRequired": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                }
              },
              "required": [
                "experienceInYears",
                "gender",
                "education",
                "certifications",
                "skills",
                "languages",
                "assetsRequired"
              ]
            },
            "responsibilities": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "salary": {
              "type": "object",
              "properties": {
                "amount": {
                  "type": "number"
                },
                "currency": {
                  "type": "string"
                },
                "frequency": {
                  "type": "string"
                }
              },
              "required": [
                "amount",
                "currency",
                "frequency"
              ]
            },
            "schedule": {
              "type": "object",
              "properties": {
                "shiftType": {
                  "type": "string"
                },
                "hoursPerWeek": {
                  "type": "number"
                },
                "daysOfWeek": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                },
                "startTime": {
                  "type": "string"
                },
                "endTime": {
                  "type": "string"
                },
                "overtimeAvailable": {
                  "type": "boolean"
                },
                "weekendWork": {
                  "type": "boolean"
                }
              },
              "required": [
                "shiftType",
                "hoursPerWeek",
                "daysOfWeek",
                "startTime",
                "endTime",
                "overtimeAvailable",
                "weekendWork"
              ]
            },
            "benefits": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "postedDate": {
              "type": "string"
            },
            "validUntil": {
              "type": "string"
            },
            "metadata": {
              "type": "object",
              "properties": {
                "tags": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                }
              },
              "required": [
                "tags"
              ]
            },
            "__v": {
              "type": "number"
            }
          },
          "required": [
            "_id",
            "jobId",
            "title",
            "description",
            "category",
            "jobType",
            "company",
            "location",
            "requirements",
            "responsibilities",
            "salary",
            "schedule",
            "benefits",
            "postedDate",
            "validUntil",
            "metadata",
            "__v"
          ]
        }
      }
    },
    {
      id: "company-b",
      search: {
        api: {
          url: process.env.COMPANY_B_URL || "http://localhost:4000/api/jobs/search",
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          data: {
            "request": {}
          }
        },
        schema: {
          "$schema": "http://json-schema.org/draft-07/schema#",
          "title": "Generated schema for Root",
          "type": "object",
          "properties": {
            "_id": {
              "type": "string"
            },
            "jobId": {
              "type": "string"
            },
            "position": {
              "type": "object",
              "properties": {
                "name": {
                  "type": "string"
                },
                "summary": {
                  "type": "string"
                },
                "department": {
                  "type": "string"
                },
                "type": {
                  "type": "string"
                }
              },
              "required": [
                "name",
                "summary",
                "department",
                "type"
              ]
            },
            "organization": {
              "type": "object",
              "properties": {
                "companyName": {
                  "type": "string"
                },
                "about": {
                  "type": "string"
                },
                "sector": {
                  "type": "string"
                }
              },
              "required": [
                "companyName",
                "about",
                "sector"
              ]
            },
            "workplace": {
              "type": "object",
              "properties": {
                "street": {
                  "type": "string"
                },
                "city": {
                  "type": "string"
                },
                "region": {
                  "type": "string"
                },
                "nation": {
                  "type": "string"
                },
                "zipCode": {
                  "type": "string"
                },
                "geo": {
                  "type": "object",
                  "properties": {
                    "lat": {
                      "type": "number"
                    },
                    "lng": {
                      "type": "number"
                    }
                  },
                  "required": [
                    "lat",
                    "lng"
                  ]
                }
              },
              "required": [
                "street",
                "city",
                "region",
                "nation",
                "zipCode",
                "geo"
              ]
            },
            "qualifications": {
              "type": "object",
              "properties": {
                "minExperienceYears": {
                  "type": "number"
                },
                "preferredGender": {
                  "type": "string"
                },
                "degrees": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                },
                "requiredCertificates": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                },
                "keySkills": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                },
                "spokenLanguages": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                },
                "mustHaveAssets": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                }
              },
              "required": [
                "minExperienceYears",
                "preferredGender",
                "degrees",
                "requiredCertificates",
                "keySkills",
                "spokenLanguages",
                "mustHaveAssets"
              ]
            },
            "tasks": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "compensation": {
              "type": "object",
              "properties": {
                "value": {
                  "type": "number"
                },
                "currencyCode": {
                  "type": "string"
                },
                "payPeriod": {
                  "type": "string"
                }
              },
              "required": [
                "value",
                "currencyCode",
                "payPeriod"
              ]
            },
            "workSchedule": {
              "type": "object",
              "properties": {
                "shift": {
                  "type": "string"
                },
                "weeklyHours": {
                  "type": "number"
                },
                "workingDays": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                },
                "start": {
                  "type": "string"
                },
                "end": {
                  "type": "string"
                },
                "overtime": {
                  "type": "boolean"
                },
                "includesWeekend": {
                  "type": "boolean"
                }
              },
              "required": [
                "shift",
                "weeklyHours",
                "workingDays",
                "start",
                "end",
                "overtime",
                "includesWeekend"
              ]
            },
            "perks": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "dates": {
              "type": "object",
              "properties": {
                "posted": {
                  "type": "string"
                },
                "expiry": {
                  "type": "string"
                }
              },
              "required": [
                "posted",
                "expiry"
              ]
            },
            "extra": {
              "type": "object",
              "properties": {
                "keywords": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                }
              },
              "required": [
                "keywords"
              ]
            },
            "__v": {
              "type": "number"
            }
          },
          "required": [
            "_id",
            "jobId",
            "position",
            "organization",
            "workplace",
            "qualifications",
            "tasks",
            "compensation",
            "workSchedule",
            "perks",
            "dates",
            "extra",
            "__v"
          ]
        }
      }
    }
  ],
  normalized_data: {
    version: "1.0.0",
    schema: {
      "$schema": "http://json-schema.org/draft-07/schema#",
      "title": "Generated schema for Root",
      "type": "object",
      "properties": {
        "jobId": {
          "type": "string"
        },
        "job": {
          "type": "object",
          "properties": {
            "title": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "requirements": {
              "type": "object",
              "properties": {
                "age": {
                  "type": "string",
                },
                "education": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                },
                "experience": {
                  "type": "string"
                },
                "skills": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                },
                "gender": {
                  "type": "string",
                  "default": "any"
                },
                "languages": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                },
                "assetsRequired": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                },
                "physicalRequirements": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                },
                "documentsRequired": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                },
                "otherRequirements": {
                  "type": "array",
                  "items": {
                    "type": "string"
                  }
                }
              },
              "additionalProperties": true
            },
            "responsibilities": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "benefits": {
              "type": "array",
              "items": {
                "type": "string"
              }
            },
            "employment_type": {
              "type": "string",
              "default": "full_time"
            },
            "posted_at": {
              "type": "string"
            },
            "expires_at": {
              "type": "string"
            },
            "status": {
              "type": "string"
            }
          },
          "additionalProperties": true
        },
        "company": {
          "type": "object",
          "properties": {
            "name": {
              "type": "string"
            },
            "website": {
              "type": "string"
            }
          },
          "additionalProperties": true
        },
        "compensation": {
          "type": "object",
          "properties": {
            "currency": {
              "type": "string"
            },
            "min_amount": {
              "type": "number"
            },
            "max_amount": {
              "type": "number"
            },
            "incentive": {
              "type": "boolean"
            },
            "bonus": {
              "type": "boolean"
            }
          },
          "additionalProperties": true
        },
        "location": {
          "type": "object",
          "properties": {
            "city": {
              "type": "string"
            },
            "state": {
              "type": "string"
            },
            "country": {
              "type": "string"
            },
            "postal_code": {
              "type": "string"
            },
            "complete_address": {
              "type": "string"
            }
          },
          "additionalProperties": true
        }
      },
      "required": [
        "job",
        "company",
        "compensation",
        "location"
      ]
    }
  }
}

export default config;
