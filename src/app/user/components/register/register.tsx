'use client'
import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { Add_User,REQUEST_OTP } from '../../queries/user-queries'
import client from '@/services/apollo-client'
import { useRouter } from 'next/navigation'
import { ToastContainer,toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import styles from './register.module.css'
import OtpVerify from '../../modals/otpVerify/OtpVerify'
import { Input,Button } from 'antd';

function RegisterUser() {
    const [data, setData] = useState({username:'',email:'',phone:'',city:'',state:'',country:'',pincode:'',password:''});
    const[image,setImage]=useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const[password,setPassword]=useState('')
    const[errorMessage,setErrorMessage]=useState('')
    const[error,setError]=useState(false)
    const [showOtpModal, setShowOtpModal] = useState<boolean>(false);
    const[isVerified,setIsVerified]=useState(false)
    const [addUser] = useMutation(Add_User, { client });
    const[requestOtp]=useMutation(REQUEST_OTP,{client})
    const router=useRouter()

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
          setError(true)
          setErrorMessage('Passwords do not match')
        
        }
        else
        {
        try {
            const { data: response } = await addUser({ variables: {  file: image, input: data } });
            console.log('User added:', response.addUser);
            if(response.addUser.status===false)
            {
             setErrorMessage(response.addUser.message)
             setError(true)
            }
            else
            {
              
              router.push('/user/signin')
            }
        } catch (err) {
            console.error('Error adding user:', err);
        }
      }
    };
    const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
     setPassword(e.target.value)
  };

const handleOtp=async()=>
  {
    try
    {
    const{data:response}= await requestOtp({ variables: { phone:data.phone,username:data.username,email:data.email } });
    console.log(response.requestOtp.status)
    if(response.requestOtp.status!=false)
    {
      setShowOtpModal(true);
      console.log('OTP sent:', response);
    }
    else
    {
      setError(true)
      setErrorMessage(response.requestOtp.message)
    }
    }catch(error)
    {
      console.log(error)
    }
  }
    return (
        <div className={styles.mainContainer}>
            <div className={styles.container}>
              <ToastContainer/>
              <div>

      {showOtpModal && (
        <OtpVerify
          onClose={() => setShowOtpModal(false) }
          phone={data.phone}
          verified={setIsVerified}
        />
      )}
    </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <h1 className={styles.registerHead}>Register Here</h1>
              <div className={styles.formdiv}>
                <Input type="text" name="username" placeholder="Enter your name" onChange={handleChange} />
                <Input type="text" name="email" placeholder="Enter your email" onChange={handleChange} />
                <Input type="text" name="phone" placeholder="Enter your phone" onChange={handleChange} />
                {error && !isVerified && <span className={styles.error}>{errorMessage}</span>}<br/>
               {!isVerified && <Button type="primary"  onClick={handleOtp} >Verify</Button>}
                </div>
                { isVerified && <div className={styles.formdiv}>
                <Input type="text" name="city" placeholder="Enter your city" onChange={handleChange} />
                <Input type="text" name="state" placeholder="Enter your state" onChange={handleChange} />
                <Input type="text" name="country" placeholder="Enter your country" onChange={handleChange} />
                <Input type="text" name="pincode" placeholder="Enter your pincode" onChange={handleChange} />
                <Input type="password" name="password" placeholder="Enter your password" onChange={handleChange} />
                <Input type="password" name="confirmPassword" placeholder="Confirm your password" onChange={handlePassword} />
                {error && <span className={styles.error}>{errorMessage}</span>}<br/>
                <input type="file" onChange={handleFileChange} />
           {imagePreview && (
          <div>
            <img src={imagePreview} alt="Preview" style={{ width: '200px', height: 'auto' }} />
          </div>
        )}
                <Button type="primary" htmlType='submit' >Signup</Button></div>}
            </form>
            <div className={styles.image}>
            <img  className={styles.carImage} src="/assets/cars.png" alt="" />
        </div>
            </div>
        </div>
    );
}

export default RegisterUser;
