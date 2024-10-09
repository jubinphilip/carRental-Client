import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_BOOKINGS } from '../../queries/admin-queries';
import client from '@/app/services/apollo-client';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx'; 
import { DatePicker } from 'antd';
import styles from './view-bookings.module.css';
import moment, { Moment } from 'moment'; 
import { FaFilePdf } from "react-icons/fa6";
import { SiMicrosoftexcel } from "react-icons/si";

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
  startlocation: string;
  droplocation: string;
  User: User;
  RentedVehicle: RentedVehicle;
}

interface GetBookingsData {
  getBookings: Booking[];
}

function ViewBookings() {
  const { loading, error, data } = useQuery<GetBookingsData>(GET_BOOKINGS, { client });
  const [bookingsData, setBookingsData] = useState<Booking[]>([]);
  const [date, setDate] = useState<Moment | null>(null);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (data && data.getBookings) {
      setBookingsData(data.getBookings);
      setFilteredBookings(data.getBookings); 
    }
  }, [data]);

  useEffect(() => {
    if (date) {
      const filtered = bookingsData.filter((booking) => {
        const selectedDate = date.toDate(); 
        const startDate = new Date(booking.startdate);
        const endDate = new Date(booking.enddate);
        return selectedDate >= startDate && selectedDate <= endDate;
      });
      setFilteredBookings(filtered);
    } else {
      setFilteredBookings(bookingsData); 
    }
  }, [date, bookingsData]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleDate = (date: Moment | null) => {
    setDate(date); 
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    
    doc.text('Bookings List', 14, 16);
    
    const headers = [
      'Booking ID', 'User', 'Phone', 'Vehicle Type',
      'Transmission', 'Fuel', 'Manufacturer Model',
      'Start Date', 'End Date', 'Start Location', 
      'Drop Location', 'Amount'
    ];
    
    const content = filteredBookings.map((info) => [
      info.id,
      info.User.username,
      info.User.phone,
      info.RentedVehicle?.Vehicle?.type,
      info.RentedVehicle?.Vehicle?.transmission,
      info.RentedVehicle?.Vehicle?.fuel,
      `${info.RentedVehicle?.Vehicle?.Manufacturer?.manufacturer} ${info.RentedVehicle?.Vehicle?.Manufacturer?.model}`,
      info.startdate,
      info.enddate,
      info.startlocation,
      info.droplocation,
      info.amount.toString()
    ]);

    autoTable(doc, {
      head: [headers],
      body: content,
      startY: 20,
    });
    
    doc.save('bookings.pdf');
  };

  const downloadExcel = () => {
    const workbook = XLSX.utils.book_new(); 
    const worksheet = XLSX.utils.json_to_sheet(filteredBookings.map((info) => ({
      BookingID: info.id,
      User: info.User.username,
      Phone: info.User.phone,
      VehicleType: info.RentedVehicle?.Vehicle?.type,
      Transmission: info.RentedVehicle?.Vehicle?.transmission,
      Fuel: info.RentedVehicle?.Vehicle?.fuel,
      ManufacturerModel: `${info.RentedVehicle?.Vehicle?.Manufacturer?.manufacturer} ${info.RentedVehicle?.Vehicle?.Manufacturer?.model}`,
      StartDate: info.startdate,
      EndDate: info.enddate,
      StartLocation: info.startlocation,
      DropLocation: info.droplocation,
      Amount: info.amount
    }))); 

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bookings'); 
    XLSX.writeFile(workbook, 'bookings.xlsx'); 
  };

  return (
    <div className={styles.container}>
        
      <h1 className={styles.title}>Bookings</h1>
      
      <div>
   
      </div>
      <div className={styles.headContainer}>
      <DatePicker 
        onChange={handleDate} 
        value={date} 
      />
      <div className={styles.buttonContainer}>
      <button className={styles.downloadButton} onClick={downloadPDF}><FaFilePdf/><span>Download PDF</span></button>
      <button className={styles.downloadButton} onClick={downloadExcel}><SiMicrosoftexcel/><span>Download Excel</span></button>
      </div>
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
            <th className={styles.tableHeader}>Start Date</th>
            <th className={styles.tableHeader}>End Date</th>
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
              <td className={styles.tableCell}>{info.startdate}</td>
              <td className={styles.tableCell}>{info.enddate}</td>
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
