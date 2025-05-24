import authReducer from "./Reducers/authReducer";
import categoryReducer from "./Reducers/categoryReducer";
import dashboardReducer from "./Reducers/dashboardReducer";
import orderReducer from "./Reducers/orderReducer";
import PaymentReducer from "./Reducers/paymentReducer";
import productReducer from "./Reducers/productReducer";
import sellerReducer from "./Reducers/sellerReducer";
import bannerReducer from "./Reducers/bannerReducer";

const rootReducer = {
  auth: authReducer,
  category: categoryReducer,
  product: productReducer,
  seller: sellerReducer,
  order: orderReducer,
  payment: PaymentReducer,
  dashboard: dashboardReducer,
  banner: bannerReducer,
};
export default rootReducer;
