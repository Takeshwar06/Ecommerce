import AuthContext from '@/context/authContext'
import { useContext } from 'react'
import { createContext } from 'react'

export const useAuth = () => {
    const consumer = useContext(AuthContext)

    if (!consumer) {
        throw new Error('useAuth must be used within an AuthProvider')
    }

    return consumer
}
