
export declare module AlexaSDK {

  export interface MicrophoneCapabilities {
    /**
     * The Alexa device has some mechanism to allow the customer to push a button to begin talking to Alexa, e.g. the button on top of an Echo Dot, or on the remote of a Fire TV
     */
    supportsPushToTalk: boolean; 
    /**
     * The Alexa device supports using a wake word, e.g. "Alexa", "Echo", or "Computer" to begin talking to Alexa. Some devices like Fire TV Sticks may not support a wake word
     */
    supportsWakeWord: boolean;
  }

  export interface Capabilities {
    microphone: MicrophoneCapabilities;
  }



  export interface MemoryInfo {
    availableMemoryInMB: number;
  }

  export interface MemoryInfoError {
    message: string;
  }

  export interface Performance {
    /**
     * Returns current information about the memory environment. Note that this call may be resource intensive, and could impact performance.
     */
    getMemoryInfo(): Promise<MemoryInfo | MemoryInfoError>
  }



  export interface RateLimit {
    /**
     * the total number of message sends supported each second
     */
    maxRequestsPerSecond: number;
    /**
     * how many more requests you can send within this window
     */
    remainingRequests: number;
    /**
     * how many milliseconds before the next message can be sent
     */
    timeUntilNextRequestMs: number;
    /**
     * how many milliseconds until the next window begins
     */
    timeUntilResetMs: number;
  }

  /**
   * Describes the final status of an attempt to send a message to your skill backend
   */
  export interface MessageSendResult {
    /**
     * HTTP error code that indicates the status of transmission. 2XX indicates success, other codes indicate the message was not sent to your skill backend
     */
    statusCode: number
    /**
     * Human readable explanation for the statusCode value
     */
    reason: string,
    /**
     * Message transmission is rate limited to prevent spamming the network. This object describes when you may or may not send another message, and or why this message was rejected
     */
    rateLimit?: number,
  }

  export interface Skill {
    /**
     * Register a function to be called each time a message is received from your backend via the Alexa.Presentation.HTML.HandleMessage. See: https://developer.amazon.com/en-US/docs/alexa/web-api-for-games/alexa-presentation-html-interface.html#handle
     * @param callback Function that will be called whenever a message arrives 
     */
    onMessage( callback: (message: any) => void ) : Skill;
    /**
     * Sends a message to your skill backend that will arrive in the form of a Alexa.Presentation.HTML.Message. See: https://developer.amazon.com/en-US/docs/alexa/web-api-for-games/alexa-games-build-your-skill.html#communicate-with-the-web-app
     * @param message JSON to deliver to your skill backend
     * @param callback Function that will be called to report the status of transmission
     */
    sendMessage( message: any, callback?: MessageSendResult ): Skill;
  }

  export interface Speech {
    /**
     * Registers a callback that will be called whenever the system begins automated Alexa speech playback. Use this to duck your own audio playback under the speech
     * @param callback function to call when speech starts
     */
    onStarted( callback: () => void ) : Speech;
    /**
     * Registers a callback that will be called whenever the system stops automated Alexa speech playback
     * @param callback function to call when speech stops
     */
    onStopped( callback: () => void ) : Speech;
  }



  export declare type MicrophoneOpenedError = "microphone-already-open" | "request-open-unsupported" | "too-many-requests" | "unknown";

  export interface MicrophoneOpenOptions {
    /**
     * Callback function that will be invoked when the microphone is opened on device for this specific request. Note: the customer may also press the button or use the wake word as you're submitting this request, intending to perform some other task
     */
    onOpened: undefined | (() => void);
    /**
     * Callback function that will be invoked when the microphone stops listening, specifically for this request
     */
    onClosed: undefined | (() => void);
    /**
     * Callback functiont hat will be incoked if there was an error attempting to fulfill this request
     */
    onError: undefined | ((error: MicrophoneOpenedError) => void);
  }



  export interface Voice {
    /**
     * Asks the Alexa system to start listening for customer speech, as if the customer had pressed the talk button on an Echo Dot. The microphone will keep listening until the customer stops speaking, or a timeout occurs.
     * @param configuration 
     */
    requestMicrophoneOpen(configuration?: MicrophoneOpenOptions): void
    /**
     * Register a callback that will be fired whenever the microphone is opened on device. Use this to duck your audio playback to improve speech recognition accuracy
     * @param callback function that will be called when the microphone starts listening
     */
    onMicrophoneOpened(callback: () => void): Voice
    /**
     * Register a callback that will be fired whenever the microphone closes on device. You can use this to indicate that you're now waiting for the speech recognition results to be processed on the cloud
     * @param callback function that will be called when the microphone stops listening 
     */
    onMicrophoneClosed(callback: () => void): Voice;
  }



