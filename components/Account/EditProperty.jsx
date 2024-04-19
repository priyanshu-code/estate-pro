"use client"

import { propertySchema } from '@/schema/property';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useCallback, useEffect, useState } from 'react';
import { Textarea } from '../ui/textarea';
import { Plus, Minus } from 'lucide-react';
import Selector from "./Selector";
import locations from '@/public/locations'
import propertyTypes from '@/public/propertyTypes'
import { useToast } from '../ui/use-toast';
import { createProperty, updateProperty } from '@/services/property';
import { useSession } from 'next-auth/react';
import { setUser } from '@/features/user/userSlice';
import { useDispatch } from 'react-redux';
import AmenitiySelector from './AmenitiesSelector';
import propertyAmenities from '@/public/amenities';
import { setDashActive } from '@/features/global/globalSlice';
import Image from 'next/image';
import cross from '@/public/cross.svg'
import { useRouter } from 'next/navigation';
const backendAssetsUrl = process.env.NEXT_PUBLIC_BACKEND_URL + 'assets/'


export default function EditProperty({ property }) {
    const { data: session } = useSession()
    const router = useRouter()
    const [amenities, setAmenities] = useState(property?.amenities || [])
    const [amenitiesError, setAmenitiesError] = useState(false)
    const [loading, setLoading] = useState(false)
    const [images, setImages] = useState([])
    const [imagesError, setImagesError] = useState('')
    const [existingImages, setExistingImages] = useState(property?.propertyImages || [])
    const [removedImages, setremovedImages] = useState([])
    const { toast } = useToast()
    const formData = new FormData();

    const form = useForm({
        resolver: zodResolver(propertySchema),
        defaultValues: {
            title: property?.title || '',
            description: property?.description || '',
            type: property?.type || '',
            location: property?.location || '',
            price: property?.price || 100000,
            area: property?.area || 1000,
            bedrooms: property?.bedrooms || 0,
            bathrooms: property?.bathrooms || 0,
        },
    });

    useEffect(() => {
        if (images.length + existingImages.length <= 0) {
            setImagesError('Min error');
        } else if (images.length + existingImages.length > 5) {
            setImagesError('Max error');
        } else if (imagesError !== 'error') {
            setImagesError('');
        }
    }, [images, existingImages, imagesError])

    function handleImage(e) {
        const { files } = e.target
        const imagesArray = Array.from(files)
        if (images.length + existingImages.length === 0) {
            setImagesError('Min error');
            return;
        }
        if (images.length + existingImages.length > 5) {
            setImagesError('Max error');
            return;
        }

        if (!imagesArray || imagesArray.some(item => item.type.split('/')[0] !== 'image')) {
            setImagesError('error');
            return;
        }
        setImages(imagesArray);
    }
    useEffect(() => {
        if (amenities.length > 0) {
            setAmenitiesError(false)
        }
    }, [amenities])
    // Handle form submission

    const onSubmit = async (values) => {
        if (images.length + existingImages.length > 5) {
            setImagesError('Max error');
            return;
        }
        if (images.length + existingImages.length <= 0) {
            setImagesError('Min error');
            return;
        }
        if (amenities.length <= 0) {
            setAmenitiesError(true)
            return;
        }
        setLoading(true)
        formData.append('title', values.title);
        formData.append('description', values.description);
        formData.append('price', Number(values.price));
        formData.append('location', values.location || '');
        formData.append('type', values.type || '');
        formData.append('bedrooms', values?.bedrooms);
        formData.append('bathrooms', values?.bathrooms);
        formData.append('area', values?.area);

        // Append RemovedImage(s)        
        removedImages.forEach((item) => formData.append('removedImages[]', item));

        // Append Amenitie(s)
        amenities.forEach((item) => formData.append('amenities[]', item));

        // Append Image(s)
        images.forEach(image => formData.append('pictures', image))

        const { error, msg, data } = await updateProperty({ propertyId: property?._id, data: formData, token: session.token })
        if (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: msg,
            });
        } else {
            // Do something here
            toast({
                title: "Success",
                description: msg,
            });
            location.reload()
        }
        setLoading(false)
    };

    const getAmeniities = useCallback((data) => {
        setAmenities(data)
    }, [])


    return (
        <main className='grid grid-cols-1 place-items-center space-y-5'>
            <div className='flex flex-col space-y-2'>
                <h1 className='text-2xl font-semibold'>Edit your listing</h1>
                <h1 className='text-gray-500'>Your favourite properties.</h1>
            </div>
            <div className="flex flex-col w-full sm:max-w-3xl space-y-4 pb-3">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Basic Details */}
                        <div className='flex flex-col border gap-4 p-4 sm:p-6 rounded-2xl'>
                            <h1 className='text-xl font-bold'>
                                INCLUDE SOME DETAILS
                            </h1>
                            {/* Property Title */}
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='font-bold'>Title*</FormLabel>
                                        <FormControl>
                                            <Input

                                                className="customInput" placeholder="Title" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Property Description */}
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='font-bold'>Description *</FormLabel>
                                        <FormControl>
                                            <Textarea className="customInput min-h-[6rem]" placeholder="Property Description" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Property Type */}
                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem className='flex flex-col'>
                                        <FormLabel className='font-bold'>Type*</FormLabel>
                                        <FormControl>
                                            <Selector defaultValue={field.value} className="customInput" options={propertyTypes} formField={'type'} onChange={(data) => field.onChange(data)} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* Property Location */}
                            <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='font-bold'>Location*</FormLabel>
                                        <FormControl>
                                            <Selector defaultValue={field.value} className="customInput" options={locations} formField={'location'} onChange={(data) => field.onChange(data)} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        {/* Price Section */}
                        <div className='flex flex-col border gap-4 p-4 sm:p-6 rounded-2xl'>
                            <h1 className='text-xl font-bold'>
                                SET A PRICE
                            </h1>
                            {/* Price */}
                            <FormField
                                control={form.control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='font-bold'>Price*</FormLabel>
                                        <FormControl
                                            onChange={(e) => {
                                                const newValue = Math.max(Number(e.target.value), 100000);
                                                field.onChange(Number(newValue));
                                            }}
                                        >
                                            <Input
                                                type="number" className="customInput" placeholder="Price" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>


                        <div className='flex flex-col border gap-4 p-4 sm:p-6 rounded-2xl'>
                            <h1 className='text-xl font-bold'>
                                ADD IMAGES
                            </h1>
                            {/* Images */}
                            <FormField
                                control={form.control}
                                name="propertyImages"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-bold">Property Image *</FormLabel>
                                        <FormControl>
                                            <Input
                                                className="customInput cursor-pointer"
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleImage}
                                            />
                                        </FormControl>
                                        {imagesError === 'error' && <FormDescription className="text-destructive">Invalid image type</FormDescription>}
                                        {imagesError === 'Max error' && <FormDescription className="text-destructive">Max 5 images allowed</FormDescription>}
                                        {imagesError === 'Min error' && <FormDescription className="text-destructive">Need at least 1 image</FormDescription>}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-1 px-2'>
                            {existingImages.map((item, i) => {
                                const url = item.startsWith('pictures-') ? backendAssetsUrl + item : item
                                const key = i + item
                                return <div className='relative border' key={item}>
                                    <button className='absolute top-2 right-2 rounded-full bg-gray-100'
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setremovedImages(prev => [...prev, item])
                                            setExistingImages(prev => prev.filter(image => image !== item))
                                        }}>
                                        <Image className='p-1' src={cross} height={25} width={25} alt='cross' />
                                    </button>

                                    <Image
                                        key={key}
                                        src={url} width={300} height={300} alt={item}
                                        className={`aspect-[20/19] w-full h-full transition-all duration-300 rounded-lg`}
                                    />                            </div>
                            })}
                        </div>

                        <div className='flex flex-col border gap-4 p-4 sm:p-6 rounded-2xl'>
                            <h1 className='text-xl font-bold'>
                                ADDITIONAL INFO
                            </h1>
                            {/* Amenities */}
                            <AmenitiySelector
                                currentArr={amenities}
                                suggestedArr={propertyAmenities}
                                label="Amenities*"
                                placeholder="Gym / Pool / Garden..."
                                getAmeniities={(data) => getAmeniities(data)}
                                maxLength={8}
                                minLength={1}
                            />
                            {amenitiesError && <p className='text-destructive text-sm'>Need at least 1 Amenitiy</p>}
                            {/* Area */}
                            <FormField
                                control={form.control}
                                name="area"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='font-bold'>{'Area (sqft.)*'}</FormLabel>
                                        <FormControl
                                            onChange={(e) => {
                                                const newValue = Math.max(Number(e.target.value), 1000);
                                                field.onChange(Number(newValue));
                                            }}
                                        >
                                            <Input type="number" inputMode="numeric" className="customInput" placeholder="Area" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="bedrooms"
                                render={({ field }) => (

                                    <FormItem>
                                        <FormLabel className='font-bold'>Bedrooms</FormLabel>
                                        <FormControl>
                                            <div className='flex items-center justify-between gap-2'>
                                                <button
                                                    disabled={field.value === 0}
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        const newValue = Math.max(field.value - 1, 0);
                                                        field.onChange(newValue);
                                                    }}
                                                    className={`rounded-full border p-2 ${field.value === 0 ? 'bg-gray-100' : 'hover:bg-gray-100'}`}><Minus size={15} /></button>
                                                <h1 >{field.value}</h1>
                                                <button
                                                    disabled={field.value === 20}
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        const newValue = Math.min(field.value + 1, 20);
                                                        field.onChange(newValue);
                                                    }}
                                                    className={`rounded-full border p-2 ${field.value === 20 ? 'bg-gray-100' : 'hover:bg-gray-100'}`}><Plus size={15} /></button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="bathrooms"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='font-bold'>Bathrooms</FormLabel>
                                        <FormControl>
                                            <div className='flex items-center justify-between gap-2'>
                                                <button
                                                    disabled={field.value === 0}
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        const newValue = Math.max(field.value - 1, 0);
                                                        field.onChange(newValue);
                                                    }}
                                                    className={`rounded-full border p-2 ${field.value === 0 ? 'bg-gray-100' : 'hover:bg-gray-100'}`}><Minus size={15} /></button>
                                                <h1 >{field.value}</h1>
                                                <button
                                                    disabled={field.value === 20}
                                                    onClick={(e) => {
                                                        e.preventDefault()
                                                        const newValue = Math.min(field.value + 1, 20);
                                                        field.onChange(newValue);
                                                    }}
                                                    className={`rounded-full border p-2 ${field.value === 20 ? 'bg-gray-100' : 'hover:bg-gray-100'}`}><Plus size={15} /></button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="min-w-full flex justify-end sm:justify-center">
                            <Button type="submit">
                                {loading ? <LoaderIcon /> : "Save"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </main>

    )
}

