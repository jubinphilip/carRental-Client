import { gql } from '@apollo/client';

export const Admin_Login = gql`
  mutation AdminLogin($input:AdminInput!) {
    adminLogin(input:$input) {
      id
      username
      token
    }
  }
`;
export const ADD_MANUFACTURER = gql`
  mutation AddManufacturer($input: AddManufacturer!) {
    addManufacturer(input: $input) {
      id
      status
    }  
  }
`;
export const GET_MANUFACTURERS = gql`
  query GetManufacturers {
    getManufacturers {
      id
      manufacturer
      model
      year
    }
  }`;



  export const ADD_VEHICLE = gql`
  mutation AddVehicle($primaryFile: Upload!, $secondaryFiles: [Upload!]!, $input: Vehicledata!) {
    addVehicle(primaryFile: $primaryFile, secondaryFiles: $secondaryFiles, input: $input) {
      id
      status
    }
  }
`;


export const GET_VEHICLES = gql`
  query GetVehicles {
    getCarsData {
      id
      fileurl
      secondaryImageUrls
      type
      transmission
      description
      fuel
      seats
      Manufacturer {
        id
        manufacturer
        model
        year
      }
    }
  }`;
  export const UPLOAD_EXCEL = gql`
  mutation UploadExcel($file: Upload!) {
    uploadExcel(file: $file) {
      status
      message
    }
  }
`;
  export const DELETE_VEHICLE = gql`
  mutation deleteVehicle($id: ID!) {
    deleteVehicle(id: $id) {
      id
      status
    }
  }
`;
export const GET_CAR_DATA = gql`
  query getCarData($id: ID!) {
    getCarData(id: $id) {
      id
      fileurl
      type
      transmission
      description
      fuel
      seats
      Manufacturer {  
        id   
        manufacturer 
        model
        year
      }
    }
  }
`;

export const EDIT_VEHICLE = gql`
  mutation EditVehicle($file: Upload!, $input: Vehicledata!) {
    editVehicle(file: $file, input: $input) {
      id
      status
    }
  }
`;

export const ADD_RENT = gql`
  mutation AddRent( $input: Rentdata!) {
    addRent( input: $input) {
      id
      status
    }
  }
`;

export const GET_BOOKINGS = gql`
  query getBookings {
    getBookings {
      id
      startdate
      amount
      enddate
      startlocation
      droplocation
      RentedVehicle {
        id
        Vehicle {
          id
          type
          transmission
          fuel
          Manufacturer {
          manufacturer
            model
          }
        }
      }
    User{
    id
    username
    phone
    }
    }
  }
`;




