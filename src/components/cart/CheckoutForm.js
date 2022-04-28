import React, {useState, useEffect, Fragment} from 'react';
import Currency from 'react-currency-formatter';
import PropTypes from 'prop-types'
import {
    CardElement,
    useStripe,
    useElements
  } from "@stripe/react-stripe-js";

function CheckoutForm({totalPrice, checkoutSuccess, apiPath}) {
    const [succeeded, setSucceeded] = useState(false);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState('');
    const [disabled, setDisabled] = useState(true);
    const [clientSecret, setClientSecret] = useState('');
    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
      console.log(JSON.stringify({totalPrice}))
      console.log(typeof(totalPrice));
        window
            .fetch(`${apiPath}/petalosarte/charge`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({totalPrice})
            })
            .catch(err => {
              console.log(err);
            })
            .then(res => {
                return res.json();
            })
            .then(data => {
                setClientSecret(data.clientSecret)
            })
    }, []);
    
    const cardStyle = {
        style: {
          base: {
            color: "#32325d",
            fontFamily: 'Arial, sans-serif',
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": {
              color: "#32325d"
            }
          },
          invalid: {
            fontFamily: 'Arial, sans-serif',
            color: "#fa755a",
            iconColor: "#fa755a"
          }
        }
      };


      const handleChange = async (event) => {
        setDisabled(event.empty);
        setError(event.error ? event.error.message : "");
      };


      const handleSubmit = async ev => {
        ev.preventDefault();
        setProcessing(true);
    
        const payload = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement)
          }
        });
        console.log(payload);
    
        if (payload.error) {
            console.log('error');
            console.log(payload.error.message)
          setError(`Payment failed test`);
          setProcessing(false);
        } else {
          setError(null);
          setProcessing(false);
          setSucceeded(true);
          setTimeout(() => {checkoutSuccess(payload)}, 2000);
        }
      };


      


    return (
        <Fragment>

            <form id="my-payment-form" onSubmit={handleSubmit}>
                <CardElement id="card-element" options={cardStyle} onChange={handleChange} />
                <button
                    className='btn btn-primary w-100 mt-3'
                    disabled={processing || disabled || succeeded}
                    id="submit">
                    <span id="button-text">
                        {processing ? 
                            <div className="spinner" id="spinner"></div>
                            :
                            <Fragment>
                                Pay <Currency quantity={totalPrice} currency="USD"/>
                            </Fragment>
                        }
                    </span>
                </button>
                {/* Show any error that happens when processing the payment */}
                {error && <div className="card-error" role="alert">{error}</div> }
                {/* Show a success message upon completion */}
                <p className={succeeded ? "result-message" : "result-message hidden"}>
                    Payment succeeded, redirecting you to your receipt
                </p>
            </form>
        </Fragment>
    )
}

CheckoutForm.propTypes = {
    totalPrice: PropTypes.number,
    checkoutSuccess: PropTypes.func,
    apiPath: PropTypes.string
}

export default CheckoutForm