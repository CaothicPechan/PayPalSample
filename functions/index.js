const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({origin: true});
const paypal = require('@paypal/checkout-server-sdk');
const payPalClient = require('./payPalClient');



const Order = require('./Orders')

admin.initializeApp(functions.config().firebase);
let db = admin.firestore();
let paypal_config = functions.config().paypal;

exports.orders = functions.https.onRequest((req, res) =>{
    cors(req, res, async () => {

        console.log(`Method ${req.method}`);
        console.log(`Query ${JSON.stringify(req.query)}`);
        console.log(`Body ${JSON.stringify(req.body)}`)

        let _order = new Order(req,res,db);

        switch(req.method){

            case 'GET': 
            {
                return res.send(501)
            }
            case 'POST': 
            {
                console.log('Order Data Received ')

                return _order.create(paypal_config);
            }
            case 'PATCH': 
            {
                if( req.body.orderID){
                    return _order.approve(paypal_config, req.body.orderID);    
                }else{
                    return res.send(404);
                }
            }
            default:
            {
                return res.sendStatus(501)
            }

        }
    });
})
