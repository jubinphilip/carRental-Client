'use client';
import React, { useState,useEffect } from 'react';
import styles from './addmodel.module.css';
import { ADD_MANUFACTURER,UPLOAD_EXCEL,GET_MANUFACTURERS } from '../../queries/admin-queries';
import { useMutation,useQuery } from '@apollo/client';
import {toast,ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import client from '@/services/apollo-client';
import { useRouter } from 'next/navigation';
import getCookie from '@/utils/get-token';
interface RecordType {
  manufacturer: string;
  model: string;
  year:string;
}
interface Manufacturer {
  id: string;
  manufacturer: string;
  model: string;
  year: string;
}
function Addmodel() {

  const { loading, error, data } = useQuery(GET_MANUFACTURERS, { client });
  const[addManufacturer]=useMutation(ADD_MANUFACTURER,{client});
  const [uploadExcel] = useMutation(UPLOAD_EXCEL, { client });
  const [fileName, setFileName] = useState('No file chosen');
  const[showModels,setShowModels]=useState(false)
  const [excelSheet, setExcelSheet] = useState<File | null>(null);
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const router=useRouter()

  useEffect(() => {
    if (data ? data.getManufacturers:'') {
      setManufacturers(data.getManufacturers);
      console.log(data.getManufacturers);
    }
  }, [data]);

  const [record, setRecord] = useState<RecordType>({manufacturer: '',model: '',year:''});
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setRecord((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };


  const handleExcelfile = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event && event.target && event.target.files) {
      const file = event.target.files[0];
      if (file) {
        setExcelSheet(file);
        setFileName(file ? file.name : 'No file chosen');
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
  const token=await getCookie('token')
  if(!token)
  {
    toast.error('Please login to proceed')
    router.push('/user/signin') 
    return
  }
    e.preventDefault();
    console.log(record)
    try{
      const {data:response}=await addManufacturer({variables:{input:record}})
      console.log(response.addManufacturer.status)
      if(response.addManufacturer.status==='Success')
      {
        toast.success("Manufacturer added",response.addManufacturer)
       setShowModels(true)
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
        <p className={styles.excelupload}>Upload from excel sheet</p>
        <div className={styles.fileInputWrapper}>
      <input
        type="file"
        name="excel"
        onChange={handleExcelfile}
        className={styles.fileInput}
        id="fileInput"
        accept=".xlsx, .xls"
      />
      <label htmlFor="fileInput" className={styles.fileInputLabel}>
        Choose File
      </label>
      <span className={styles.fileName}>{fileName}</span>
    </div>
        <button  className={styles.submitdata} onClick={handleExcelUpload}>Upload</button>
        {!showModels  ? <button className={styles.showData} onClick={()=>setShowModels(true)}>Show Models</button>:
      <div>
       <h2>Available Models</h2>
      <div className={styles.tableContainer}>
      <table className={styles.carTable}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Manufacturer</th>
            <th>Model</th>
            <th>Year</th>
          </tr>
        </thead>
        <tbody>
          {manufacturers.map((manufacturer) => (
            <tr key={manufacturer.id}>
              <td>{manufacturer.id}</td>
              <td>{manufacturer.manufacturer}</td>
              <td>{manufacturer.model}</td>
              <td>{manufacturer.year}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
      </div>}
      </div>
    </div>
  );
}

export default Addmodel;
