/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
 
const stationName = "<deine Station-Name>"
const spokenStationName = "<deine ausgesprochene Station-Name>"

const Alexa = require('ask-sdk-core');
const messages = {
    continue:
        'Ich mache weiter, wo wir beim letzten Mal aufgehört haben. ',
    help:
        'Du hörst einen Sender von laut f m',
    pause:
        'Ok. Mit fortfahren, gehts weiter',
    stop:
        'Bis bald!',
    welcome:
        'Willkommen, du hörst' + spokenStationName,
    more:
        'Wenn Du mehr Sender hören willst, besuch uns auf laut punkt <say-as interpret-as="cardinal">FM</say-as>.',
    unable:
        'Das kann ich leider nicht.',
    fallback:
        'Ich weiß nicht, wie ich das schaffen soll. Bitte versuch was anders'
};

const url = "https://stream.laut.fm/" + stationName + "?ref=alexa-own-" + stationName;
const token = function() {
    return url + '&' + ( new Date() ).getTime();
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest'
            || (Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
                && Alexa.getIntentName(handlerInput.requestEnvelope) === 'PlayStationIntent');
    },
    handle(handlerInput) {
        const speakOutput = messages.welcome;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .addAudioPlayerPlayDirective("REPLACE_ALL", url, token(), 0)
            .getResponse();
    }
};

const PauseIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.PauseIntent'
    },
    handle(handlerInput) {
        const speakOutput = messages.pause
        
        return handlerInput.responseBuilder
            .addAudioPlayerStopDirective()
            .speak(speakOutput)
            .getResponse();
    }
}

const ResumeIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.ResumeIntent'
    },
    handle(handlerInput) {
        const speakOutput = messages.continue

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .addAudioPlayerPlayDirective("REPLACE_ALL", url, token(), 0)
            .getResponse();
    }
}

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = messages.help;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .addAudioPlayerPlayDirective("REPLACE_ALL", url, token(), 0)
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
        const speakOutput = messages.stop;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .addAudioPlayerStopDirective()
            .getResponse();
    }
};

const PreviousNextRepeatIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.NextIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.PreviousIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.RepeatIntent')
    },
    handle(handlerInput) {
        const speakOutput = messages.unable;
        
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .addAudioPlayerPlayDirective("REPLACE_ALL", url, token(), 0)
            .getResponse()
    }
    
}
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
        const speakOutput = messages.unable;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .addAudioPlayerPlayDirective("REPLACE_ALL", url, token(), 0)
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
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
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
        const speakOutput = messages.fallback;
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
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        PauseIntentHandler,
        ResumeIntentHandler,
        PreviousNextRepeatIntentHandler,
        IntentReflectorHandler,
        )
    .addErrorHandlers(
        ErrorHandler)
    .lambda();
