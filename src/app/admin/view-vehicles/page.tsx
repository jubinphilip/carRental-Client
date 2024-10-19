'use client'
import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import client from '@/services/apollo-client';
import { GET_VEHICLES ,DELETE_VEHICLE} from '../queries/admin-queries';
import { ToastContainer,toast } from 'react-toastify';
import { Modal } from 'antd';
import 'react-toastify/dist/ReactToastify.css';
import styles from './viewvehicles.module.css';
import EditCars from '../modals/edit-cars/EditCars';
import AddRent from '../modals/add-rent/Add-Rent';
import Loader from '@/components/PreLoader';



const ViewVehicles = () => {
  const { loading: queryLoading, error: queryError, data: queryData, refetch } = useQuery(GET_VEHICLES, { client });
  const [deleteVehicle, { loading: mutationLoading, error: mutationError, data: mutationData }] = useMutation(DELETE_VEHICLE, { client });
  const [showEdit,setShowedit]=useState(false)
  
  const[showAdd,setShowAdd]=useState(false)
  const[id,setId]=useState('')

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: 'Are you sure you want to delete this vehicle?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        try {
          const response = await deleteVehicle({ variables: { id } });
          if (response.data.deleteVehicle.status === 'Success') {
            toast.success("Vehicle Deleted");
            refetch();
          } else {
            toast.error("Error Deleting Vehicle");
          }
        } catch (error) {
          console.error('Error:', error);
          toast.error('Failed to delete vehicle');
        }
      },
      onCancel() {
        toast.info("Deletion Cancelled");
      },
    });
  };


  const handleId=(id: string,type:string)=>
  {
    setId(id)
    type==='edit'?  setShowedit(true): setShowAdd(true)
  }


  useEffect(() => {
    if (queryData?.getCarsData) {
      console.log('Fetched Vehicles:', queryData.getCarsData);
    }
  }, [queryData]);

  if (queryLoading) return <Loader/>;
  if (queryError) return <p>Error: {queryError.message}</p>;


  return (
    <div>
      <ToastContainer/>
      <h1>Available Cars</h1>
      {showEdit && <EditCars  carid={id} editstate={setShowedit}/>}
      {showAdd &&<AddRent carid={id} addstate={setShowAdd} />}
        <div className={styles.grid}>
      {queryData?.getCarsData?.map((vehicle:any) => (
        <div key={vehicle?.id} className={styles.card}>
          <img
            src={vehicle?.fileurl}
            alt={`${vehicle?.Manufacturer.manufacturer} ${vehicle?.Manufacturer.model}`}
            className={styles.image}
          />
          <div className={styles.content}>
            <h2 className={styles.title}>{vehicle?.Manufacturer.manufacturer} {vehicle?.Manufacturer.model}</h2>
            <p className={styles.description}>{vehicle?.description}</p>
            <div className={styles.details}>
              <p>Type: {vehicle?.type}</p>
              <p>Transmission: {vehicle?.transmission}</p>
              <p>Fuel: {vehicle?.fuel}</p>
              <p>Seats: {vehicle?.seats}</p>
              <p>Year: {vehicle?.Manufacturer.year}</p>
            </div>
            <div className={styles.buttons}>
  <button className={`${styles.button} ${styles.editButton}`} onClick={() => handleId(vehicle.id, "edit")}>Edit</button>
  <button className={`${styles.button} ${styles.deleteButton}`} onClick={() => handleDelete(vehicle.id)}>Delete</button>
  <button className={`${styles.button} ${styles.addButton}`} onClick={() => handleId(vehicle.id, "add")}>Add or Edit rent Details</button>
</div>
          </div>
        </div>
      ))}
    </div>
    </div>
  );
}

export default ViewVehicles;
