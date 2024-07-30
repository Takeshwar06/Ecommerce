import {
  deleteProduct,
  getAllProducts,
  updateProductDetails,
} from "@/api/ApiRoutes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export default function UpdateProduct() {
  const [products, setProducts] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [productDetails, setProductDetails] = useState({
    productName: "",
    price: "",
    description: "",
    stockQuantity: "",
    productId: "",
  });

  const { toast } = useToast();

  const { auth } = useAuth();
  useEffect(() => {
    (async () => {
      const response = await axios.get(getAllProducts, {
        headers: {
          Authorization: `Bearer ${auth.token.accessToken}`,
        },
      });
      console.log(response);
      if (response.data.success) {
        setProducts(response.data.data);
      }
    })();
  }, []);

  const handleUpdate = (product) => {
    setProductDetails({
      productName: product.productName,
      price: product.price,
      description: product.description,
      stockQuantity: product.stockQuantity,
      productId: product._id,
    });
    setIsOpen(true);
  };
  const handleDetailsChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setProductDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleUpdateSubmit = async () => {
    try {
      if (productDetails.productId === "") {
        toast({
          description: "please Re-write deatails",
          duration: 2000,
        });
        return;
      }
      const response = await axios.patch(
        `${updateProductDetails}/${productDetails.productId}`,
        {
          productName: productDetails.productName,
          price: productDetails.price,
          description: productDetails.description,
          stockQuantity: productDetails.stockQuantity,
        },
        {
          headers: {
            Authorization: `Bearer ${auth.token.accessToken}`,
          },
        }
      );
      console.log(response);
      if (response.data.success) {
        setIsOpen(false);
        toast({
          description:
            response.data?.message || "Product details updated succefully !",
          duration: 2000,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: error?.message || "Something went wrong !!",
        duration: 2000,
      });
    }
  };

  const handleDeleteProduct = async (product, index) => {
    try {
      const response = await axios.delete(`${deleteProduct}/${product._id}`, {
        headers: {
          Authorization: `Bearer ${auth.token.accessToken}`,
        },
      });
      if (response.data.success) {
        const data = products;
        data.splice(index, 1);
        setProducts(data);
        toast({
          description:
            response.data?.message || "Product deleted successfully !",
          duration: 2000,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        description: error?.message || "Something went wrong !!",
        duration: 2000,
      });
    }
  };
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => {
          return (
            <div
              key={product?._id}
              className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
            >
              <img
                className="w-full h-32 object-cover"
                src={`${
                  product.productImage
                    ? product.productImage
                    : "https://via.placeholder.com/150"
                }`}
                alt="Product Image"
              />
              <div className="p-3 flex flex-col h-40">
                <h2 className="text-sm font-semibold mb-1 truncate">
                  {product.productName}
                </h2>
                <p className="text-gray-600 text-xs flex-grow mb-2 ">
                  {product.description}
                </p>
                <div className="flex items-center justify-between text-xs mt-auto">
                  <span className="font-semibold">${product.price}</span>
                  <Badge>In Stock</Badge>
                </div>
                <p className="text-gray-600 text-xs">
                  Qty: {product.stockQuantity}
                </p>
              </div>
              <div className="w-full flex justify-between p-2">
                <Button
                  onClick={() => handleUpdate(product)}
                  size="sm"
                  variant="outline"
                  className="w-[45%]"
                >
                  Update
                </Button>
                <Button
                  onClick={() => handleDeleteProduct(product)}
                  size="sm"
                  className="w-[45%]"
                >
                  Delete
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Product Details</DialogTitle>
            <DialogDescription>
              Make changes to here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                name="productName"
                value={productDetails.productName}
                defaultValue="Pedro Duarte"
                onChange={handleDetailsChange}
                className="col-span-3"
                placeholder="product name"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                name="description"
                value={productDetails.description}
                onChange={handleDetailsChange}
                defaultValue="@peduarte"
                className="col-span-3"
                placeholder="description"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                name="price"
                defaultValue="@peduarte"
                value={productDetails.price}
                onChange={handleDetailsChange}
                className="col-span-3"
                placeholder="product price"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                name="stockQuantity"
                defaultValue="@peduarte"
                value={productDetails.stockQuantity}
                onChange={handleDetailsChange}
                className="col-span-3"
                placeholder="stock quantity"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdateSubmit} type="submit">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
