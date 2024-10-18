import React from 'react';
import { IoClose } from "react-icons/io5";
import { useQuery } from '@apollo/client';
import { GET_CAR_INFO } from '../../queries/user-queries';
import client from '@/services/apollo-client';
import styles from './ViewCar.module.css';
import { useRouter } from 'next/navigation';
import { BsFillFuelPumpFill } from "react-icons/bs";
import { PiSeat } from "react-icons/pi";
import { GiGearStick } from "react-icons/gi";



interface ViewCarProps
 {   carid: string | null;   
  modalstate: React.Dispatch<React.SetStateAction<boolean>>; 
}  
 
 const ViewCar: React.FC<ViewCarProps> = ({ carid, modalstate }) =>
 {
  const { loading, error, data } = useQuery(GET_CAR_INFO, { variables: { id: carid }, client });
  const router=useRouter()
  const handleClose = () => {
    modalstate(false);
  };
  function handleBook()
  {
    router.push(`/user/bookcar/${carid}`)
  }
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const vehicle = data?.getCarInfo?.Vehicle;
  console.log(vehicle)
  console.log(carid)
  if (!vehicle) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.header}>
          <h2 className={styles.title}> {vehicle.Manufacturer.manufacturer} {vehicle.Manufacturer.model}</h2>
          <button onClick={handleClose} className={styles.closeButton}>
            <IoClose  />
          </button>
        </div>
        
        <div className={styles.imageGallery}>

      <img src={vehicle.fileurl} alt={vehicle.model} className={styles.mainImage} />
      {Array.isArray(vehicle.secondaryImageUrls) && vehicle.secondaryImageUrls.length > 0 ? (
        vehicle.secondaryImageUrls.map((url:any, index:any) => (
          <img 
            key={index} 
            src={url} 
            alt={`Secondary image ${index + 1}`} 
            className={styles.subImage} 
          />
        ))
      ) : (
        <p>No secondary images available.</p> 
      )}
    </div>
        
        <div className={styles.details}>
          <div className={styles.firstContainer}>
          <p><strong>Year:</strong> {vehicle.Manufacturer.year}</p>
          <p className={styles.price}><strong>Price:</strong> {data?.getCarInfo?.price}₹/<span>day</span></p>
          </div>
          <div className={styles.secondContainer}>
          <p> <BsFillFuelPumpFill className={styles.icons}/> {vehicle.fuel}</p>
          <p> <PiSeat className={styles.icons}/> {vehicle.seats}</p>
          <p> <GiGearStick className={styles.icons}/>{vehicle.transmission}</p>
          </div>
          <p><strong>Description:</strong> {vehicle.description}</p>
        </div>
        
        <button className={styles.bookButton} onClick={handleBook}>
          Book Now
        </button>
      </div>
    </div>
  );
}

export default ViewCar;