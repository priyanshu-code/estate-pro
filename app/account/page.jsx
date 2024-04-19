"use client"
import Account from '@/components/Account/Account';
import AddNewListing from '@/components/Account/AddProperty';
import Favorites from '@/components/Account/Favorites';
import MyListing from '@/components/Account/MyListing';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { setDashActive } from '@/features/global/globalSlice';
import { getUser } from '@/features/user/userSlice';
import { checkLatestUser } from '@/services/user';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const navItems = ['Account', '+ New Listing', 'Favorites', 'My Listings',]

export default function AccountPage() {
    const { data: session, status } = useSession();
    const { user, token } = useSelector(store => store.User)
    const { dashActive } = useSelector(store => store.Global)
    const { toast } = useToast()
    const dispatch = useDispatch();
    useEffect(() => {
        const checkUser = async () => {
            const { error, latestUser } = await checkLatestUser(token)
            if (!error) {
                const isLatest = latestUser === user.updatedAt
                if (!isLatest) {
                    dispatch(getUser(session.token))
                }
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Error fetching latest user",
                });
            }
        }
        if (status === 'authenticated') {
            checkUser()
        }
    }, [status])


    if (status === 'loading' || status === 'unauthenticated') return
    return (<>
        <main className='flex max-sm:flex-col items-start justify-between gap-6 max-w-[100vw] p-4 sm:px-8 md:px-12 lg:px-16'>
            <nav className='hidden sm:flex flex-col justify-start p-3 w-[200px] border rounded-2xl'>
                <div className='flex flex-col gap-3'>
                    {navItems.map(item => {
                        return <NavButton key={item} onClick={() => dispatch(setDashActive(item))} props={{ active: dashActive === item, name: item }} />
                    })}
                </div>
            </nav>
            <div className='flex-1 w-full sm:w-[calc(100vw-150px)] border rounded-2xl p-2 sm:p-4 h-full min-h-[calc(100vh-189px)] sm:min-h-[calc(100vh-109px)] '>
                {dashActive === "Account" && <Account />}
                {dashActive === "Favorites" && <Favorites />}
                {dashActive === "+ New Listing" && <AddNewListing />}
                {dashActive === "My Listings" && <MyListing />}
            </div>
        </main>
        <MobileDashboarNavbarBottom />
    </>
    )
}

const NavButton = ({ props, onClick }) => {
    const { active, name } = props
    return <button onClick={onClick} className={`rounded-full  ${active ? 'bg-gray-400' : 'bg-gray-200 hover:bg-gray-300'} w-full p-2`}>{name}</button>
}


function MobileDashboarNavbarBottom() {
    const { dashActive } = useSelector(store => store.Global)
    const dispatch = useDispatch();
    return (
        <div className='sm:hidden sticky flex items-center px-3 h-20 bottom-0 left-0 right-0 w-full bg-white z-20 border '>
            <div className='w-full grid grid-cols-4 gap-2'>
                {navItems.map((item) => {
                    const active = dashActive === item;
                    return (
                        <button
                            onClick={() => dispatch(setDashActive(item))}
                            className={`h-16 grid grid-cols-1 place-items-center w-full text-sm font-bold aspect-square rounded-xl
                                ${active ? 'bg-gray-400' : 'bg-gray-200 hover:bg-gray-300'}`}
                            key={item}
                        >
                            <p>{item.split('').slice(0, 3).join('')}</p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
