import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js' 
import { Elements } from '@stripe/react-stripe-js';
import axios from 'axios';
import CheckOutForm from './CheckOutForm';

const stripePromise = loadStripe('pk_test_51RP0SCJLGF10hz7iNHLr19JmyHFdLC77gX69znCCq22LGYxrPNmTyj3DxozKEHJxqXTW2O2ss6zPwJfYC8wnt9en00LNYvlePj');

const Stripe = ({ price, orderId }) => {
    const [clientSecret, setClientSecret] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const appearance = {
        theme: 'stripe',
        variables: {
            colorPrimary: '#0570de',
            colorBackground: '#ffffff',
            colorText: '#30313d',
            colorDanger: '#df1b41',
            fontFamily: 'Ideal Sans, system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '4px'
        }
    };

    const options = {
        appearance,
        clientSecret
    };

    const create_payment = async () => {
        try {
            setIsLoading(true);
            setError('');
            const { data } = await axios.post(
                'http://localhost:5000/api/order/create-payment',
                { price },
                { withCredentials: true }
            );
            setClientSecret(data.clientSecret);
        } catch (error) {
            console.log(error.response.data)
        }
    };

    return (
        <div className='mt-4'>
            {
                clientSecret ? (
                    <Elements options={options} stripe={stripePromise}>
                        <CheckOutForm orderId={orderId} />
                    </Elements>
                ) : <button onClick={create_payment} className='px-10 py-[6px] rounded-sm hover:shadow-green-700/30 hover:shadow-lg bg-green-700 text-white'>Start Payment</button>
            }
        </div>
    );
};

export default Stripe;