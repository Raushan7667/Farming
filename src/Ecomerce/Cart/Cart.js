import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Cart = () => {
    const [cartProduct, setCartProduct] = useState(null)
    const [token, setToken] = useState(null);

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
    


    return (
        <>
            <div className="mx-auto p-4 mt-16 flex justify-between lg:flex-row flex-col">
                <div>
                    {cartProduct?.items?.map(item => (

                        <div
                            key={item._id}
                            className="flex gap-4 items-center border-b py-4"
                        >
                            <div>
                                <img
                                    src={item?.product?.images[0] || "https://via.placeholder.com/120"} // Replace with actual image URL
                                    alt={item.product.name}
                                    className="w-28 h-28 object-cover rounded-md"
                                />
                            </div>
                            <div>
                                <h3 className="font-semibold">{item.product.name}</h3>
                                <p className="text-gray-600">Size: {item.selectedsize}</p>
                                <p className="text-gray-600">Shop: {item.product.fullShopDetails}</p>
                                <p className="text-gray-600">Qunatitiy:-{item.quantity}</p>
                            </div>

                            <div className="flex items-center space-x-4">
                                <div>
                                    <p className="line-through text-gray-500">₹{item.selectedPrice}</p>
                                    <p className="font-bold text-green-600">₹{item.selecetedDiscountedPrice}</p>
                                </div>

                                <button
                                      onClick={() => removeItem(item._id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-6 border-t pt-4">
                    <div className="flex justify-between">
                        <span>Total Price:</span>
                        <span className="line-through">₹{cartProduct?.totalPrice}</span>
                    </div>
                    <div className="flex justify-between font-bold">
                        <span>Total Discounted Price:</span>
                        <span className="text-green-600">₹{cartProduct?.totalDiscountedPrice}</span>
                    </div>
                    <button className="mt-4 w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600">
                        Proceed to Checkout
                    </button>
                </div>


            </div>
        </>
    )
}

export default Cart