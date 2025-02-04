import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import ProductCard from '../Product/ProductCard';
import Loading from '../../Component/Common/Loading';

const ProductPage = () => {
    const { id } = useParams();
    const [secondLevecategory,setSecondLevecategory]=useState([]);
   const[product,setProduct]=useState([]);
   const[loading,setLoading]=useState(false);
   const [secondLevecategorydata,setSecondLevecategorydata]=useState(false);

    const fetchCategory = async()=>{
        try {
            console.log("id durin setSecondLevecategory",id)
            setLoading(true);
          
            let response = await axios.post("http://localhost:4000/api/v1/products/getonecategory", {
                parentCategoryId: id
            });

            setSecondLevecategory(response?.data?.data?.subcategories)
          
            // console.log("response of second level category",response?.data?.data?.subcategories)
            setLoading(false);
           
            
        } catch (error) {
            console.error("Error in fetching second level category",error)

            
        }

    }



useEffect(()=>{
    fetchCategory();

},[])
const allProducts = secondLevecategory.flatMap(category => category.product);
const handleClick = async(id)=>{
  try {
    setSecondLevecategorydata(false)
    let response=await axios.post("http://localhost:4000/api/v1/products/particularcreatecategory",{
      categoryId:id
    })
    console.log("response ",response?.data?.data?.product)
    setProduct(response?.data?.data?.product)
 setSecondLevecategorydata(true)
    
  } catch (error) {
    
  }


}

   
  return (
    <>
    {
      loading ? (<Loading text={"Fetching Product Data"}/>):( <>
        <nav className="w-full bg-[#cefad0] shadow-sm mt-16">
        {/* Navigation Section */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-4 overflow-x-auto py-4 scrollbar-hide justify-evenly">
            {secondLevecategory.map((category, index) => (
              <div
                key={index}
                className="flex-shrink-0 text-center cursor-pointer group"
             onClick={() => handleClick(category._id)}
              >
                <div
                  className={`rounded-full p-4 mb-2 ${category.bgColor} group-hover:shadow-md transition-shadow duration-200`}
                >
                  <img
                    src={category.image}
                    alt={category.name || "Category"}
                    className="w-16 h-16 object-cover rounded-full"
                  />
                </div>

                <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Product Section */}
     {
      secondLevecategorydata ?(<div className="max-w-7xl mx-auto mb-4 mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{
        product.map(prop=>(<ProductCard product={prop}/>))
      }</div>):( <div className="max-w-7xl mx-auto mb-4 mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {allProducts.map(prod => (
        <ProductCard key={prod._id} product={prod} />
      ))}
    </div>)

     }
      </>)
    }


      
    </>
  )
}

export default ProductPage