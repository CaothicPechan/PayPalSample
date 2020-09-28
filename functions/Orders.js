
const paypal = require('@paypal/checkout-server-sdk');
const payPalClient = require('./payPalClient');

module.exports = class Orders {

    constructor(req,res,firebaseContext){
        this.req = req;
        this.res = res;
        this.db = firebaseContext;
        this.response = {
            status: 200,
            url: '',
            payload: {}
        };

        this.create = this.create.bind(this);
    }

    /**
     * 
     * @param {Object} catalog 
     *  
     * 
     *      @param {String} name
     *      @param {Object} data
     * 
     * 
     */
    async create(paypal_config, _order = null) {

        let res = this.res;


        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [{
            amount: {
                currency_code: 'USD',
                value: '2.50'
            }
            }]
        });

        let order;
        try {
            order = await payPalClient.client(paypal_config).execute(request);
            console.log('Check order order', order)
            var id = order.result.id;
            console.log('Check order order Id', id)
            // 5. Return a successful response to the client with the order ID
            return res.status(200).json({
                orderID: id
            });

        } catch (err) {
            console.error(err);
            return res.send(500);
        }
    }

    async approve(paypal_config, orderID) {

        let orderContext = this.db.collection('orders');
        let res = this.res;
        let today = new Date();
        let newOrder = { id: orderID };
        newOrder.createDate = today.toISOString();
        newOrder.updateDate = null;
        console.log('Order approve process ', orderID)


        const request = new paypal.orders.OrdersCaptureRequest(orderID);
        request.requestBody({});

        let details = {};
        try {
            const capture = await payPalClient.client(paypal_config).execute(request);

            const captureID = capture.result.purchase_units[0].payments.captures[0].id;

            newOrder.capture = capture;
            await orderContext.add(newOrder);
            details = capture.result;

        } catch (err) {
            console.error(err);
            return res.send(500);
        }
        res.status(200).json(details);
        return;
    }
}
