import React from 'react'
import styles from './icons.module.css'
function Icons() {
    const images=[
        '/assets/bmwlogo.png',
        '/assets/Honda.png',
        '/assets/Toyota.png',
        '/assets/KIA.png',
        '/assets/Hyundai.png',
        '/assets/lexus-logo.png',
        '/assets/Marcedes.png',
        '/assets/Nissan.png',
    ]
  return (
    <div className={styles.mainContainer}>
        <div className={styles.container}>
        
      {images.map((src, index) => (
        <img className={styles.logos} key={index} src={src} alt={`Image ${index + 1}`} />
      ))}
    </div>
        
    </div>
  )
}

export default Icons
