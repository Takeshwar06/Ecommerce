import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import React, { useState } from 'react'
import { Button } from '../components/ui/button'
import {
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from '../components/ui/card'
import { Label } from '../components/ui/label'
import { Input } from '../components/ui/input'
import axios from 'axios';
import { addNewProduct } from '@/api/ApiRoutes';

export default function AddProduct() {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [productImage, setProductImage] = useState('');
  const [isLoading,setIsLoading]=useState(false);
  const { auth } = useAuth();
  const { toast } = useToast();


  const handleAddProduct = async () => {
    if (Number(price) === NaN || Number(stockQuantity === NaN)) { return };
    if (
      [productName, price, stockQuantity, description].some((field) => field?.trim() === "") ||
      !productImage
    ) {
      toast({
        variant: "destructive",
        description: "All field are required !!",
        duration: 1000,
      })
    } else {
      try {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('productName', productName);
        formData.append('description', description);
        formData.append('price', stockQuantity);
        formData.append('productImage', productImage);
        formData.append('stockQuantity', stockQuantity);

        const response = await axios.post(addNewProduct, formData,{
          headers: {
            'Authorization': `Bearer ${auth.token.accessToken}`,
            'Content-Type': 'multipart/form-data' 
          },
        });
        if(response.data.success){
          toast({
              description:response.data?.message || "Product created suceesuflly !!",
              duration:2000,
          })
         setDescription("");setPrice("");setProductImage("");
         setStockQuantity("");setProductName("");
      }
      } catch (error) {
        toast({
          variant: "destructive",
          description: error?.message || "Something went wrong !!",
          duration: 1000,
        })
      }finally{
        setIsLoading(false);
      }
    }

  }
  return (
    <div className='w-full border-none mt-5'>
      <CardHeader>
        <CardTitle className='w-full flex justify-center'>
          <h1 className='text-center text-lg font-bold'>Add New Product Item</h1>
        </CardTitle>

      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Label htmlFor="name">Product Name</Label>
          <Input id="name" value={productName} onChange={e => setProductName(e.target.value)} placeholder="Enter your name" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="email">Description</Label>
          <Input id="email" value={description} onChange={e => setDescription(e.target.value)} placeholder="Enter your Email" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="password">Price</Label>
          <Input id="password" value={price} onChange={e => setPrice(e.target.value)} type="password" placeholder="Enter password" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="c-password">Stock Quantity</Label>
          <Input id="c-password" value={stockQuantity} onChange={e => setStockQuantity(e.target.value)} type="password" placeholder="Confirm password" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="picture">Pruduct Image</Label>
          <Input id="picture" onChange={e => setProductImage(e.target.files[0])} type="file" />
        </div>
      </CardContent>
      <CardFooter className='flex-col'>

        <Button onClick={handleAddProduct} className="w-full">{isLoading?"Uploading...":"Create"}</Button>
      </CardFooter>
    </div>
  )
}
