import { getCurrentUser } from '@/api/ApiRoutes'
import AuthContainer from '@/components/layouts/AuthContainer'
import MainContainer from '@/components/layouts/MainContainer'
import ProtectedRoute from '@/components/ProtectedRoute'
import menuItems from '@/config/menuItem'
import { useAuth } from '@/hooks/useAuth'

import AdminLogin from '@/pages/AdminLogin'
import Home from '@/pages/Home'
import Register from '@/pages/Register'
import UserLogin from '@/pages/UserLogin'
import axios from 'axios'
import React, { useEffect } from 'react'
import { Route, Routes, useNavigate } from 'react-router-dom'

export default function AppRoutes() {
    const { auth, setAuth } = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if(!auth?.token){navigate("/auth");return;}
        ; (async () => {
            const response = await axios.get(getCurrentUser, {
                headers: {
                    "Authorization": `Bearer ${auth.token.accessToken}`
                }
            });
            if (response.data.success) {
                setAuth({
                    ...auth,
                    user: response.data.data
                })
            }
            // here you can refresh token if access token expire
        })();
    }, [])
    return (
        <Routes>
            <Route path="/auth" element={<AuthContainer />}>
                <Route
                    path="login"
                    element={<UserLogin />}
                />
                <Route
                    path="admin-login"
                    element={<AdminLogin />}
                />
                <Route
                    path="register"
                    element={<Register />}
                />
            </Route>
            <Route path="/" element={
                <ProtectedRoute><MainContainer /></ProtectedRoute>
            }>
                {
                    menuItems.map((item) => {
                        if (item.role.includes(auth?.user?.role)) {
                            return (
                                    <Route key={item.href} path={item.href} element={item.component} />
                            )
                        } else {
                            return null
                        }
                    })
                }
            </Route>
        </Routes>
    )
}
