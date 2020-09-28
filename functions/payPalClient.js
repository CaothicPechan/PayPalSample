
'use strict';

const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

/**
 * Returns PayPal HTTP client instance with environment which has access
 * credentials context. This can be used invoke PayPal API's provided the
 * credentials have the access to do so.
 */
function client(paypal_config) {
    console.log('Setting up client')
    return new checkoutNodeJssdk.core.PayPalHttpClient(environment(paypal_config));
}

/**
 * Setting up and Returns PayPal SDK environment with PayPal Access credentials.
 * For demo purpose, we are using SandboxEnvironment. In production this will be
 * LiveEnvironment.
 */
function environment(paypal_config) {
    let clientId = paypal_config.client_id;
    let clientSecret = paypal_config.client_secret;

    // if (process.env.NODE_ENV === 'production') {
    //     return new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret);
    //  }

    return new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
}

async function prettyPrint(jsonData, pre=""){
    let pretty = "";
    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
    }
    for (let key in jsonData){
        if (jsonData.hasOwnProperty(key)){
            if (isNaN(key))
              pretty += pre + capitalize(key) + ": ";
            else
              pretty += pre + (parseInt(key) + 1) + ": ";
            if (typeof jsonData[key] === "object"){
                pretty += "\n";
                pretty += await prettyPrint(jsonData[key], pre + "\t");
            }
            else {
                pretty += jsonData[key] + "\n";
            }

        }
    }
    return pretty;
}



module.exports = {client: client, prettyPrint:prettyPrint};