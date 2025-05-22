import authReducer from "./Reducers/authReducer";
import categoryReducer from "./Reducers/categoryReducer";
import orderReducer from './Reducers/orderReducer';
import PaymentReducer from "./Reducers/paymentReducer";
import productReducer from "./Reducers/productReducer";
import sellerReducer from "./Reducers/sellerReducer";

const rootReducer = {
    auth: authReducer,
    category: categoryReducer,
    product: productReducer,
    seller: sellerReducer,
    order: orderReducer,
    payment: PaymentReducer,
}
export default rootReducer;