Add this to the bottom of the app.json under expo, and uncomment sentry code in app.tsx

    "hooks": {
      "postPublish": [
        {
          "file": "sentry-expo/upload-sourcemaps",
          "config": {
            "organization": "your sentry organization's short name here",
            "project": "your sentry project's name here",
            "authToken": "your auth token here"
          }
        }
      ]
    }
