interface LoginData{
    email:string,
    password:string,
}
interface RegisterData{
   username:string,
   email:string,
   phone:string,
}

interface FormData{
    city:string,
    state:string,
    country:string,
    pincode:string,
    password:string,
}
export const validateUser=(record:LoginData)=>
{
    const errors={
        email:'',
        password:''
    };
    if(!record.email)
        errors.email="email is required"
    if(!record.password)
        errors.password="password is required"

    return errors
}
export const validateRegistration=(record:RegisterData)=>
{
    const errors={
        username:'',
        email:'',
        phone:'',
    }
    if(!record.username)
        errors.username="username is required"
    if(!record.email)
        errors.email="email is required"
    if(!record.phone)
        errors.phone="phone is required"
    return errors
}

export const validateFormFields=(record:FormData)=>
{
    const errors={
        password:'',
        city:'',
        state:'',
        country:'',
        pincode:'',
    }
    if(!record.city)
        errors.city="city is required"
    if(!record.state)
        errors.state="state is required"
    if(!record.country)
        errors.country="country is required"
    if(!record.pincode)
        errors.pincode="pincode is required"
    if(!record.password)
        errors.password="password is required"  
    return errors 
}