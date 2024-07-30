import React, { useState } from 'react'
import { Button } from '../components/ui/button'
import { Card,
     CardContent,
     CardDescription, 
     CardHeader, 
     CardTitle,
     CardFooter } from '../components/ui/card'
import { Label } from '../components/ui/label'
import { Input } from '../components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import axios from 'axios'
import { adminLogin } from '@/api/ApiRoutes'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export default function AdminLogin() {
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [secrete,setSecrete]=useState("");
    const {toast}=useToast();
    const {setAuth}=useAuth();
    const navigate = useNavigate();

    const login = async()=>{
          console.log(email,password,secrete);
          if (
            [email, password,secrete].some((field) => field?.trim() === "")
        ) {
            toast({
                variant: "destructive",
                description: "All field are required !!",
                duration: 1000,
            })
        } else{
            try {
                const response = await axios.post(adminLogin,{
                    email,password,adminSecret:secrete
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
                        description:response.data?.message || "admin logged in sucessfully !!",
                        duration:2000,
                    })
                 navigate("/");
                }
            } catch (error) {
                toast({
                    variant: "destructive",
                    description: error?.message || "Invalid Credincial !!",
                    duration: 1000,
                })
            }
        }
    }
  return (
    <div className='w-[80%] border-none mt-5'>
    <CardHeader>
        <CardTitle className='w-full flex justify-center'>
            <h1 className='text-center text-lg font-bold'>Login With Your Admin Secrete</h1>
        </CardTitle>
        
    </CardHeader>
    <CardContent className="space-y-2">
        <div className="space-y-1">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" value={email} onChange={e=>setEmail(e.target.value) }placeholder="Enter your Email"/>
        </div>
        <div className="space-y-1">
            <Label htmlFor="password">Password</Label>
            <Input id="password" value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="Enter password" />
        </div>

        <div className="space-y-1">
            <Label htmlFor="c-password">Admin Secrete</Label>
            <Input id="c-password" value={secrete} onChange={e=>setSecrete(e.target.value)} type="password" placeholder="Enter your Secrete"/>
        </div>
        
    </CardContent>
    <CardFooter className='flex-col'>
        <Button onClick={login} className="w-full">Create</Button>
    </CardFooter>
</div>
  )
}
