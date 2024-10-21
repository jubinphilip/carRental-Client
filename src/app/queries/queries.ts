import { gql } from "@apollo/client";
//Query used by both admin and user for viewing the rented vehicles
export const GET_RENT_VEHICLES = gql`
  query GetRentVehicles($dateRange:[String]) {
    rentVehicles(dateRange:$dateRange) {
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
  }
`;
