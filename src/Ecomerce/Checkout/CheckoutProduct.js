import React from 'react';
import { useSelector } from 'react-redux';

const CheckoutProduct = () => {
  // Sample data (you can fetch this from an API or state management)

  const { selectedProduct, loading } = useSelector((state) => state.singleproduct);

  return (
   <div>
      {loading ? (
        <h2>Loading...</h2>
      ) : (
        <div className='mt-16'>
          <h2>{selectedProduct?.name}</h2>
          <p>{selectedProduct?.description}</p>
          <p>{selectedProduct?.price}</p>
        </div>
      )}
   </div>
  );
};

export default CheckoutProduct;