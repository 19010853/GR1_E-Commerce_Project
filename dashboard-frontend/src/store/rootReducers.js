import authReducer from "./Reducers/authReducer";
import categoryReducer from "./Reducers/categoryReducer";
import { combineReducers } from 'redux';
import  productReducer  from "./Reducers/productReducer";

const rootReducer =  combineReducers({
    auth: authReducer,
    category: categoryReducer,
    product: productReducer,
})

export default rootReducer;