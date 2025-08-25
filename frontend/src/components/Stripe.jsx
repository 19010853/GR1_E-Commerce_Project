import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import axios from "axios";
import CheckoutForm from "./CheckoutForm";
import StripeFallback from "./StripeFallback";

// Cải thiện việc load Stripe với error handling
const stripePromise = loadStripe(
  "pk_test_51RP0SYR4aa1jsPsoteqaWwf3ZCsuiXjm61w8E36xlWgxqheD2pwoucpC7uKSJGExRPqZ9p10TuBTQ7p4NJIj0ucg00YxYxhrt3"
).catch((error) => {
  console.error('Failed to load Stripe:', error);
  return null;
});

const Stripe = ({ price, orderId }) => {
  const [clientSecret, setClientSecret] = useState("");
  const [stripeLoaded, setStripeLoaded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stripeFailed, setStripeFailed] = useState(false);

  // Kiểm tra xem Stripe đã load thành công chưa
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Nếu sau 10 giây vẫn chưa load được, coi như failed
      if (!stripeLoaded) {
        setStripeFailed(true);
      }
    }, 10000);

    stripePromise.then((stripe) => {
      clearTimeout(timeoutId);
      if (stripe) {
        setStripeLoaded(true);
      } else {
        setStripeFailed(true);
        setError('Không thể tải thư viện Stripe. Vui lòng kiểm tra kết nối mạng.');
      }
    });

    return () => clearTimeout(timeoutId);
  }, [stripeLoaded]);

  const apperance = {
    theme: "stripe",
  };
  
  const options = {
    apperance,
    clientSecret,
  };

  const create_payment = async () => {
    if (!stripeLoaded) {
      setError('Stripe chưa sẵn sàng. Vui lòng thử lại.');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/order/create-payment",
        { price },
        { withCredentials: true }
      );
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error('Payment creation error:', error);
      setError(error.response?.data?.message || 'Không thể tạo thanh toán. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // Hiển thị fallback nếu Stripe không thể load
  if (stripeFailed) {
    return <StripeFallback price={price} orderId={orderId} />;
  }

  // Hiển thị lỗi nếu có
  if (error) {
    return (
      <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Lỗi thanh toán
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-4">
              <button
                onClick={() => {
                  setError(null);
                  window.location.reload();
                }}
                className="bg-red-100 text-red-800 px-3 py-1 rounded text-sm hover:bg-red-200"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Hiển thị loading nếu Stripe chưa load
  if (!stripeLoaded) {
    return (
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-blue-700">Đang tải Stripe...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4">
      {clientSecret ? (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm orderId={orderId} />
        </Elements>
      ) : (
        <button
          onClick={create_payment}
          disabled={loading}
          className={`px-10 py-[6px] rounded-sm hover:shadow-green-700/30 hover:shadow-lg bg-green-700 text-white ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Đang xử lý...' : 'Bắt đầu thanh toán'}
        </button>
      )}
    </div>
  );
};

export default Stripe;
