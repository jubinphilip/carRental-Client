'use client'
import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_USER_BOOKINGS, ADD_REVIEW } from '../queries/user-queries';
import client from '@/services/apollo-client';
import { useMutation } from '@apollo/client';
import { useAppContext } from '@/context/appContext';
import styles from './my-bookings.module.css';
import { FaRegStar, FaStar, FaPenAlt } from "react-icons/fa";
import { Modal, Button, Input } from 'antd';
import Loader from '@/components/Preloader/PreLoader';
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';
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
  //Query for  fetting the bookings of a user
  const [bookingsData, setBookingsData] = useState<Booking[]>([]);
  //Mutation for adding a review for a car
  const [addReview] = useMutation(ADD_REVIEW, { client });
  const { user } = useAppContext();
  const [ratings, setRatings] = useState<{ [key: string]: number }>({}); // Store ratings per car ID
  const [carid, setCarid] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [review, setReview] = useState('');
  const [submittedReview, setSubmittedReview] = useState('');
     const router=useRouter()

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

  const handleRatingClick = (star: number, carid: string) => {
    setRatings((prev) => ({
      ...prev,
      [carid]: star, // Update the rating for the specific car
    }));
    setCarid(carid);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleOk = () => {
    setSubmittedReview(review); // Set the review to display after clicking OK
    setShowModal(false);   // Close the modal
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  const handleSubmit = async () => {
    try {
      const response = await addReview({
        variables: {
          input: {
            userid: userid,
            carid: carid,
            rating: ratings[carid], // Use the specific car's rating
            review: submittedReview,
          },
        },
      });
      console.log(response.data)
     if(response.data.addReview.status===true)
     {
        toast.success(response.data.addReview.message)
     }
     else
     {
        toast.error(response.data.addReview.message)
     }
    } catch (error) {
      console.log("Error generated", error);
    }
  };
  function handleClick(id:string)
  {
    router.push(`/user/bookcar/${id}`)
  }

  if (loading) return <p><Loader /></p>;
  if (error) return <p>Error fetching bookings: {error.message}</p>;

  return (
    <div className={styles.mainContainer}>
       <ToastContainer/>
      <div className={styles.container}>
        <h1 className={styles.bookingsHead}>My Bookings</h1>

        {bookingsData.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <div className={styles.bookingCards}>
            {bookingsData.map((booking) => {
              const isDisabled = booking.payment_status === 'pending';

              const createdAtTimestamp = booking.createdAt;
              const createdAt = new Date(Number(createdAtTimestamp));
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
                  key={booking.id} >
                 
                  <div className={styles.imageContainer} onClick={()=>handleClick(booking.RentedVehicle.id)}>
                    <img className={styles.cardImage} src={booking.RentedVehicle.Vehicle.fileurl} alt="Vehicle" />
                  </div>
                  <div className={styles.carname} onClick={()=>handleClick(booking.RentedVehicle.id)}>
                    <h4>{booking.RentedVehicle.Vehicle.Manufacturer.manufacturer}</h4>
                    <p>{booking.RentedVehicle.Vehicle.Manufacturer.model}</p>
                    <p>Booked At: {formattedCreatedAt}</p>
                    {isDisabled && (
                      <p className={styles.cancelledBooking}>This Booking Was Not Completed</p>
                    )}
                  </div>
                  <div className={styles.dateContainer} onClick={()=>handleClick(booking.RentedVehicle.id)}>
                    <p>Start Date: {booking.startdate}</p>
                    <p>End Date: {booking.enddate}</p>
                  </div>
                  <div className={styles.detailsContainer} onClick={()=>handleClick(booking.RentedVehicle.id)}>
                    <p>Amount: {booking.amount}₹</p>
                    <p>Start Location: {booking.startlocation}</p>
                    <p>Drop Location: {booking.droplocation}</p>
                    <p>Vehicle Type: {booking.RentedVehicle.Vehicle.type}</p>
                  </div>
                  <div className={styles.ratingReview}>
                    <div className={styles.starRating}>
                      <h3>Rate The Car</h3>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={styles.star}
                          onClick={() => handleRatingClick(star, booking.RentedVehicle.id)} 
                        >
                          {ratings[booking.RentedVehicle.id] >= star ? <FaStar className={styles.filled} /> : <FaRegStar />}
                        </span>
                      ))}
                    </div>
                    <div className={styles.writeReview}>
                      <p onClick={handleShowModal}>write a review <FaPenAlt /></p>
                      <p>{submittedReview}</p> 
                    </div>
                    <Button onClick={handleSubmit}>Add</Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <Modal 
          title="Write a Review" 
          visible={showModal} 
          onOk={handleOk} 
          onCancel={handleCancel}
        >
          <Input.TextArea 
            value={review}
            onChange={(e) => setReview(e.target.value)} 
            rows={4} 
            placeholder="Write your review here"
          />
        </Modal>
      </div>
    </div>
  );
}

export default MyBookings;
