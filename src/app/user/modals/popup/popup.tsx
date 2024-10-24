import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import styles from './popup.module.css';

const Guidelines = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    // Show popup after 2.5 seconds of page load
    const timeoutId = setTimeout(() => {
      setIsVisible(true);
    }, 2500);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleClose = () => {
    setIsClosed(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };


  if (!isVisible) return null;

  return (
    <div className={`${styles.popupContainer} ${isClosed ? styles.closed : styles.open}`}>
      <div className={styles.popup}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <AlertCircle className={styles.icon} />
            <h2 className={styles.title}>Pickup Guidelines</h2>
          </div>
          <button 
            onClick={handleClose}
            className={styles.closeButton}
            aria-label="Close popup"
          >
            <X size={18} />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>ID Required</h3>
            <p className={styles.sectionText}>
              Valid government-issued ID needed at pickup.
            </p>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>License</h3>
            <p className={styles.sectionText}>
              Current driver's license mandatory for vehicle operation.
            </p>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Age</h3>
            <p className={styles.sectionText}>
              Minimum age requirement: 18 years.
            </p>
          </div>

          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Insurance</h3>
            <p className={styles.sectionText}>
              Valid insurance proof required. Additional coverage available.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guidelines;