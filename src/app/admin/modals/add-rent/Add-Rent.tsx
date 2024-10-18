import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import styles from './addrent.module.css';
import { useMutation } from '@apollo/client';
import client from '@/services/apollo-client';
import { ADD_RENT } from '../../queries/admin-queries';
import {toast,ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface AddRentProps {
  carid: string | null;
  addstate: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmitRent: () => void;
}
const AddRent: React.FC<AddRentProps> = ({ carid, addstate,onSubmitRent }) => {
  const [addRent] = useMutation(ADD_RENT, { client });
  const [record, setRecord] = useState({ vehicleid: carid, price: '', quantity: '' });

  const handleClose = () => {
    addstate(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRecord((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Record Data: ", record);
    try {
      const { data: response } = await addRent({
        variables: {
          input: record
        }
      });
      console.log("Response", response);

       if(response.addRent.status==='Success')
       {
        
        toast.success("Car added for Rent ")
        setTimeout(()=>
        {
          onSubmitRent();
        },1000)
       }
       else
       {
        toast.error("Some Error Occured")
       }
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <div className={styles.overlay}>
      <ToastContainer/>
      <div className={styles.popup}>
        <button className={styles.closeButton} onClick={handleClose}>
          <IoClose />
        </button>
        <h2>Add Rent</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="price" onChange={handleChange} placeholder='Enter the price for a Car'/>
          <input type="text" name="quantity" onChange={handleChange} placeholder='Enter the quantity'/>
          <button className={styles.submitButton} type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default AddRent;