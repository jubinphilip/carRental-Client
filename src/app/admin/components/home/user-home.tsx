import React, { useEffect } from 'react'
import styles from './home.module.css'
import client from '@/services/apollo-client';
import { useQuery } from '@apollo/client'
import { GET_RENT_VEHICLES } from '@/app/queries/queries'
function Home() {
  const { data, error, loading } = useQuery(GET_RENT_VEHICLES, {client})
  useEffect(()=>{
    if(data)
    {
      console.log("Fetched Vehicles:",data.rentVehicles)
    }
  },[data])
  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error("Error fetching data:", error); 
    return <p>Error: {error.message}</p>; 
  }
  
  return (
    <div className={styles.rentalList}>
      {data?.rentVehicles?.map((rental:any) => (
        <div key={rental.id} className={styles.rentalItem}>
          <div className={styles.imageContainer}>
            <img src={rental.Vehicle.fileurl} alt={`${rental.Vehicle.Manufacturer.manufacturer} ${rental.Vehicle.Manufacturer.model}`} className={styles.vehicleImage} />
          </div>
          <div className={styles.details}>
            <h2>{rental.Vehicle.Manufacturer.manufacturer} {rental.Vehicle.Manufacturer.model} ({rental.Vehicle.Manufacturer.year})</h2>
            <p className={styles.description}>{rental.Vehicle.description}</p>
            <div className={styles.specs}>
              <span>Type: {rental.Vehicle.type}</span>
              <span>Fuel: {rental.Vehicle.fuel}</span>
              <span>Transmission: {rental.Vehicle.transmission}</span>
              <span>Seats: {rental.Vehicle.seats}</span>
            </div>
            <div className={styles.rentalInfo}>
              <span className={styles.price}>Price: ${rental.price} per day</span>
              <span className={styles.quantity}>Available: {rental.quantity}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home
