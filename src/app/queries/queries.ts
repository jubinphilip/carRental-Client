import { gql } from "@apollo/client";

export const GET_RENT_VEHICLES = gql`
  query GetRentVehicles {
    rentVehicles {
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
