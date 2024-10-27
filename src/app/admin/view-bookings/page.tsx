'use client'
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_BOOKINGS,UPDATE_RETURN_STATUS } from '../queries/admin-queries';
import client from '@/services/apollo-client';
import jsPDF from 'jspdf';
import { TiTick } from "react-icons/ti";
import { FaWindowClose } from "react-icons/fa";
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx'; 
import { DatePicker } from 'antd';
import styles from './view-bookings.module.css';
import moment, { Moment } from 'moment'; 
import Loader from '@/components/Preloader/PreLoader';
import { FaFilePdf } from "react-icons/fa6";
import { SiMicrosoftexcel } from "react-icons/si";
import { toast ,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
  //Updates Return status of each vehicle
  const [updateReturnVehicle, { data: updateData}] = useMutation(UPDATE_RETURN_STATUS, { client });
  const [bookingsData, setBookingsData] = useState<Booking[]>([]);
  const [date, setDate] = useState<Moment | null>(null);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);

  useEffect(() => {
    if (data && data.getBookings) {
      // Filter bookings with status "completed"
      const completedBookings = data.getBookings.filter(
        (booking) => booking.payment_status === "Completed"
      );
  
      setBookingsData(completedBookings);
      setFilteredBookings(completedBookings);
      console.log("Completed bookings:", completedBookings);
    }
  }, [data]);
  

//Filters the bookings with date
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

  if (loading) return <Loader/>;
  if (error) return <p>Error: {error.message}</p>;
  const today = new Date(); 
  const curdate = today.toISOString().split('T')[0];
  
  const handleDate = (date: Moment | null) => {
    setDate(date); 
  };
//Function for downloading the  booking data as a table
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

  //Function for downlaoding booking records as excelsheet

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

//Function for handling the return status
  const handleReturnStatus = async (id: string, status: string,carid:string) => {
    console.log(id, status);
    const input = {
        id: id,
        status: status,
        carid:carid
    };
    try {
        const { data: response } = await updateReturnVehicle({
            variables: { input: input },
            refetchQueries: [{ query: GET_BOOKINGS }]
        });
        console.log(response.updateReturnVehicle.status)
        if(response.updateReturnVehicle.status==true)
        {
          toast.success(response.updateReturnVehicle.message)
        }
        else
        {
          toast.error(response.updateReturnVehicle.message)
        }
    } catch (err) {
        console.error('Error updating return status:', err);
    }
};

  return (
    <div className={styles.container}>
        <ToastContainer/>
      <h1 className={styles.title}>Bookings</h1>
      
      <div>
   
      </div>
      <div className={styles.headContainer}>
      <DatePicker 
        onChange={handleDate} 
        value={date} 
        className={styles.datePicker}
      />
      <div className={styles.buttonContainer}>
      <button className={styles.downloadButton} onClick={downloadPDF}>
        <FaFilePdf />
        <span>Download PDF</span>
      </button>
      <button className={styles.downloadButton} onClick={downloadExcel}>
        <SiMicrosoftexcel />
        <span>Download Excel</span>
      </button>
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
            <th className={styles.tableHeader}>Return Status</th>
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
              <td className={styles.tableCell}>
              <div>
                {/* shows the option for updating return status conditionally the option shows only  if the return date is less than or equal to current date */}
    {info.enddate <= curdate && info.status === 'Pending' ? (
        <div>
            <TiTick 
                onClick={() => handleReturnStatus(info.id, 'returned', info.RentedVehicle?.id)} 
                className={styles.returnedButton} 
            />
            <FaWindowClose 
                onClick={() => handleReturnStatus(info.id, 'not returned', info.RentedVehicle?.id)} 
                className={styles.notreturnedButton} 
            />
        </div>
    ) : (
        <span>{info?.status}</span> 
    )}
</div>


</td>

            </tr>
          ))}
        </tbody>
      </table>
   <a href="/admin/sales" className={styles.sales}><button className={styles.salesButton}>Show Sales</button></a> 
   <a href="/admin/failed-bookings" className={styles.sales}><button className={styles.salesButton}>Failed Bookings</button></a> 
    </div>
  );
}

export default ViewBookings;
