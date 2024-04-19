'use client'
import userImage from '@/public/navbar/user.svg'
import menu from '@/public/navbar/menu.svg'
import cross from '@/public/cross.svg'
import { useSession, signOut } from 'next-auth/react'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Modal from '@/components/Modal'
import Login from './Auth/Login'
import Register from './Auth/Register'
import Link from 'next/link'
import { closeAuthModal, openAuthModal, setAuthPage } from '@/features/global/globalSlice'
import { getUser, logoutUser, setToken, setUser } from '@/features/user/userSlice'

export default function NavBar() {
    const { data: session, status } = useSession()
    const dispatch = useDispatch()
    const [accountOpen, setAccountOpen] = useState(false)
    const router = useRouter()
    const { authModalOpen, authPage } = useSelector(store => store.Global)
    const { token, user } = useSelector(store => store.User)

    const toggleAccountOpen = () => {
        setAccountOpen(prev => !prev)
    }


    useEffect(() => {
        if (status === 'authenticated' && (token === '' || Object.keys(user).length === 0)) {
            const { token } = session
            dispatch(setToken(token))
            dispatch(getUser(token))
        } else if (status === 'unauthenticated' && Object.keys(user).length > 0) {
            dispatch(logoutUser())
        }
    }, [status])

    return (
        <nav className="flex items-center justify-between p-3 px-5 w-full">
            <div className='flex items-center justify-center gap-2 text-2xl'>
                <Link href={'/'} >Estate-Pro</Link>
            </div>
            <button onClick={toggleAccountOpen} className={`relative flex items-center justify-center gap-2 rounded-full bg-white border p-2 px-2.5 select-none 
        ${accountOpen ? 'shadow-md' : 'hover:shadow-md'}
        `}>
                <Image className='p-2' src={menu} height={35} width={35} alt='menu' />
                <Image className='bg-gray-200 rounded-full p-2' src={userImage} height={35} width={35} alt='menu' />
                {accountOpen && status === 'unauthenticated' ? (
                    // unauthenticated
                    <div className='absolute z-10 bg-inherit top-full right-0 mt-2 flex flex-col border shadow-md py-2 w-40 rounded-xl overflow-hidden'>
                        <ul className='text-left text-sm'>
                            <li onClick={() => {
                                dispatch(setAuthPage('register'))
                                dispatch(openAuthModal())

                            }} className='p-2 px-4 hover:bg-gray-100/80 font-semibold'>Sign up</li>
                            <li onClick={() => {
                                dispatch(openAuthModal())
                                dispatch(setAuthPage('login'))

                            }} className='p-2 px-4 hover:bg-gray-100/80'>Login</li>
                        </ul>
                    </div>
                ) : accountOpen && status === 'authenticated' ? (
                    // authenticated
                    <div className='absolute z-10 bg-inherit top-full right-0 mt-2 flex flex-col border shadow-md py-2 w-40 rounded-xl overflow-hidden'>
                        <ul className='text-left text-sm'>
                            <li
                                onClick={() => router.push('/account')}
                                className='p-2 px-4 hover:bg-gray-100/80 font-semibold'>Account</li>
                            <li
                                onClick={() => { signOut() }}
                                className='p-2 px-4 hover:bg-gray-100/80'>Logout</li>
                        </ul>
                    </div>
                ) : accountOpen && (
                    // Loading
                    <div className='absolute z-10 bg-inherit top-full right-0 mt-2 flex flex-col border shadow-md py-2 w-40 rounded-xl overflow-hidden'>
                        Loading
                    </div>
                )
                }
            </button>

            <Modal className='flex flex-col items-center justify-between bg-white rounded-2xl py-6 relative' isOpen={authModalOpen} closeModal={() => dispatch(closeAuthModal())} >
                <button className='absolute top-4 right-4 rounded-full hover:bg-gray-100' onClick={() => dispatch(closeAuthModal())}>
                    <Image className='p-2' src={cross} height={35} width={35} alt='cross' />
                </button>
                {authPage === 'login' && (
                    <>
                        <Login />
                        <p className="mt-8 text-sm">
                            Don&apos;t have an account?{' '}
                            <span onClick={() => dispatch(setAuthPage('register'))} className="underline cursor-pointer" >
                                Sign up
                            </span>
                        </p>
                    </>
                )
                }
                {authPage === 'register' && (
                    <>
                        <Register />
                        <p className="mt-8 text-sm">
                            Already have an account?{"  "}
                            <span onClick={() => dispatch(setAuthPage('login'))} className="underline cursor-pointer">
                                Sign In
                            </span>
                        </p>
                    </>
                )
                }
            </Modal>
        </nav>)
}

