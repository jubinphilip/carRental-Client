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
    const [addUser] = useMutation(Add_User, { client });//Mutation for adding user
    const[requestOtp]=useMutation(REQUEST_OTP,{client})//Mutation for sending otp for verification after sending otp the otpverify modal is displayed
    const router=useRouter()

    //Function handle FileChange
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
        setError(false)
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(data);
        //Checks whether the password and confirmpassword fields are same
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
              //after successfull registration it automatically redirects to signin
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
    //Requesting OTP
    const{data:response}= await requestOtp({ variables: { phone:data.phone,username:data.username,email:data.email } });
    console.log(response.requestOtp.status)
    if(response.requestOtp.status!=false)
    {
      //if the response is true the the modal for inserting otp is displayed
      setShowOtpModal(true);
      console.log('OTP sent:', response);
    }
    else
    {
      //else error is displayed
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
{/* conditionally displaying the otpmodal */}
      {showOtpModal && (
        <OtpVerify
          onClose={() => setShowOtpModal(false) }
          phone={data.phone}
          verified={setIsVerified}//pass a state if otp is verified then isVerified is set to true 
        />
      )}
    </div>
            <form onSubmit={handleSubmit} className={styles.form}>
              <h1 className={styles.registerHead}>Register Here</h1>
              {!isVerified && <div className={styles.formdiv}>
                <Input type="text" name="username" placeholder="Enter your name" onChange={handleChange} />
                <Input type="text" name="email" placeholder="Enter your email" onChange={handleChange} />
                <Input type="text" name="phone" placeholder="Enter your phone" onChange={handleChange} />
                {error && !isVerified && <span className={styles.error}>{errorMessage}</span>}<br/>
             <Button type="primary"  onClick={handleOtp} >Verify</Button>
                </div>}
                {/* after verification the fields for adding the rest data are displayed */}
                { isVerified && <div className={styles.formdiv}>
                <Input type="text" name="city" placeholder="Enter your city" onChange={handleChange} />
                <Input type="text" name="state" placeholder="Enter your state" onChange={handleChange} />
                <Input type="text" name="country" placeholder="Enter your country" onChange={handleChange} />
                <Input type="text" name="pincode" placeholder="Enter your pincode" onChange={handleChange} />
                <Input type="password" name="password" placeholder="Enter your password" onChange={handleChange} />
                <Input type="password" name="confirmPassword" placeholder="Confirm your password" onChange={handlePassword} />
                {imagePreview && (
          <div className={styles.imagePreviewContainer}>
            <img src={imagePreview} alt="Preview" className={styles.imagePreview} />
          </div>
        )}
                {error && <span className={styles.error}>{errorMessage}</span>}<br/>
                <label className={styles.profileUpload}>Upload Profile Picture</label>
                <div className={styles.imageInputWrapper}>
            <label htmlFor="upload">
              <img src="/assets/imageadd.png" className={styles.imageAdd} alt="" />
            </label>
            <input type="file" id='upload' accept=".jpg, .jpeg, .png, .webp, .avif" className={styles.primaryImageInput} onChange={handleFileChange} />
            </div>          
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
