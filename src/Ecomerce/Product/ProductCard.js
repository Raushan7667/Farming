import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  const calculateDiscount = () => {
    const originalPrice = product.price_size[0].price;
    const discountedPrice = product.price_size[0].discountedPrice;
    return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
  };

  useEffect(() => {
    if (isHovered && product.images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
      }, 1000); // Change image every 1 second

      return () => clearInterval(interval); // Cleanup on unhover
    }
  }, [isHovered, product.images.length]);

  const goToProduct = async (productId) => {
    navigate(`/product/item/${productId}`);
  };

  return (
    <div
      className="relative group bg-white rounded-lg shadow hover:shadow-md transition-all duration-300 overflow-hidden w-full sm:max-w-xs"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImageIndex(0);
      }}
    >
      {/* Heart Icon */}
      <div className="absolute top-2 right-2 z-10">
        <Heart className="text-slate-400 size-6 cursor-pointer opacity-60 fill-slate-400" />
      </div>

      {/* Image Container */}
      <div className="relative h-48 sm:h-56 overflow-hidden flex justify-center items-center">
        {product.images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`${product.name} view ${index + 1}`}
            className={`absolute top-0 left-0 w-full h-full object-contain transition-opacity duration-500 ${
              currentImageIndex === index ? "opacity-100" : "opacity-0"
            }`}
            onClick={() => goToProduct(product._id)}
          />
        ))}

        {/* Rating Display (Bottom Right) */}
        <div className="absolute bottom-2 right-2 bg-green-200  text-xs sm:text-sm px-2 py-1 rounded-md shadow-md text-black">
          ⭐ {product.avgRating ? product.avgRating.toFixed(1) : "N/A"}
        </div>

        {/* Dots Navigation */}
        <div className=" opacity-0 hover:opacity-100
         absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1 z-10">
          {product.images.map((_, index) => (
            <div
              key={index}
              className={`w-1 h-1 rounded-full transition-all duration-300 ${
                currentImageIndex === index ? "bg-green-500 w-3" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-sm sm:text-lg  text-gray-800 mb-1 truncate">
          {product.name}
        </h3>
        <div className="flex flex-wrap items-center gap-2 mb-2 text-sm sm:text-base">
          <span className="font-bold">₹{product.price_size[0].discountedPrice}</span>
          <span className="text-gray-500 line-through">₹{product.price_size[0].price}</span>
          <span className="font-bold text-green-500">{calculateDiscount()}% off</span>
          <span className="text-xs text-gray-600">({product.price_size[0].size})</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

