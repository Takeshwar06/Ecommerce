import { getAllProducts } from '@/api/ApiRoutes';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import React, { useEffect, useState } from 'react'

export default function UpdateProduct() {
   const [products,setProducts]=useState([]);
   const {auth}=useAuth();
   useEffect(()=>{
    ;(async()=>{
      const response = await axios.get(getAllProducts,{
        headers:{
          'Authorization': `Bearer ${auth.token.accessToken}`,
        }
      });
      console.log(response);
      if(response.data.success){
         setProducts(response.data.data);
      }
    })();
   },[])
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

    {
      products.map((product) => {
        return (
          <div key={product?._id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
            <img className="w-full h-32 object-cover" src={`${product.productImage?product.productImage:"https://via.placeholder.com/150"}`} alt="Product Image" />
            <div className="p-3 flex flex-col h-40">
              <h2 className="text-sm font-semibold mb-1 truncate">{product.productName}</h2>
              <p className="text-gray-600 text-xs flex-grow mb-2 ">{product.description}</p>
              <div className="flex items-center justify-between text-xs mt-auto">
                <span className="font-semibold">${product.price}</span>
                <Badge>In Stock</Badge>
              </div>
              <p className="text-gray-600 text-xs">Qty: {product.stockQuantity}</p>
            </div>
             <div className='w-full flex justify-between p-2'>
             <Button size='sm'  variant="outline" className='w-[45%]'>Update</Button>
             <Button size='sm' className='w-[45%]'>Delete</Button>
             </div>
          </div>
        )
      })
    }
  </div>
  )
}
