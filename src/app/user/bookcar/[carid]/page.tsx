'use client';
import React, { useState, useEffect } from 'react';
import styles from './book-car.module.css';
import { useQuery, useMutation } from '@apollo/client';
import { GET_CAR_INFO, ADD_BOOKING, CREATE_ORDER, VERIFY_PAYMENT} from '../../queries/user-queries';
import client from '@/services/apollo-client';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BookedDates from '../../components/BookedDates/BookedDates';
import { useAppContext } from '@/context/appContext';
import Reviews from '../../components/Reviews/Reviews';
import { useRouter, useParams } from 'next/navigation';
import getCookie from '@/utils/get-token';
import Loader from '@/components/Preloader/PreLoader';
interface RazorpayWindow extends Window {
  Razorpay: any;
}
declare const window: RazorpayWindow;
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name?: string;
    email?: string;
  };
  theme: {
    color: string;
  };
  notes?: {
    [key: string]: string;
  };
}
interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}
function BookCar() {
  const locations = ['Kakkanad', 'Edappally', 'Kaloor', 'Palarivattom', 'Aluva'];
  const { carid } = useParams();//carid is retrived from params
  const carIdString = Array.isArray(carid) ? carid[0] : carid;
  const { loading, error, data } = useQuery(GET_CAR_INFO, { variables: { id: carid }, client });

  const [bookCar] = useMutation(ADD_BOOKING, { client });
  const [createOrder] = useMutation(CREATE_ORDER, { client });
  const [verifyPayment] = useMutation(VERIFY_PAYMENT, { client });
  const userid = sessionStorage.getItem('userid');
  const [mainImage, setMainImage] = useState<string | undefined>();
  const [totalCost, setTotalCost] = useState<number | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const[dateError,setDateError]=useState('')
  const [token, setToken] = useState<string | null>('');
  const { user } = useAppContext();
  const{dateRange}=useAppContext()
  const router = useRouter();
  const quantity = data?.getCarInfo?.quantity;
  const [record, setRecord] = useState({
    userid: userid,
    carid: carid,
    quantity: '',
    startdate: '',
    enddate: '',
    startlocation: locations[0],
    droplocation: locations[0],
    amount: 0
  });

 
  useEffect(() => {
    console.log(dateRange?dateRange:'')
    setToken(getCookie('usertoken'));
    if (data && data.getCarInfo?.Vehicle?.fileurl) {
      setMainImage(data.getCarInfo.Vehicle.fileurl);
    }
  }, [data]);
//USeeffect hook is used to load the payment interface
  useEffect(() => {
    try {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    } catch (error) {
      console.error('Error loading Razorpay script:', error);
      toast.error('Failed to load Razorpay.');
    }
  }, [])

  useEffect(() => {
    if (record.startdate && record.enddate) {
      const cost = calculateCost();//after selecting the date the cost is calculated automatically
      setTotalCost(cost);
      setRecord(prev => ({ ...prev, amount: cost }));
    }
    setRecord(prev => ({ ...prev, quantity }));
  }, [record.startdate, record.enddate, data?.getCarInfo?.price, quantity]);

  if (loading) return <Loader/>;
  if (error) return <p>Error: {error.message}</p>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setRecord(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
//Function for submitting the data
  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    console.log("Clicked")
    e.preventDefault();
    if (!token) {
      toast.error("You have to Login");
      setTimeout(() => {
        router.push('/user/signin');
      }, 1000);
      return;
    }
    const currentDate = new Date();
    const startDate = new Date(record.startdate);
    const endDate = new Date(record.enddate);
    if (!record.startdate || !record.enddate) {
      setDateError("Choose start date and End date")
      console.log("error")
      return
    }
    else if (startDate < currentDate || endDate < currentDate) {
     setDateError("Date must be greater than or equal to current date❗")
     console.log("error")
     return
  }
  else if(endDate < startDate)
  {
     setDateError("Are you going to end the trip before it starts😂😂")
     console.log("error")
     return

  }
     try {
      const { data: response } = await bookCar({ variables: { input: record } });
      if (response.bookCar.status === 'Success') {
        const newBookingId = response.bookCar.id;  
        setBookingId(newBookingId);  
     
        console.log('Booking ID set:', newBookingId);
  
        await handlePayment(newBookingId);  
      } else {
        toast.error("Car is not available on that day");
      }
    } catch (err) {
      console.error('Error booking car:', err);
    } 
  };
  //Function for handling the payment
  const handlePayment = async (bookingId: string) => {  
    const amount = record.amount;
    const currency = 'INR';
  
    try {
      //mutation for creating an order
      const { data: orderData } = await createOrder({
        variables: { amount, currency },
      });
      const { id: orderId } = orderData.createOrder;
      const options: RazorpayOptions = {
        key: 'rzp_test_XcdzS9WNbteswG',
        amount: amount * 100,
        currency,
        name: 'DriveX',
        description: 'Payment for Order',
        order_id: orderId,
        handler: async (response: RazorpayResponse) => {
          try {
            const {  razorpay_signature } = response;
            console.log("Booking ID Before Verification:", razorpay_signature);
            //Function for verifying the payment
            const { data: verifyData } = await verifyPayment({
              variables: {
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                razorpay_signature: razorpay_signature,
                bookingId: bookingId,  
              },
            });
            console.log('Payment verified successfully!', verifyData);
            toast.success("Booking Success");
            console.log('Booking ID:', bookingId);
          } catch (verifyError) {
            console.error('Payment verification failed', verifyError);
          }
        },
        prefill: {
          name: user?.username,
          email: user?.email,
        },
        theme: {
          color: '#F37254',
        },
        notes: {
          orderId: orderId,
        },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Order creation error:', error);
    }
  };
  if(data)
  {
    console.log(data)
  }
  //Function for Calculating the cost
  function calculateCost() {
    const startDate = new Date(record.startdate);
    const endDate = new Date(record.enddate);
    const timeDifference = endDate.getTime() - startDate.getTime();
    const days = timeDifference / (1000 * 60 * 60 * 24);
    return days * (data?.getCarInfo?.price || 0);
  }
  return (
    <div>
    <div className={styles.mainContainer}>
      <ToastContainer />
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
            {/* MApping through the images */}
            {Array.isArray(data?.getCarInfo?.Vehicle?.secondaryImageUrls) &&
            data.getCarInfo.Vehicle.secondaryImageUrls.length > 0 ? (
              data.getCarInfo.Vehicle.secondaryImageUrls.map((url: string, index: number) => (
                <div className={styles.subImageContainer} key={index}>
                  <img
                    src={url}
                    onClick={() => setMainImage(url)}//onClicking the subimage comes at place of mainimage
                    alt={`Secondary image ${index + 1}`}
                    className={styles.subImage}
                  />
                </div>
              ))
            ) : (
              <p>No secondary images available.</p>
            )}
          </div>
          <BookedDates params={{ carIdString, quantity }} />
        </div>
        <div className={styles.textContainer}>
          <div className={styles.carInfo}>
          <h3>{data?.getCarInfo?.Vehicle?.Manufacturer?.manufacturer} {data?.getCarInfo?.Vehicle?.Manufacturer?.model}</h3>
          <p>{data?.getCarInfo?.Vehicle?.Manufacturer?.year}</p>
          <p>{data?.getCarInfo?.Vehicle?.fuel}</p>
          <p>{data?.getCarInfo?.Vehicle?.seats}</p>
          <p>{data?.getCarInfo?.Vehicle?.type}</p>
          <p>{data?.getCarInfo?.Vehicle?.transmission}</p>
          </div>
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
            
            <div>
      {dateRange[0]!= null ? (
        <>
          <p>You Booked For</p>
          <p>
            {dateRange[0] ? dateRange[0].format('YYYY-MM-DD') : 'Start date not selected'} to{' '}
            {dateRange[1] ? dateRange[1].format('YYYY-MM-DD') : 'End date not selected'}
          </p>
        </>
      ):
      <div className={styles.selectDate}>
      <div>
        <p>From Date</p>
        <input type="date" name="startdate" id="startDateTime" className={styles.datePicker} onChange={handleChange} value={record.startdate} />
      </div>
      <div>
        <p>To Date</p>
        <input type="date" name="enddate" id="endDateTime" onChange={handleChange} className={styles.datePicker} value={record.enddate} />
      </div>
      {dateError && <p className={styles.error}>{dateError}</p>}
    </div>}
    </div>

            <div className={styles.priceContainer}>
              <p className={styles.cost}>Price/day: ${data?.getCarInfo?.price}</p>
              {totalCost !== null && <p className={styles.totalcost}>Total Cost: ${totalCost.toFixed(2)}</p>}
            </div>
            <button onClick={handleSubmit} className={styles.bookButton}>Book Now</button>
          </div>
        
        </div>
      </div>
    
    </div>
    <Reviews carid={carid}/>
    </div>
     
  );
}
export default BookCar;