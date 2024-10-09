import { gql } from '@apollo/client';

export const Add_User = gql`
  mutation AddUser($file: Upload!,$input: AddUserInput!) {
    addUser(file: $file,input: $input) {
      id
      email
    }
  }
`;
export const GET_USER=gql`
query GetUser($id: ID!) {
    getUser(id: $id){
     username
     email
     phone
     city 
     state
     country
     pincode
     fileurl
      }
    }`

export const LOGIN_USER = gql`
  mutation LoginUser($input: LoginUserInput!) {
    loginUser(input: $input) {
      id
      email
      token 
    }
  }
`;

export const GET_CAR_INFO = gql`
  query Getcarinfo($id: ID!) {
    getCarInfo(id: $id){
      id
      quantity
      price
      Vehicle {
        id
        fileurl
        secondaryImageUrls
        type
        transmission
        fuel
        seats
        description
        Manufacturer {
          id
          manufacturer
          model
          year
        }
      }
    }
  }`

export const ADD_BOOKING=gql`
  mutation AddBooking($input:BookingInput!){
  bookCar(input:$input)
  {
    id
    status
  }
  }
`

export const EDIT_USER=gql`
mutation EditUSer($file: Upload,$input:EditInput!)
{
  editUser(file: $file,input:$input)
  {
    id
    success
    message
  }
}`

export const EDIT_PASSWORD=gql`
mutation EditUSerPassword($input:EditPassword!)
{
  editUserPassword(input:$input)
  {
    id
    success
    message
  }
}`


export const REQUEST_OTP = gql`
  mutation requestOTP($phone: String!) {
    requestOtp(phone: $phone) {
      success
      message
    }
  }
`;

export const VERIFY_OTP = gql`
  mutation verifyOtp($phone: String!, $otp: String!) {
    verifyOtp(phone: $phone, otp: $otp) {
      success
      message
    }
  }
`;