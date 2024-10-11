'use client'
import React, { useEffect, useState } from 'react';
import { GET_RENT_VEHICLES } from '@/app/queries/queries';
import { useQuery } from '@apollo/client';
import styles from './carlist.module.css';
import client from '@/services/apollo-client';
import ViewCar from '../modals/viewCar/ViewCar';
import typesenseClient from '@/services/typesense-config';

interface Car {
    id: string;
    manufacturer: string;
    model: string;
    year: string;
    price: string;
    type: string;
    image: string;
}

const Types = [
    { id: 1, image: '/assets/suv.png', tag: 'SUV' },
    { id: 2, image: '/assets/sedan.png', tag: 'Sedan' },
    { id: 3, image: '/assets/hatchback.png', tag: 'Hatchback' },
    { id: 4, image: '/assets/muv.png', tag: 'MUV' },
];

function CarList() {
    const { data, error, loading } = useQuery(GET_RENT_VEHICLES, { client });
    const [cars, setCars] = useState<Car[]>([]);
    const [selectedType, setSelectedType] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [showCar, setShowCar] = useState(false);
    const [carId, setCarId] = useState('');

    useEffect(() => {
        if (data && data.rentVehicles) {
            const formattedCars = data.rentVehicles.map((rental: any) => ({
                id: rental.id,
                manufacturer: rental.Vehicle.Manufacturer.manufacturer,
                model: rental.Vehicle.Manufacturer.model,
                year: rental.Vehicle.Manufacturer.year,
                price: rental.price,
                type: rental.Vehicle.type,
                image: rental.Vehicle.fileurl
            }));
            setCars(formattedCars);
        }
    }, [data]);

    useEffect(() => {
        handleSearch();
    }, [selectedType, searchQuery]);

    const handleSearch = async () => {
        try {
            const searchParams: any = {
                q: searchQuery,
                query_by: 'manufacturer,model,year,type',
                per_page: 100
            };

            if (selectedType) {
                searchParams.filter_by = `type:=${selectedType}`;
            }

            const searchResults = await typesenseClient.collections('cars').documents().search(searchParams);

            if (searchResults && Array.isArray(searchResults.hits)) {
                const validResults = searchResults.hits
                    .map(hit => hit.document as Car)
                    .filter((car): car is Car => car !== undefined);
                setCars(validResults);
            } else {
                console.warn('No hits found or search results are undefined');
                setCars([]);
            }
        } catch (error) {
            console.error('Error searching:', error);
            setCars([]);
        }
    };

    const handleTypeCardClick = (tag: string) => {
        setSelectedType(prevType => prevType === tag ? '' : tag);
        setSearchQuery('');
    };

    const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleCardClick = (id: string) => {
        setCarId(id);
        setShowCar(true);
    };

    if (error) {
        console.log(error);
    }

    return (
        <div className={styles.mainContainer}>
            <div className={styles.container}>
                <h1 className={styles.mainhead}>Drive Your Adventure</h1>
                <p className={styles.maindesc}>
                    Choose from our fleet of versatile vehicles to match your journey. Whether it's a family road trip or a solo escape, find the ride that's perfect for any adventure.
                </p>
                <div className={styles.searchbox}>
                    <input
                        type="text"
                        name="search"
                        placeholder='Search for Cars'
                        className={styles.searchinput}
                        value={searchQuery}
                        onChange={handleSearchInputChange}
                    />
                    <button className={styles.searchButton} onClick={handleSearch}>
                        <img className={styles.lens} src="/assets/lens.png" alt="" />
                    </button>
                </div>
                <div className={styles.typeCards}>
                    {Types.map((type) => (
                        <div
                            key={type.id}
                            className={`${styles.typeCard} ${selectedType === type.tag ? styles.selectedType : ''}`}
                            onClick={() => handleTypeCardClick(type.tag)}>
                            <img src={type.image} alt={type.tag} />
                            <p>{type.tag}</p>
                        </div>
                    ))}
                </div>
                {showCar && <ViewCar carid={carId} modalstate={setShowCar} />}
                <div className={styles.carsContainer}>
                    {cars.map((car, index) => (
                        <div className={`${styles.carcard} ${styles.cardHover}`} key={index} onClick={() => handleCardClick(car.id)}>
                            <img
                                className={styles.carImage}
                                src={car.image}
                                alt={`${car.manufacturer} ${car.model}`} />
                            <div className={styles.descriptionContainer}>
                                <h3 className={styles.carName}>
                                    {car.manufacturer} {car.model}
                                </h3>
                                <p className={styles.carType}>Type: {car.type}</p>
                                <p>Year: {car.year}</p>
                                <p className={styles.carRate}>Rate: ${car.price}/day</p>
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