# Alexa Web API for Games Hello World

This is minimal sample of using the Alexa Web API for Games feature. It is laid out in a format compatible with the ASK command line interface tool. For more information, see: https://developer.amazon.com/en-US/docs/alexa/smapi/quick-start-alexa-skills-kit-command-line-interface.html Specifically this sample expects that you have already successfully configured the ask cli to deploy skills with a paired aws account through an aws cli profile.

## How to deploy this sample
- modify `ask-resources.json` and or `package.json` as described below to accomodate your ask profile configuration
- ensure that the AWS profile you intend to use has sufficient permissions to deploy the infrastructure for this skill. If you are using an IAM Role or IAM User, make sure they have full permission to modify:
  - Cloudformation, used to generate the infrastructure
  - Lambda, to act as the compute backend for the skill
  - Cloudwatch, to create logging targets for the Lambda
  - S3, to host the web app
  - IAM, used to create roles to limit the relationships between the above resources
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


### OK, I've deployed the sample, what can I do now?

* Change your skill's name. Look at `./skill-package/interactionModels/custom/en-US.json`. This is the language model for your skill when played in the US English language. Near the top, look for `invocationName` and change it! Run ask deploy to apply the change. Changing invocation name specifically can take a minute or two to apply to your testing account.
* Add something to say! The intents block in `./skill-package/interactionModels/custom/en-US.json` contains all of the utterances your skill will be able to recognize. It is populated with a few required Amazon standard intents, as well as a few custom ones. Look at `HelloWorldIntent` to see how you define a new named intent and provide examples of how your player will invoke it. Next, look into `./lambda/index.js` for the same string, `HelloWorldIntent`, to see how you can add a handler that responds when they do.
* Pass new information from your skill endpoint to your web app. In `./lambda/index.js` look at the instances of `Alexa.Presentation.HTML.HandleMessage`. This takes an arbitrary JSON blob and sends it to your web app. Try modifying an existing one, or add a new intent that responds with this directive. Now look in `./web/index.js` and notice how `messageReceivedCallback` is registered with the Alexa instance to receive those JSON messages. The sample just prints the message out, but you could try to apply any change to the web app you like! Maybe create an intent that recognizes color and set that color as the CSS property of an element?
* Plug in a game engine/framework. `./web/index.js` is loaded by the sample in `./web/index.html` as the entry point. You could keep adding to `./web/index.js`, replace it, or add new scripts and elements to the HTML page. If you’ve chosen to use any sort of framework, follow their guide for how to modify these two key single-page-app files.
* Add more files. You can enrich both the backend and web app with mode content. The salient entry points are:
    * `./lambda/index.js` adds the `handler` property to the `exports` object, which is what lambda will invoke to handle requests. As long as you end up with a similar file, exporting the same property, it’ll work. The entire `./lambda` folder will be uploaded by ask-cli to your aws account as a single zip file. Keep the total size of this trim, to keep iteration time low!
    * `./web/html` is currently specified as the web app to load, via the `Alexa.Presentation.HTML.Start` directive in the endpoint code. You can modify this if need be. Otherwise, that HTML page loads `./web/index.js`, which you could generate from other sources instead.
    * You can add any other asset files for your web app to the `./web` directory, all of which will be synchronized with your S3 bucket by the `deploy-webapp.js` script. That uses aws cli’s sync command, which functions roughly like rsync, using hashes to avoid redundant uploads. The total number of files and how often they change will affect your iteration time, but not necessarily the size of the files.


### Is this sample production ready?

If you begin a project from this sample and intent to take it all the way to production, you'll need to make various upgrades based on how your project evolves. Things to consider:
* The simple web app deployment presented here supports a single JavaScript file. Should you decide to use this sample as a development starting point, you'll soon want to select a more scalable build system that would let you automatically package a single page application into as few assets as possible, for instance webpack.
* S3 will work great during development, and even support several hundred customers, but eventually you'll run into concurrent access limits, and depending on your content, latency issues. As your web app is loaded by the device in the same manner as a web browser, the usual web advice about distribution and edge caching applies. The simplest upgrade path from this project is to create an Amazon CloudFront distribution and point it to your S3 bucket.
* The provided CloudFormation creates a single endpoint deployment and connects that to your skill. Unlike your web app, your skill endpoint will be invoked by Alexa from the Alexa regional data centers. To support customers with the best latency internationally, you'll want to modify your deployment to create regional skill endpoints located adjacent to Alexa's. See more information here: https://developer.amazon.com/en-US/docs/alexa/custom-skills/host-a-custom-skill-as-an-aws-lambda-function.html#select-the-optimal-region-for-your-aws-lambda-function 

