import React, { useState, useRef, useEffect, ChangeEvent, FormEvent } from 'react';
import styles from './otp-verify.module.css'
import { VERIFY_OTP } from '../../queries/user-queries';
import { useMutation } from '@apollo/client';
import client from '@/services/apollo-client';

interface OtpVerifyProps {
  onClose: () => void;
  phone:String
  verified: (status: boolean) => void;
}

const OtpVerify: React.FC<OtpVerifyProps> = ({ onClose, phone,verified}) => {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  //Mutation for verifying otp
  const [verifyOtp, { loading, error }] = useMutation(VERIFY_OTP, { client });
  const inputRefs = useRef<React.RefObject<HTMLInputElement>[]>(
    Array(6).fill(null).map(() => React.createRef<HTMLInputElement>())
  );

  useEffect(() => {
    if (inputRefs.current[0]?.current) {
      inputRefs.current[0].current.focus();
    }
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>, index: number): void => {
    const value = event.target.value;
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5 && inputRefs.current[index + 1]?.current) {
      inputRefs.current[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, index: number): void => {
    if (event.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]?.current) {
      inputRefs.current[index - 1].current?.focus();
    }
  };
//Function for submittting otp along with phone number for verification
  const handleSubmit =async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();
    const otpString = otp.join('');
    if (otpString.length === 6) {
        const { data: response } = await verifyOtp({variables: { otp: otpString, phone: phone }  });
        console.log(response)
         if(response.verifyOtp.status)
         {
            console.log("OTP Verified")
            verified(true)
            onClose()
         }
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>Verify OTP</h2>
          <button onClick={onClose} className={styles.closeButton} aria-label="Close">×</button>
        </div>
        <p className={styles.instructions}>
          Enter the 6-digit code sent to your phone
        </p>
        <form onSubmit={handleSubmit}>
          <div className={styles.otpInputs}>
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                ref={inputRefs.current[index]}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={styles.otpInput}
                aria-label={`Digit ${index + 1}`}
              />
            ))}
          </div>
          <button type="submit" className={styles.verifyButton}>
            Verify OTP
          </button>
        </form>
        <p className={styles.resendText}>
          Didn't receive the code? <button onClick={() => {/* Implement resend logic */}} className={styles.resendLink}>Resend OTP</button>
        </p>
      </div>
    </div>
  );
};

export default OtpVerify;