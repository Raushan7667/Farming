import { combineReducers } from "redux";
import authReducer from '../slice/authSlice'
import profileReducer from '../slice/profileSlice'
import cartReducer from '../slice/cartSlice'
import wishlistReducer from '../slice/wishlistSlice'
import singleproductReducer from '../slice/SingleProductSlice'

const rootReducer=combineReducers({
    auth:authReducer,
    profile:profileReducer,
    cart:cartReducer,
    wishlist:wishlistReducer,
    singleproduct:singleproductReducer

})

export default rootReducer;