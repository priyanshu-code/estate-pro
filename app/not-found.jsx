"use client";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
    return (
        <>
            <div className="h-[100vh] bg-white flex flex-col  justify-center items-center ">
                <Image
                    src="/404.png"
                    width={208}
                    height={176}
                    alt="Error Page"
                />
                <h1 className="mt-5 text-lg sm:text-2xl font-bold  text-black text-center">
                    404
                </h1>
                <h1 className="mt-2 text-sm sm:text-xl font-bold  text-black text-center ">
                    Sorry, the page you visited does not exist.
                </h1>
                <Link
                    href={"/"}
                    className="mt-7 flex justify-center items-center bg-black text-white rounded-md p-4 text-xl font-bold "
                >
                    {"Back Home"}
                </Link>
            </div>
        </>
    );
};

