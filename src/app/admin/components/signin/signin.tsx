
"use client"
import React, { useState } from 'react'
import client from '@/services/apollo-client'
import { Admin_Login } from '../../queries/admin-queries'
import { useMutation } from '@apollo/client'
import { useRouter } from 'next/navigation'
import { Button,Input } from 'antd'
import validateAdmin from '../../requests/validate'
import styles from './signin.module.css'

function Signin() {
    const [record,setRecord]=useState({ username: '', password: '' })
    const [error,setError]=useState('')
    const[showError,setShowError]=useState(false)
    //Mutation for admin login
    const[adminLogin]=useMutation(Admin_Login,{client})
    const[validationError,setValidationError]=useState({username:'',password:''})
    const router=useRouter()
    const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
            setRecord((prev)=>({...prev,[e.target.name]:e.target.value}))
    }
    const handleSubmit:React.FormEventHandler<HTMLFormElement>=async(e)=>{
        
        e.preventDefault()
        console.log(record)
        const error=validateAdmin(record)
        setValidationError(error) 
        if(record.username=='' || record.password=='')
            {
                return
            }       
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
        if (response.data.adminLogin.status===true) {
            console.log("Admin Logged in", response.data);
            router.push('/');
            document.cookie = `token=${response.data.adminLogin.token}; path=/; max-age=86400; Secure; SameSite=Strict`;
            sessionStorage.setItem('user', response.data.adminLogin.__typename);
            window.dispatchEvent(new Event('storage'));
        }
        else
        {
            console.log(response.data.adminLogin.message)
            setError(response.data.adminLogin.message)
            setShowError(true)
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
            <h1 className={styles.loginHead}>Login As Admin</h1>
        <Input type="text" name="username" className={validationError.username?styles.inputerror:''} placeholder='Enter admin name' onChange={handleChange} id="" />
        {validationError.username && <span className={styles.error}>{validationError.username}</span>}
        <Input type="password" className={validationError.password?styles.inputerror:''} name="password" placeholder='Enter password' onChange={handleChange} id="" />
        {validationError.password && <span className={styles.error}>{validationError.password}</span>}
        {showError && <span className={styles.error}>{error}</span>}
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
