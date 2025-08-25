import React, { useEffect, useState } from "react";
import { FaImages } from "react-icons/fa6";
import { FadeLoader } from "react-spinners";
import { FaRegEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  profile_image_upload,
  messageClear,
  profile_info_add,
  change_password,
} from "../../store/Reducers/authReducer";
import toast from "react-hot-toast";
import { PropagateLoader } from "react-spinners";
import { overrideStyle } from "../../utils/utils";
import {
  get_seller_info,
  update_seller_image,
  update_seller_info,
  update_seller_password,
  create_stripe_connect_account,
  check_stripe_account_status,
  active_stripe_connect_account,
} from "../../store/Reducers/sellerReducer";

const Profile = () => {
  const [state, setState] = useState({
    division: "",
    district: "",
    shopName: "",
    sub_district: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isEditingShop, setIsEditingShop] = useState(false);
  const [showStripeStatus, setShowStripeStatus] = useState(false);

  const dispatch = useDispatch();
  const location = useLocation();
  const { userInfo, loader, successMessage, errorMessage } = useSelector(
    (state) => state.auth
  );
  const { stripeStatus } = useSelector((state) => state.seller);

  const status = "active";

  // Xử lý URL parameters khi quay lại từ Stripe
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const activeCode = urlParams.get('activeCode');
    
    if (activeCode) {
      console.log('Found activeCode in URL:', activeCode);
      dispatch(active_stripe_connect_account(activeCode));
      
      // Clean up URL
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location.search, dispatch]);

  useEffect(() => {
    if (successMessage && successMessage !== "Login successful") {
      toast.success(successMessage);
      dispatch(messageClear());
    }
    if (errorMessage) {
      toast.error(errorMessage);
      dispatch(messageClear());
    }
  }, [successMessage, errorMessage, dispatch]);

  const add_image = (e) => {
    if (e.target.files.length > 0) {
      const formData = new FormData();
      formData.append("image", e.target.files[0]);
      dispatch(profile_image_upload(formData));
    }
  };

  const inputHandle = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const add = (e) => {
    e.preventDefault();
    dispatch(profile_info_add(state));
    setIsEditingShop(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setState({
      division: userInfo?.shopInfo?.division || "",
      district: userInfo?.shopInfo?.district || "",
      shopName: userInfo?.shopInfo?.shopName || "",
      sub_district: userInfo?.shopInfo?.sub_district || "",
    });
  };

  // Change Password
  const [passwordData, setPasswordData] = useState({
    email: "",
    old_password: "",
    new_password: "",
  });

  const passwordInputHandle = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    })
  }
  
  const handlePasswordChange = (e) => {
    e.preventDefault();
    dispatch(change_password(passwordData))
  }

  return (
    <div className="px-2 lg:px-7 py-5">
      <div className="w-full flex flex-wrap">
        <div className="w-full md:w-6/12">
          <div className="w-full p-4 bg-[#6a5fdf] rounded-md text-[#d0d2d6]">
            <div className="flex justify-center items-center py-3">
              {userInfo?.image ? (
                <label
                  htmlFor="img"
                  className="h-[150px] w-[200px] relative p-3 cursor-pointer overflow-hidden"
                >
                  <img src={userInfo.image} alt="" />
                  {loader && (
                    <div className="bg-slate-600 absolute left-0 top-0 w-full h-full opacity-70 flex justify-center items-center z-20">
                      <span>
                        <FadeLoader />
                      </span>
                    </div>
                  )}
                </label>
              ) : (
                <label
                  className="flex justify-center items-center flex-col h-[150px] w-[200px] cursor-pointer border border-dashed hover:border-red-500 border-[#d0d2d6] relative"
                  htmlFor="img"
                >
                  <span>
                    <FaImages />{" "}
                  </span>
                  <span>Chọn hình ảnh</span>
                  {loader && (
                    <div className="bg-slate-600 absolute left-0 top-0 w-full h-full opacity-70 flex justify-center items-center z-20">
                      <span>
                        <FadeLoader />
                      </span>
                    </div>
                  )}
                </label>
              )}
              <input
                onChange={add_image}
                type="file"
                className="hidden"
                id="img"
              />
            </div>

            <div className="px-0 md:px-5 py-2">
              <div className="flex justify-between text-sm flex-col gap-2 p-4 bg-slate-800 rounded-md relative">
                <span 
                  onClick={handleEditClick}
                  className="p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50 absolute right-2 top-2 cursor-pointer"
                >
                  <FaRegEdit />{" "}
                </span>
                <div className="flex gap-2">
                  <span>Tên : </span>
                  <span>{userInfo?.name}</span>
                </div>
                <div className="flex gap-2">
                  <span>Email : </span>
                  <span>{userInfo?.email}</span>
                </div>
                <div className="flex gap-2">
                  <span>Vai trò : </span>
                  <span>{userInfo?.role}</span>
                </div>
                <div className="flex gap-2">
                  <span>Trạng thái : </span>
                  <span>{userInfo?.status}</span>
                </div>
                <div className="flex gap-2">
                  <span>Tài khoản thanh toán : </span>
                  <p>
                    {userInfo?.payment === "active" ? (
                      <span className="bg-red-500 text-white text-xs cursor-pointer font-normal ml-2 px-2 py-0.5 rounded">
                        {userInfo?.payment}
                      </span>
                    ) : (
                      <span 
                        onClick={() => {
                          if (!loader) {
                            dispatch(create_stripe_connect_account());
                          }
                        }} 
                        className={`${loader ? 'bg-gray-500' : 'bg-blue-500'} text-white text-xs cursor-pointer font-normal ml-2 px-2 py-0.5 rounded flex items-center gap-2`}
                      >
                        {loader ? (
                          <>
                            <PropagateLoader color="#fff" cssOverride={overrideStyle} />
                            Đang xử lý...
                          </>
                        ) : (
                          'Nhấp để kích hoạt'
                        )}
                      </span>
                    )}
                  </p>
                </div>
                
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => {
                      if (showStripeStatus) {
                        // Nếu đang hiển thị thì ẩn đi
                        setShowStripeStatus(false);
                      } else {
                        // Nếu đang ẩn thì kiểm tra và hiển thị
                        dispatch(check_stripe_account_status());
                        setShowStripeStatus(true);
                      }
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1 rounded"
                  >
                    {showStripeStatus ? 'Ẩn trạng thái Stripe' : 'Kiểm tra trạng thái Stripe'}
                  </button>
                  
                  {/* Nút tiếp tục hoàn thành thiết lập nếu tài khoản chưa hoàn chỉnh */}
                  {stripeStatus && !stripeStatus.isFullyActivated && (
                    <button
                      onClick={() => {
                        dispatch(create_stripe_connect_account());
                      }}
                      className="bg-orange-500 hover:bg-orange-600 text-white text-xs px-3 py-1 rounded"
                    >
                      Tiếp tục thiết lập
                    </button>
                  )}
                </div>
                
                {/* Hiển thị thông tin trạng thái Stripe chỉ khi showStripeStatus = true */}
                {showStripeStatus && stripeStatus && (
                  <div className="mt-3 p-3 bg-slate-700 rounded-md">
                    <h4 className="text-sm font-medium mb-2">Trạng thái tài khoản Stripe:</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span>Thanh toán được kích hoạt:</span>
                        <span className={stripeStatus.charges_enabled ? 'text-green-400' : 'text-red-400'}>
                          {stripeStatus.charges_enabled ? '✓' : '✗'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Chuyển khoản được kích hoạt:</span>
                        <span className={stripeStatus.payouts_enabled ? 'text-green-400' : 'text-red-400'}>
                          {stripeStatus.payouts_enabled ? '✓' : '✗'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Thông tin đã được gửi:</span>
                        <span className={stripeStatus.details_submitted ? 'text-green-400' : 'text-red-400'}>
                          {stripeStatus.details_submitted ? '✓' : '✗'}
                        </span>
                      </div>
                      {stripeStatus.pendingRequirements && stripeStatus.pendingRequirements.length > 0 && (
                        <div className="mt-2">
                          <span className="text-yellow-400">Yêu cầu chưa hoàn thành:</span>
                          <ul className="mt-1 text-yellow-300">
                            {stripeStatus.pendingRequirements.map((req, index) => (
                              <li key={index}>• {req}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="px-0 md:px-5 py-2">
              {!userInfo?.shopInfo || isEditingShop ? (
                <form onSubmit={add}>
                  <div className="flex flex-col w-full gap-1 mb-2">
                    <label htmlFor="Shop">Tên cửa hàng</label>
                    <input
                      value={state.shopName}
                      onChange={inputHandle}
                      className="px-4 py-2 focus:border-indigo-200 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]"
                      type="text"
                      name="shopName"
                      id="Shop"
                      placeholder="Tên cửa hàng"
                    />
                  </div>

                  <div className="flex flex-col w-full gap-1 mb-2">
                    <label htmlFor="division">Tên tỉnh/thành phố</label>
                    <input
                      value={state.division}
                      onChange={inputHandle}
                      className="px-4 py-2 focus:border-indigo-200 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]"
                      type="text"
                      name="division"
                      id="division"
                      placeholder="Tên tỉnh/thành phố"
                    />
                  </div>

                  <div className="flex flex-col w-full gap-1 mb-2">
                    <label htmlFor="district">Tên quận/huyện</label>
                    <input
                      value={state.district}
                      onChange={inputHandle}
                      className="px-4 py-2 focus:border-indigo-200 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]"
                      type="text"
                      name="district"
                      id="district"
                      placeholder="Tên quận/huyện"
                    />
                  </div>

                  <div className="flex flex-col w-full gap-1 mb-2">
                    <label htmlFor="sub">Tên phường/xã</label>
                    <input
                      value={state.sub_district}
                      onChange={inputHandle}
                      className="px-4 py-2 focus:border-indigo-200 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]"
                      type="text"
                      name="sub_district"
                      id="sub"
                      placeholder="Tên phường/xã"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      disabled={loader}
                      className="bg-red-500 w-[200px] hover:shadow-red-300/50 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3"
                    >
                      {loader ? (
                        <PropagateLoader
                          color="#fff"
                          cssOverride={overrideStyle}
                        />
                      ) : (
                        "Lưu thay đổi"
                      )}
                    </button>
                    {isEditingShop && (
                      <button
                        type="button"
                        onClick={() => setIsEditingShop(false)}
                        className="bg-gray-500 w-[200px] hover:shadow-gray-300/50 hover:shadow-lg text-white rounded-md px-7 py-2 mb-3"
                      >
                        Hủy
                      </button>
                    )}
                  </div>
                </form>
              ) : (
                <div className="flex justify-between text-sm flex-col gap-2 p-4 bg-slate-800 rounded-md relative">
                  <span 
                    onClick={() => setIsEditingShop(true)}
                    className="p-[6px] bg-yellow-500 rounded hover:shadow-lg hover:shadow-yellow-500/50 absolute right-2 top-2 cursor-pointer"
                  >
                    <FaRegEdit />{" "}
                  </span>
                  <div className="flex gap-2">
                    <span>Tên cửa hàng : </span>
                    <span>{userInfo.shopInfo?.shopName}</span>
                  </div>
                  <div className="flex gap-2">
                    <span>Tỉnh/Thành phố : </span>
                    <span>{userInfo.shopInfo?.division}</span>
                  </div>
                  <div className="flex gap-2">
                    <span>Quận/Huyện : </span>
                    <span>{userInfo.shopInfo?.district}</span>
                  </div>
                  <div className="flex gap-2">
                    <span>Phường/Xã : </span>
                    <span>{userInfo.shopInfo?.sub_district}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full md:w-6/12">
          <div className="w-full pl-0 md:pl-7 mt-6 md:mt-0">
            <div className="bg-[#6a5fdf] rounded-md text-[#d0d2d6] p-4">
              <h1 className="text-[#d0d2d6] text-lg mb-3 font-semibold">
                Đổi mật khẩu
              </h1>
              <form onSubmit={handlePasswordChange}>
                <div className="flex flex-col w-full gap-1 mb-2">
                  <label htmlFor="email">Email</label>
                  <input
                    className="px-4 py-2 focus:border-indigo-200 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]"
                    type="email"
                    name="email"
                    id="email"
                    placeholder="email"
                    value={passwordData.email}
                    onChange={passwordInputHandle}
                  />
                </div>

                <div className="flex flex-col w-full gap-1 mb-2">
                  <label htmlFor="o_password">Mật khẩu cũ</label>
                  <input
                    className="px-4 py-2 focus:border-indigo-200 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]"
                    type="password"
                    name="old_password"
                    id="o_password"
                    placeholder="Mật khẩu cũ"
                    value={passwordData.old_password}
                    onChange={passwordInputHandle}
                  />
                </div>

                <div className="flex flex-col w-full gap-1 mb-2">
                  <label htmlFor="n_password">Mật khẩu mới</label>
                  <input
                    className="px-4 py-2 focus:border-indigo-200 outline-none bg-[#6a5fdf] border border-slate-700 rounded-md text-[#d0d2d6]"
                    type="password"
                    name="new_password"
                    id="n_password"
                    placeholder="Mật khẩu mới"
                    value={passwordData.new_password}
                    onChange={passwordInputHandle}
                  />
                </div>

                <button disabled={loader} className="bg-red-500  hover:shadow-red-500/40 hover:shadow-md text-white rounded-md px-7 py-2 my-2">
                  {loader ? "Đang tải ..." : "Lưu thay đổi"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
