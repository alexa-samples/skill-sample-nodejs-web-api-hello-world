// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: LicenseRef-.amazon.com.-AmznSL-1.0
// Licensed under the Amazon Software License  http://aws.amazon.com/asl/


const debugElement = document.getElementById('debugElement');
/**
 * Append text or any object that can be stringified to the debug element
 * @param {any} msg 
 */
function printDebug( msg ) {
    if ( typeof(msg) !== 'string' ) {
        debugElement.append(JSON.stringify(msg,null,2));
    } else {
        debugElement.append(msg);
    }
    debugElement.append('\n');
    debugElement.scrollTo({top: debugElement.scrollHeight});
    console.log(msg);
}



/** @type {Alexa.AlexaClient} */
let alexaClient;

function beginApp() {
printDebug('Beginning Alexa.create');
Alexa.create({version: '1.1'})
    .then((args) => {
        if ( args.alexa ) {
            alexaClient = args.alexa;
            alexaClient.skill.onMessage(messageReceivedCallback);
            printDebug(`Alexa is ready :) Received initial data:`);
            printDebug(args.message);
        } else {
            printDebug(`Alexa failed to initialize, code: ${args.code}`);
        }
    })
    .catch(error => {
        printDebug( 'Alexa not ready :(' );
        printDebug( error );
    });
}

// to avoid blocking the first paint, we start code after the first frame
requestAnimationFrame(beginApp);

     

/**
 * Implements receiving a message from your skill backend
 * @param {any} message 
 */
function messageReceivedCallback(message) {
  // Process message (JavaScript object) from your skill
  printDebug('received a message from the skill endpoint');
  printDebug(message);
}

/**
 * Implements listening to the result of sending a message to your skill backend
 * @param {Alexa.MessageSendResult} result 
 */
const messageSentCallback = function(result) {
    if ( result.statusCode === 200 ) {
        printDebug(`message was sent to backend successfully`);
    } else {
        printDebug(`failed to send message to skill backend:`);
    }
    printDebug(result);
};

/**
 * Wraps sending a message to your skill backend 
 * with our custom result callback function
 * @param {any} msg 
 */
function sendMessage(msg){
    printDebug(`sending message to skill endpoint:`);
    printDebug(msg);
    if ( alexaClient ) {
        alexaClient.skill.sendMessage(msg, messageSentCallback);
    } else {
        printDebug(`Alexa was not ready, could not send message:`);
        printDebug(msg);
    }
}

/*
  When handling touch events on Alexa screen devices, 
  you can skip the latency caused by browser support 
  for long presses by handling the down events directly.
  Be sure to preventDefault on touch events if you've also
  implemented mouse events for testing.
*/

function bindButton( name, func ) {
    const element = document.getElementById(name);
    element.addEventListener('mousedown', (ev) => {
        func();
    });
    
    element.addEventListener('touchstart', (ev) => {
        func();
        ev.preventDefault();
    });    
}

bindButton('helloButton', () => {
    sendMessage({speech:'Hello world', time: Date.now()});
});

bindButton('micButton', () => {
    if ( !alexaClient ) {
        printDebug('cannot open the microphone, Alexa is not ready');
        return;
    }
    
    printDebug('requesting the microphone open');
    alexaClient.voice.requestMicrophoneOpen({
        onOpened: () => printDebug('the microphone was opened'),
        onClosed: () => printDebug('the microphone was closed'),
        onError: (err) => {
            printDebug('failed to open the microphone:');
            printDebug(err);
        }
    })
});