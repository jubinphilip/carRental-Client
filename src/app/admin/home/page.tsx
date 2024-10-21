'use client'
import React, { useEffect } from 'react'
import styles from './home.module.css'
import client from '@/services/apollo-client';
import { useMutation, useQuery } from '@apollo/client'
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Modal} from 'antd'
import { GET_RENT_VEHICLES } from '@/app/queries/queries'
import { DELETE_RENT_VEHICLE } from '../queries/admin-queries';
import Loader from '@/components/Preloader/PreLoader';
import { MdAutoDelete } from "react-icons/md";
function Home() {
  const { data, error, loading,refetch } = useQuery(GET_RENT_VEHICLES, {client})//Query for getting all rented vehicles
  const [deleteRentVehicles]=useMutation(DELETE_RENT_VEHICLE,{client})//Mutation for deleting vehicles
  useEffect(()=>{
    if(data)
    {
      console.log("Fetched Vehicles:",data.rentVehicles)
    }
  },[data])
  if (loading) return <p><Loader/></p>;
  if (error) {
    console.error("Error fetching data:", error); 
    return <p>Error: {error.message}</p>; 
  }

  //function for deleting a vehicle from rented vehicles list
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: 'Are you sure you want to delete this vehicle?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        try {
          const response = await deleteRentVehicles({ variables: { id } });
          if (response.data.deleteVehicle.status === 'Success') {
            toast.success("Vehicle Deleted");
            refetch()
          } else {
            toast.error("Error Deleting Vehicle");
          }
        } catch (error) {
          console.error('Error:', error);
          toast.error('Failed to delete vehicle');
        }
      },
      onCancel() {
        toast.info("Deletion Cancelled");
      },
    });
  };


  
  return (
    <div className={styles.rentalList}>
      <ToastContainer/>
      <h1 className={styles.homehead}>Rented Vehicles</h1>
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
             
              <span className={styles.quantity}>Available: {rental.quantity}<br/> </span>
            </div>
            <div  className={styles.iconContainer}>
           < MdAutoDelete className={styles.deleteIcon}  onClick={()=>handleDelete(rental.id)}/>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home
