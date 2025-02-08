import axios from 'axios'
import { Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const [cartProduct, setCartProduct] = useState(null)
    const [token, setToken] = useState(null);
    const navigate=useNavigate()

    const fetcProduct = async () => {
        try {
            const response = await axios.get("http://localhost:4000/api/v1/products/cartitems", {
                headers: { Authorization: `Bearer ${token}` },
            })
            console.log("cart response", response?.data?.cart)
            setCartProduct(response?.data?.cart)

        } catch (error) {
            alert.error(error)

        }

    }


    useEffect(() => {

        const storedTokenData = JSON.parse(localStorage.getItem("token"));
        if (storedTokenData && Date.now() < storedTokenData.expires) {
            setToken(storedTokenData.value);
        } else {
            localStorage.removeItem("token");
            setToken(null);
        }

    }, [])
    useEffect(() => {
        if (token) {
            fetcProduct()
        }
    }, [token])

    const removeItem = async (id) => {
        try {
            console.log("Removing", id);
            const response = await axios.delete(`http://localhost:4000/api/v1/products/removeitem/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Product removed from cart successfully!");
    
            // Refresh the cart after removing an item
            fetcProduct();
    
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };

    const goToProduct=async(id)=>{
        navigate(`/product/item/${id}`)
    }

    if (!cartProduct?.items?.length) {
        return (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500 text-lg">Your cart is empty</p>
          </div>
        );
      }
    


    return (
        <>
      <div className="container mx-auto px-4 mt-16">
      <div className="flex flex-col lg:flex-row gap-6 min-h-[calc(100vh-8rem)]">
        {/* Cart Items Section */}
        <div className="lg:w-3/5 w-full">
          <div className="bg-gray-50 rounded-lg shadow p-6 max-h-[calc(100vh-8rem)] overflow-auto scrollbar-hide">
            <h2 className="text-xl font-semibold mb-4">Shopping Cart</h2>
            <div className="space-y-4">
              {cartProduct?.items?.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-lg p-4 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    <img
                      src={item?.product?.images[0] || "/api/placeholder/112/112"}
                      alt={item.product.name}
                      className="w-28 h-28 object-cover rounded-md flex-shrink-0"
                    />
                    <div className="flex-grow">
                      <h3 className="font-semibold text-lg cursor-pointer hover:text-blue-600" onClick={()=>{goToProduct(item.product._id)}}>{item.product.name}</h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>Size: {item.selectedsize}</p>
                        <p>Shop: {item.product.fullShopDetails}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="font-medium">Price:</span>
                          <span className="line-through text-gray-500">₹{item.selectedPrice}</span>
                          <span className="text-green-600 font-semibold">₹{item.selecetedDiscountedPrice}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-2 border-t">
                    <p className="text-gray-600">
                      Quantity: <span className="font-semibold">{item.quantity}</span>
                    </p>
                    <button
                      onClick={() => removeItem(item._id)}
                      className="flex items-center gap-1 text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 size={16} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary Section - Fixed */}
        <div className="lg:w-2/5 w-full">
          <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Price</span>
                <span className="line-through text-gray-500">₹{cartProduct?.totalPrice}</span>
              </div>
              <div className="flex justify-between items-center font-semibold">
                <span>Total Discounted Price</span>
                <span className="text-green-600">₹{cartProduct?.totalDiscountedPrice}</span>
              </div>
              <div className=" text-green-500 mt-2 font-semibold ">
                You save: ₹{cartProduct?.totalPrice - cartProduct?.totalDiscountedPrice}
              </div>
            </div>
            <button className="w-full mt-6 bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-medium">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>

    <div>
        technological and economic changes, advances in space exploration are expanding humanity’s reach beyond Earth. Space agencies like NASA, ESA, and private companies like SpaceX and Blue Origin are working towards ambitious goals such as colonizing Mars, mining asteroids for resources, and establishing permanent lunar bases. The development of reusable rockets and advancements in propulsion technology have made space travel more cost-effective,
    </div>
        </>
    )
}

export default Cart