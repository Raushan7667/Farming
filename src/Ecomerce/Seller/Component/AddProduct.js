import React, { useEffect, useRef, useState } from 'react';
import { Camera, Trash2, Plus, X } from 'lucide-react';
import axios from 'axios';
import TextEditor from './TextEditor';
import { useParams, useNavigate } from 'react-router-dom';

const AddProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [fetchdata, setFetchedData] = useState([]);
  const [images, setImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [chips, setChips] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const [productData, setProductData] = useState({
    fullShopDetails: '',
    name: '',
    description: '',
    priceDetails: [{ price: '', discountedPrice: '', size: '', quantity: '' }],
    images: []
  });

  // Fetch product data if editing
  useEffect(() => {
    const fetchProductData = async () => {
      if (id) {
        try {
          const storedTokenData = JSON.parse(localStorage.getItem("token"));
          if (storedTokenData && Date.now() < storedTokenData.expires) {
            const response = await axios.get(
              `http://localhost:4000/api/v1/products/getproductbyid/${id}`,
              {
                headers: {
                  Authorization: `Bearer ${storedTokenData.value}`
                }
              }
            );
            
            const product = response.data.product;
            setIsEditing(true);
            
            // Set form data
            setProductData({
              fullShopDetails: product.fullShopDetails || '',
              name: product.name || '',
              description: product.description || '',
              priceDetails: product.price_size || [{ price: '', discountedPrice: '', size: '', quantity: '' }],
              images: product.images || []
            });
            
            // Set category and subcategory
            setSelectedCategory(product.category?.parentCategory || '');
            setSelectedSubcategory(product.category?._id || '');
            
            // Set tags
            setChips(product.tag || []);
          }
        } catch (error) {
          console.error('Error fetching product:', error);
        }
      }
    };

    fetchProductData();
  }, [id]);

  const fetchCategory = async () => {
    try {
      let response = await axios.get("http://localhost:4000/api/v1/products/getallparentcategory");
      console.log("all category", response.data.data);
      setFetchedData(response.data.data);
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePriceDetailChange = (index, e) => {
    const { name, value } = e.target;
    const newPriceDetails = [...productData.priceDetails];
    newPriceDetails[index][name] = value;
    setProductData(prev => ({
      ...prev,
      priceDetails: newPriceDetails
    }));
  };

  const addPriceDetail = () => {
    setProductData(prev => ({
      ...prev,
      priceDetails: [
        ...prev.priceDetails,
        { price: '', discountedPrice: '', size: '', quantity: '' }
      ]
    }));
  };

  const removePriceDetail = (index) => {
    const newPriceDetails = productData.priceDetails.filter((_, i) => i !== index);
    setProductData(prev => ({ ...prev, priceDetails: newPriceDetails }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
    const imageUrls = files.map(file => URL.createObjectURL(file));
    setProductData(prev => ({
      ...prev,
      images: [...prev.images, ...imageUrls]
    }));
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setProductData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory('');
  };

  const handleSubcategoryChange = (subcategoryId) => {
    setSelectedSubcategory(subcategoryId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    
    formData.append("name", productData.name);
    formData.append("description", productData.description);
    formData.append("price_size", JSON.stringify(productData.priceDetails));
    formData.append("fullShopDetails", productData.fullShopDetails);
    formData.append("category", selectedSubcategory);
    formData.append("badges", "PreciAgri");
    formData.append("tag", JSON.stringify(chips));
    
    // Only append new images if they exist
    if (images.length > 0) {
      images.forEach((image) => {
        formData.append(`image`, image);
      });
    }

    let token;
    const storedTokenData = JSON.parse(localStorage.getItem("token"));
    if (storedTokenData && Date.now() < storedTokenData.expires) {
      token = storedTokenData.value;
    } else {
      localStorage.removeItem("token");
    }

    if (token) {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const url = isEditing 
          ? `http://localhost:4000/api/v1/products/editproduct/${id}`
          : "http://localhost:4000/api/v1/products/createproduct";
        
        const method = isEditing ? 'put' : 'post';
        
        await axios[method](url, formData, config);
        
        // Navigate back to seller dashboard after successful submission
        navigate('/seller');
      } catch (error) {
        console.error('Error saving product:', error);
      }
    }
  };

  const handleDeleteChip = (chipIndex) => {
    // Filter the chips array to remove the chip with the given index
    const newChips = chips.filter((_, index) => index !== chipIndex)
    setChips(newChips)
  }
  const handleKeyDown = (event) => {
    // Check if user presses "Enter" or ","
    if (event.key === "Enter" || event.key === ",") {
      // Prevent the default behavior of the event
      event.preventDefault()
      // Get the input value and remove any leading/trailing spaces
      const chipValue = event.target.value.trim()
      // Check if the input value exists and is not already in the chips array
      if (chipValue && !chips.includes(chipValue)) {
        // Add the chip to the array and clear the input
        const newChips = [...chips, chipValue]
        setChips(newChips)
        event.target.value = ""
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-7xl mx-auto p-6 bg-white shadow-md rounded">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2">Full Shop Details</label>
          <input
            type="text"
            name="fullShopDetails"
            value={productData.fullShopDetails}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Product Name</label>
          <input
            type="text"
            name="name"
            value={productData.name}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
      </div>
      <label className="block mb-1 mt-2">Category</label>
      <div className="mt-4 flex gap-2">
        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="">Select Category</option>
          {fetchdata.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          value={selectedSubcategory}
          onChange={(e) => handleSubcategoryChange(e.target.value)}
          className="w-full p-2 border rounded"
          disabled={!selectedCategory}
        >
          <option value="">Select Subcategory</option>
          {selectedCategory &&
            fetchdata.find(cat => cat._id === selectedCategory)?.subcategories.map((subcategory) => (
              <option key={subcategory._id} value={subcategory._id}>
                {subcategory.name}
              </option>
            ))}
        </select>
      </div>
      <div className="mt-4">
        <label className="block mb-2">Description</label>
        {/* Replace textarea with TextEditor component */}
        <TextEditor 
          value={productData.description} 
          onChange={handleInputChange} 
        />
      </div>
      
      {/* Hidden field that shows the HTML content for debugging */}
      <div className="mt-2 p-2 border rounded bg-gray-50">
        <details>
          <summary className="text-sm font-medium cursor-pointer">View HTML content (for debugging)</summary>
          <pre className="text-xs mt-2 p-2 bg-gray-100 rounded overflow-x-auto">
            {productData.description}
          </pre>
        </details>
      </div>
      
      <div className="flex flex-col space-y-2 mt-4">
        <label className="block mb-2" htmlFor="chip">
          Enter the name of the chip
        </label>
        <div className="flex w-full flex-wrap gap-y-2">
          {chips.map((chip, index) => (
            <div
              key={index}
              className="m-1 flex items-center rounded-full bg-green-400 px-2 py-1 text-sm text-richblack-5"
            >
              {chip}
              <button
                type="button"
                className="ml-2 focus:outline-none"
                onClick={() => handleDeleteChip(index)}
              >
                <X />
              </button>
            </div>
          ))}
          <input
            name="chip"
            type="text"
            placeholder="Enter tag"
            onKeyDown={handleKeyDown}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
      <div className="mt-4">
        <label className="block mb-2">Product Images</label>
        <div className="flex flex-wrap gap-2 mt-2 mb-2">
          {productData.images.map((image, index) => (
            <div key={index} className="relative">
              <img
                src={image}
                alt="Product"
                className="w-24 h-24 object-cover rounded"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded cursor-pointer"
        >
          <Camera size={20} /> Upload Images
        </label>
      </div>
      <div className="mt-4">
        <label className="block mb-2">Price & Sizes</label>
        {productData.priceDetails.map((detail, index) => (
          <div key={index} className="grid grid-cols-4 gap-2 mb-2">
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={detail.price}
              onChange={(e) => handlePriceDetailChange(index, e)}
              className="p-2 border rounded"
              required
            />
            <input
              type="number"
              name="discountedPrice"
              placeholder="Discounted Price"
              value={detail.discountedPrice}
              onChange={(e) => handlePriceDetailChange(index, e)}
              className="p-2 border rounded"
            />
            <input
              type="text"
              name="size"
              placeholder="Size"
              value={detail.size}
              onChange={(e) => handlePriceDetailChange(index, e)}
              className="p-2 border rounded"
              required
            />
            <div className="flex items-center">
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                value={detail.quantity}
                onChange={(e) => handlePriceDetailChange(index, e)}
                className="p-2 border rounded flex-grow"
                required
              />
              {index > 0 && (
                <button
                  type="button"
                  onClick={() => removePriceDetail(index)}
                  className="ml-2 text-red-500"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={addPriceDetail}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded mt-2"
        >
          <Plus size={20} /> Add Price/Size
        </button>
      </div>
      <button
        type="submit"
        className="w-full mt-4 p-3 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {isEditing ? 'Update Product' : 'Add Product'}
      </button>
    </form>
  );
};

export default AddProduct;