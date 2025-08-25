import React from "react";

const StripeFallback = ({ price, orderId }) => {
  return (
    <div className="mt-4 p-6 bg-yellow-50 border border-yellow-200 rounded-md">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            Thanh toán tạm thời không khả dụng
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>
              Chúng tôi đang gặp vấn đề với hệ thống thanh toán. Vui lòng thử lại sau hoặc liên hệ hỗ trợ.
            </p>
            <div className="mt-3">
              <p><strong>Thông tin đơn hàng:</strong></p>
              <p>Tổng tiền: ${price}</p>
              <p>Mã đơn hàng: {orderId}</p>
            </div>
          </div>
          <div className="mt-4 space-x-3">
            <button
              onClick={() => window.location.reload()}
              className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded text-sm hover:bg-yellow-200"
            >
              Thử lại
            </button>
            <button
              onClick={() => window.history.back()}
              className="bg-gray-100 text-gray-800 px-3 py-1 rounded text-sm hover:bg-gray-200"
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StripeFallback; 