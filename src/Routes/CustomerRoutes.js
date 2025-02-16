import React from 'react'
import NavBar from '../Component/Common/NavBar'
import { Route, Routes } from 'react-router-dom'
import Product from '../Ecomerce/Pages/Product'
import Home from '../Component/HomePage/Home'
import News from '../Component/HomePage/News'
import AboutUs from '../Component/HomePage/AboutUs'

import VerifyEmail from '../Component/Common/VerifyEmail'
import ProductPage from '../Ecomerce/Pages/ProductPage'
import Contact from '../Component/HomePage/Contact'
import SignUp from '../Component/HomePage/SignUp'
import Login from '../Component/HomePage/Login'
import ForgetPassword from '../Component/HomePage/ForgetPassword'
import Footer from '../Component/Common/Footer'
import SingleItem from '../Ecomerce/Product/SingleItem'
import Cart from '../Ecomerce/Cart/Cart'
import Profile from '../Ecomerce/Profile/Profile'
import WishList from '../Ecomerce/WishList/WishList'
import Search from '../Ecomerce/Product/Search'
import UpdatePassword from '../Component/Common/UpdatePassword'

const CustomerRoutes = () => {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path='/product' element={<Product />} />
        <Route path='/' element={<Home />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/login' element={<Login />} />
        <Route path='/forgot-password' element={<ForgetPassword />} />
        <Route path='/news' element={<News />} />
        <Route path='/about' element={<AboutUs />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/verifyemail' element={<VerifyEmail />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path='/product/item/:productId' element={<SingleItem/>} />
        <Route path='/product/cart' element={<Cart/>} />
        <Route path='/product/profile' element={<Profile/>} /> 
        <Route path='/product/wishlist' element={<WishList/>} />   
        <Route path='/product/search' element={<Search/>} /> 
        <Route path='/update-password/:token' element={<UpdatePassword/>} /> 
      </Routes>
      <Footer/>
    </>
  )
}

export default CustomerRoutes