'use client'
import cross from '@/public/cross.svg'
import searchIcon from '@/public/search.svg'
import slider from '@/public/sliders.svg'
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import Modal from "@/components/Modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from 'react-redux';
import { setSearchFilters, setSearchLoading, setSearchMessages, setSearchProperties, setSearchQuery } from '@/features/global/globalSlice';
import Selector from '../Account/Selector';
import propertyTypes from '@/public/propertyTypes';
import locations from '@/public/locations';
import { getFilteredProperties } from '@/services/property';

export default function Search() {
    const dispatch = useDispatch()
    const { searchQuery, searchFilters, searchLoading } = useSelector(store => store.Global)
    const [filterModalOpen, setFilterModalOpen] = useState(false)

    const closeFilterModal = () => {
        setFilterModalOpen(false)
    }

    const [minPrice, setMinPrice] = useState(100000);
    const [maxPrice, setMaxPrice] = useState(100000000);


    const handleSearchQuery = (e) => {
        dispatch(setSearchQuery(e.target.value))
    }
    const handleKeyPress = (e) => {

        if (searchQuery && e.key === 'Enter')
            handleSearch()
    }

    const handleMinPriceChange = useCallback((newValue) => {
        if (newValue >= 100000) {
            setMinPrice(newValue)
        };
    }, []);

    const handleMaxPriceChange = useCallback((newValue) => {
        if (newValue >= 100000) {
            setMaxPrice(newValue)
        };
    }, []);

    // Update price
    useEffect(() => {
        dispatch(setSearchFilters({ ...searchFilters, minPrice, maxPrice }))
    }, [minPrice, maxPrice])

    const handleSearch = async () => {
        dispatch(setSearchLoading(true))
        const { error, msg, data } = await getFilteredProperties({ limit: 12, searchQuery, searchFilters })
        const { location, type } = searchFilters
        const { properties, queryResults } = data
        dispatch(setSearchProperties(properties))
        let message = ''
        if (queryResults.queryGiven) {
            if (queryResults.resultsFound) {
                // Results found for query
                message = `Showing results for: ${searchQuery}`;
            } else {
                // Results not found for query
                message = `No results found for: ${searchQuery}`;
            }
        } else {
            if (queryResults.resultsFound) {
                // Results found for filters
                if (location || type)
                    message = `Showing results for: ${location ? "Location: " + location : ''} ${type ? "and Type: " + type : ' -'}`;
                else
                    message = ''
            } else {
                // Results not found for filters
                message = `No results found for ${location ? "Location: " + location : ''} ${type ? "and Type: " + type : ' -'}`;
            }
        }
        dispatch(setSearchMessages(message))
        dispatch(setSearchLoading(false))
        closeFilterModal()
    }
    return (
        <div className="flex w-full items-center justify-center gap-2 sm:gap-6">
            {/* SeachBox */}
            <div className="flex items-center justify-start w-full max-w-96 gap-2 px-3 p-2  bg-gray-300 rounded-full overflow-hidden">
                <Image className="p-2" src={searchIcon} height={35} width={35} alt="search" />
                <input
                    value={searchQuery}
                    onChange={handleSearchQuery}
                    onKeyDown={handleKeyPress}
                    className='outline-none bg-transparent' placeholder="Search"></input>
            </div>
            {/* Filter Button */}
            <button onClick={() => setFilterModalOpen(true)} className="flex items-center justify-center gap-2 rounded-2xl h-14 aspect-square sm:aspect-auto p-1 sm:p-2 sm:px-3 border hover:bg-gray-100 hover:outline outline-1 transition-colors duration-300 ">
                <Image src={slider} height={20} width={20} alt="slider" />
                <h1 className="hidden sm:block">Filters</h1>
            </button>
            {/* Filter Modal */}
            <Modal className='mb-[60%] sm:mb-0 flex flex-col items-center justify-between bg-white rounded-2xl p-6 relative' isOpen={filterModalOpen} closeModal={closeFilterModal} >
                {!searchLoading && <button className='absolute top-4 right-4 rounded-full hover:bg-gray-100' onClick={closeFilterModal}>
                    <Image className='p-2' src={cross} height={35} width={35} alt='cross' />
                </button>}
                <div className="flex flex-col gap-2 w-[80vw] max-w-96 aspect-square">
                    <h1 className="text-lg lg:text-xl font-bold">Filters</h1>
                    <div className="space-y-1">
                        <Label className="font-bold">Location</Label>
                        {/* Location Filter */}
                        <Selector defaultValue={searchFilters.location} options={locations} formField={'location'} onChange={(data) => {
                            if (searchFilters.location === data) {
                                dispatch(setSearchFilters({ ...searchFilters, location: '' }))
                            } else {
                                dispatch(setSearchFilters({ ...searchFilters, location: data }))
                            }
                        }} />
                    </div>
                    <div className="space-y-1">
                        <Label className="font-bold">Type</Label>
                        {/* Type Filter */}
                        <Selector defaultValue={searchFilters.type} options={propertyTypes} formField={'type'} onChange={(data) => {
                            if (searchFilters.type === data) {
                                dispatch(setSearchFilters({ ...searchFilters, type: '' }))
                            } else {
                                dispatch(setSearchFilters({ ...searchFilters, type: data }))
                            }
                        }} />
                    </div>
                    <div className="space-y-2">
                        <div className="space-y-1">
                            <Label className="font-bold">Min. price</Label>
                            <h1>₹{parseFloat(minPrice).toLocaleString('en-IN')}</h1>
                        </div>
                        <Slider
                            onValueChange={([newMin]) => {
                                handleMinPriceChange(newMin);
                            }}
                            value={[minPrice]}
                            defaultValue={[100000]} min={100000} max={maxPrice - 100000} step={100000} />
                    </div>
                    <div className="space-y-2">
                        <div className="space-y-1">
                            <Label className="font-bold">Max. price</Label>
                            <h1>₹{parseFloat(maxPrice).toLocaleString('en-IN')}</h1>
                        </div>
                        <Slider
                            onValueChange={([newMax]) => {
                                if (maxPrice <= minPrice && maxPrice > newMax) {
                                    handleMinPriceChange(newMax - 100000)
                                }
                                handleMaxPriceChange(newMax);
                            }}
                            defaultValue={[100000000]} min={200000} max={100000000} step={100000} />
                    </div>
                    <Button onClick={handleSearch} className="mt-5">{searchLoading ? <LoaderIcon /> : 'Search'}</Button>
                </div>
            </Modal>
        </div>
    )
}


