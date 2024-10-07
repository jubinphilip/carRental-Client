import React from 'react'
import styles from './footer.module.css'
function Footer() {
  return (
    <div className={styles.maincontainer}>
      <div className={styles.container}>
            <div className={styles.main}>
                <h2 className={styles.logo}>DriveX</h2>
                <p className={styles.text1}>We are a well-known car rental service that has many partners in each region to connect with you to assist in your trip in meetings, events, holidays or long trips.</p>
                <div className={styles.social}>
                <img src="/assets/fb.png" alt="" />
                <img src="/assets/inssta.png" alt="" />
                <img src="/assets/twitter.png" alt="" />
                <img src="/assets/in.png" alt="" />
                </div>
            </div>
            <div className={styles.links}>
            <div className={styles.company}>
                <h3 className={styles.head}>Company</h3>
                <li className={styles.content}>About Us</li>
                <li className={styles.content}>Services</li>
                <li className={styles.content}>Cars</li>
                <li className={styles.content}>Our Partner</li>
            </div>
            <div className={styles.services}>
                <h3  className={styles.head}>Services</h3>
                <li className={styles.content}>Instant Rent</li>
                <li className={styles.content}>Private Driver</li>
                <li className={styles.content}>Long Trip</li>
            </div>
            <div className={styles.support}>
                <h3  className={styles.head}>Support</h3>
                <li className={styles.content}>Blog</li>
                <li className={styles.content}>FAQ</li>
                <li className={styles.content}>Call Center</li>
                <li className={styles.content}>Partner With Us</li>
                <li className={styles.content}>Terms & Conditions</li>
            </div>  
            </div>
      </div>
    </div>
  )
}

export default Footer
