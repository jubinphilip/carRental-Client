'use client'
import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { Add_User,REQUEST_OTP } from '../../queries/user-queries'
import client from '@/services/apollo-client'
import { useRouter } from 'next/navigation'
import { ToastContainer,toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import styles from './register.module.css'
import { validateRegistration,validateFormFields } from '../../requests/validate'
import OtpVerify from '../../modals/otpVerify/OtpVerify'
import { Input,Button } from 'antd';

function RegisterUser() {
    const [data, setData] = useState({username:'',email:'',phone:'',city:'',state:'',country:'',pincode:'',password:''});
    const [validateErrors,setValidateErrors]=useState({username:'',email:'',phone:''})
    const[validateFormErrors,setValidateFormErrors]=useState({city:'',state:'',country:'',pincode:'',password:''})
    const[image,setImage]=useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const[password,setPassword]=useState('')
    const[errorMessage,setErrorMessage]=useState('')
    const[error,setError]=useState(false)
    const [showOtpModal, setShowOtpModal] = useState<boolean>(false);
    const[isVerified,setIsVerified]=useState(false)
    //Mutation for adding user
    const [addUser] = useMutation(Add_User, { client });
    //Mutation for sending otp for verification after sending otp the otpverify modal is displayed
    const[requestOtp]=useMutation(REQUEST_OTP,{client})
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
        const testdata={
          password:data.password,
          city:data.city,
          state:data.state,
          country:data.country,
          pincode:data.pincode,
        }
        const errors=validateFormFields(testdata)
        setValidateFormErrors(errors)
        if(testdata.password=='' ||testdata.city==''||testdata.pincode==''||testdata.state==''||testdata.country=='')
        {
          return
        }
        //Checks whether the password and confirmpassword fields are same
        if(data.password!=password)
        {
          setError(true)
          setErrorMessage('Passwords do not match')
        }
        else if(image===null)
        {
          setErrorMessage("Profile Photo needs to be Uploaded")
          setError(true)
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
      //stores password in a state for comparing 
     setPassword(e.target.value)
  };

const handleOtp=async()=>
  {
    const testdata={
      username:data.username,
      email:data.email,
      phone:data.phone,
    }
    const validationErrors=validateRegistration(testdata)
    setValidateErrors(validationErrors)
    if(testdata.username=='' || testdata.phone==''||testdata.email=='')
    {
      return
    }
    try
    {
    //Requesting OTP
    const{data:response}= await requestOtp({ variables: { phone:data.phone,username:data.username,email:data.email } });
    console.log(response.requestOtp.status)
    if(response.requestOtp.status!=false)
    {
      //if the response is true the the modal for inserting otp is displayed
      setShowOtpModal(true);
      setError(false)
      toast.success(response.requestOtp.message)
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
      toast.error("Some Error has Occured")
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
                <Input type="text" name="username" placeholder="Enter your name" className={validateErrors.username?styles.inputError:''} onChange={handleChange} />
                {validateErrors.username &&  <span className={styles.error}>{validateErrors.username}</span>}
                <Input type="text" name="email" placeholder="Enter your email" className={validateErrors.email?styles.inputError:''} onChange={handleChange} />
                {validateErrors.email &&  <span className={styles.error}>{validateErrors.email}</span>}
                <Input type="text" name="phone" placeholder="Enter your phone" className={validateErrors.phone?styles.inputError:''} onChange={handleChange} />
                {validateErrors.phone &&  <span className={styles.error}>{validateErrors.phone}</span>}
                {error && !isVerified && <span className={styles.error}>{errorMessage}</span>}<br/>
             <Button type="primary"  onClick={handleOtp} >Verify</Button>
                </div>}
                {/* after verification the fields for adding the rest data are displayed */}
                { isVerified && <div className={styles.formdiv}>
                <Input type="text" name="city" placeholder="Enter your city" className={validateFormErrors.city?styles.inputError:''} onChange={handleChange} />
                {validateFormErrors.city &&  <span className={styles.error}>{validateFormErrors.city}</span>}
                <Input type="text" name="state" placeholder="Enter your state" className={validateFormErrors.state?styles.inputError:''} onChange={handleChange} />
                {validateFormErrors.state &&  <span className={styles.error}>{validateFormErrors.state}</span>}
                <Input type="text" name="country" placeholder="Enter your country" className={validateFormErrors.country?styles.inputError:''} onChange={handleChange} />
                {validateFormErrors.country &&  <span className={styles.error}>{validateFormErrors.country}</span>}
                <Input type="text" name="pincode" placeholder="Enter your pincode"  className={validateFormErrors.country?styles.inputError:''} onChange={handleChange} />
                {validateFormErrors.pincode &&  <span className={styles.error}>{validateFormErrors.pincode}</span>}
                <Input type="password" name="password" placeholder="Enter your password" className={validateFormErrors.password?styles.inputError:''} onChange={handleChange} />
                      {validateFormErrors.password &&  <span className={styles.error}>{validateFormErrors.password}</span>}
                <Input type="password" name="confirmPassword" placeholder="Confirm your password" className={validateFormErrors.password?styles.inputError:''} onChange={handlePassword} />
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
