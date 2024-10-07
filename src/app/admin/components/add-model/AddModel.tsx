'use client';
import React, { useState } from 'react';
import styles from './addmodel.module.css';
import { ADD_MANUFACTURER,UPLOAD_EXCEL } from '../../queries/admin-queries';
import { useMutation } from '@apollo/client';
import {toast,ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import client from '@/app/services/apollo-client';
interface RecordType {
  manufacturer: string;
  model: string;
  year:string;
}
function Addmodel() {
  const[addManufacturer]=useMutation(ADD_MANUFACTURER,{client});
  const [uploadExcel] = useMutation(UPLOAD_EXCEL, { client });
  const [excelSheet, setExcelSheet] = useState<File | null>(null);
  const [record, setRecord] = useState<RecordType>({manufacturer: '',model: '',year:''});
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setRecord((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleExcelfile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event && event.target && event.target.files) {
      const file = event.target.files[0];
      if (file) {
        setExcelSheet(file);
      }
    }
  };

  const handleExcelUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Excel Data: ", excelSheet);
    try {
      const { data: response } = await uploadExcel({ variables: { file: excelSheet } });
      if (response.uploadExcel.status === 'Success') {
        toast.success("Excel file processed successfully.");
      } else {
        toast.error("Error processing Excel file.");
      }
    } catch (error) {
      toast.error("Error uploading Excel file.");
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(record)
    try{
      const {data:response}=await addManufacturer({variables:{input:record}})
      console.log(response.addManufacturer.status)
      if(response.addManufacturer.status==='Success')
      {
        toast.success("Manufacturer added",response.addManufacturer)
       
      }
      else
      {
        toast.error("Error Adding")
      }
      
    }catch(error)
    {
      toast.error("Error adding user");
    }

  }
  return (
    <div className={styles.mainContainer}>
      <ToastContainer/>
      <div className={styles.container}>
        <h1 className={styles.head}>Add Model</h1>
        <form onSubmit={handleSubmit} className={styles.modelform}>
          <input
            type="text"
            placeholder="Enter the Manufacturer"
            name="manufacturer"
            value={record.manufacturer}
            onChange={handleChange}
            className={styles.inputbox}
          />
          <input
            type="text"
            placeholder="Enter the Model"
            name="model"
            value={record.model}
            onChange={handleChange}
            className={styles.inputbox}
          />
            <input
            type="text"
            placeholder="Enter the Year"
            name="year"
            value={record.year}
            onChange={handleChange}
            className={styles.inputbox}
          />
          <button type='submit' className={styles.submitdata}>Add Data</button>
        </form>
        <p>Upload from excel sheet</p>
        <input type="file" name="excel" onChange={handleExcelfile} />
        <button  className={styles.submitdata} onClick={handleExcelUpload}>Upload</button>
      </div>
    </div>
  );
}

export default Addmodel;
