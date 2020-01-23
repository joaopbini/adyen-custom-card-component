// 0. Get originKey
getOriginKey().then(originKey => {
    getPaymentMethods().then(paymentMethodsResponse => {
        // 1. Create an instance of AdyenCheckout
        const checkout = new AdyenCheckout({
            environment: 'test',
            paymentMethodsResponse,
            originKey: originKey // Mandatory. originKey from Costumer Area
        });

        function handleOnChange(state, component) {
            console.log("change")
            state.isValid // True or false. Specifies if all the information that the shopper provided is valid.
            state.data // Provides the data that you need to pass in the `/payments` call.
            component
            makePayment(state.data)
        }

        function handleOnSubmit(state, component) {
            console.log("submit")
            state.isValid // True or false. Specifies if all the information that the shopper provided is valid.
            state.data // Provides the data that you need to pass in the `/payments` call.
            component // Provides the active component instance that called this event.
        }

        const configuration = {
            locale: "en_US",
            environment: "test",
            paymentMethodsResponse,
            originKey: originKey,
            onChange: handleOnChange,
            showPayButton: true,
            onSubmit: handleOnSubmit,
            amount: {
                value: 1000,
                currency: 'BRL'
            }
        };

        const checkoutCustom = new AdyenCheckout(configuration);

        const customCard = checkoutCustom.create('securedfields', {
            // Optional configuration
            type: 'card',
            brands: ['mc', 'visa', 'amex', 'bcmc', 'maestro'],
            styles: {
                error: {
                    color: 'red'
                },
                validated: {
                    color: 'green'
                },
                placeholder: {
                    color: '#d8d8d8'
                }
            },
            ariaLabels: {
                lang: 'en-GB',
                encryptedCardNumber: {
                    label: 'Credit or debit card number field'
                }
            },
            // Events
            onChange: function (state) {
                console.log("change")
                if(state.isValid){
                    console.log("Make payment")
                    makePayment(state.data)
                }
            },
            onValid: function () {
            },
            onLoad: function () {
            },
            onConfigSuccess: function () {
            },
            onFieldValid: function () {
            },
            onBrand: function () {
            },
            onError: function () {
            },
            onFocus: function () {
            },
            onBinValue: function (bin) {
            },
            onSubmit: function() {
                console.log("submit")
            },
        }).mount('#customCard-container');

        // 2. Create and mount the Component
        const card = checkout
            .create('card', {
                // Optional Configuration
                // hasHolderName: true,

                paymentMethodsConfiguration: {
                    card: { // Example optional configuration for Cards
                        hasHolderName: true,
                        holderNameRequired: true,
                        enableStoreDetails: true,
                        hideCVC: false, // Change this to true to hide the CVC field for stored cards
                        name: 'Credit or debit card'
                    }
                },

                // Optional. Customize the look and feel of the payment form
                // https://docs.adyen.com/developers/checkout/api-integration/configure-secured-fields/styling-secured-fields
                styles: {},

                // Optional. Define custom placeholders for the Card fields
                // https://docs.adyen.com/developers/checkout/api-integration/configure-secured-fields/styling-secured-fields
                placeholders: {
                    // encryptedCardNumber: '9999 9999 9999 9999',
                    // encryptedExpiryDate: '01/22',
                    // encryptedSecurityCode : '123'
                },

                // Optionally show a Pay Button
                showPayButton: true,

                // Events
                onSubmit: (state, component) => {
                    if (state.isValid) {
                        makePayment(card.data);
                    }
                },

                onChange: (state, component) => {
                    // state.data;
                    // state.isValid;

                    updateStateContainer(state); // Demo purposes only
                }
            })
            .mount('#card-container');
    });
});
