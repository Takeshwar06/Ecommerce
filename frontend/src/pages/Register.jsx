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
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Label } from '../components/ui/label'
import { Input } from '../components/ui/input'
import GitHubIcon from '@mui/icons-material/GitHub';
import GoogleIcon from '@mui/icons-material/Google';
import { useToast } from '@/components/ui/use-toast'
import axios from 'axios'
import { userRegister } from '@/api/ApiRoutes'
import { Link } from 'react-router-dom';
export default function Register() {
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const register = async () => {
        if (
            [email, password, userName].some((field) => field?.trim() === "")
        ) {
            toast({
                variant: "destructive",
                description: "All field are required !!",
                duration: 1000,
            })
        } else {
            try {
                const response = await axios.post(userRegister, {
                    userName, email, password
                });
                if (response.data.success) {
                    setIsOpen(true);
                }else{
                    toast({
                        variant: "destructive",
                        description: "Something went wrong !!",
                        duration: 1000,
                    })
                }
            } catch (error) {
                toast({
                    variant: "destructive",
                    description: "Something went wrong !!",
                    duration: 1000,
                })
            }
        }
    }
    return (
        <>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Success !!!</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                        <p>Acount has been successfully created please login your acount</p>
                    </div>
                    <DialogFooter>
                        <Link to={"/auth/login"}>
                            <Button type="button" onClick={() => setIsOpen(false)}>
                                Login
                            </Button>
                        </Link>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <div className='w-[80%] border-none mt-5'>
                <CardHeader>
                    <CardTitle className='w-full flex justify-center'>
                        <h1 className='text-center text-lg font-bold'>Create Your Acount</h1>
                    </CardTitle>

                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="space-y-1">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" value={userName} onChange={e => setUserName(e.target.value)} placeholder="Enter your name" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your Email" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" value={password} onChange={e => setPassword(e.target.value)} type="password" placeholder="Enter password" />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="c-password">Confirm Password</Label>
                        <Input id="c-password" type="password" placeholder="Confirm password" />
                    </div>
                </CardContent>
                <CardFooter className='flex-col'>
                    <span className='mb-5 text-sm'>OR CONTINUE WITH</span>
                    <div className='w-full mb-5 flex justify-between'>
                        <Button className="w-1/2 mr-1 " variant="outline"><GitHubIcon className="mr-2 h-4 w-4" /> GitHub</Button>
                        <Button className="w-1/2 ml-1" variant="outline"><GoogleIcon className="mr-2 h-4 w-4" />Google</Button>
                    </div>
                    <Button onClick={register} className="w-full">Create</Button>
                </CardFooter>
            </div>
        </>
    )
}
