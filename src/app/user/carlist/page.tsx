'use client'
import React, { useEffect, useState } from 'react';
import { GET_RENT_VEHICLES } from '@/app/queries/queries';
import { useQuery } from '@apollo/client';
import styles from './carlist.module.css';
import client from '@/app/services/apollo-client';
import ViewCar from '../modals/viewCar/ViewCar';


const Types = [
    {
        id: 1,
        image: '/assets/suv.png',
        tag: 'SUV',
    },
    {
        id: 2,
        image: '/assets/sedan.png',
        tag: 'Sedan',
    },
    {
        id: 3,
        image: '/assets/hatchback.png',
        tag: 'Hatchback',
    },
    {
        id: 4,
        image: '/assets/muv.png',
        tag: 'MUV',
    },
];


function CarList() {
    const { data, error, loading } = useQuery(GET_RENT_VEHICLES, { client });
    const [selectedCar, setSelectedCar] = useState('');
    const [search, setSearch] = useState('');
    const[showCar,setShowCar]=useState(false)
    const[carId,setCarId]=useState('')

    useEffect(() => {
        if (data) {
            console.log("Fetched Vehicles:", data.rentVehicles);

        }
    }, [data]);

    function handleTypeCardClick(tag: string) {
        setSelectedCar(tag)
    }
    if(error)
    {
        console.log(error)
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setSearch(e.target.value);
    };
    const handleCardClick=(id:string)=>
    {
        setCarId(id)
        setShowCar(true)
    }

    const filteredCars = data?.rentVehicles?.filter((car: any) => {
        const matchesType = selectedCar ? car.Vehicle.type.toLowerCase() === selectedCar.toLowerCase() : true;
        const matchesSearch = car.Vehicle.Manufacturer.model.toLowerCase().includes(search.toLowerCase());
        return matchesType && matchesSearch; 
    });

    return (
        <div className={styles.mainContainer}>
            <div className={styles.container}>
                <h1 className={styles.mainhead}>Drive Your Adventure</h1>
                <p className={styles.maindesc}>
                    Choose from our fleet of versatile vehicles to match your journey. Whether it’s a family road trip or a solo escape, find the ride that’s perfect for any adventure.
                </p>
                <div className={styles.searchbox}>
                    <input
                        type="text"
                        name="search"
                        placeholder='Search for Cars'
                        className={styles.searchinput}
                        value={search}
                        onChange={handleChange}
                    />
                    <img className={styles.lens} src="/assets/lens.png" alt="" />
                </div>
                <div className={styles.typeCards}>
                    {Types.map((type) => (
                        <div
                            key={type.id}
                            className={`${styles.typeCard} ${selectedCar === type.tag ? styles.selectedType : ''}`}
                            onClick={() => handleTypeCardClick(type.tag)}>
                            <img src={type.image} alt={type.tag} />
                            <p>{type.tag}</p>
                        </div>
                    ))}
                </div>
                {showCar &&<ViewCar  carid={carId} modalstate={setShowCar}/>}
                <div className={styles.carsContainer}>
      {filteredCars?.map((rental:any, index:any) => (
        <div className={`${styles.carcard} ${styles.cardHover}`} key={index} onClick={()=>handleCardClick(rental.id)}>
            <img 
              className={styles.carImage} 
              src={rental.Vehicle.fileurl} 
              alt={`${rental.Vehicle.Manufacturer.manufacturer} ${rental.Vehicle.Manufacturer.model}`} />
         
          <div className={styles.descriptionContainer}>
            <h3 className={styles.carName}>
              {rental.Vehicle.Manufacturer.manufacturer} {rental.Vehicle.Manufacturer.model}
            </h3>
            <p className={styles.carType}>Type: {rental.Vehicle.type}</p>
            <p className={styles.carRate}>Rate: ${rental.price}/day</p>
            <div className={styles.buttonContainer}>
            <button className={styles.bookButton}>Book Now</button>
            </div>
            
          </div>
        </div>
      ))}
    </div>
            </div>
        </div>
    );
}

export default CarList;
