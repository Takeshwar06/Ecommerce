import React from 'react'
import Header from '../navigation/header'
import SideNav from '../navigation/sideNav'
import { Outlet } from 'react-router-dom'


export default function MainContainer() {
    return (
        <div className="flex flex-col h-screen">
            <div className="fixed top-0 left-0 w-full h-[70px] bg-gray-800 text-white z-10">
                <Header />
            </div>

            <div className="fixed top-[70px] left-0 w-[300px] h-[calc(100vh-70px)] bg-slate-50 z-10">
                <SideNav />
            </div>

            <div className="flex-1 ml-[300px] mt-[70px] px-5 py-2 overflow-y-auto">
                <Outlet />
            </div>
        </div>


    )
}
