interface LoginData{
    username:string,
    password:string,
}
const validateAdmin=(record:LoginData)=>
{
    const errors={
        username:'',
        password:''
    };
    if(!record.username)
        errors.username="email is required"
    if(!record.password)
        errors.password="password is required"

    return errors
}
export default validateAdmin