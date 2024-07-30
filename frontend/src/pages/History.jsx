import { getUserOrders } from "@/api/ApiRoutes";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import React, { useEffect, useState } from "react";

export default function History() {
  const { auth } = useAuth();
  const [historyItems, setHistoryItems] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await axios.get(getUserOrders, {
        headers: {
          Authorization: `Bearer ${auth.token.accessToken}`,
        },
      });
      if (response.data.success) {
        setHistoryItems(response.data.data);
      }
    })();
  }, []);
  return (
    <>
      {historyItems.map((item) => {
        return (
          <div class="border border-gray-300 rounded-lg p-4 mb-4 bg-white shadow-md">
            <div class="flex justify-between items-center mb-4">
              <div class="text-lg font-semibold">
                Order ID:{" "}
                <span class="font-normal">{item.razorpay_order_id}</span>
              </div>
              <div class="text-sm text-gray-600">
                Date:{" "}
                <span class="font-normal">
                  {item.createdAt.substring(0, 10)}
                </span>
              </div>
            </div>
            <div class="mb-4">
              <div class="font-semibold text-lg">
                Total: <span class="font-normal">${item.orderPrice}</span>
              </div>
            </div>
            <div class="space-y-4">
              {item.orderItems.map((orderItem) => {
                return (
                  <div class="flex items-center border-b border-gray-200 pb-4">
                    <img
                      src={`${
                        orderItem.productId.productImage
                          ? orderItem.productId.productImage
                          : "https://via.placeholder.com/60"
                      }`}
                      alt="Item Image"
                      class="w-16 h-16 object-cover mr-4 rounded-lg"
                    />
                    <div class="flex-grow">
                      <div class="font-semibold text-md">
                        {orderItem.productId.productName}
                      </div>
                      <div class="text-sm text-gray-600">
                        Price: ${orderItem.productId.price}
                      </div>
                      <div class="text-sm text-gray-600">
                        Quantity: {orderItem.quantity}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </>
  );
}
