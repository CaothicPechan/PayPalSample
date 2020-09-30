<template lang="pug">
    .paypal-content
        v-card.mx-auto.my-12(:loading='loading' max-width='374')
            template(slot='progress')
                v-progress-linear(color='deep-purple' height='10' indeterminate='')
            v-img(height='250' src='https://cdn.vuetifyjs.com/images/cards/cooking.png')
            v-card-title Cafetería Wanderstar
                v-row.mx-0(align='center')
                        v-rating(:value='4.5' color='amber' dense='' half-increments='' readonly='' size='14')
                        .grey--text.ml-4
                            | 4.5 (413)
            v-card-text
                    .my-4.subtitle-1
                        strong Paquete de Desayuno y Café
                    div
                        | Incluye una taza de café, galletas y un pay con entrega a domicilio.
            v-divider.mx-4
            v-alert(v-if='message.active' dense='' text='' :type='message.type')
                | {{ message.text }}

            v-card-title Paga en línea
                v-chip.ma-2(color='success' outlined='')
                    v-icon(left='')
                        | attach_money
                    |       2.50 USD

            
            v-card-actions
                #paypal-button-container

            

</template>

<script>



export default {
    data: () => ({
        loading: false,
        message:{
            text:'',
            type:'success',
            active: false
        }
    }),
    mounted(){
        let _this = this;
        paypal.Buttons({

            
            createOrder: function() {
                return fetch('https://us-central1-fir-2c459.cloudfunctions.net/orders', {
                    method: 'post',
                    headers: {
                        'content-type': 'application/json'
                    }
                }).then(function(res) {
                    return res.json();
                }).then(function(data) {
                    return data.orderID; 
                });
            },
            onApprove: function(data) {
                return fetch('https://us-central1-fir-2c459.cloudfunctions.net/orders', {
                    headers: {
                        'content-type': 'application/json'
                    },
                    method: 'patch',
                    body: JSON.stringify({
                        orderID: data.orderID
                    })
                }).then(function(res) {
                    return res.json();
                }).then(function(details) {

                    _this.message.text = `¡Gracias por la compra ${details.payer.name.given_name}!`;
                    _this.message.active = true;
                    
                })
            }

        }).render('#paypal-button-container');
    }
}
</script>

<style scoped>
#paypal-button-container{
    width: 100%;
}
</style>