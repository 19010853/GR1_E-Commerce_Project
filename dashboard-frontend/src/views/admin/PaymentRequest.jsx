import React, { forwardRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FixedSizeList as List } from "react-window";
import {
  confirm_payment_request,
  get_payment_request,
  messageClear,
} from "../../store/Reducers/paymentReducer";
import moment from "moment";
import toast from "react-hot-toast";

function handleOnWheel({ deltaY }) {
  console.log("handleOnWheel", deltaY);
}

const outerElementType = forwardRef((props, ref) => (
  <div ref={ref} onWheel={handleOnWheel} {...props} />
));

const PaymentRequest = () => {
  const dispatch = useDispatch();
  const { successMessage, errorMessage, pendingWithdraws, loader } =
    useSelector((state) => state.payment);
  const [paymentId, setPaymentId] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorDetails, setErrorDetails] = useState(null);

  useEffect(() => {
    dispatch(get_payment_request());
  }, []);

  const confirm_request = (id) => {
    setPaymentId(id);
    dispatch(confirm_payment_request(id));
  };

  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (errorMessage) {
      if (typeof errorMessage === 'string') {
        toast.error(errorMessage);
      } else if (errorMessage.message) {
        toast.error(errorMessage.message);
        if (errorMessage.accountStatus || errorMessage.requirements) {
          setErrorDetails(errorMessage);
          setShowErrorModal(true);
        }
      }
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage]);

  const Row = ({ index, style }) => {
    return (
      <div style={style} className="flex text-sm text-white font-medium">
        <div className="w-[25%] p-2 whitespace-nowrap">{index + 1}</div>
        <div className="w-[25%] p-2 whitespace-nowrap">
          ${pendingWithdraws[index]?.amount}
        </div>
        <div className="w-[25%] p-2 whitespace-nowrap">
          <span className="py-[1px] px-[5px] bg-slate-300 text-blue-500 rounded-md text-sm">
            {pendingWithdraws[index]?.status}
          </span>
        </div>
        <div className="w-[25%] p-2 whitespace-nowrap">
          {" "}
          {moment(pendingWithdraws[index]?.createdAt).format("LL")}{" "}
        </div>
        <div className="w-[25%] p-2 whitespace-nowrap">
          <button
            disabled={loader}
            onClick={() => confirm_request(pendingWithdraws[index]?._id)}
            className="bg-indigo-500 shadow-lg hover:shadow-indigo-500/50 px-3 py-[2px cursor-pointer text-white rounded-sm text-sm]"
          >
            {loader && paymentId === pendingWithdraws[index]?._id
              ? "Đang tải..."
              : "Xác nhận"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="px-2 lg:px-7 pt-5">
      <div className="w-full p-4 bg-[#6a5fdf] rounded-md">
        <h2 className="text-xl font-medium pb-5 text-[#d0d2d6]">
          Yêu cầu rút tiền
        </h2>
        <div className="w-full">
          <div className="w-full overflow-x-auto">
            <div className="flex bg-[#a7a3de] uppercase text-xs font-bold min-w-[340px] rounded-md">
              <div className="w-[25%] p-2">STT</div>
              <div className="w-[25%] p-2">Số tiền</div>
              <div className="w-[25%] p-2">Trạng thái</div>
              <div className="w-[25%] p-2">Ngày</div>
              <div className="w-[25%] p-2">Thao tác</div>
            </div>
            {
              <List
                style={{ minWidth: "340px" }}
                className="List"
                height={350}
                itemCount={pendingWithdraws.length}
                itemSize={35}
                outerElementType={outerElementType}
              >
                {Row}
              </List>
            }
          </div>
        </div>
      </div>

      {/* Modal hiển thị chi tiết lỗi Stripe */}
      {showErrorModal && errorDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-red-600">
                Chi tiết lỗi Stripe
              </h3>
              <button
                onClick={() => setShowErrorModal(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-800 mb-2">Thông báo lỗi:</h4>
                <p className="text-red-600">{errorDetails.message}</p>
              </div>

              {errorDetails.accountStatus && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Trạng thái tài khoản Stripe:</h4>
                  <div className="bg-gray-100 p-3 rounded">
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span>Thanh toán được kích hoạt:</span>
                        <span className={errorDetails.accountStatus.charges_enabled ? 'text-green-600' : 'text-red-600'}>
                          {errorDetails.accountStatus.charges_enabled ? '✓' : '✗'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Chuyển khoản được kích hoạt:</span>
                        <span className={errorDetails.accountStatus.payouts_enabled ? 'text-green-600' : 'text-red-600'}>
                          {errorDetails.accountStatus.payouts_enabled ? '✓' : '✗'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Thông tin đã được gửi:</span>
                        <span className={errorDetails.accountStatus.details_submitted ? 'text-green-600' : 'text-red-600'}>
                          {errorDetails.accountStatus.details_submitted ? '✓' : '✗'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {errorDetails.requirements && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Yêu cầu cần hoàn thành:</h4>
                  <div className="bg-gray-100 p-3 rounded">
                    <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                      {JSON.stringify(errorDetails.requirements, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {errorDetails.accountLink && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Liên kết hoàn thành thiết lập:</h4>
                  <a
                    href={errorDetails.accountLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline break-all"
                  >
                    {errorDetails.accountLink}
                  </a>
                </div>
              )}

              {/* Hiển thị hướng dẫn test mode */}
              {errorDetails.isTestMode && errorDetails.testModeInstructions && (
                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <h4 className="font-medium text-blue-800 mb-2">{errorDetails.testModeInstructions.title}:</h4>
                  <div className="space-y-2">
                    {errorDetails.testModeInstructions.steps.map((step, index) => (
                      <p key={index} className="text-sm text-blue-700">{step}</p>
                    ))}
                  </div>
                  <div className="mt-3 p-2 bg-blue-100 rounded">
                    <p className="text-sm font-medium text-blue-800">Test Card: {errorDetails.testModeInstructions.testCard}</p>
                    <p className="text-sm text-blue-700">Số tiền cần: ${errorDetails.testModeInstructions.testAmount}</p>
                  </div>
                </div>
              )}

              <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                <h4 className="font-medium text-yellow-800 mb-2">Hướng dẫn khắc phục:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Đảm bảo người bán đã hoàn thành tất cả thông tin cá nhân</li>
                  <li>• Kiểm tra thông tin ngân hàng và tài khoản</li>
                  <li>• Xác minh danh tính nếu được yêu cầu</li>
                  <li>• Hoàn thành tất cả các bước trong quy trình onboarding của Stripe</li>
                  {errorDetails.isTestMode && (
                    <>
                      <li>• <strong>Test Mode:</strong> Cần thêm tiền vào Stripe balance để test</li>
                      <li>• Sử dụng test card để tạo charge và có tiền trong balance</li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowErrorModal(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentRequest;
