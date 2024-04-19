'use client'
import { useMemo } from "react";
import PropertyCard from "../Card";
import { useSelector } from "react-redux";

export default function Main({ properties }) {
    const { token } = useSelector(store => store.User);
    const { searchProperties, searchMessage, searchLoading } = useSelector(store => store.Global);

    const allProperties = useMemo(() => searchProperties.length > 0 ? searchProperties : properties, [searchProperties, properties]);

    const PropertyCards = useMemo(() => (allProperties.map((item, i) => (
        <PropertyCard key={i} props={item} token={token} />
    ))), [token, allProperties])
    if (!properties || properties.length === 0 || searchLoading) {
        return <>Loading</>;
    }
    return (
        <div className="flex flex-col w-full">
            <h1 className="text-sm italic my-2">{searchMessage && searchMessage}</h1>
            <div className="w-full grid gap-6 justify-items-stretch grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {PropertyCards}
            </div>
        </div>
    );
}