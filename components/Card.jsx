'use client'
import { useCallback, useState, useEffect } from "react";
import ImageSwiper from "./ImageSwiper";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/features/user/userSlice";
import { useToast } from "./ui/use-toast";
import { favoriteProperty, unFavoriteProperty } from "@/services/user";
import Link from "next/link";
import { useSession, signOut } from 'next-auth/react';
import { openAuthModal, setAuthPage } from "@/features/global/globalSlice";

function PropertyCard({ props, token }) {
    const { data: session, status } = useSession();
    const { user } = useSelector(store => store.User);
    const { _id, title, description, price, location, type, propertyImages, area } = props;
    const dispatch = useDispatch();
    const [favoriteLoading, setFavoriteLoading] = useState(false);

    const favorite = status === 'authenticated' && user && Object.keys(user).length > 0 ? user.favoriteProperties.includes(_id) : false;
    const { toast } = useToast();

    const handleFavorite = useCallback(async () => {
        setFavoriteLoading(true);
        const { error, msg, user } = favorite
            ? await unFavoriteProperty({ propertyId: _id, token })
            : await favoriteProperty({ propertyId: _id, token });

        if (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: msg,
            });
        } else {
            dispatch(setUser(user));
        }

        setFavoriteLoading(false);
    }, [favorite, _id, token]);

    const handleClick = () => {
        if (status !== 'authenticated') {
            dispatch(openAuthModal());
            dispatch(setAuthPage('login'));
        } else {
            handleFavorite();
        }
    };

    return (
        <div className="w-full flex flex-col justify-center gap-2">
            <ImageSwiper props={propertyImages} />
            <div className="flex flex-col">
                <div className="flex items-center justify-between gap-1">
                    <Link target="_blank" href={`property/${_id}`} className="font-semibold truncate capitalize">{title},{location}</Link>
                    <button onClick={handleClick} className="hover:scale-110 z-10">
                        {favoriteLoading ? <LoaderIcon /> : <BookmarkIcon checked={favorite} />}
                    </button>
                </div>
                <Link target="_blank" href={`property/${_id}`}>
                    <h1 className="truncate">{description}</h1>
                    <h1 className="font-light text-sm opacity-80">{type} - {area + " "}sqft. </h1>
                    <h1 className=""><span className="font-bold">₹{parseFloat(price).toLocaleString('en-IN')}</span></h1>
                </Link>
            </div>
        </div>
    );
}

export default PropertyCard;
const BookmarkIcon = ({ checked }) => {
    return <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={checked ? "black" : "none"}
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="feather feather-bookmark">
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
    </svg>;
};
const LoaderIcon = () => {
    return <svg className="animate-spin" width="20" height="20" viewBox="0 0 475 475" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M452.2 237C465.344 237 476.123 247.682 474.811 260.761C470.93 299.438 457.619 336.705 435.89 369.226C409.738 408.365 372.567 438.87 329.079 456.883C285.59 474.897 237.736 479.61 191.569 470.427C145.401 461.244 102.993 438.576 69.7086 405.291C36.4237 372.007 13.7564 329.599 4.5731 283.431C-4.61018 237.264 0.103015 189.41 18.1167 145.921C36.1303 102.433 66.6354 65.262 105.774 39.1102C138.295 17.3808 175.562 4.0695 214.239 0.188919C227.318 -1.12332 238 9.65562 238 22.8V22.8C238 35.9444 227.303 46.4467 214.261 48.0855C185.015 51.7605 156.908 62.1921 132.219 78.6882C100.908 99.6096 76.5043 129.346 62.0933 164.137C47.6824 198.928 43.9118 237.211 51.2585 274.145C58.6051 311.079 76.7389 345.005 103.367 371.633C129.995 398.261 163.921 416.395 200.855 423.742C237.789 431.088 276.072 427.318 310.863 412.907C345.654 398.496 375.39 374.092 396.312 342.781C412.808 318.092 423.24 289.985 426.915 260.739C428.553 247.697 439.056 237 452.2 237V237Z"
            fill="#000" />
    </svg>
}