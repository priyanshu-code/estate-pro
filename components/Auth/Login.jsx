"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { signIn } from "next-auth/react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { loginSchema } from "@/schema/auth";
import { useToast } from "../ui/use-toast";
import { useState } from "react";
import progress from '@/public/progress.svg'
import Image from "next/image";
import { useDispatch } from 'react-redux'
import { closeAuthModal } from "@/features/global/globalSlice";

export default function Login() {
    const [loginLoading, setLoginLoading] = useState(false)
    const { toast } = useToast()
    const dispatch = useDispatch()
    // Login form
    const loginForm = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    // Credentials Login
    async function onSubmit(values) {
        setLoginLoading(true)
        const result = await signIn("credentials", {
            email: values.email,
            password: values.password,
            redirect: false,
        });
        if (result.error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: result.error,
            });
        } else {
            toast({
                title: "Success",
                description: "Welcome!",
            });
            loginForm.reset()
            dispatch(closeAuthModal())
        }
        setLoginLoading(false)
    }
    return (
        <div className="flex flex-col  items-center w-full max-w-[500px] space-y-7 px-6">
            <h1 className="min-w-full m-4 text-3xl font-bold xs:text-3xl sm:text-4xl">
                Sign in to Estate-Pro
            </h1>
            <Form {...loginForm}>
                <form
                    onSubmit={loginForm.handleSubmit(onSubmit)}
                    encType="multipart/form-data"
                    className="grid min-w-full grid-cols-1 gap-2"
                >
                    <FormField
                        control={loginForm.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem className="min-w-full">
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input className="customInput" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem className="min-w-full">
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input type="password" className="customInput" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="min-w-full mt-2 ">
                        <Button type="submit" className="min-w-full py-6 text-xl ">
                            {loginLoading ? <Image className="animate-spin p-2" src={progress} height={35} width={35} alt="progress" /> : 'Login'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
