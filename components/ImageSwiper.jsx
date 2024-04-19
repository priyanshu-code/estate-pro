"use client"

import Image from "next/image"
import { useState } from "react"
import arrowLeft from '@/public/swiper/arrow-left.svg'
import arrowRight from '@/public/swiper/arrow-right.svg'

const backendAssetsUrl = process.env.NEXT_PUBLIC_BACKEND_URL + 'assets/'

function ImageSwiper({ props }) {
    const [currentImage, setCurrentImage] = useState(0)
    const nextImage = () => {
        if (currentImage < props.length - 1) {
            setCurrentImage(prev => prev + 1)
        }
    }
    const previousImage = () => {
        if (currentImage > 0) {
            setCurrentImage(prev => prev - 1)
        }
    }
    if (!props) {
        return <span className="aspect-[20/19] w-full h-full max-w-[300px] bg-gray-50"></span>
    }
    return <div className="relative w-full flex items-center justify-start overflow-hidden group">
        {currentImage > 0 && <button onClick={previousImage} className="absolute p-2 top-1/2 -translate-y-1/2 left-[3%] bg-white opacity-100 md:opacity-0 md:group-hover:opacity-100 rounded-full transition-all duration-700 z-10">
            <Image src={arrowLeft} height={16} width={16} alt="arrowLeft" />
        </button>}

        {props.map((item, i) => {
            const key = item + i
            const url = item.startsWith('pictures-') ? backendAssetsUrl + item : item
            return (
                <Image
                    key={key}
                    src={url} width={300} height={300} alt={item}
                    style={{ translate: `${-(currentImage * 100)}%` }}
                    className={`aspect-[20/19] min-w-full h-full transition-all duration-300 rounded-lg`}
                />
            )
        })}
        {currentImage < props.length - 1 && <button onClick={nextImage} className="absolute p-2 top-1/2 -translate-y-1/2 right-[3%] bg-white opacity-100 md:opacity-0 md:group-hover:opacity-100 rounded-full transition-all duration-300">
            <Image src={arrowRight} height={16} width={16} alt="arrowRight" />
        </button>}
    </div>
}

export default ImageSwiper