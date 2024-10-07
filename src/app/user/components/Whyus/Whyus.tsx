import React from 'react'
import styles from './whyus.module.css'
function Whyus() {
    const row1=[{
        image:"/assets/easyrent.png",
        head:"Easy Rent",
        text:"Rent a car at our rental with an easy and fast process without disturbing your productivity"
    },
    {
        image:"/assets/quality.png",
        head:"Easy Rent",
        text:"Our cars are always maintained engine health and cleanliness to provide a more comfortable driving experience"
    },
    {
        image:"/assets/agent.png",
        head:"Easy Rent",
        text:"You can ask your travel companion to escort and guide your journey."
    }]
    const row2=[{
        image:"/assets/carsafety.png",
        head:"Car Safety",
        text:"Rent a car at our rental with an easy and fast process without disturbing your productivity"
    },
    {
        image:"/assets/refund.png",
        head:"Refund",
        text:"Our cars are always maintained engine health and cleanliness to provide a more comfortable driving experience"
    },
    {
        image:"/assets/live.png",
        head:"Live Monitoring",
        text:"You can ask your travel companion to escort and guide your journey."
    }]
  return (      
  <div className={styles.maincontainer}>
    <div className={styles.container}>
    <div className={styles.whyushead}>
            <h4 className={styles.head1}>ADVANTAGES</h4>
            <h2 className={styles.mainhead}>Why Choose Us ?</h2>
            <p className={styles.description}>We present many guarantees and advantages when you rent a car with us for your trip. Here are some of the advantages that you will get</p>
        </div>
        <div className={styles.content}>
        <div className={styles.row1}>
        {row1.map((item, index) => (
          <div key={index} className={styles.card}>
            <img src={item.image} alt={item.head} className={styles.cardImage} />
            <div>
            <h3 className={styles.cardHead}>{item.head}</h3>
            <p className={styles.cardText}>{item.text}</p>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.row2}>
        {row2.map((item, index) => (
          <div key={index} className={styles.card}>
            <img src={item.image} alt={item.head} className={styles.cardImage} />
            <div>
            <h3 className={styles.cardHead}>{item.head}</h3>
            <p className={styles.cardText}>{item.text}</p>
            </div>
          </div>
        ))}
      </div>
      </div>
        </div>
        </div>
    
  )
}

export default Whyus
