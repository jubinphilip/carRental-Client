'use client'
import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_BOOKINGS } from '../queries/admin-queries';
import client from '@/services/apollo-client';
import { FaWindowClose } from "react-icons/fa";
import { DatePicker } from 'antd';
import styles from './failed-bookings.module.css';
import moment, { Moment } from 'moment'; 
import Loader from '@/components/Preloader/PreLoader';




interface Manufacturer {
  model: string;
  manufacturer: string;
}

interface Vehicle {
  id: string;
  type: string;
  transmission: string;
  fuel: string;
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
  createdAt:string;
  startlocation: string;
  droplocation: string;
  payment_status:string;
  status:string;
  User: User;
  RentedVehicle: RentedVehicle;
}

interface GetBookingsData {
  getBookings: Booking[];
}

function ViewBookings() {
  //Query for Getting Booking Records from Database
  const { loading, error, data } = useQuery<GetBookingsData>(GET_BOOKINGS, { client });

  const [bookingsData, setBookingsData] = useState<Booking[]>([]);
  const [date, setDate] = useState<Moment | null>(null);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (data && data.getBookings) {
      // Filter bookings with status "completed"
      const completedBookings = data.getBookings.filter(
        (booking) => booking.payment_status === "Booking Failed"
      );
  
      setBookingsData(completedBookings);
      setFilteredBookings(completedBookings);
      console.log("Failed bookings:", completedBookings);
    }
  }, [data]);
  

//Filters the bookings with date
  useEffect(() => {
    if (date) {
      const filtered = bookingsData.filter((booking) => {
        const selectedDate = moment(date.toDate()).format('MM/DD/YYYY'); // Format selected date to string
        const formattedDate = moment(Number(booking.createdAt)).format('MM/DD/YYYY'); // Format createdAt to string
        
        console.log("Selected Date:", selectedDate, "Booking Date:", formattedDate);
        
        return selectedDate === formattedDate; // Compare formatted date strings
      });
      setFilteredBookings(filtered);
    } else {
      setFilteredBookings(bookingsData); 
    }
  }, [date, bookingsData]);

  if (loading) return <Loader/>;
  if (error) return <p>Error: {error.message}</p>
  
  const handleDate = (date: Moment | null) => {
    setDate(date); 
    console.log(date)
  };


 



//Function for handling the return status
  const handleReturnStatus = async (id: string, status: string,carid:string) => {
    console.log(id, status);
    const input = {
        id: id,
        status: status,
        carid:carid
    };
   
};

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Failed Bookings</h1>
      
      <div>
   
      </div>
      <div className={styles.headContainer}>
      <DatePicker 
        onChange={handleDate} 
        value={date} 
        className={styles.datePicker}
      />
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.tableHeader}>Booking ID</th>
            <th className={styles.tableHeader}>User</th>
            <th className={styles.tableHeader}>Phone</th>
            <th className={styles.tableHeader}>Vehicle Type</th>
            <th className={styles.tableHeader}>Transmission</th>
            <th className={styles.tableHeader}>Fuel</th>
            <th className={styles.tableHeader}>Manufacturer Model</th>
            <th className={styles.tableHeader}>Booking Date</th>
            <th className={styles.tableHeader}>Start Location</th>
            <th className={styles.tableHeader}>Drop Location</th>
            <th className={styles.tableHeader}>Amount</th>
          </tr>
        </thead>
        <tbody>
          {filteredBookings.map((info, index) => (
            <tr
              key={index}
              className={`${index % 2 === 0 ? styles.tableRowEven : ''} ${styles.tableRowHover}`}
            >
              <td className={styles.tableCell}>{info.id}</td>
              <td className={styles.tableCell}>{info.User.username}</td>
              <td className={styles.tableCell}>{info.User.phone}</td>
              <td className={styles.tableCell}>{info.RentedVehicle?.Vehicle?.type}</td>
              <td className={styles.tableCell}>{info.RentedVehicle?.Vehicle?.transmission}</td>
              <td className={styles.tableCell}>{info.RentedVehicle?.Vehicle?.fuel}</td>
              <td className={styles.tableCell}>
                {info.RentedVehicle?.Vehicle?.Manufacturer?.manufacturer}{' '}
                {info.RentedVehicle?.Vehicle?.Manufacturer?.model}
              </td>
              <td className={styles.tableCell}>
  {info.createdAt ? new Date(Number(info.createdAt)).toLocaleDateString() : "N/A"}
</td>


              <td className={styles.tableCell}>{info.startlocation}</td>
              <td className={styles.tableCell}>{info.droplocation}</td>
              <td className={`${styles.tableCell} ${styles.amount}`}>{info.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewBookings;
