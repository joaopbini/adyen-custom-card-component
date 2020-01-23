// 0. Get originKey
getOriginKey().then(originKey => {
    getPaymentMethods().then(paymentMethodsResponse => {

        const sfText = document.querySelector('.sf-text');

        const onConfigSuccess = (cbObj) => {
            document.querySelector('.secured-fields').style.display = 'block';
            document.querySelector('.card-input__spinner__holder').style.display = 'none';
        };

        const onBrand = (cbObj) => {
            const holderDiv = document.querySelector('.secured-fields');
            holderDiv.querySelector('#pmImage').setAttribute('src', cbObj.brandImageUrl);
        };

        const onFocus = (cbObj) => {
            const sfNode = cbObj.rootNode.querySelector(`[data-cse="${cbObj.fieldType}"]`);
            // Add focus
            if (cbObj.focus) {
                if (sfNode.className.indexOf('pm-input-field--focus') === -1) {
                    sfNode.className += ' pm-input-field--focus';
                }
                return;
            }
            // Remove focus
            if (sfNode.className.indexOf('pm-input-field--focus') > -1) {
                const newClassName = sfNode.className.replace('pm-input-field--focus', '');
                sfNode.className = newClassName.trim();
            }
        };

        const onError = (cbObj) => {
            const sfNode = cbObj.rootNode.querySelector(`[data-cse="${cbObj.fieldType}"]`);
            const errorNode = sfNode.parentNode.querySelector('.pm-form-label__error-text');
            if (cbObj.error !== '') {
                errorNode.style.display = 'block';
                errorNode.innerText = cbObj.i18n;
                // Add error classes
                if (sfNode.className.indexOf('pm-input-field--error') === -1) {
                    sfNode.className += ' pm-input-field--error';
                }
            } else if (cbObj.error === '') {
                errorNode.style.display = 'none';
                errorNode.innerText = '';
                // Remove error classes
                if (sfNode.className.indexOf('pm-input-field--error') > -1) {
                    const newClassName = sfNode.className.replace('pm-input-field--error', '');
                    sfNode.className = newClassName.trim();
                }
            }
        };

        const onFieldValid = (cbObj) => {
//            console.log('onFieldValid:: end digits =',cbObj.endDigits);
        };

        const onBinValue = (cbObj) => {
//            console.log('onBinValue:: bin =',cbObj.binValue);
        };

        // 1. Create an instance of AdyenCheckout
        const checkout = new AdyenCheckout({
            environment: 'test',
            loadingContext: 'https://checkoutshopper-test.adyen.com/checkoutshopper/',
            paymentMethodsResponse,
            originKey: originKey, // Mandatory. originKey from Costumer Area
            onChange: handleOnChange,
            onError: console.error
        });

        function handleOnChange(state) {

            if (!state.data || !state.data.paymentMethod) return;

            if (state.isValid) {
                payButton.removeAttribute('disabled');
            } else {
                payButton.setAttribute('disabled', 'true');
            }

        }

        const customCard = checkout.create('securedfields', {

            // Optional configuration
            type: 'card',
            brands: ['mc', 'visa', 'amex', 'bcmc', 'maestro'],

            paymentMethodsConfiguration: {
                card: { // Example optional configuration for Cards
                    hasHolderName: true,
                    holderNameRequired: true,
                    enableStoreDetails: true,
                    hideCVC: false, // Change this to true to hide the CVC field for stored cards
                    name: 'Credit or debit card'
                }
            },

            // hasHolderName: true,
            // holderNameRequired: true,
            // enableStoreDetails: true,
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
            onConfigSuccess,
            onBrand,
            onFocus,
            onError,
            onFieldValid,
            onBinValue
        }).mount('.secured-fields');

        let payButton = createPayButton('.secured-fields', window.securedFields, 'securedfields');
        payButton.setAttribute('disabled', 'true');

        function createPayButton(parent, component, attribute) {

            const payBtn = document.createElement('button');

            payBtn.textContent = 'Pagar';
            payBtn.name = 'pay';
            payBtn.classList.add('adyen-checkout__button', `js-${attribute}`);

            payBtn.addEventListener('click', e => {
                e.preventDefault();
                startPayment(component);
            });

            document.querySelector(parent).appendChild(payBtn);

            return payBtn;
        }

        function startPayment(component) {

            payButton.setAttribute('disabled', 'true');

            console.log("Make payment");
            console.log("CustomCard: \n");
            console.log(customCard);
            console.log("Data: \n");
            console.log(customCard.data);
            makePayment(customCard.data).then(r => handlePaymentResult(r))

        }

        function handlePaymentResult(result) {
            console.log('Result: ', result);

            switch (result.resultCode) {
                case 'RedirectShopper':
                    window.location = result.redirect.url;
                    break;
                case 'Authorised':
                    sfText.innerText = result.resultCode;
                    document.querySelector('.secured-fields').style.display = 'none';
                    break;
                case 'Refused':
                    sfText.innerText = result.resultCode;
                    break;
            }
        }


    });
});
