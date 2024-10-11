'use client';

import React, { useState, useEffect } from 'react';
import styles from './book-car.module.css';
import { useParams } from 'next/navigation';
import { useQuery, useMutation } from '@apollo/client';
import { GET_CAR_INFO, ADD_BOOKING } from '../../queries/user-queries'; // Ensure both queries are imported
import client from '@/services/apollo-client';
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BookedDates from '../../components/BookedDates/BookedDates';
import { useRouter } from 'next/navigation';


function BookCar() {
  const locations = ['Kakkanad', 'Edappally', 'Kaloor', 'Palaivattom', 'Aluva'];
  const { carid } = useParams();
  const carIdString = Array.isArray(carid) ? carid[0] : carid; 
  const { loading, error, data } = useQuery(GET_CAR_INFO, { variables: { id: carid }, client });
  const [bookCar] = useMutation(ADD_BOOKING, { client });
  const userid=sessionStorage.getItem('userid')
  const [mainImage, setMainImage] = useState<string | undefined>();
  const [totalCost, setTotalCost] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>('');

  const router=useRouter()
  const quantity=data?.getCarInfo?.quantity
  const [record, setRecord] = useState({
    userid:userid,
    carid: carid,
    quantity:'',
    startdate: '',
    enddate: '',
    startlocation: locations[0],
    droplocation: locations[0],
    amount:totalCost
  });

  useEffect(() => {
    setToken(localStorage.getItem('token'))
    if (data && data.getCarInfo?.Vehicle?.fileurl) {
      setMainImage(data.getCarInfo.Vehicle.fileurl);
    }
  }, [data]);

  useEffect(() => {
    if (record.startdate && record.enddate) {
      const cost = calculateCost();
      setTotalCost(cost);
    }
    setRecord((prev) => ({ ...prev, quantity }));
  }, [record.startdate, record.enddate, data?.getCarInfo?.price]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setRecord((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (!token) {
      toast.error("You have to Login");
      setTimeout(() => {
        router.push('/user/signin');
      }, 1000); 
    }
    
    console.log(record)
    try {
      const { data: response } = await bookCar({ variables:{input:record }});
      if(response.bookCar.status==='Success')
      {
        toast.success("Booking Success")
      }
      else
      {
        toast.error("Car is not available a that day")
      }
      console.log('Booking successful:', response);
    } catch (err) {
      console.error('Error booking car:', err);
    }
  };

  function calculateCost() {
    const startDate = new Date(record.startdate);
    const endDate = new Date(record.enddate);
    const timeDifference = endDate.getTime() - startDate.getTime();
    const days = timeDifference / (1000 * 60 * 60 * 24);
    const amount= days * (data?.getCarInfo?.price || 0);
setRecord((prev) => ({ ...prev, amount }));

    return amount
  }

  return (
    <div className={styles.mainContainer}>
      <ToastContainer/>
      <div className={styles.container}>
      <div className={styles.imageContainer}>
  <div className={styles.mainImageContainer}>
    <img src={mainImage} alt="Main vehicle image" />
  </div>

  <div className={styles.subImages}>
    <div className={styles.subImageContainer}>
      <img
        src={data?.getCarInfo?.Vehicle?.fileurl}
        alt="Default image"
        className={styles.subImage}
        onClick={() => setMainImage(data?.getCarInfo?.Vehicle?.fileurl)}
      />
    </div>

    {Array.isArray(data?.getCarInfo?.Vehicle?.secondaryImageUrls) &&
    data.getCarInfo.Vehicle.secondaryImageUrls.length > 0 ? (
      data.getCarInfo.Vehicle.secondaryImageUrls.map((url: string, index: number) => (
        <div className={styles.subImageContainer} key={index}>
          <img
            src={url}
            onClick={() => setMainImage(url)}
            alt={`Secondary image ${index + 1}`}
            className={styles.subImage}
          />
        </div>
      ))
    ) : (
      <p>No secondary images available.</p>
    )}
  </div>
</div>

        <div className={styles.textContainer}>
        <div className={styles.formContainer}>
          <div className={styles.selectLocation}>
            <div>
            <p>Select Pickup Place</p>
            <select id="startLocationSelect" name="startlocation" onChange={handleChange} className={styles.locationInput} value={record.startlocation}>
              {locations.map((location, index) => (
                <option key={index} value={location}>
                  {location}
                </option>
              ))}
            </select>
            </div>
            <div>
            <p>Select Dropoff Location</p>
            <select id="dropLocationSelect" name="droplocation" onChange={handleChange} className={styles.locationInput} value={record.droplocation}>
              {locations.map((location, index) => (
                <option key={index} value={location}>
                  {location}
                </option>
              ))}
            </select>
            </div>
          </div>
          <div className={styles.selectDate}>
           <div>
            <p>From Date</p>
            <input type="date" name="startdate" id="startDateTime" className={styles.datePicker} onChange={handleChange} value={record.startdate} />
            </div>
            <div>
            <p>To Date</p>
            <input type="date" name="enddate" id="endDateTime" onChange={handleChange} className={styles.datePicker} value={record.enddate} />
          
          </div>
          </div>
          <div className={styles.priceContainer}>
          <p className={styles.cost}>Price/day: ${data?.getCarInfo?.price}</p>
          {totalCost !== null && <p className={styles.totalcost}>Total Cost: ${totalCost.toFixed(2)}</p>}
          </div>
          <button onClick={handleSubmit} className={styles.bookButton}>Book Now</button>
          </div>
          <BookedDates params={{ carIdString, quantity }} />
        </div>
      </div>
    </div>
  );
}

export default BookCar;