  export interface AlexaClient {
    /**
     * Version of the loaded Alexa client library
     */
    version: string;
    /**
     *Information about the capabilities of this Alexa device
    */
    capabilities: Capabilities;
    /**
     * Information about the performance of this Alexa device
     */
    performance: Performance;
    /**
     * Bidirection interface for communicating with your skill backend
     */
    skill: Skill;
    /**
     * Interface for interacting with Alexa speech being played back by the system
     */
    speech: Speech;
    /**
     * Interface for interacting with voice input
     */
    voice: Voice;
  }



  export type SpeechMarkTypes = "sentence" | "word" | "viseme" | "ssml";

  /**  
   * Represents a single speech mark, as part of the list of speech marks returned alongside transformed text to speech. It defines an object that appears at a particular time in the audio stream, either a sentence, word, phoneme, or ssml mark tag.
   * For more information on speech marks, see: https://docs.aws.amazon.com/polly/latest/dg/speechmarks.html */
  export interface SpeechMark {
    /** byte (not character!) offset to the start of the object */
    start: number;
    /** byte (not character!) offset to end of the object */
    end: number;
    /** offset to the object from stream start, in milliseconds */
    time: string;
    /** type of object, may be sentence, word, visems, or ssml \<mark/> tag */
    type: SpeechMarkTypes;
    /** varies, could be viseme name (viseme), text fragment (sentence/word), or "name" from \<mark name="something"/> tag */
    value: string;
  }

  /**
   * Audio data returned from Alexa.speech.fetchAndDemuxMP3
   */
  export interface AudioData {
    /**
     * The audio only portion of the downloaded MP3 file, ready to pass to decodeAudioData in Web Audio
     */
    audioBuffer: ArrayBuffer;
    /**
     * An array of speech marks that describe the contents of the audio data
     */
    speechMarks: SpeechMark[];
  }

  export interface FetchAndDemuxError {
    /** 
     * In the case of a failure to fully extract the speech marks from the audio file, this may still contain a playable audio buffer
    */
    data: undefined | { audioBuffer: ArrayBuffer };
    /**
     * A human readable reason the fetch failed
     */
    message: string;
    /**
     * In the event of a network error, this will contain the relevant HTTP error code
     */
    statusCode: undefined | number;
  }

  export interface SpeechUtils {
    /**
     * 
     * @param url Fetches a single text to speech transformer audio file, and then separates the audio data from the speech marks
     */
    fetchAndDemuxMP3(url: string): Promise<AudioData | FetchAndDemuxError>;
  }

  export interface Utils {
    readonly speech: SpeechUtils;
  }




  export declare type MessageActions = "alexa-html-ready" | "message-to-html" | "tts-started" | "tts-stopped" | "mic-event" | "mic-requested-event" | "memory-available";

  export interface SystemMessage {
    action: MessageActions;
    data: any;
  }

  /**
   * This interface describes the protocol used to communicate with Alexa. You can replace this during Alexa.create to stub out the communications during testing
   */
  export interface MessageProvider {
    receive( cb: (msg: SystemMessage) => void ) : void;
    send( cmd: string, payload?: any ) : Promise<SendResult>;
  }

  export interface CreateClientOptions {
    /**
     * If left empty, defaults to the latest version
     */
    version?: string;
    /**
     * Allows the internal message implementation to be replaced with the given object. Used to stub out communications during testing
     */
    messageProvider?: MessageProvider;
  }



  export interface AlexaCreateResult {
    alexa: AlexaClient;
    /**
     * The data you specified as the `data` member of the Alexa.Presentation.HTML.Start directive
     */
    message: any;
  }

  export interface AlexaCreateError {
    code: "no-such-version" | "unauthorized-access" | "too-many-requests" | "unknown";
    message: string;
  }

  export interface Alexa {
    /**
     * Creates an object that represents the connection to your skill backend
     * @param options 
     */
    create( options: CreateClientOptions ) : Promise<AlexaCreateResult | AlexaCreateError>;
    readonly utils: Utils;
  }
}

export declare global {
  /**
   * Global Alexa object, created when you include the Alexa Web API js file in your HTML page
   */
  const Alexa: AlexaSDK.Alexa;
}

