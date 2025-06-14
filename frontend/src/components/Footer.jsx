import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaYoutube, FaInstagram } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { useSelector } from "react-redux";
import { FaHeart } from "react-icons/fa6";
import { FaCartShopping } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const { card_product_count, wishlist_count } = useSelector(
    (state) => state.card
  );

  return (
    <footer className="bg-[#f3f6fa]">
      <div className="w-[85%] flex flex-wrap mx-auto border-b py-16 md-lg:pb-10 sm:pb-6">
        <div className="w-3/12 lg:w-4/12 sm:w-full">
          <div className="flex flex-col gap-3">
            <img
              className="w-[190px] h-[70px]"
              src="http://localhost:3000/images/logo.png"
              alt="logo"
            />
            <ul className="flex flex-col gap-2 text-slate-600">
              <li>
                Địa chỉ: Nông Trang, Việt Trì, Phú Thọ, Việt Nam
              </li>
              <li>Điện thoại: 0868951933</li>
              <li>Email: khoinguyenminhk37@gmail.com</li>
            </ul>
          </div>
        </div>

        <div className="w-5/12 lg:w-8/12 sm:w-full">
          <div className="flex justify-center sm:justify-start sm:mt-6 w-full">
            <div>
              <h2 className="font-bold text-lg mb-2">Liên kết hữu ích</h2>
              <div className="flex justify-between gap-[80px] lg:gap-[40px]">
                <ul className="flex flex-col gap-2 text-slate-600 text-sm font-semibold">
                  <li>
                    <Link>Về chúng tôi</Link>
                  </li>
                  <li>
                    <Link>Về cửa hàng</Link>
                  </li>
                  <li>
                    <Link>Thông tin giao hàng</Link>
                  </li>
                  <li>
                    <Link>Chính sách bảo mật</Link>
                  </li>
                  <li>
                    <Link>Blog</Link>
                  </li>
                </ul>

                <ul className="flex flex-col gap-2 text-slate-600 text-sm font-semibold">
                  <li>
                    <Link>Dịch vụ của chúng tôi</Link>
                  </li>
                  <li>
                    <Link>Hồ sơ công ty</Link>
                  </li>
                  <li>
                    <Link>Thông tin giao hàng</Link>
                  </li>
                  <li>
                    <Link>Chính sách bảo mật</Link>
                  </li>
                  <li>
                    <Link>Blog</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="w-4/12 lg:w-full lg:mt-6">
          <div className="w-full flex flex-col justify-start gap-5">
            <h2 className="font-bold text-lg mb-2">Tham gia cùng chúng tôi</h2>
            <span>
              Nhận thông tin cập nhật qua email về các ưu đãi đặc biệt mới nhất
            </span>
            <div className="h-[50px] w-full bg-white border relative">
              <input
                className="h-full bg-transparent w-full px-3 outline-0"
                type="text"
                placeholder="Nhập email của bạn"
              />
              <button className="h-full absolute right-0 bg-[#890528] text-white uppercase px-4 font-bold text-sm">
                Đăng ký
              </button>
            </div>
            <ul className="flex justify-start items-center gap-3">
              <li>
                <a
                  className="w-[38px] h-[38px] hover:bg-[#890528] hover:text-white flex justify-center items-center bg-white rounded-full"
                  href="#"
                >
                  <FaFacebookF />{" "}
                </a>
              </li>
              <li>
                <a
                  className="w-[38px] h-[38px] hover:bg-[#890528] hover:text-white flex justify-center items-center bg-white rounded-full"
                  href="#"
                >
                  <FaLinkedin />{" "}
                </a>
              </li>
              <li>
                <a
                  className="w-[38px] h-[38px] hover:bg-[#890528] hover:text-white flex justify-center items-center bg-white rounded-full"
                  href="#"
                >
                  <FaGithub />{" "}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="w-[90%] flex flex-wrap justify-center items-center text-slate-600 mx-auto py-5 text-center">
        <span>Bản quyền © 2025 Đã đăng ký</span>
      </div>

      <div className="hidden fixed md-lg:block w-[50px] h-[110px] bottom-3 right-2 bg-white rounded-full p-2">
        <div className="w-full h-full flex gap-3 flex-col justify-center items-center">
          <div
            onClick={() => navigate(userInfo ? "/card" : "/login")}
            className="relative flex justify-center items-center cursor-pointer w-[35px] h-[35px] rounded-full bg-[#e2e2e2]"
          >
            <span className="text-xl text-[#890528]">
              <FaCartShopping />
            </span>
            {card_product_count !== 0 && (
              <div className="w-[20px] h-[20px] absolute bg-red-500 rounded-full text-white flex justify-center items-center -top-[3px] -right-[5px]">
                {card_product_count}
              </div>
            )}
          </div>

          <div
            onClick={() =>
              navigate(userInfo ? "/dashboard/my-wishlist" : "/login")
            }
            className="relative flex justify-center items-center cursor-pointer w-[35px] h-[35px] rounded-full bg-[#e2e2e2]"
          >
            <span className="text-xl text-[#890528]">
              <FaHeart />
            </span>
            {wishlist_count !== 0 && (
              <div className="w-[20px] h-[20px] absolute bg-red-500 rounded-full text-white flex justify-center items-center -top-[3px] -right-[5px]">
                {wishlist_count}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
