import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const admin_Login = createAsyncThunk(
    'auth/admin_Login',
    async(info) => {
        console.log(info)
        try {
            const {data} = await api.post('/admin-login', info, {withCredentials: true})
            console.log(data)
        } catch (error) {
            console.log(error.response.data)
        }
    }
)

export const authReducer = createSlice({
    name: 'auth',
    initialState: {
        successMessage: '',
        errorMessage: '',
        loader: false,
        userInformation: ''
    },
    reducers: {

    },
    extraReducers: () => {

    }
})

export default authReducer.reducer;