import { useEffect } from 'react'
import { useState } from 'react'
import { createContext } from 'react'

const AuthContext = createContext(undefined)

export const AuthProvider = ({ children }) => {
    const [cartItemsCount,setCartItemsCount]=useState(0); // need to create another context for this 
    const inititalAuth = JSON.parse(localStorage.getItem('auth')) || {
        token: null,
        user: null,
    }
    const [auth, setAuth] = useState(inititalAuth)

    useEffect(() => {
        if (auth) {
            localStorage.setItem('auth', JSON.stringify(auth))
            if(auth.user){
               setCartItemsCount(auth.user.cart.length);
            }
        }
    }, [auth])

    return (
        <AuthContext.Provider value={{ auth, setAuth , cartItemsCount,setCartItemsCount }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext
