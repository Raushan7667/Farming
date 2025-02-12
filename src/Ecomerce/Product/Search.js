import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'

const Search = () => {
    const [searchParams] = useSearchParams();
    const[product,setProduct]=useState(null)
    const query = searchParams.get("query");
    console.log("query for searching",query)
    const serchProduct=async ()=>{
      try {
        let response=await axios.get()
        
      } catch (error) {
        
      }

    }

    useEffect(()=>{
        serchProduct()
    },[])
  return (
    <div className='mt-16'>Search</div>
  )
}

export default Search