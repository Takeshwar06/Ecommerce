import React from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import "./styles.css";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";
import { logout } from "@/api/ApiRoutes";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const { auth, setAuth, cartItemsCount } = useAuth();
  const navigate = useNavigate();

  const logoutUser = async () => {
    console.log(auth);
    try {
      await axios.post(
        logout,
        {},
        {
          headers: {
            Authorization: `Bearer ${auth.token.accessToken}`,
          },
        }
      );
      localStorage.removeItem("token");
      navigate("/auth");
      setAuth({
        token: null,
        user: null,
      });
    } catch (error) {}
  };
  return (
    <div className="w-full h-full justify-between  px-4 flex items-center ">
      <div className="left-side ml-10">
        <img width={"140px"} src="/ecommerce.png" alt="" />
      </div>
      <div className="right-side flex mr-10 items-center">
        <div className="cart flex items-center flex-col mr-5 cursor-pointer">
          <ShoppingCartIcon className="" />
          <p className="text-sm">
            Cart
            <span className="font-bold ml-1 text-red-500">
              {cartItemsCount}
            </span>
          </p>
        </div>
        <div
          onClick={logoutUser}
          className="person flex items-center flex-col cursor-pointer "
        >
          <AccountCircleIcon />
          <p className="text-sm">Logout</p>
        </div>
      </div>
    </div>
  );
}
