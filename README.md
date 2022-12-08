# Alexa Web API for Games Hello World

This is minimal sample of using the Alexa Web API for Games feature. It is laid out in a format compatible with the ASK command line interface tool. For more information, see: https://developer.amazon.com/en-US/docs/alexa/smapi/quick-start-alexa-skills-kit-command-line-interface.html Specifically this sample expects that you have already successfully configured the ask cli to deploy skills with a paired aws account through an aws cli profile.

## How to deploy this sample
- modify `ask-resources.json` and or `package.json` as described below to accomodate your ask profile configuration
- use `npm run deploy` to initially build and deploy:
  - the skill (to the Amazon developer portal), 
  - the skill backend (to AWS Lambda), and 
  - the web app (to AWS S3)
- iterate and deploy by repeating calls to `npm run deploy`. In the case where you are only modifying the web app, you can reduce iteration time by calling `npm run deploy-webapp` directly

## Using profiles other than default
This sample is configured to deploy to your `default` ask cli and aws cli profiles. If you opted not to have a default profile, or would like to deploy to an alternative profile, then you will need to:
1. modify the ask-resources.json file to change the `profiles.default` key to a `profiles.yourProfileName` key instead.
2. when invoking the deploy-webapp.js script, use the `-p` flag to pass in your AWS profile name.

## What the sample does
- The skill endpoint, `./lambda/index.js`, responds to skill launch by checking to see if Web API is supported on the device, and if so, sends a directive to launch a web app. See `LaunchRequestHandler`
- The web app, `./web/index.js` we initialize the Alexa Web API JavaScript API, and then register callbacks to handle messaging with the endpoint. A matching handler on the endpoint, `ProcessHTMLMessageHandler`, listens for messages, and performs different actions based on the message contents
- The web app logs its activity to a debug div on screen to help explain what events are occuring
- A voice intent, `Alexa, repeat after me [content]` produces a response at `RepeatAfterMeHandler`, which will cue some speech, as well as send a message to the web app 
- A button in the web app, `helloButton` demonstrates sending a message from the device. The message used produces both speech in response, and logged events in the endpoint's CloudWatch logs
- The `micButton` demonstrates using the Alexa api to request the microphone be opened on the device, when possible

## FAQs

### Is this sample production ready?

If you begin a project from this sample and intent to take it all the way to production, you'll need to make various upgrades based on how your project evolves. Things to consider:
* The simple web app deployment presented here supports a single JavaScript file. Should you decide to use this sample as a development starting point, you'll soon want to select a more scalable build system that would let you automatically package a single page application into as few assets as possible, for instance webpack.
* S3 will work great during development, and even support several hundred customers, but eventually you'll run into concurrent access limits, and depending on your content, latency issues. As your web app is loaded by the device in the same manner as a web browser, the usual web advice about distribution and edge caching applies. The simplest upgrade path from this project is to create an Amazon CloudFront distribution and point it to your S3 bucket.
* The provided CloudFormation creates a single endpoint deployment and connects that to your skill. Unlike your web app, your skill endpoint will be invoked by Alexa from the Alexa regional data centers. To support customers with the best latency internationally, you'll want to modify your deployment to create regional skill endpoints located adjacent to Alexa's. See more information here: https://developer.amazon.com/en-US/docs/alexa/custom-skills/host-a-custom-skill-as-an-aws-lambda-function.html#select-the-optimal-region-for-your-aws-lambda-function 

