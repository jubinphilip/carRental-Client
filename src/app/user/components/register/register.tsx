'use client'
import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { Add_User } from '../../queries/user-queries'
import client from '@/app/services/apollo-client'
import { ToastContainer,toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import styles from './register.module.css'
import { Input,Button } from 'antd';

function RegisterUser() {
    const [data, setData] = useState({username:'',email:'',phone:'',city:'',state:'',country:'',pincode:'',password:''});
    const[image,setImage]=useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const[password,setPassword]=useState('')
    const [addUser, { loading, error }] = useMutation(Add_User, { client });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0] || null;
        setImage(file); 
        if (file) {
          const previewUrl = URL.createObjectURL(file);
          setImagePreview(previewUrl); 
        } else {
          setImagePreview(null); 
        }
      };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(data);
        if(data.password!=password)
        {
          toast.error('Passwords do not match')
        }
        else
        {
        try {
            const { data: response } = await addUser({ variables: {  file: image, input: data } });
            console.log('User added:', response.addUser);
        } catch (err) {
            console.error('Error adding user:', err);
        }
      }
    };
    const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
     setPassword(e.target.value)
  };
    return (
        <div className={styles.mainContainer}>
            <div className={styles.container}>
              <ToastContainer/>
            <form onSubmit={handleSubmit} className={styles.form}>
                <Input type="text" name="username" placeholder="Enter your name" onChange={handleChange} />
                <Input type="email" name="email" placeholder="Enter your email" onChange={handleChange} />
                <Input type="text" name="phone" placeholder="Enter your phone" onChange={handleChange} />
                <Input type="text" name="city" placeholder="Enter your city" onChange={handleChange} />
                <Input type="text" name="state" placeholder="Enter your state" onChange={handleChange} />
                <Input type="text" name="country" placeholder="Enter your country" onChange={handleChange} />
                <Input type="text" name="pincode" placeholder="Enter your pincode" onChange={handleChange} />
                <Input type="password" name="password" placeholder="Enter your password" onChange={handleChange} />
                <Input type="password" name="confirmPassword" placeholder="Confirm your password" onChange={handlePassword} />
                <input 
            type="file" 
            onChange={handleFileChange} 
          />
           {imagePreview && (
          <div>
            <img src={imagePreview} alt="Preview" style={{ width: '200px', height: 'auto' }} />
          </div>
        )}
                <Button type="primary" htmlType='submit' >Signup</Button>
            </form>
            <div className={styles.image}>
            <img  className={styles.carImage} src="/assets/cars.png" alt="" />
        </div>
            </div>
        </div>
    );
}

export default RegisterUser;
