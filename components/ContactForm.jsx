'use client'

import ContactFormSchema from '@/schema/contact'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { zodResolver } from '@hookform/resolvers/zod';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

export default function ContactForm() {
    const [contactLoading, setContactLoading] = useState(false)
    const [messageSent, setMessageSent] = useState(false)
    const form = useForm({
        resolver: zodResolver(ContactFormSchema),
        defaultValues: {
            name: '',
            email: '',
            query: '',
            offerPrice: null,
        },
    });
    const onSubmit = async (values) => {
        setContactLoading(true)
        const fakeWaitTime = () => new Promise((resolve, reject) => {
            setTimeout(() => {
                setMessageSent(true)
                resolve()
            }, 2000)
        })
        await fakeWaitTime()
        setContactLoading(false)
    }

    if (messageSent) {
        return (
            <div className="flex flex-col w-full sm:max-w-3xl space-y-4 pb-3">
                <div className='flex flex-col border gap-4 p-4 sm:p-6 rounded-2xl font-semibold text-xl'>
                    We have received your query!
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col w-full sm:max-w-3xl space-y-4 pb-3">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    {/* Basic Details */}
                    <div className='flex flex-col border gap-2 p-4 sm:p-6 rounded-2xl'>
                        <h1 className='text-2xl font-bold'>
                            Contact Owner
                        </h1>
                        <div className='grid sm:grid-cols-2 gap-2 sm:gap-4'>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='font-bold'>Name*</FormLabel>
                                        <FormControl>
                                            <Input className="customInput" placeholder="Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='font-bold'>Email*</FormLabel>
                                        <FormControl>
                                            <Input className="customInput" placeholder="Email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        {/* Property Description */}
                        <FormField
                            control={form.control}
                            name="query"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='font-bold'>Query *</FormLabel>
                                    <FormControl>
                                        <Textarea className="customInput min-h-[6rem]" placeholder="Write your queries about the property..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="offerPrice"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className='font-bold'>Offer Price</FormLabel>
                                    <FormControl>
                                        <FormControl
                                            onChange={(e) => {
                                                const newValue = Math.max(Number(e.target.value), 0);
                                                field.onChange(Number(newValue));
                                            }}
                                        >
                                            <Input
                                                type="number" className="customInput" placeholder="Make them an offer" {...field} />
                                        </FormControl>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="min-w-full flex justify-end sm:justify-center mt-4">
                            <Button type="submit" className='w-[79.16px]' disabled={contactLoading}>
                                {contactLoading ? <LoaderIcon /> : 'Submit'}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>)
}

const LoaderIcon = () => {
    return <svg className="animate-spin" width="20" height="20" viewBox="0 0 475 475" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M452.2 237C465.344 237 476.123 247.682 474.811 260.761C470.93 299.438 457.619 336.705 435.89 369.226C409.738 408.365 372.567 438.87 329.079 456.883C285.59 474.897 237.736 479.61 191.569 470.427C145.401 461.244 102.993 438.576 69.7086 405.291C36.4237 372.007 13.7564 329.599 4.5731 283.431C-4.61018 237.264 0.103015 189.41 18.1167 145.921C36.1303 102.433 66.6354 65.262 105.774 39.1102C138.295 17.3808 175.562 4.0695 214.239 0.188919C227.318 -1.12332 238 9.65562 238 22.8V22.8C238 35.9444 227.303 46.4467 214.261 48.0855C185.015 51.7605 156.908 62.1921 132.219 78.6882C100.908 99.6096 76.5043 129.346 62.0933 164.137C47.6824 198.928 43.9118 237.211 51.2585 274.145C58.6051 311.079 76.7389 345.005 103.367 371.633C129.995 398.261 163.921 416.395 200.855 423.742C237.789 431.088 276.072 427.318 310.863 412.907C345.654 398.496 375.39 374.092 396.312 342.781C412.808 318.092 423.24 289.985 426.915 260.739C428.553 247.697 439.056 237 452.2 237V237Z"
            fill="#fff" />
    </svg>
}