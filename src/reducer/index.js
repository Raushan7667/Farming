import { combineReducers } from "redux";
import authReducer from '../slice/authSlice'
import profileReducer from '../slice/profileSlice'
import cartReducer from '../slice/cartSlice'
import wishlistReducer from '../slice/wishlistSlice'

const rootReducer=combineReducers({
    auth:authReducer,
    profile:profileReducer,
    cart:cartReducer,
    wishlist:wishlistReducer

})

export default rootReducer;