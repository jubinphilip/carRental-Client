'use client';
import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_BOOKINGS } from '../queries/user-queries';
import client from '@/services/apollo-client';
import { useAppContext } from '@/context/appContext';
import styles from './my-bookings.module.css';
import Loader from '@/components/PreLoader';

interface Manufacturer {
  model: string;
  manufacturer: string;
}

interface Vehicle {
  id: string;
  type: string;
  transmission: string;
  fuel: string;
  fileurl: string;
  Manufacturer: Manufacturer;
}

interface RentedVehicle {
  id: string;
  Vehicle: Vehicle;
}

interface User {
  id: string;
  username: string;
  phone: string;
}

interface Booking {
  id: string;
  startdate: string;
  enddate: string;
  amount: number;
  startlocation: string;
  droplocation: string;
  payment_status: string;
  createdAt: string;
  User: User;
  RentedVehicle: RentedVehicle;
}

interface GetBookingsData {
  getUserBookings: Booking[];
}

function MyBookings() {
  const [bookingsData, setBookingsData] = useState<Booking[]>([]);
  const { user } = useAppContext();
  const userid = user?.userid;
  console.log('User ID:', userid);

  const { loading, error, data } = useQuery<GetBookingsData>(GET_USER_BOOKINGS, {
    variables: { id: userid },
    client,
    skip: !userid,
    onCompleted: (fetchedData) => {
      setBookingsData(fetchedData.getUserBookings);
      console.log('Fetched bookings:', fetchedData.getUserBookings);
    }
  });

  if (loading) return <p><Loader/></p>;
  if (error) return <p>Error fetching bookings: {error.message}</p>;

  return (
    <div className={styles.mainContainer}>
      <div className={styles.container}>
        <h1 className={styles.bookingsHead}>My Bookings</h1>

        {bookingsData.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <div className={styles.bookingCards}>
            {bookingsData.map((booking) => {
              const isDisabled = booking.payment_status === 'pending';

              // Parse and format createdAt date
              const createdAtTimestamp = booking.createdAt;
              const createdAt = new Date(Number(createdAtTimestamp)); // Ensure it's parsed correctly
              const formattedCreatedAt = !isNaN(createdAt.getTime())
                ? createdAt.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : 'Invalid date';

              return (
                <div 
                  className={`${styles.bookingCard} ${isDisabled ? styles.disabledCard : ''}`} 
                  key={booking.id}
                >
                  <div className={styles.imageContainer}>
                    <img className={styles.cardImage} src={booking.RentedVehicle.Vehicle.fileurl} alt="Vehicle" />
                  </div>
                  <div className={styles.carname}>
                    <h4>{booking.RentedVehicle.Vehicle.Manufacturer.manufacturer}</h4>
                    <p>{booking.RentedVehicle.Vehicle.Manufacturer.model}</p>
                    <p>Booked At: {formattedCreatedAt}</p>
                    {/* Display the cancellation message */}
                    {isDisabled && (
                      <p className={styles.cancelledBooking}>This Booking Was Not Completed</p>
                    )}
                  </div>
                  <div className={styles.dateContainer}>
                    <p>Start Date: {booking.startdate}</p>
                    <p>End Date: {booking.enddate}</p>
                  </div>
                  <div className={styles.detailsContainer}>
                    <p>Amount: {booking.amount}₹</p>
                    <p>Start Location: {booking.startlocation}</p>
                    <p>Drop Location: {booking.droplocation}</p>
                    <p>Vehicle Type: {booking.RentedVehicle.Vehicle.type}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyBookings;
