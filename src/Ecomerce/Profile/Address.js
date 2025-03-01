import React, { useEffect, useState } from 'react'
import ProfileLayout from './Profile'
import axios from 'axios';

const Address = () => {
    const [addresses, setAddresses] = useState([]);
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
  return (
    <ProfileLayout>
  <div>
            {/* List of Addresses */}
            {addresses.length > 0 ? (
                <div className="space-y-4">
                    {addresses.map((address) => (
                        <div
                            key={address._id}
                            className="p-4 border rounded-md shadow-sm bg-white"
                        >
                            <p className="font-semibold">{address.Name}</p>
                            <p>{address.streetAddress}</p>
                            <p>{`${address.city}, ${address.state}, ${address.zipCode}`}</p>
                            <p>Mobile: {address.mobile}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-600">No addresses found. Please add a new address.</p>
            )}

            {/* Add New Address Button */}
            <button
                className="mt-4 w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
                // onClick={onAddNewAddress}
            >
                Add New Address
            </button>
        </div>
    </ProfileLayout>
   
  )
}

export default Address