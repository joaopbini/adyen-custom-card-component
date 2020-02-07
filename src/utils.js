const paymentMethodsConfig = {
    shopperReference: 'Checkout Components sample code test',
    reference: 'Checkout Components sample code test',
    countryCode: 'BR',
    amount: {
        value: 100000,
        currency: 'BRL'
    }
};

const paymentsDefaultConfig = {
    shopperReference: 'Checkout Components sample code test',
    reference: 'Checkout Components sample code test',
    countryCode: 'BR',
    channel: 'Web',
    returnUrl: 'https://your-company.com/',
    installments: {
        value: 6
    },
    amount: {
        value: 115607,
        currency: 'BRL'
    }
    // lineItems: [
    //     {
    //         id: '1',
    //         description: 'Test Item 1',
    //         amountExcludingTax: 10000,
    //         amountIncludingTax: 11800,
    //         taxAmount: 1800,
    //         taxPercentage: 1800,
    //         quantity: 1,
    //         taxCategory: 'High'
    //     }
    // ]
};

// Generic POST Helper
const httpPost = (endpoint, data) =>
    fetch(`/${endpoint}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => response.json());

// Get all available payment methods from the local server
const getPaymentMethods = () =>
    httpPost('paymentMethods', paymentMethodsConfig)
        .then(response => {
            if (response.error) throw 'No paymentMethods available';

            return response;
        })
        .catch(console.error);

// Posts a new payment into the local server
const makePayment = (paymentMethod, config = {}) => {
    console.log("Make payment");
    const paymentsConfig = {...paymentsDefaultConfig, ...config};
    const paymentRequest = {...paymentsConfig, ...paymentMethod};

    // updateRequestContainer(paymentRequest);

    return httpPost('payments', paymentRequest)
        .then(response => {
            if (response.error) throw 'Payment initiation failed';

            // updateResponseContainer(response);

            return response;
        })
        .catch(console.error);
};

// Fetches an originKey from the local server
const getOriginKey = () =>
    httpPost('originKeys')
        .then(response => {
            if (response.error || !response.originKeys) throw 'No originKey available';
            console.log(response.originKeys[Object.keys(response.originKeys)[0]]);

            return response.originKeys[Object.keys(response.originKeys)[0]];
        })
        .catch(console.error);
