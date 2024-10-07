import React from 'react';
import styles from './hero.module.css';

function Hero() {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.container}>
        <div className={styles.heroHead}>
          <h1>We Have Prepared a Car For Your Trip</h1>
          <p>
            We have many types of cars that are ready for you to travel anywhere and anytime.
          </p>
          <div className={styles.heroButtons}>
            <button><img className={styles.heroButton} src="/assets/play.jpg" alt="Play" /></button>
            <button><img className={styles.heroButton} src="/assets/app.jpg" alt="App" /></button>
          </div>
        </div>
        <div className={styles.heroImage}>
          <img className={styles.map} src="/assets/map.png" alt="map" />
          <img className={styles.car} src='/assets/bmw.png' alt='car'/>
          <img className={styles.mapIcon1} src="/assets/loc.png" alt="loc" />
          <img className={styles.mapIcon2} src="/assets/loc2.png" alt="loc" />
        </div>
      </div>
    </div>
  );
}

export default Hero;