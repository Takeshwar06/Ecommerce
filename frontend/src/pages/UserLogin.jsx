import React, { useState } from 'react'
import { Button } from '../components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter
} from '../components/ui/card'
import { Label } from '../components/ui/label'
import { Input } from '../components/ui/input'
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
import { useToast } from '@/components/ui/use-toast'
import axios from 'axios'
import { userLogin } from '@/api/ApiRoutes'
import { duration } from '@mui/material'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'


export default function UserLogin() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { toast } = useToast();
    const {auth,setAuth} = useAuth();
    const navigate = useNavigate();

    const login = async () => {
        if (
            [email, password].some((field) => field?.trim() === "")
        ) {
            toast({
                variant: "destructive",
                description: "All field are required !!",
                duration: 1000,
            })
        } else {
          try {
            const response = await axios.post(userLogin,{
                email,password
            })
            if(response.data.success){
                setAuth({
                    token:{
                        accessToken:response.data.data.accessToken,
                        refreshToken:response.data.data.refreshToken
                    },
                    user:response.data.data.user
                })
                toast({
                    description:response.data?.message || "logged in sucessfully !!",
                    duration:2000,
                })
             navigate("/");
            }
          } catch (error) {
            toast({
                variant: "destructive",
                description: error?.message || "Invalid Creadicial !!",
                duration: 1000,
            })
          }
        }
    }
    return (
        <div className='w-[80%] border-none mt-5'>
            <CardHeader>
                <CardTitle className='w-full flex justify-center'>
                    <h1 className='text-center text-lg font-bold'>Login Your Acount</h1>
                </CardTitle>

            </CardHeader>
            <CardContent className="space-y-2">

                <div className="space-y-1">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your Email" />
                </div>
                <div className="space-y-1">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" />
                </div>

            </CardContent>
            <CardFooter className='flex-col'>
                <span className='mb-5 text-sm'>OR CONTINUE WITH</span>
                <div className='w-full mb-5 flex justify-between'>
                    <Button className="w-1/2 mr-1 " variant="outline"><GitHubIcon className="mr-2 h-4 w-4" /> GitHub</Button>
                    <Button className="w-1/2 ml-1" variant="outline"><GoogleIcon className="mr-2 h-4 w-4" />Google</Button>
                </div>
                <Button onClick={login} className="w-full">Create</Button>
            </CardFooter>
        </div>
    )
}