const LoaderIcon = () => {
    return <svg className="animate-spin" width="20" height="20" viewBox="0 0 475 475" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M452.2 237C465.344 237 476.123 247.682 474.811 260.761C470.93 299.438 457.619 336.705 435.89 369.226C409.738 408.365 372.567 438.87 329.079 456.883C285.59 474.897 237.736 479.61 191.569 470.427C145.401 461.244 102.993 438.576 69.7086 405.291C36.4237 372.007 13.7564 329.599 4.5731 283.431C-4.61018 237.264 0.103015 189.41 18.1167 145.921C36.1303 102.433 66.6354 65.262 105.774 39.1102C138.295 17.3808 175.562 4.0695 214.239 0.188919C227.318 -1.12332 238 9.65562 238 22.8V22.8C238 35.9444 227.303 46.4467 214.261 48.0855C185.015 51.7605 156.908 62.1921 132.219 78.6882C100.908 99.6096 76.5043 129.346 62.0933 164.137C47.6824 198.928 43.9118 237.211 51.2585 274.145C58.6051 311.079 76.7389 345.005 103.367 371.633C129.995 398.261 163.921 416.395 200.855 423.742C237.789 431.088 276.072 427.318 310.863 412.907C345.654 398.496 375.39 374.092 396.312 342.781C412.808 318.092 423.24 289.985 426.915 260.739C428.553 247.697 439.056 237 452.2 237V237Z"
            fill="#fff" />
    </svg>
}