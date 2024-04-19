import EditProperty from "@/components/Account/EditProperty";

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
    return (<EditProperty property={property} />)
}
