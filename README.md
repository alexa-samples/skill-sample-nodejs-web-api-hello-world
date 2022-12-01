# alexaskill-webapi-helloworld


## Features
A simple webapi hello world skill which illustrates  the following core concepts:
- Intialize the Alexa Javascript API and register callbacks
- Send a message to the skill backend from custom Javascript via a touch events in HTML
- Sending a ``` Alexa.Presentation.HTML.HandleMessage``` directive from the skill lambda using an Intent hanler (```HelloWorldIntent```)which  is handled by the custom JS under Web\index.js to update the front end HTML page

## Deployment
  - Host the assets under \web to an approriate web host such as s3 or aws amplify
  - Use ```ask deploy``` to build and deploy the skill model and lambda backend
  - Add an environment variable named WEB_URL pointing to index.html e.g. https://somehost/web/index.html
  
  TIP: If hosting  Web assets in S3, a quick way to push Web assets is via the AWS CLI using  ```aws s3 cp . s3://<bucketname>/web --recursive``` from the web directory and fronting the S3 bucket via cloudfront (optional)
