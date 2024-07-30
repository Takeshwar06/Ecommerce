import React from 'react'
import HomeIcon from '@mui/icons-material/Home';
import { Separator } from '../ui/separator';
import menuItems from '@/config/menuItem';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function SideNav() {
  const location = useLocation();
  const {auth}=useAuth();

  function getModifiedFirstName(fullName) {
    const nameParts = fullName.split(' ');
  
    const firstName = nameParts[0];
  
    const modifiedFirstName = firstName.substring(1);
  
    return modifiedFirstName;
  }
  return (
    <div className='w-full flex flex-col items-center mt-14'>
      <div className="logo relative">
        <h1 className='text-lg'><span className='text-orange-500'>{auth.user.userName[0]}</span>{getModifiedFirstName(auth.user.userName)}</h1>
      </div>
      <div className="link-items mt-10 w-[70%] ">
        <ul className="items ">
          {
            menuItems.map((item) => {
             if(item.role.includes(auth.user.role)){
              return (
                <div key={item.href}>
                  <li key={item.href} className={`flex  mt-6  ${item.href === location.pathname.substring(1) ? "text-orange-500" : ""}`}>
                    {item.icon}
                    <Link to={item.href}>
                      <p className="ml-2 font-medium cursor-pointer">{item.title}</p>
                    </Link>
                  </li>
                  <Separator className='mt-2' />
                </div>
              )
             }
            })
          }
        </ul>
      </div>
    </div>
  )
}
