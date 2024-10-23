
"use client"
import React, { use, useState } from 'react'
import client from '@/services/apollo-client'
import { LOGIN_USER } from '../queries/user-queries'
import { useAppContext} from '@/context/appContext'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/navigation'
import styles from './signin.module.css'
import { Input,Button } from 'antd';
function Signin() {
    
    const{setUser}=useAppContext()
    const [record,setRecord]=useState({email: '', password: '' })
    const[errorMessage,setErrorMessage]=useState('')
    const[showerror,setShowError]=useState(false)
    const[loginUser,{data,loading,error}]=useMutation(LOGIN_USER,{client})
    const router=useRouter()
    const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
            setRecord((prev)=>({...prev,[e.target.name]:e.target.value}))
            setShowError(false)
    }
    //Function for submiting the user credentials
    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        console.log(record);
        
        try {
            const response = await loginUser({
                variables: {
                    input: {
                        email: record.email,
                        password: record.password,
                    },
                },
            });
            console.log(response)
            if (response.data.loginUser.status==='true') 
                //if response is true then essential details are stored into the context and is redirected
                {
                console.log(response.data)
                console.log("User Logged In", response.data);
                sessionStorage.setItem('token',response.data.loginUser.token)
                sessionStorage.setItem('username',response.data?.loginUser.email)
                document.cookie = `usertoken=${response.data.loginUser.token}; path=/; max-age=86400; Secure; SameSite=Strict`;//setting token inside a cookie
                sessionStorage.setItem('userid',response.data.loginUser.id)
                window.dispatchEvent(new Event('storage'));//when user logins an event  is triggered for dealing with some states in navbar
                //storing user information in context
                const userData={
                    userid:response.data.loginUser.id,
                    email:response.data.loginUser.email,
                    token:response.data.loginUser.token,
                    fileurl:response.data.loginUser.fileurl,
                    username:response.data.loginUser.username
                }
                setUser(userData)
                router.push('/');
            }
            else
            {
                console.log("hello")
                setErrorMessage(response.data.loginUser.message)
                setShowError(true)
            }
        } catch (error) {
            console.error("Login error:", error);
        }
    };
    function handleClick()
    {
        router.push('/admin/login')
    }
  return (
    <div className={styles.mainContainer}>
        <div className={styles.container}>
        <form  className={styles.form} onSubmit={handleSubmit}>
        <h1 className={styles.loginHead}>Login Here</h1>
        <Input type="text" name="email" placeholder='Enter your email' onChange={handleChange}  />
        <Input type="password" name="password" placeholder='enter your Password' onChange={handleChange}  />
       {showerror &&  <span className={styles.error}>{errorMessage}</span>}
        <Button type="primary" htmlType='submit' >Signin</Button>
        <p className={styles.registerLink}>Don't have an Account?<a href="/user/register" className={styles.link}>Register</a></p>
        <div className={styles.adminoptions}>
        <p className={styles.oroption}>or</p>
        <button  className={styles.adminLogin} onClick={handleClick}>Sign in as Admin</button>
        </div>
        </form>
        <div className={styles.image}>
            <img  className={styles.carImage} src="/assets/gwagon.png" alt="" />
        </div>
        </div>
    </div>
  )
}

export default Signin
