import React, { useEffect, useState } from 'react';
import { Heart, Share2, ShoppingCart, Truck, RefreshCw, Star, Minus, Plus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import RatingAndReview from './RatingAndReview';
import toast from 'react-hot-toast';
import copy from "copy-to-clipboard"


const SingleItem = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [mainImage, setMainImage] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [wisListId, setWisListId] = useState(null);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const navigate = useNavigate()

    let token;
    const storedTokenData = JSON.parse(localStorage.getItem("token"));
    if (storedTokenData && Date.now() < storedTokenData.expires) {
        console.log("Token:", storedTokenData.value);
        token = storedTokenData.value
    } else {
        localStorage.removeItem("token");
        console.log("Token has expired");
    }
    const fetchProductId = async () => {
        try {
            let response = await axios.get("http://localhost:4000/api/v1/products/wishlistid", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            console.log("wishlistid", response?.data)
            // setWisListId()
            setWisListId(response?.data?.items?.map(item => item.productId));

        } catch (error) {

        }
    }

    useEffect(() => {
        fetchProductId()
    }, [])
    console.log("wishlistid", wisListId)


    const fetchProduct = async () => {
        try {
            let response = await axios.get(`http://localhost:4000/api/v1/products/getproductbyId/${productId}`);
            const fetchedProduct = response?.data?.product;
            setProduct(fetchedProduct);
        } catch (error) {
            console.error("Error fetching product", error);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [productId]);

    useEffect(() => {
        if (product) {
            setMainImage(product?.images?.[0] || null);
            setSelectedSize(product?.price_size?.[0] || null);
        }
    }, [product]);
    const removeFromWishList=async(productId)=>{
        try {
            let response=await axios.delete("http://localhost:4000/api/v1/products/removewishlist",{
                productId
            },
            {
                headers: { Authorization: `Bearer ${token}` },
              })
            
        } catch (error) {
            
        }

    }

    const handleShare = () => {
        copy(window.location.href)
        toast.success("Link copied to clipboard")
      }

    const addtoWishList = async (productId) => {
        
        // const{


        // }=product;

        if (token) {
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    // Do not set 'Content-Type' manually for FormData
                },
            };

            console.log("Add to wish list token", token)


            try {


                let response = await axios.post("http://localhost:4000/api/v1/products/addwishlist", {
                    productId
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` // Ensure token is valid
                    }

                }

                )

                console.log("wisList Response:", response.data);
                alert("Product added to WishList successfully!");
            } catch (error) {
                console.error("Error adding to wishList:", error.response?.data || error.message);
                alert("Failed to add product to WishList.");
            }
        }


    }

    const addtocart = async (id) => {
        if (!selectedSize) {
            alert("Please select a size before adding to cart.");
            return;
        }

        let selectedsize = selectedSize.size;
        let selecetedDiscountedPrice = selectedSize.discountedPrice;
        let selectedPrice = selectedSize.price;
        // const {
        //     selectedSize,
        //     selecetedDiscountedPrice,


        // }=product

        try {
            const response = await axios.post(
                "http://localhost:4000/api/v1/products/addtocart",
                {
                    productId: id,
                    quantity,
                    selectedsize, // Correct key name
                    selecetedDiscountedPrice, // Fix typo if needed
                    selectedPrice
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` // Ensure token is valid
                    }
                }
            );

            console.log("Cart Response:", response.data);
            alert("Product added to cart successfully!");
            navigate("/product/cart")
        } catch (error) {
            console.error("Error adding to cart:", error.response?.data || error.message);
            alert("Failed to add product to cart.");
        }

        console.log("Add to Cart:", selectedsize, selectedPrice, selecetedDiscountedPrice, quantity);
    };


    const handleQuantityChange = (newQuantity) => {
        if (selectedSize && newQuantity >= 1 && newQuantity <= selectedSize.quantity) {
            setQuantity(newQuantity);
        }
    };

    if (!product) return <div className="text-center text-xl mt-20">Loading...</div>;

    return (

       <>
        <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8 mt-16">
            {/* Image Gallery Section */}
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Thumbnail Gallery */}
                <div className="flex lg:flex-col space-x-2 lg:space-y-2 overflow-x-auto lg:overflow-visible">
                    {product.images?.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Product thumbnail ${index + 1}`}
                            className={`w-16 h-16 lg:w-20 lg:h-20 object-contain rounded-lg cursor-pointer  
                                ${mainImage === image ? 'border-2 border-blue-500' : 'opacity-70 hover:opacity-100'}`}
                            onClick={() => setMainImage(image)}

                        />
                    ))}
                </div>

                {/* Main Image and Mobile Price Section */}
                <div className="flex-grow relative">
                    <img
                        src={mainImage || "fallback-image-url"}
                        alt={product.name}
                        className="w-full h-[400px] lg:h-[500px] object-contain rounded-lg shadow-lg"
                    />
                    <div className="absolute top-4 right-4 flex space-x-2">
                        <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition" aria-label="Add to Wishlist">
                            <Heart size={24} className="text-gray-600 hover:text-red-500"
                                onClick={() => {
                                    addtoWishList(product._id)
                                }}
                            />
                        </button>
                        <button className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition" aria-label="Share" onClick={()=>{handleShare()}}>
                            <Share2 size={24} className="text-gray-600" />
                        </button>
                    </div>

                    {/* Mobile Price Display */}
                    <div className="lg:hidden mt-4  rounded-lg shadow-sm">
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            {product.price_size?.map((sizeOption) => (
                                <div
                                    key={sizeOption._id}
                                    className={`border rounded-lg p-2 bg-white cursor-pointer transition 
                                        ${selectedSize?._id === sizeOption._id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                                    onClick={() => setSelectedSize(sizeOption)}
                                >
                                    <div className="text-center">
                                        <div className="font-medium mb-1">{sizeOption.size}</div>
                                        <div className="text-blue-600 font-bold">₹{sizeOption.discountedPrice}</div>
                                        <div className="text-xs">
                                            <span className="text-gray-500 line-through">₹{sizeOption.price}</span>
                                            <span className="text-green-600 ml-1">
                                                {Math.round(((sizeOption.price - sizeOption.discountedPrice) / sizeOption.price) * 100)}% off
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>



                    {/* Action Buttons */}


                    <div>
                        <div className="flex  space-x-4  p-4 rounded-lg mb-4">
                            <span className="text-gray-700 font-medium">Quantity:</span>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => handleQuantityChange(quantity - 1)}
                                    disabled={quantity <= 1}
                                    className={`p-2 rounded-full ${quantity <= 1
                                        ? 'bg-gray-100 text-gray-400'
                                        : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                                        } transition-colors duration-200`}
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="w-10 text-center font-medium">{quantity}</span>
                                <button
                                    onClick={() => handleQuantityChange(quantity + 1)}
                                    disabled={!selectedSize || quantity >= selectedSize.quantity}
                                    className={`p-2 rounded-full ${!selectedSize || quantity >= selectedSize.quantity
                                        ? 'bg-gray-100 text-gray-400'
                                        : 'bg-blue-100 text-green-600 hover:bg-green-200'
                                        } transition-colors duration-200`}
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="flex space-x-4 mt-4">
                            <button className="flex-1 flex items-center justify-center bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition" onClick={() => addtocart(product._id)}>
                                <ShoppingCart className="mr-2" /> Add to Cart
                            </button>
                            <button className="flex-1 flex items-center justify-center bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition">
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>

            </div>


            {/* Product Details */}
            <div>
                <h1 className="text-2xl text-[#1b2c0a] font-bold mb-2">{product.name}</h1>

                {/* Desktop Price Display */}
                <div className="hidden lg:block  p-4 rounded-lg mb-4">
                    <div className="flex flex-wrap gap-4">
                        {product.price_size?.map((sizeOption) => (
                            <div
                                key={sizeOption._id}
                                className={`border rounded-lg p-3 bg-white cursor-pointer transition 
                                    ${selectedSize?._id === sizeOption._id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                                onClick={() => setSelectedSize(sizeOption)}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-medium">{sizeOption.size}</span>
                                    <div>
                                        <div className="flex items-center">
                                            <span className="text-xl font-bold text-blue-600 mr-2">₹{sizeOption.discountedPrice}</span>
                                            <span className="text-gray-500 line-through text-sm">₹{sizeOption.price}</span>
                                            <span className="text-green-600 font-semibold text-sm ml-2">
                                                {Math.round(((sizeOption.price - sizeOption.discountedPrice) / sizeOption.price) * 100)}% off
                                            </span>
                                        </div>
                                        <span className="text-xs text-gray-500">Qty Available: {sizeOption.quantity}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Delivery and Services */}
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <h3 className="text-lg font-semibold mb-3">Delivery & Services</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="flex flex-col items-center">
                            <Truck className="mb-2 text-blue-600" />
                            <span className="text-xs">Free Delivery</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <RefreshCw className="mb-2 text-green-600" />
                            <span className="text-xs">7 Days Replacement</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <Star className="mb-2 text-yellow-600" />
                            <span className="text-xs">Quality Guaranteed</span>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <h3 className="text-lg font-semibold mb-2">Product Description</h3>
                    <p className="text-gray-700">{product.description}</p>
                </div>
            </div>
        </div>
        <div>
           <RatingAndReview productId={productId}/>
        </div>
        </>
    );
};

export default SingleItem;
