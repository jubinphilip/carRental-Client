'use client'
import React, { useEffect, useState } from 'react'
import styles from './navbar.module.css'
import Link from 'next/link'
import getCookie from '@/utils/get-token'
import { Button } from 'antd'
import { useRouter } from 'next/navigation'
import { clearCookie } from '@/utils/clear-cookie'
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useAppContext } from '@/context/appContext';
import { GiHamburgerMenu } from "react-icons/gi";
import UserProfile from '../../modals/userprofile/userprofile'

function Navbar() {
    const [isAuthorized, setIsAuthorized] = useState(false)
    const[user,setUser]=useState('')
    const[showProfile,setShowProfile]=useState(false)
    const [menu,setMenu]=useState(false)
    const { user: contextUser } = useAppContext();
    const router = useRouter()
    const fileurl = contextUser?.fileurl;
    console.log("Fileurl is ",fileurl)
    useEffect(() => {
        checkAuthStatus();
        
        window.addEventListener('storage', checkAuthStatus);
        return () => {
            window.removeEventListener('storage', checkAuthStatus);
        }
    }, []);

    const checkAuthStatus = () => {
        const token = getCookie('token'); 
        const usertoken=getCookie('usertoken')
        const user = sessionStorage.getItem('user');
        setUser(user || '');
        
        token?setIsAuthorized(true):'';
        usertoken?setIsAuthorized(true):'';
    }

    function handleLogout() {
        console.log("Logout enabled")
        clearCookie('token');
        clearCookie('usertoken')
        sessionStorage.removeItem('user')
        sessionStorage.removeItem('userid')
        setIsAuthorized(false)
        setUser('')
        router.push('/')
    }
    function handleProfileClick()
    {
        setShowProfile(true)
    }
    return (
        <div className={styles.maincontainer}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <h2 className={styles.logo}>DriveX</h2>
                </div>
                {showProfile && <UserProfile modalstate={setShowProfile}/>}
                <div className={styles.navItems}>
                    <Link className={styles.navitem} href="/"> <p>home</p></Link>
                    {!user && <Link className={styles.navitem} href="/user/bookings"> <p>bookings</p></Link>}
                    {user && <Link className={styles.navitem} href="/admin/dashboard"> <p>Dashboard</p></Link> }
                    {isAuthorized ? 
                    
                       <div className={styles.profile}> {!user && <img src={fileurl} className={styles.profileicon} onClick={handleProfileClick}/>}<Button onClick={handleLogout} type="primary" danger>Logout</Button> </div>
                        : 
                        <Link className={styles.navitem} href="/user/signin"> <p>Sign In</p></Link>
                    }
                    {!isAuthorized && <Link className={styles.navitem} href="/user/register"> <p>Sign Up</p></Link>}
                </div>
                {!menu &&<div className={styles.burgermenu}>
                    <GiHamburgerMenu onClick={()=>setMenu(!menu)}/>
                </div>}

               {menu && <div className={styles.mobilenavItems}>
             
                    <IoIosCloseCircleOutline className={styles.close} onClick={()=>setMenu(!menu)}/>
                    <Link className={styles.navitem} href="/"> <p>home</p></Link>
                    <Link className={styles.navitem} href="/"> <p>bookings</p></Link>
                    {user && <Link className={styles.navitem} href="/admin/dashboard"> <p>Dashboard</p></Link> }
                    {isAuthorized ? 
                        <Button onClick={handleLogout} type="primary" danger>Logout</Button> 
                        : 
                        <Link className={styles.navitem} href="/user/signin"> <p>Sign In</p></Link>
                    }
                    {!isAuthorized && <Link className={styles.navitem} href="/user/register"> <p>Sign Up</p></Link>}
                </div>
    
                }
            </div>

            
        </div>
    )
}

export default Navbar