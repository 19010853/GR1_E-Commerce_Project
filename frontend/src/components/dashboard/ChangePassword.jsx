import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";

const ChangePassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.new_password !== formData.confirm_password) {
      setError("Mật khẩu mới không khớp");
      return;
    }

    if (formData.new_password.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    try {
      const token = localStorage.getItem("customerToken");
      if (!token) {
        setError("Vui lòng đăng nhập");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
        return;
      }

      const response = await api.put(
        "/customer/change-password",
        {
          old_password: formData.old_password,
          new_password: formData.new_password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.message) {
        alert("Đổi mật khẩu thành công");
        setFormData({
          old_password: "",
          new_password: "",
          confirm_password: "",
        });
      }
    } catch (error) {
      if (error.response?.status === 409) {
        setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else if (error.response?.status === 400) {
        setError("Mật khẩu cũ không đúng");
      } else {
        setError(error.response?.data?.error || "Có lỗi xảy ra");
      }
    }
  };

  return (
    <div className="p-4 bg-white">
      <h2 className="text-xl text-slate-600 pb-5">Đổi mật khẩu</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-1 mb-2">
          <label htmlFor="old_password">Mật khẩu cũ</label>
          <input
            className="outline-none px-3 py-1 border rounded-md text-slate-600"
            type="password"
            name="old_password"
            id="old_password"
            placeholder="Mật khẩu cũ"
            value={formData.old_password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col gap-1 mb-2">
          <label htmlFor="new_password">Mật khẩu mới</label>
          <input
            className="outline-none px-3 py-1 border rounded-md text-slate-600"
            type="password"
            name="new_password"
            id="new_password"
            placeholder="Mật khẩu mới"
            value={formData.new_password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="flex flex-col gap-1 mb-2">
          <label htmlFor="confirm_password">Xác nhận mật khẩu mới</label>
          <input
            className="outline-none px-3 py-1 border rounded-md text-slate-600"
            type="password"
            name="confirm_password"
            id="confirm_password"
            placeholder="Xác nhận mật khẩu mới"
            value={formData.confirm_password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <button
            type="submit"
            className="px-8 py-2 bg-[#890528] shadow-lg hover:shadow-green-500/30 text-white rounded-md"
          >
            Cập nhật mật khẩu
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
