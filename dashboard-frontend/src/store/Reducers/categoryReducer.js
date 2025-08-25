import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

export const categoryAdd = createAsyncThunk(
  "category/categoryAdd",
  async ({ name, image }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("image", image);
      const { data } = await api.post("/category-add", formData, {
        withCredentials: true,
      });
      // console.log(data)
      return fulfillWithValue(data);
    } catch (error) {
      // console.log(error.response.data)
      return rejectWithValue(error.response.data);
    }
  }
);

// End Method

export const get_category = createAsyncThunk(
  "category/get_category",
  async (
    { parPage, page, searchValue },
    { rejectWithValue, fulfillWithValue }
  ) => {
    try {
      const { data } = await api.get(
        `/category-get?page=${page}&&searchValue=${searchValue}&&parPage=${parPage}`,
        { withCredentials: true }
      );
      console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      // console.log(error.response.data)
      return rejectWithValue(error.response.data);
    }
  }
);

// End Method

export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async ({ id, name, image }, { rejectWithValue, fulfillWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      if (image) {
        formData.append("image", image);
      }
      const { data } = await api.put(`/category-update/${id}`, formData, {
        withCredentials: true,
      });
      // console.log(data);
      return fulfillWithValue(data);
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// End Method

export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (id, { rejectWithValue, fulfillWithValue }) => {
    try {
      const response = await api.delete(`/category/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
// End Method

export const categoryReducer = createSlice({
  name: "category",
  initialState: {
    successMessage: "",
    errorMessage: "",
    loader: false,
    categorys: [],
    totalCategory: 0,
  },
  reducers: {
    messageClear: (state) => {
      state.errorMessage = "";
      state.successMessage = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(categoryAdd.pending, (state) => {
        state.loader = true;
        state.successMessage = "";
        state.errorMessage = "";
      })
      .addCase(categoryAdd.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.error === "Category name already exists" ? "Tên danh mục đã tồn tại" :
          payload?.error === "Invalid category data" ? "Dữ liệu danh mục không hợp lệ" :
            payload?.error === "Lỗi tải lên hình ảnh" ? "Lỗi tải lên hình ảnh" :
              payload?.error === "Lỗi server" ? "Lỗi server" :
                payload?.error || "Đã xảy ra lỗi";
        state.successMessage = "";
      })
      .addCase(categoryAdd.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = "Đã thêm danh mục thành công";
        state.categorys = [...state.categorys, payload.category];
        state.errorMessage = "";
      })
      .addCase(get_category.fulfilled, (state, { payload }) => {
        state.totalCategory = payload.totalCategory;
        state.categorys = payload.categorys;
        state.successMessage = "";
        state.errorMessage = "";
      })
      .addCase(updateCategory.pending, (state) => {
        state.loader = true;
        state.successMessage = "";
        state.errorMessage = "";
      })
      .addCase(updateCategory.fulfilled, (state, { payload }) => {
        state.loader = false;
        state.successMessage = "Đã cập nhật danh mục thành công";
        const index = state.categorys.findIndex(
          (category) => category._id === payload.category._id
        );
        if (index !== -1) {
          state.categorys[index] = payload.category;
        }
        state.errorMessage = "";
      })
      .addCase(updateCategory.rejected, (state, { payload }) => {
        state.loader = false;
        state.errorMessage = payload?.error === "Category not found" ? "Không tìm thấy danh mục" :
          payload?.error === "Category name already exists" ? "Tên danh mục đã tồn tại" :
            payload?.error === "Lỗi server" ? "Lỗi server" :
              payload?.error || "Đã xảy ra lỗi";
        state.successMessage = "";
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categorys = state.categorys.filter(
          (cat) => cat._id !== action.meta.arg
        );
        state.successMessage = "Đã xóa danh mục thành công";
        state.errorMessage = "";
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.errorMessage = action.payload?.error === "Category not found" ? "Không tìm thấy danh mục" :
          action.payload?.error === "Cannot delete category with products" ? "Không thể xóa danh mục có sản phẩm" :
            action.payload?.error === "Lỗi server" ? "Lỗi server" :
              action.payload?.error || "Đã xảy ra lỗi";
        state.successMessage = "";
      });
  },
});
export const { messageClear } = categoryReducer.actions;
export default categoryReducer.reducer;
