import { gql } from '@apollo/client';

export const Add_User = gql`
  mutation AddUser($file: Upload!,$input: AddUserInput!) {
    addUser(file: $file,input: $input) {
      statuscode
      status
      message
      data
      {
        id
        email
      }
    }
  }
`;

export const REQUEST_OTP = gql`
  mutation requestOTP($phone: String!,$username:String!,$email:String!) {
    requestOtp(phone: $phone,username:$username,email:$email) {
      statuscode
      status
      message
    }
  }
`;

export const VERIFY_OTP = gql`
  mutation verifyOtp($phone: String!, $otp: String!) {
    verifyOtp(phone: $phone, otp: $otp) {
      statuscode
      status
      message
    }
  }
`;

export const LOGIN_USER = gql`
  mutation LoginUser($input: LoginUserInput!) {
    loginUser(input: $input) {
      statuscode
      id
      email
      token 
      fileurl
      username
      status
      message
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
    statuscode 
    status
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



export const GET_BOOKED_DATES = gql`
  query GetBookedDates($carId: ID!, $quantity: String!) {
    bookedDates(carId: $carId, quantity: $quantity) {
      dates
    }
  }
`;

export const CREATE_ORDER = gql`
  mutation createOrder($amount: Float!, $currency: String!) {
    createOrder(amount: $amount, currency: $currency) {
      id
      currency
      amount
    }
  }
`;

export const VERIFY_PAYMENT = gql`
  mutation verifyPayment($paymentId: String!, $orderId: String!,$razorpay_signature:String!,$bookingId:String!) {
    verifyPayment(paymentId: $paymentId, orderId: $orderId,razorpay_signature:$razorpay_signature,bookingId:$bookingId) {
      signature
    }
  }
`;

export const ADD_REVIEW=gql`
mutation addReview($input:ReviewInput!){
addReview (input:$input){
    status
    message
  }
}`

export const GET_REVIEW = gql`
 query GetCarReviews($carId: ID!) {
  getCarReviews(carId: $carId) {
    averageRating
    reviews {
      id
      rating
      review
      User {
        id
        username
        createdAt
      }
    }
  }
}

`;


export const GET_USER_BOOKINGS = gql`
  query getUserBookings($id:ID!) {
    getUserBookings(id:$id) {
      id
      startdate
      amount
      enddate
      startlocation
      payment_status
      createdAt
      droplocation
      RentedVehicle {
        id
        price
        Vehicle {
          id
          fileurl
          type
          transmission
          fuel
          Manufacturer {
          manufacturer
            model
          }
        }
      }
    }
  }
`;
