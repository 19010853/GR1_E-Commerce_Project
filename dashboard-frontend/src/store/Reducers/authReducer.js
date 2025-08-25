import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";
import { jwtDecode } from "jwt-decode";

export const admin_login = createAsyncThunk(
    'auth/admin_login',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        console.log(info)
        try {
            const { data } = await api.post('/admin-login', info, { withCredentials: true })
            localStorage.setItem('accessToken', data.token)
            // console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)


export const seller_login = createAsyncThunk(
    'auth/seller_login',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        console.log(info)
        try {
            const { data } = await api.post('/seller-login', info, { withCredentials: true })
            console.log(data)
            localStorage.setItem('accessToken', data.token)
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)

export const profile_image_upload = createAsyncThunk(
    'auth/profile_image_upload',
    async (image, { rejectWithValue, fulfillWithValue }) => {

        try {
            const { data } = await api.post('/profile-image-upload', image, { withCredentials: true })
            // console.log(data)            
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)
// end method 

export const seller_register = createAsyncThunk(
    'auth/seller_register',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            console.log(info)
            const { data } = await api.post('/seller-register', info, { withCredentials: true })
            localStorage.setItem('accessToken', data.token)
            //  console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)

export const get_user_info = createAsyncThunk(
    'auth/get_user_info',
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get('/get-user', { withCredentials: true })
            // console.log(data)
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)

export const profile_info_add = createAsyncThunk(
    'auth/profile_info_add',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/profile-info-add', info, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)
// end method 

export const change_password = createAsyncThunk(
    'auth/change_password',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/change-password', info, { withCredentials: true })
            return fulfillWithValue(data.message)
        } catch (error) {
            return rejectWithValue(error.response.data)
        }
    }
)

const returnRole = (token) => {
    if (token) {
        const decodeToken = jwtDecode(localStorage.getItem('accessToken'))
        const expireTime = new Date(decodeToken.exp * 1000)
        if (new Date() > expireTime) {
            localStorage.removeItem('accessToken')
            return ''
        } else {
            return decodeToken.role
        }
    } else {
        return ''
    }
}
// End Method

export const logout = createAsyncThunk(
    'auth/logout',
    async ({ navigate, role }, { rejectWithValue, fulfillWithValue }) => {

        try {
            const { data } = await api.get('/logout', { withCredentials: true })
            localStorage.removeItem('accessToken')
            if (role === 'admin') {
                navigate('/admin/login')
            } else {
                navigate('/login')
            }
            return fulfillWithValue(data)
        } catch (error) {
            // console.log(error.response.data)
            return rejectWithValue(error.response.data)
        }
    }
)

// end Method 

export const authReducer = createSlice({
    name: 'auth',
    initialState: {
        successMessage: '',
        errorMessage: '',
        loader: false,
        userInfo: '',
        role: returnRole(localStorage.getItem('accessToken')),
        token: localStorage.getItem('accessToken'),
    },
    reducers: {
        messageClear: (state, _) => {
            state.errorMessage = "";
            state.successMessage = "";
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(admin_login.pending, (state, { payload }) => {
                state.loader = true;
            })
            .addCase(admin_login.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error === "Invalid credentials" ? "Thông tin đăng nhập không hợp lệ" :
                    payload.error === "User not found" ? "Không tìm thấy người dùng" :
                        payload.error === "Mật khẩu không đúng" ? "Mật khẩu không đúng" :
                            payload.error === "Không tìm thấy email" ? "Không tìm thấy email" :
                                payload.error === "Lỗi server" ? "Lỗi server" :
                                    payload.error;
            })
            .addCase(admin_login.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = "Đăng nhập thành công";
                state.token = payload.token;
                state.role = returnRole(payload.token);
            })

            .addCase(seller_login.pending, (state, { payload }) => {
                state.loader = true;
            })
            .addCase(seller_login.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error === "Invalid credentials" ? "Thông tin đăng nhập không hợp lệ" :
                    payload.error === "User not found" ? "Không tìm thấy người dùng" :
                        payload.error === "Mật khẩu không đúng" ? "Mật khẩu không đúng" :
                            payload.error === "Không tìm thấy email" ? "Không tìm thấy email" :
                                payload.error === "Lỗi server" ? "Lỗi server" :
                                    payload.error;
            })
            .addCase(seller_login.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = "Đăng nhập thành công";
                state.token = payload.token;
                state.role = returnRole(payload.token);
            })

            .addCase(seller_register.pending, (state, { payload }) => {
                state.loader = true;
            })
            .addCase(seller_register.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error === "Email already exists" ? "Email đã tồn tại" :
                    payload.error === "Invalid email format" ? "Định dạng email không hợp lệ" :
                        payload.error === "Password must be at least 6 characters" ? "Mật khẩu phải có ít nhất 6 ký tự" :
                            payload.error === "Lỗi server" ? "Lỗi server" :
                                payload.error;
            })
            .addCase(seller_register.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = "Đăng ký thành công";
                state.token = payload.token;
                state.role = returnRole(payload.token);
            })
            .addCase(get_user_info.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.userInfo = payload.userInfo
            })
            .addCase(profile_image_upload.pending, (state, { payload }) => {
                state.loader = true;
            })
            .addCase(profile_image_upload.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.userInfo = payload.userInfo;
                state.successMessage = payload.message === "Profile image updated" ? "Đã cập nhật ảnh đại diện" : payload.message;
            })
            .addCase(profile_info_add.pending, (state, { payload }) => {
                state.loader = true;
            })
            .addCase(profile_info_add.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.userInfo = payload.userInfo;
                state.successMessage = payload.message === "Profile updated successfully" ? "Đã cập nhật thông tin thành công" : payload.message;
            })
            // Change Password
            .addCase(change_password.pending, (state, { payload }) => {
                state.loader = true;
            })
            .addCase(change_password.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message === "Password changed successfully" ? "Đã đổi mật khẩu thành công" : payload.message;
                state.token = payload.token;
                state.role = returnRole(payload.token);
            })
            .addCase(change_password.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload.error === "Current password is incorrect" ? "Mật khẩu hiện tại không đúng" :
                    payload.error === "New password must be at least 6 characters" ? "Mật khẩu mới phải có ít nhất 6 ký tự" :
                        payload.error;
            })
    }

})
export const { messageClear } = authReducer.actions
export default authReducer.reducer