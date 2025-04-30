import authReducer from "./Reducers/authReducer";
import categoryReducer from "./Reducers/categoryReducer";
import { combineReducers } from 'redux';

const rootReducer =  combineReducers({
    auth: authReducer,
    category: categoryReducer,
})

export default rootReducer;