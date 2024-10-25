import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import styles from './change-password.module.css';
import { useMutation } from '@apollo/client';
import client from '@/services/apollo-client';
import { EDIT_PASSWORD } from '../../queries/user-queries';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



interface UserProps {
  userid: string | null;
  modalstate: React.Dispatch<React.SetStateAction<boolean>>;
}

const ChangePassWord: React.FC<UserProps> = ({ userid, modalstate }) => {
//mutation for editing the password of a  user
  const [editUserPassword] = useMutation(EDIT_PASSWORD, { client });
  const [record, setRecord] = useState({ id: userid, currentPswd: '', newPswd: '' });
  const [error,setError]=useState('')

  const handleClose = () => {
    modalstate(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecord((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

//Function passes the current password and new password to backend and it compares and if the currentpassword is verified then password is changed
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!record.currentPswd || !record.newPswd) {
     setError("Both fields are required");
      return;
    }

    try {
      const { data: response } = await editUserPassword({
        variables: {
          input: record
        }
      });
      
      if (response.editUserPassword.status===true) {
        toast.success("User Password Changed");
        modalstate(false);
      } else {
       setError(response.editUserPassword.message || "Some error occurred");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to change password. Please try again.");
    }
  };

  return (
    <div className={styles.overlay}>
      <ToastContainer />
      <div className={styles.popup}>
        <button className={styles.closeButton} onClick={handleClose}>
          <IoClose />
        </button>
        <h2>Change Password</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="password" 
            name="currentPswd"
            onChange={handleChange}
            placeholder="Enter your old password"
          />
          <input
            type="password"
            name="newPswd"
            onChange={handleChange}
            placeholder="Enter the new Password"
          />
          {error && <span className={styles.error}>{error}</span>}
          <button className={styles.submitButton} type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassWord;
