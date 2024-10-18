'use client';
import React, { useEffect, useState } from 'react';
import { GET_RENT_VEHICLES } from '@/app/queries/queries';
import { useQuery } from '@apollo/client';
import styles from './carlist.module.css';
import client from '@/services/apollo-client';
import ViewCar from '../../../components/viewCar/ViewCar';
import typesenseClient from '@/services/typesense-config';
import Loader from '@/components/PreLoader';

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
  const { data, error, loading: graphQLLoading } = useQuery(GET_RENT_VEHICLES, { client });
  const [cars, setCars] = useState<Car[]>([]);
  const [selectedType, setSelectedType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCar, setShowCar] = useState(false);
  const [carId, setCarId] = useState('');
  const [loading, setLoading] = useState(true); // renamed to avoid confusion with GraphQL loading

  const [priceRange, setPriceRange] = useState<string[]>([]); // Price filter state

  // Set loading state initially and after data fetch
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 5000); // Show loader for 2 seconds
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (data && data.rentVehicles) {
      const formattedCars = data.rentVehicles.map((rental: any) => ({
        id: rental.id,
        manufacturer: rental.Vehicle.Manufacturer.manufacturer,
        model: rental.Vehicle.Manufacturer.model,
        year: rental.Vehicle.Manufacturer.year,
        price: rental.price,
        type: rental.Vehicle.type,
        image: rental.Vehicle.fileurl,
      }));
      setCars(formattedCars);
    }
  }, [data]);

  const filterCars = () => {
    return cars.filter((car) => {
      const priceNumber = parseFloat(car.price);
      if (priceRange.length === 0) return true;

      return priceRange.some((range) => {
        switch (range) {
          case '1000-2000':
            return priceNumber >= 1000 && priceNumber < 2000;
          case '2000-3000':
            return priceNumber >= 2000 && priceNumber < 3000;
          case '3000-5000':
            return priceNumber >= 3000 && priceNumber < 5000;
          case '5000+':
            return priceNumber >= 5000;
          default:
            return false;
        }
      });
    });
  };

  useEffect(() => {
    handleSearch();
  }, [selectedType, searchQuery, priceRange]);

  const handleSearch = async () => {
    try {
      const searchParams: any = {
        q: searchQuery,
        query_by: 'manufacturer,model,year,type',
        per_page: 100,
      };

      if (selectedType) {
        searchParams.filter_by = `type:=${selectedType}`;
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

  const handleTypeCardClick = (tag: string) => {
    setSelectedType((prevType) => (prevType === tag ? '' : tag));
    setSearchQuery('');
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCardClick = (id: string) => {
    setCarId(id);
    setShowCar(true);
  };

  const handlePriceRangeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setPriceRange((prev) => (checked ? [...prev, value] : prev.filter((range) => range !== value)));
  };

  if (error) {
    console.error(error);
    return <div>Error occurred: {error.message}</div>;
  }

  // Conditionally render the loader if loading from GraphQL or custom state
  if (loading || graphQLLoading) return <Loader />;

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
            placeholder="Search for Cars"
            className={styles.searchinput}
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
          <button className={styles.searchButton} onClick={handleSearch}>
            <img className={styles.lens} src="/assets/lens.png" alt="Search" />
          </button>
        </div>
        {/* Price Filter Section */}
        <div className={styles.priceFilter}>
          <h3 className={styles.pricefilterhead}>Filter by Price</h3>
          <div className={styles.priceSelectors}>
            <div>
              <label>
                <input type="checkbox" value="1000-2000" onChange={handlePriceRangeChange} />
                1000 - 2000
              </label>
            </div>
            <div>
              <label>
                <input type="checkbox" value="2000-3000" onChange={handlePriceRangeChange} />
                2000 - 3000
              </label>
            </div>
            <div>
              <label>
                <input type="checkbox" value="3000-5000" onChange={handlePriceRangeChange} />
                3000 - 5000
              </label>
            </div>
            <div>
              <label>
                <input type="checkbox" value="5000+" onChange={handlePriceRangeChange} />
                5000+
              </label>
            </div>
          </div>
        </div>
        {/* Type Filter Section */}
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
          {filterCars().map((car, index) => (
            <div className={`${styles.carcard} ${styles.cardHover}`} key={index} onClick={() => handleCardClick(car.id)}>
              <img className={styles.carImage} src={car.image} alt={`${car.manufacturer} ${car.model}`} />
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
