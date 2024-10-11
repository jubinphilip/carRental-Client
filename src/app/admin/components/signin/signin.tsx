
"use client"
import React, { useState } from 'react'
import client from '@/services/apollo-client'
import { Admin_Login } from '../../queries/admin-queries'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/navigation'
import { Button,Input } from 'antd'
import styles from './signin.module.css'

function Signin() {
    const [record,setRecord]=useState({ username: '', password: '' })
    const[adminLogin,{data,loading,error}]=useMutation(Admin_Login,{client})
    const router=useRouter()
    const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
            setRecord((prev)=>({...prev,[e.target.name]:e.target.value}))
    }
    const handleSubmit:React.FormEventHandler<HTMLFormElement>=async(e)=>{
        e.preventDefault()
        console.log(record)
        try
        {
        const response=await adminLogin({
            variables:{
                input:{
                username:record.username,
                password:record.password,
            }
            }
        })
        if(response.data)
        {   
            console.log("Admin Loginned",response.data)
            router.push('/')
            sessionStorage.setItem('token',response.data.adminLogin.token)
            localStorage.setItem('token',response.data.adminLogin.token)
            sessionStorage.setItem('user',response.data.adminLogin.__typename)
            window.dispatchEvent(new Event('storage'));
        }
    }
    catch(error)
    {
        console.log(error)
    }
    }
  return (
    <div className={styles.mainContainer}>
<div className={styles.container}>
        <form className={styles.form} onSubmit={handleSubmit}>
        <Input type="text" name="username" placeholder='Enter admin name' onChange={handleChange} id="" />
        <Input type="password" name="password" placeholder='Enter password' onChange={handleChange} id="" />
        <Button type="primary" htmlType='submit' >Signin</Button>
        </form>
        <div className={styles.image}>
            <img  className={styles.carImage} src="/assets/gwagon.png" alt="" />
        </div>
        </div>
    </div>
  )
}

export default Signin
