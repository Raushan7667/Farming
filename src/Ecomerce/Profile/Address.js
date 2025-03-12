import React, { useEffect, useState } from 'react'
import ProfileLayout from './Profile'
import axios from 'axios';
import { X } from 'lucide-react';

const Address = () => {
    const [addresses, setAddresses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        Name: '',
        streetAddress: '',
        city: '',
        state: '',
        zipCode: '',
        mobile: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    let token;
    const storedTokenData = JSON.parse(localStorage.getItem("token"));
    if (storedTokenData && Date.now() < storedTokenData.expires) {
        console.log("Token:", storedTokenData.value);
        token = storedTokenData.value
    } else {
        localStorage.removeItem("token");
        console.log("Token has expired");
    }

    const fetchAddresses=async()=>{
        try {
            const response = await axios.get("http://localhost:4000/api/v1/auth/getaddress", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setAddresses(response.data);
        } catch (error) {
            console.error("Error fetching addresses:", error);
        }
    }
    console.log("addresses",addresses)

    useEffect(()=>{
        fetchAddresses()
         
    },[])

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        if (!formData.Name.trim()) return "Name is required";
        if (!formData.streetAddress.trim()) return "Street address is required";
        if (!formData.city.trim()) return "City is required";
        if (!formData.state.trim()) return "State is required";
        if (!formData.zipCode.trim()) return "ZIP code is required";
        if (!formData.mobile.trim()) return "Mobile number is required";
        if (!/^\d{10}$/.test(formData.mobile)) return "Invalid mobile number";
        if (!/^\d{6}$/.test(formData.zipCode)) return "Invalid ZIP code";
        return "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);
        setError('');

        try {
            await axios.post(
                "http://localhost:4000/api/v1/auth/addaddress",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Reset form and close modal
            setFormData({
                Name: '',
                streetAddress: '',
                city: '',
                state: '',
                zipCode: '',
                mobile: ''
            });
            setShowModal(false);
            
            // Refresh addresses list
            fetchAddresses();
        } catch (error) {
            setError(error.response?.data?.message || "Error adding address");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ProfileLayout>
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">My Addresses</h2>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Add New Address
                    </button>
                </div>

                {/* Addresses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                        <div
                            key={address._id}
                            className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow"
                        >
                            <p className="font-semibold text-lg">{address.Name}</p>
                            <p className="text-gray-600 mt-2">{address.streetAddress}</p>
                            <p className="text-gray-600">{`${address.city}, ${address.state}, ${address.zipCode}`}</p>
                            <p className="text-gray-600 mt-2">Mobile: {address.mobile}</p>
                        </div>
                    ))}
                </div>

                {addresses.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No addresses found. Please add a new address.
                    </div>
                )}

                {/* Add Address Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg w-full max-w-md">
                            <div className="flex justify-between items-center p-4 border-b">
                                <h3 className="text-xl font-semibold">Add New Address</h3>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-4">
                                {error && (
                                    <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="Name"
                                            value={formData.Name}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Street Address
                                        </label>
                                        <input
                                            type="text"
                                            name="streetAddress"
                                            value={formData.streetAddress}
                                            onChange={handleInputChange}
                                            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                            placeholder="Enter street address"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter city"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                State
                                            </label>
                                            <input
                                                type="text"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter state"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                ZIP Code
                                            </label>
                                            <input
                                                type="text"
                                                name="zipCode"
                                                value={formData.zipCode}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter ZIP code"
                                                maxLength="6"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Mobile Number
                                            </label>
                                            <input
                                                type="tel"
                                                name="mobile"
                                                value={formData.mobile}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter mobile number"
                                                maxLength="10"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        {loading ? 'Adding...' : 'Add Address'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </ProfileLayout>
    );
};

export default Address