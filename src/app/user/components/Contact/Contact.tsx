import React from 'react'
import styles from './contact.module.css'
function Contact() {
  return (
    <div className={styles.maincontainer}>
        <div className={styles.container}>
            <div className={styles.contactinfo}>
        <h4 className={styles.head1}>Get In Touch</h4>
        <h2 className={styles.mainhead}>Contact Us</h2>
        <p className={styles.description}>
        if you need consultation with us, you can write a message or call us, we will respond as quickly as possible</p>
        <div className={styles.conatctcontent}>
          <p className={styles.content}><img src='/assets/fi_mail.png' alt="" />drivex@gmail.com</p>
          <p className={styles.content}><img src='/assets/fi_phone.png' alt="" />+1234567890</p>
          <p className={styles.content}><img src='/assets/fi_clock.png' alt="" />Everyday : 08.00-21.00</p>
          <p className={styles.content}><img src='/assets/u_location-point.png' alt="" />Kochi India</p>
        </div>
        <div className={styles.social}>
        <img src="/assets/fb.png" alt="" />
        <img src="/assets/inssta.png" alt="" />
        <img src="/assets/twitter.png" alt="" />
        <img src="/assets/in.png" alt="" />
        </div>
            </div>
            <div className={styles.map}>
            <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d251482.5759647517!2d76.13612123967098!3d9.982516031000996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b080d514abec6bf%3A0xbd582caa5844192!2sKochi%2C%20Kerala!5e0!3m2!1sen!2sin!4v1727329241456!5m2!1sen!2sin"
      width="600"
      height="450"
      style={{ border: 0 }}
      allowFullScreen={true}
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
            </div>
        </div>
      
    </div>
  )
}

export default Contact
