import React, { useState, useEffect } from 'react';
import styles from './popup.module.css'; // Assuming you have some CSS for the popup

function TimelyPopup() {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // Function to show the popup for a certain duration (e.g., 3 seconds)
    const togglePopup = () => {
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
      }, 3000); // Hide popup after 3 seconds
    };

    // Set an interval to show the popup every 5 seconds
    const intervalId = setInterval(() => {
      togglePopup();
    }, 5000); // Show popup every 5 seconds

    // Cleanup the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      {showPopup && (
        <div className={styles.popup}>
          <div className={styles.popupContent}>
            <h2>Disclaimer for Vehicle Pickup</h2>
<h5>Valid ID Requirement:</h5>
<p>Drivers are required to present a valid government-issued ID (such as a passport or national ID card) when arriving to pick up the vehicle.</p>

<h5>Driver's License:</h5>
<p>A valid driver’s license is mandatory. The driver must possess an active, up-to-date license to legally operate the vehicle.</p>

<h5>Age Requirement:</h5>
<p>Drivers must be at least 18 years of age to rent and operate the vehicle.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default TimelyPopup;
