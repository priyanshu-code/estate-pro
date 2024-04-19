"use client"

import { getUserProperties, setUser } from "@/features/user/userSlice";
import { useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import PropertyCard from "../Card";
import { Button } from "../ui/button";
import { setDashActive } from "@/features/global/globalSlice";
import Link from "next/link";
import { deleteProperty } from "@/services/property";

export default function MyListingWrapper() {
    return (
        <div className='flex flex-col space-y-5'>
            <div className='space-y-2'>
                <h1 className='text-2xl font-semibold'>My Properties</h1>
                <h1 className='text-gray-500'>Manage your properties.</h1>
            </div>
            <MyListing />
        </div>
    )
}

function MyListing() {
    const { user, token, userProperties, userPropertiesLoading } = useSelector(store => store.User)
    const dispatch = useDispatch();

    useEffect(() => {
        if (user.userListings?.length > 0) {
            dispatch(getUserProperties())
        }
    }, [])

    const PropertyCards = useMemo(() => {
        return userProperties.map((item, i) => {
            const { _id } = item
            return (<div key={i} className="flex flex-col gap-1">
                <PropertyCard props={item} />
                <div className="grid grid-cols-2 gap-2">
                    <Link target="_blank" href={'account/' + _id} ><Button className="w-full">Edit</Button></Link>
                    <Button onClick={async () => {
                        const { error, msg, data } = await deleteProperty(_id, token)
                        if (error) {
                            console.log(error)
                        } else {
                            dispatch(setUser(data.user))
                        }
                    }}>Delete</Button>
                </div>
            </div>)
        });
    }, [userProperties, user]);

    if (user.userListings?.length === 0 || userProperties.length === 0) {
        return (
            <div className="flex flex-col gap-2 ">
                <h1>You don&apos;t any property listing.</h1>
                <Button className='max-w-20' onClick={() => dispatch(setDashActive('+ New Listing'))} >Create</Button>
            </div>
        )
    }
    if (userPropertiesLoading) {
        return <>
            {user.userListings.map(item => (
                <div key={item}>
                    Loading
                </div>
            ))}</>
    }

    return (
        <div className="w-full grid gap-6 justify-items-stretch grid-cols-1 sm:grid-cols-2 md:grid-cols-3  xl:grid-cols-4">
            {PropertyCards}
        </div>
    )
}

