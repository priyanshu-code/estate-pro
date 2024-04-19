import ImageSwiper from "@/components/ImageSwiper";
import ContactForm from "@/components/ContactForm";

const getProperty = async (propertyId) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}public/${propertyId}`, {
        cache: 'no-store',
    });
    const data = await res.json();
    return data;
};

export default async function Username({ params }) {
    const { propertyId } = params
    const { property } = await getProperty(propertyId);
    if (!property) {
        return <h1>404 Property not found</h1>
    }
    const { title, description, price, location, type, amenities, propertyImages, bedrooms, bathrooms, area } = property
    return (
        <main className="flex flex-col items-center gap-5 p-4 sm:px-8 md:px-12 lg:px-16 2xl:px-20">
            <div className="flex flex-col items-center lg:items-start w-full max-w-5xl gap-6">
                <header className="flex flex-col text-2xl font-bold">
                    {type},{" "} {location}
                </header>
                <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-start h-full">
                    <div className="w-full max-w-[400px]">
                        <ImageSwiper props={propertyImages} />
                    </div>
                    <div className="flex flex-col justify-between gap-2">
                        <h1 className="underline font-bold text-3xl capitalize">{title}</h1>
                        <h1>{description}</h1>
                        <h1 className="mt-auto text-2xl">Area: <span className="font-bold">{area} Sqft.</span></h1>
                        <h1 className="text-2xl">Price:{" "}<span className="font-bold"> ₹{parseFloat(price).toLocaleString('en-IN')}</span></h1>
                    </div>
                </div>
                <div className="flex flex-col gap-4 items-start w-full text-xl">
                    <h1>Bathrooms:<span className="font-bold"> {bathrooms}</span></h1>
                    <h1>Bedrooms: <span className="font-bold">{bedrooms}</span></h1>
                </div>
                <div className="flex flex-col gap-4 items-start w-full">
                    <h1 className="text-2xl font-bold">Amenities</h1>
                    <ul className="ml-4 grid sm:grid-cols-2 lg:grid-cols-3 w-full gap-2">
                        {amenities.map((item, i) => (
                            <li className="list-disc" key={`${item}#${i}`}>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>

            </div>
            <span className="w-full h-0.5 bg-gray-400"></span>
            <ContactForm />
        </main>
    )
}
