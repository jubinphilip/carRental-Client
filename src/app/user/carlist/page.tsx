'use client'
import React, { useEffect, useState } from 'react';
import { GET_RENT_VEHICLES } from '@/app/queries/queries';
import { useQuery } from '@apollo/client';
import styles from './carlist.module.css';
import client from '@/services/apollo-client';
import ViewCar from '@/app/user/modals/viewCar/ViewCar';
import typesenseClient from '@/services/typesense-config';
import Loader from '@/components/Preloader/PreLoader';
import { useAppContext } from '@/context/appContext';
import ChooseDate from '../modals/chooseDate/ChooseDate';

interface Car {
  id: string;
  manufacturer: string;
  model: string;
  year: string;
  price: string;
  type: string;
  image: string;
}

function CarList() {
  const { dateRange } = useAppContext();
  const { data, error, loading: graphQLLoading } = useQuery(GET_RENT_VEHICLES, {
    variables: { dateRange: dateRange ? dateRange : undefined },
    client,
  });
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedType, setSelectedType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCar, setShowCar] = useState(false);
  const [carId, setCarId] = useState('');
  const [loading, setLoading] = useState(true);
  const [priceRange, setPriceRange] = useState<string[]>([]);

  const Types = [
    { id: 1, image: '/assets/suv.png', tag: 'SUV' },
    { id: 2, image: '/assets/sedan.png', tag: 'Sedan' },
    { id: 3, image: '/assets/hatchback.png', tag: 'Hatchback' },
    { id: 4, image: '/assets/muv.png', tag: 'MUV' },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (data && data.rentVehicles) {
      console.log(data.rentVehicles);
      const validIds = data.rentVehicles.map((rental: any) => rental.id);
      handleSearch(validIds);
    }
  }, [data, selectedType, searchQuery, priceRange]);

  // Function for searching vehicle in Typesense
  const handleSearch = async (validIds: string[]) => {
    try {
      const searchParams: any = {
        q: searchQuery,
        query_by: 'manufacturer,model,year,type',
        per_page: 100,
        filter_by: `id:=[${validIds.join(',')}]`,
      };

      if (selectedType) {
        searchParams.filter_by += ` && type:=${selectedType}`;
      }

      const searchResults = await typesenseClient.collections('cars').documents().search(searchParams);

      if (searchResults && Array.isArray(searchResults.hits)) {
        const validResults = searchResults.hits
          .map((hit) => hit.document as Car)
          .filter((car): car is Car => car !== undefined);
        setCars(validResults);
      } else {
        setCars([]);
      }
    } catch (error) {
      console.error('Error searching:', error);
      setCars([]);
    }
  };

  // Function for selecting type of vehicle
  const handleTypeCardClick = (tag: string) => {
    setSelectedType((prevType) => (prevType === tag ? '' : tag));
    setSearchQuery('');
  };

  // Function for searching vehicle by manufacturer, model, or year
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Function for handling click on a car
  const handleCardClick = (id: string) => {
    setCarId(id);
    setShowCar(true);
  };

  // Function for setting the price range of a car
  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const numericValue = value.replace(' ₹', ''); // Remove the currency symbol for easier handling
    setPriceRange((prev) => (checked ? [...prev, numericValue] : prev.filter((range) => range !== numericValue)));
  };

  // Function for filtering cars with all filter options
  const filterCars = () => {
    return cars.filter((car) => {
      const priceNumber = parseFloat(car.price); // Parse price to number
      if (priceRange.length === 0) return true; // No filters applied

      return priceRange.some((range) => {
        switch (range) {
          case '1000-2000':
            return priceNumber >= 1000 && priceNumber < 2000; // Filter for 1000-2000
          case '2000-3000':
            return priceNumber >= 2000 && priceNumber < 3000; // Filter for 2000-3000
          case '3000-5000':
            return priceNumber >= 3000 && priceNumber < 5000; // Filter for 3000-5000
          case '5000+':
            return priceNumber >= 5000; // Filter for 5000+
          default:
            return false; // If range doesn't match, exclude car
        }
      });
    });
  };

  if (error) {
    console.error(error);
    return <div>Error occurred: {error.message}</div>;
  }

  if (loading || graphQLLoading) return <Loader />;

  return (
    <div className={styles.mainContainer}>
      <ChooseDate />
      <div className={styles.container}>
        <h1 className={styles.mainhead}>Drive Your Adventure</h1>
        <p className={styles.maindesc}>
          Choose from our fleet of versatile vehicles to match your journey. Whether it's a family road trip or a solo escape, find the ride that's perfect for any adventure.
        </p>
        <div className={styles.searchbox}>
          <input
            type="text"
            name="search"
            placeholder="Search for Cars by Model Manufacturer or Year"
            className={styles.searchinput}
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        </div>
        <div className={styles.priceFilter}>
          <h3 className={styles.pricefilterhead}>Filter by Price</h3>
          <div className={styles.priceSelectors}>
            {['1000-2000', '2000-3000', '3000-5000', '5000+'].map((range) => (
              <div key={range}>
                <label>
                  <input type="checkbox" value={range} onChange={handlePriceRangeChange} />
                  {range} ₹
                </label>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.typeCards}>
          {Types.map((type) => (
            <div
              key={type.id}
              className={`${styles.typeCard} ${selectedType === type.tag ? styles.selectedType : ''}`}
              onClick={() => handleTypeCardClick(type.tag)}
            >
              <img src={type.image} alt={type.tag} />
              <p>{type.tag}</p>
            </div>
          ))}
        </div>
        {showCar && <ViewCar carid={carId} modalstate={setShowCar} />}
        <div className={styles.carsContainer}>
          {filterCars().map((car) => (
            <div className={`${styles.carcard} ${styles.cardHover}`} key={car.id} onClick={() => handleCardClick(car.id)}>
              <div className={styles.carImageContainer}>
                <img className={styles.carImage} src={car.image} alt={`${car.manufacturer} ${car.model}`} />
              </div>
              <div className={styles.descriptionContainer}>
                <h3 className={styles.carName}>
                  {car.manufacturer} {car.model}
                </h3>
                <p className={styles.carType}>Type: {car.type}</p>
                <p>Year: {car.year}</p>
                <p className={styles.carRate}>Rate: ₹{car.price}/day</p>
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
