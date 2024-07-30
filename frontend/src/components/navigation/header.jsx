import React from 'react'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import "./styles.css"
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
    const {auth,cartItemsCount}=useAuth();
    return (
        <div className='w-full h-full justify-between  px-4 flex items-center '>
            <div className='left-side ml-10'>
                <img  width={"140px"} src="/ecommerce.png" alt="" />
            </div>
            <div className='right-side flex mr-10 items-center'>
                <div className='cart flex items-center flex-col mr-5 cursor-pointer'>
                    <ShoppingCartIcon className='' />
                    <p className='text-sm'>Cart<span className='font-bold ml-1 text-red-500'>{cartItemsCount}</span></p>
                </div>
                <div className="person flex items-center flex-col cursor-pointer ">
                    <AccountCircleIcon />
                    <p className='text-sm'>{auth.user.userName.split(" ")[0]}</p>
                </div>

            </div>
        </div>
    )
}

