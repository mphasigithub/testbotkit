var botId = "st-f7326cc0-bbc0-5439-8e87-471c3a36c633";
var botName = "Flight Search_Webhook";
var sdk = require("./lib/sdk");
var debug  = require('debug')("Agent");
var mockServiceUrlTest = "https://samplenodekore.azurewebsites.net/places";
var { makeHttpCall } = require("./makeHttpCall");

/*
 * This is the most basic example of BotKit.
 *
 * It showcases how the BotKit can intercept the message being sent to the bot or the user.
 *
 * We can either update the message, or chose to call one of 'sendBotMessage' or 'sendUserMessage'
 */

function findhydPlaces(callback) {
    return new Promise(function(resolve, reject) {
        makeHttpCall(
            'get',
            mockServiceUrlTest
        )
        .then(function(res) {
            sdk.sendBotMessage(res.data, callback);
            resolve(res.data);

        }).catch(function(err) {
            return reject(err);
        })
    });
}

module.exports = {
    botId   : botId,
    botName : botName,

    on_user_message : function(requestId, data, callback) {
        debug("in on_user_message %s ", requestId);
        if (data.message === "Namaste") {
            data.message = "Namaste Jaipal";
            findhydPlaces(callback);
            //Sends back 'Hello' to user.
            return sdk.sendUserMessage(data, callback);
        } else if(data.message === "is this botkit?"){
            data.message = "Yes, you are chating with botkit";
            //Sends back 'Hello' to user.
            return sdk.sendUserMessage(data, callback);
        } else if(data.message === "Place to visit in hyderabad"){
            data.message = `Top 5 attaractions in Hyderabad
            1. Charminar
            2. Salar Jung Museum
            3. Golconda Fort
            4. Ramoji Film City
            5. Hussain Sagar Lake`;
            //Sends back 'Hello' to user.
           
            return sdk.sendUserMessage(data, callback);
        }else if(!data.agent_transfer){
            //Forward the message to bot
            return sdk.sendBotMessage(data, callback);
        } else {
            data.message = "Agent Message";
            return sdk.sendUserMessage(data, callback);
        }
    },
    on_bot_message  : function(requestId, data, callback) {
        if (data.message === 'hello') {
            data.message = 'The Bot says hello!';
        }
        //Sends back the message to user
        
        return sdk.sendUserMessage(data, callback);
    },
    on_agent_transfer : function(requestId, data, callback){
        return callback(null, data);
    },
    on_event : function (requestId, data, callback) {
        console.log("on_event -->  Event : ", data.event);
        return callback(null, data);
    },
    on_alert : function (requestId, data, callback) {
        console.log("on_alert -->  : ", data, data.message);
        return sdk.sendAlertMessage(data, callback);
    }

};
