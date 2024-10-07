
"use client"
import React, { useState } from 'react'
import client from '@/app/services/apollo-client'
import { LOGIN_USER } from '../queries/user-queries'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/navigation'
import styles from './signin.module.css'
import { Input,Button } from 'antd';
function Signin() {
    const [record,setRecord]=useState({email: '', password: '' })
    const[loginUser,{data,loading,error}]=useMutation(LOGIN_USER,{client})
    const router=useRouter()
    const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
            setRecord((prev)=>({...prev,[e.target.name]:e.target.value}))
    }
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
            if (response.data) {
                console.log("User Logged In", response.data);
                sessionStorage.setItem('token',response.data.loginUser.token)
                sessionStorage.setItem('userid',response.data.loginUser.id)
                window.dispatchEvent(new Event('storage'));
                router.push('/');
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
        <Input type="text" name="email" placeholder='Enter your email' onChange={handleChange}  />
        <Input type="password" name="password" placeholder='enter your Password' onChange={handleChange}  />
        <Button type="primary" htmlType='submit' >Signin</Button>
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
