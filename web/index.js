// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/

var alexaClient;
Alexa.create({version: '1.1'})
     .then((args) => {
         const {
             alexa,
             message
         } = args;
        alexaClient = alexa;
        alexaClient.skill.onMessage(messageReceivedCallback)
        document.getElementById('debugElement').innerHTML = 'Alexa is ready :)';
     })
     .catch(error => {
        document.getElementById('debugElement').innerHTML = 'Alexa not ready :(';
     });


// Implement the listener
function messageReceivedCallback(message) {
  // Process message (JavaScript object) from your skill
  document.getElementById('debugElement').innerHTML = message.message.type ? message.message.message : message.message;
}

function sendMessage(msg){
    let json = JSON.stringify(msg);
    alexaClient.skill.sendMessage(json);
}

// Check the results of the SendMessage
const messageSentCallback = function(sendResponse) {
    const {
        statusCode,
        reason,
        rateLimit,
    } = sendResponse;
    // Handle response codes
};