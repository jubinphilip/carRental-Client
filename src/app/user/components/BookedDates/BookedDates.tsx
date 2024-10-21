import React from 'react';
import { useQuery } from '@apollo/client';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import styles from './booked-dates.module.css';
import { GET_BOOKED_DATES } from '../../queries/user-queries';
import client from '@/services/apollo-client';

interface BookedDatesProps {
  params: {
    carIdString: string;
    quantity: string;
  };
}

const BookedDates: React.FC<BookedDatesProps> = ({ params }) => {
  const { carIdString, quantity } = params;
//Query for retriving booked dates for a particular carid from database 
  const { data, loading, error } = useQuery(GET_BOOKED_DATES, {
    variables: { carId: carIdString, quantity: quantity },
    client,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const bookedDates = data.bookedDates.dates.map((date: string) => new Date(date));
//Then these dates are passed to a calender and it books the date where car is not available
  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const classes = [styles.calendarTile];
      if (bookedDates.some((bookedDate:any) => 
        bookedDate.getDate() === date.getDate() &&
        bookedDate.getMonth() === date.getMonth() &&
        bookedDate.getFullYear() === date.getFullYear()
      )) {
        classes.push(styles.bookedDate);
      }
      return classes.join(' ');
    }
  }

  return (
    <div className={styles.container}>
      <h1>Booked Dates </h1>
      <div className={styles.calendarWrapper}>
        <Calendar
          tileClassName={tileClassName}
          className={`${styles.calendar} react-calendar`}
        />
      </div>
      <div className={styles.legend}>
        <span className={styles.bookedDateLegend}></span>
        <span>Booked Dates</span>
      </div>
    </div>
  );
};

export default BookedDates;