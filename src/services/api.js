const BASE_URL=process.env.REACT_APP_BASE_URL // BACKEND URL

export const endpoints={
    SENDOTP_API:BASE_URL+"/auth/sendotp",
    SIGNUP_API: BASE_URL + "/auth/signup",
    LOGIN_API: BASE_URL + "/auth/login",
    RESETPASSTOKEN_API: BASE_URL + "/auth/resetpasswordtoken",
    RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
}
export const paymentEndpoint ={
    PRODUCT_PAYMENT_API: BASE_URL + "/order/createorder",
    PRODUCT_VERIFY_API: BASE_URL + "/",
    SEND_PAYMENT_SUCCESS_EMAIL_API: BASE_URL +"",
}