const LoaderIcon = () => {
    return <svg className="animate-spin" width="20" height="20" viewBox="0 0 475 475" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M452.2 237C465.344 237 476.123 247.682 474.811 260.761C470.93 299.438 457.619 336.705 435.89 369.226C409.738 408.365 372.567 438.87 329.079 456.883C285.59 474.897 237.736 479.61 191.569 470.427C145.401 461.244 102.993 438.576 69.7086 405.291C36.4237 372.007 13.7564 329.599 4.5731 283.431C-4.61018 237.264 0.103015 189.41 18.1167 145.921C36.1303 102.433 66.6354 65.262 105.774 39.1102C138.295 17.3808 175.562 4.0695 214.239 0.188919C227.318 -1.12332 238 9.65562 238 22.8V22.8C238 35.9444 227.303 46.4467 214.261 48.0855C185.015 51.7605 156.908 62.1921 132.219 78.6882C100.908 99.6096 76.5043 129.346 62.0933 164.137C47.6824 198.928 43.9118 237.211 51.2585 274.145C58.6051 311.079 76.7389 345.005 103.367 371.633C129.995 398.261 163.921 416.395 200.855 423.742C237.789 431.088 276.072 427.318 310.863 412.907C345.654 398.496 375.39 374.092 396.312 342.781C412.808 318.092 423.24 289.985 426.915 260.739C428.553 247.697 439.056 237 452.2 237V237Z"
            fill="#fff" />
    </svg>
}