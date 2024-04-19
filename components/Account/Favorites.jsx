"use client"

import { getUserFavorites } from "@/features/user/userSlice";
import Link from "next/link";
import { useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import PropertyCard from "../Card";

export default function FavoritesWrapper() {
    return (
        <div className='flex flex-col space-y-5'>
            <div className='space-y-2'>
                <h1 className='text-2xl font-semibold'>Favorites</h1>
                <h1 className='text-gray-500'>Your favourite properties.</h1>
            </div>
            <Favorites />
        </div>
    )
}

function Favorites() {
    const { user, favorites, favoritesLoading } = useSelector(store => store.User)
    const dispatch = useDispatch();

    useEffect(() => {
        if (user.favoriteProperties?.length > 0) {
            dispatch(getUserFavorites())
        }
    }, [])

    const PropertyCards = useMemo(() => {
        return favorites.map((item, i) => {
            return <PropertyCard key={i} props={item} />
        });
    }, [favorites]);

    if (user.favoriteProperties?.length === 0 || favorites.length == 0) {
        return (
            <div className="flex flex-col ">
                <h1>You don&apos;t any favorite properties.</h1>
                <Link className="hover:underline" href={'/'}  >Explore Here</Link>
            </div>
        )
    }
    if (favoritesLoading) {
        return <>
            {user.favoriteProperties.map(item => (
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

