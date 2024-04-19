'use client'
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

export default function AccountLayout({ children }) {
    const router = useRouter();
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            router.push('/');
        },
    });
    return <> {children}</>
}