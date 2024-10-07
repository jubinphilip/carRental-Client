import React from 'react'
import styles from './services.module.css'
function Services() {
  return (
    <div className={styles.maincontainer}>
        <div className={styles.container}>
    <div className={styles.servicehead}>
        <h4 className={styles.head1}>Services</h4>
        <h2 className={styles.mainhead}>Our Services</h2>
        <p className={styles.description}>Our service is not only renting a car, but we also provide a private chauffeur service that can guide you on your trip and also longtrip packages to support your travel needs.</p>
    </div>
    <div className={styles.servicebody}>
        <div className={styles.card1}>
            <img src='/assets/Keyicon.png' alt="" />
            <h5 className={styles.cardhead}>Instant Rent</h5>
            <p className={styles.cardtext}>We provide direct rental services when you need wherever you are. Our officers are quick to respond in carrying out this task . . .</p>
        </div>
        <div className={styles.card2}>
        <img src='/assets/Agenticon.png' alt="" />
        <h5 className={styles.cardhead}>Private Driver</h5>
          <p className={styles.cardtext}>
            We have professional agents to accompany your trip useful for your protection from disturbances that you do not like . . .</p>
        </div>
        <div className={styles.card3}>
        <img src='/assets/Trip.png' alt="" />
        <h5 className={styles.cardhead}>Long Trip</h5>
        <p className={styles.cardtext}>Long trips whenever and wherever you want can comfortably use our car collection that supports long and long trips . . </p>
        </div>
    </div>
        </div>
        
    </div>
  )
}

export default Services
