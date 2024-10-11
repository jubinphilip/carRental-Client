'use client'
import React,{useEffect, useState} from 'react'
import styles from './popular.module.css'
import { MdCarRental } from "react-icons/md";
import { useQuery } from '@apollo/client';
import client from '@/services/apollo-client';
import { GET_RENT_VEHICLES } from '@/app/queries/queries';
import { useRouter } from 'next/navigation';

function Popular() {
  const { data, error, loading } = useQuery(GET_RENT_VEHICLES, {client})
  const[user,setUser]=useState('')
  const router=useRouter()
  useEffect(()=>{
   const user= sessionStorage.getItem('user')
   setUser(user?user:'')
    if(data)
    {
      console.log("Fetched Vehicles:",data.rentVehicles)

    }})
    if (error) {
      return <p>Error: Something went wrong!(error.message)</p>;

    }
    if(loading)
    {
      return<p>loading.....</p>
    }
    function handleClick()
    {
      router.push('/user/carlist')
    }
    function handleCarClick(id:string)
    {
      console.log(id)
      const carid=id
      router.push(`/user/bookcar/${carid}`)
    }
  return (
 <div className={styles.mainContainer}>
       {!user &&  <div className={styles.container}>
            <div className={styles.textcontainer}>
            <h3 className={styles.head1}>Popular Car</h3>
            <h1 className={styles.mainhead}>Choose Your Suitable Car</h1>
            <p className={styles.desccription}>
            We present popular cars that are rented by customers to maximize your comfort on long trips.</p>
            </div>
            <div className={styles.carsContainer}>
            {data?.rentVehicles?.map((rental:any,index:any) => (
        <div className={styles.carcard} key={index}>
          <img className={styles.carImage} src={rental.Vehicle.fileurl} alt={rental.Vehicle.Manufacturer.manufacturer} />
          <h3 className={styles.carName}>{rental.Vehicle.Manufacturer.manufacturer} {rental.Vehicle.Manufacturer.model}</h3>
          <p>Type:{rental.Vehicle.type}</p>
          <p className={styles.carRate}>Rate: ${rental.price}/day</p>
          <button className={styles.rentbutton} onClick={()=>handleCarClick(rental.id)}><MdCarRental/>Rent Now</button>
        </div>
      ))}
    </div>
    <div className={styles.buttonContainer}>
        <button className={styles.button} onClick={handleClick}>Load More...</button>
    </div>
        </div>}
      
    </div>
  )
}

export default Popular
