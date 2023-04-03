/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const {Configuration, OpenAIApi} = require('openai');
//const keys = require('./Keys');
var gptTurboMessage =  [{role:"system", content: "You are an AI assistant. "}]; //Try to be brief when possible.
const axios = require('axios');

/*const config = new Configuration({
    apiKey: keys.OPEN_AI_KEY
});*/

const openai = new OpenAIApi(config);
const intro_hi = ["Hello! ", "Hi! ", "Hey! ", "Welcome! "]
const intro_agent =["I am an AI language model designed to present requested information. ", 
"I am an intelligent virtual agent programmed to provide you with the requested information to the best of my ability. ",
"I am an AI model intended to furnish relevant information on request. ",
"As an AI language model my purpose is to provide requested information as accurately as possible. ",
"I am here to provide information. "];

const intro_error = [" However, I am not perfect so take caution in using the information I provide... ",
"However, as with any technology, errors or inaccuracies may occur, so please use the provided information with caution and verify if necessary... ",
"Please bear in mind that errors or inaccuracies may happen so use the information provided with caution and verify if necessary... ",
"However, errors and inaccuracies may sometimes occur, so please exercise cause when utilizing the information I present and verify it if needed... ",
"But mistakes can happen. Please double check the information I give you before relying on it... ", 
"But errors are possible. Always verify the information I provide before using it... "];

const intro = ['How can I assist you today?', 'What do you wanna know?', 'What questions do you have?', 'What would you like to know?'  ];

const other = ['Any other questions for me?', 'What else can I help you with?', 'Anything else you\'d like to know?', 'Anything else?'];

const bye = ["Goodbye!", "Untill next time!", "Take care!", "Stay safe!", "Bye!", "Have a good one!"];

const fillers = ["Let me check that for you!", "checking", "looking up"];
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        const index = Math.floor(Math.random() * 3);
        const index_hi = Math.floor(Math.random() * 3);
        const index_agent = Math.floor(Math.random() * 4); 
        const index_error = Math.floor(Math.random() * 5);
        const speakOutput =  intro_hi[index_hi] + intro_agent[index_agent] + intro_error[index_error] + intro[index];

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/*const NavigateHomeIntentHandler ={
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        && Alexa.getIntentName(handlerInput.requestEnvelope) === 'NavigateHomeIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'How can I assist you?';
        gptTurboMessage =  [{role:"system", content: "You are an AI assistant."}];
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};*/

//AMAZON.NavigateHomeIntent
//


const AskChatGPTIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AskChatGPTIntent';
  },
  
  
  async handle(handlerInput) {
    const question = 
            Alexa.getSlotValue(handlerInput.requestEnvelope, 'question');
    gptTurboMessage.push({role:"user", content:  question});
    
  
   
   // make a POST API call to the OpenAI GPT-3.5 turbo endpoint
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
    const authToken = 'Bearer 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';
    const requestData = {
        model : 'gpt-3.5-turbo',
        messages: gptTurboMessage
      //length: 50,
      //temperature: 0.7,
      //max_rerolls: 5,
      //n: 1,
      //stop: '\n'
    };
    //const startTime = Date.now();
    //const endTime = Date.now();
    
    const apiResponsePromise = axios.post(apiUrl, requestData, {
      headers: {
        Authorization: authToken,
        'Content-Type': 'application/json',
      },
    });
    /*while (apiResponsePromise){
        
    }*/
    //progressive call 
   
   // Get the API access token and request ID
    const apiAccessToken = handlerInput.requestEnvelope.context.System.apiAccessToken;
    const requestId = handlerInput.requestEnvelope.request.requestId;

   
    const index_filler = Math.floor(Math.random() * 2);
    const repromptText = fillers[index_filler];
    
   
   const directive = {
      type: 'VoicePlayer.Speak',
      speech: repromptText,
    };
    
    
    const request = {
      header: {
        requestId: requestId
      },
      directive: directive
    };

  
   // Make the API call to mark the directive as complete
    axios.post('https://api.amazonalexa.com/v1/directives', request, {
      headers: {
        Authorization: `Bearer ${apiAccessToken}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('Directive sent successfully!');
    })
    .catch(error => {
      console.error('Error sending directive:', error);
    });
   
   
   // wait for the API response
   try{
    const apiResponse = await apiResponsePromise;
    const finalSpeech = ` ${apiResponse.data.choices[0].message.content}.`;
    const index2 = Math.floor(Math.random() * 3);
    gptTurboMessage.push({role:apiResponse.data.choices[0].message.role, content: apiResponse.data.choices[0].message.content});
    return handlerInput.responseBuilder
      .speak(finalSpeech)
      .reprompt(other[index2])
      .getResponse();
    //return handlerInput.responseBuilder.getResponse();
}
catch (error){
    console.error(error);
    handlerInput.responseBuilder
      .speak('Something went wrong. I cannot connect to my base.');
}

    // send the final response
    
    //return handlerInput.responseBuilder.getResponse();
   //older working one
   
   /* const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo", //'text-davinci-003',// 'text-davinci-003',
        messages: gptTurboMessage
        //messages: gptTurboMessage,
        //messages = [{role: "system", content: "You are a personal assistant"}, {role: "user", content: question}]
        //prompt: question,
        //role: "user",
        //temperature: 1,
        //top_p: 0.5
        //max_tokens: 150
        //n: 1,
        //stop: ['\n']
        //frequency_penalty: 0.2,
        //presence_penalty: 0.2
    });
    
    
    
    //send an update for progressive
    // handlerInput.responseBuilder
     // .addDirective(directive);
      
    const speakOutput = response.data.choices[0].message.content + "...";
    //const speakOutput = response;
    // response.data.usage.prompt_tokens + "..." + response.data.usage.completion_tokens + "..." +
    gptTurboMessage.push({role:response.data.choices[0].message.role, content: response.data.choices[0].message.content});
    const index2 = Math.floor(Math.random() * 3);
    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(other[index2])
      .getResponse();
   // return handlerInput.responseBuilder.getResponse();
  
      */
  }
};

const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Hello World!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const index_bye = Math.floor(Math.random() * 5);
        const speakOutput = bye[index_bye];

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Is there something else you would like to know?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.speak("An error has occured. I cannot reach the model. Please try again!").getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
 
 
 
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        AskChatGPTIntentHandler,
        HelloWorldIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
        //NavigateHomeIntentHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();