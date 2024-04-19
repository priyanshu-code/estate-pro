"use client"
import { use, useState } from "react"
import { useSelector } from "react-redux"

export default function Account() {
    const { user } = useSelector(store => store.User)
    const { email } = user
    return (
        <div className='flex flex-col space-y-5'>
            <div className='space-y-2'>
                <h1 className='text-2xl font-semibold'>Account</h1>
                <h1 className='text-gray-500'>View and manage your account.</h1>
            </div>
            <div className='flex flex-col space-y-3'>
                <div>
                    <h1 className='font-bold'>Name: {user?.name}</h1>
                    <h1>Email: {email}</h1>
                </div>
            </div>
        </div>)
}