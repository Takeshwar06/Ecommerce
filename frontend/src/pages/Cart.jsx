import { getCartItems, getKey, orderGenerate, paymentSuccess } from '@/api/ApiRoutes';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!auth?.token) {
      navigate("/auth");
      return;
    }
    (async () => {
      const response = await axios.get(getCartItems, {
        headers: {
          "Authorization": `Bearer ${auth.token.accessToken}`
        }
      });
      console.log(response);
      if (response.data.success) {
        setCartItems(response.data.data);
      }
    })();
  }, []);

  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => {
    return total + item.productId.price * item.quantity;
  }, 0);

  const paymentProcess = async (total) => {
    console.log('payment')
    if (total < 1) {
      return;
    }
    try {
      const { data: { key } } = await axios.get(getKey, {
        headers: {
          "Authorization": `Bearer ${auth.token.accessToken}`
        }
      });
      const { data: { order } } = await axios.post(orderGenerate, { amount: total }, {
        headers: {
          "Authorization": `Bearer ${auth.token.accessToken}`
        }
      }) //first generate order 


      // varification
      const options = {
        key: key, // Enter the Key ID generated from the Dashboard
        amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: "INR",
        name: "Smart-Canteen",
        description: "Test Transaction",
        image: 'https://res.cloudinary.com/do3fiil0d/image/upload/v1701536784/smartCanteenLogo_tbtynk.jpg',
        order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        handler: function (response) {
          console.log("response");
          handlePaymentSuccess(response);
        },
        prefill: {
          name: auth.user.userName,
          email: auth.user.email,
          contact: "9691382464"
        },
        notes: {
          "address": "Razorpay Corporate Office"
        },
        theme: {
          "color": "black"
        }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    }
    catch (err) {
      console.log(err);
    }
  }

  const handlePaymentSuccess = async (response) => {
    try {
      console.log('Payment successful:', response);
      // Call your backend function here to update the payment status
      const data = await axios.post(paymentSuccess, {
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_order_id: response.razorpay_order_id,
        razorpay_signature: response.razorpay_signature,orderItems:cartItems
      }, {
        headers: {
          "Authorization": `Bearer ${auth.token.accessToken}`
        }
      })
      console.log(data);
    } catch (error) {
      toast({
        variant: "destructive",
        description: error?.message || "Something went wrong !!",
        duration: 2000,
      })
    }
  };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {cartItems.map((item) => (
        <div key={item.productId?._id} className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <img
            className="w-full h-32 object-cover"
            src={item.productId.productImage || "https://via.placeholder.com/150"}
            alt="Product Image"
          />
          <div className="p-3 flex flex-col">
            <h2 className="text-sm font-semibold mb-1 truncate">{item.productId.productName}</h2>
            <p className="text-gray-600 text-xs mb-2">{`$${item.productId.price.toFixed(2)}`}</p>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold">Qnt: {item.quantity}</span>
              <Badge>In Stock</Badge>
            </div>
            <Button onClick={e => alert("now it is not working")} size="sm" className="w-full mt-auto">Delete</Button>
          </div>
        </div>
      ))}
      <div className="fixed bottom-3 right-3">
        <Button onClick={() => paymentProcess(totalPrice)} size="lg">{`Buy: $${totalPrice.toFixed(2)}`}</Button>
      </div>
    </div>
  );
}
