import React from 'react'
import { sections } from '../../Data/AgriSpecialsData'
import FourProduct from '../component/FourProduct';
import { SumerSpci } from '../../Data/SumerSpecial';




const AgriSpecials = () => {
    return (
        
        <div className="mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* First Section */}
 <FourProduct sumerSpci={SumerSpci}/>

  {/* Second Section */}
  <FourProduct sumerSpci={SumerSpci}/>

  {/* Third Section */}
  <div className="bg-white p-4">
    <a href="/some product" className="block">
      {/* Display Product Image */}
      <img
        src="https://www.organicdews.com/assets/images/pro3/OD-AZOP-0011.png"
        alt="product"
        className="w-full h-full object-cover"
      />
    </a>
  </div>
</div>

    );
};


export default AgriSpecials