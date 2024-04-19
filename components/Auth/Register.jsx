"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { registerUserSchema } from "@/schema/auth";
import { registerUser } from "@/services/auth";
import { useToast } from "@/components/ui/use-toast"
import { useSelector, useDispatch } from 'react-redux'
import { openAuthModal, setAuthPage } from "@/features/global/globalSlice";
import progress from '@/public/progress.svg'
import Image from "next/image";
import { useState } from "react";


export default function Register() {
    const [registerLoading, setRegisterLoading] = useState(false)
    const { authModalOpen, authPage } = useSelector(store => store.Global)
    const { toast } = useToast()
    const dispatch = useDispatch()
    // Register form
    const registerForm = useForm({
        resolver: zodResolver(registerUserSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirm: ""
        },
    });
    // Credentials Register
    async function onSubmit(values) {
        setRegisterLoading(true)
        const { name, email, password } = values
        const { error, msg } = await registerUser({ name, email, password })
        if (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: msg,
            })
        } else {
            if (!authModalOpen) {
                dispatch(openAuthModal())
            }
            dispatch(setAuthPage('login'))
            toast({
                title: "Success",
                description: msg,
            });
            registerForm.reset();
        }
        setRegisterLoading(false)
    }

    return (
        <div className="flex flex-col  items-center w-full max-w-[500px] space-y-7 px-6">
            <h1 className="min-w-full m-4 text-3xl font-bold xs:text-3xl sm:text-4xl">
                Register to Estate-Pro
            </h1>
            <Form {...registerForm}>
                <form
                    onSubmit={registerForm.handleSubmit(onSubmit)}
                    encType="multipart/form-data"
                    className="grid min-w-full grid-cols-1 gap-2"
                >
                    <FormField
                        control={registerForm.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name*</FormLabel>
                                <FormControl>
                                    <Input className="customInput" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={registerForm.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>E-mail*</FormLabel>
                                <FormControl>
                                    <Input className="customInput" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password*</FormLabel>
                                <FormControl>
                                    <Input
                                        className="customInput"
                                        type="password"
                                        placeholder="6+ Characters"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={registerForm.control}
                        name="confirm"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password*</FormLabel>
                                <FormControl>
                                    <Input
                                        className="customInput"
                                        type="password"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="min-w-full mt-2">
                        <Button type="submit" className="min-w-full py-6 text-xl ">
                            {registerLoading ? <Image className="animate-spin p-2" src={progress} height={35} width={35} alt="progress" /> : 'Register'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
