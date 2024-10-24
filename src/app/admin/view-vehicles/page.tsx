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
import Loader from '@/components/Preloader/PreLoader';
import { GiGearStick } from "react-icons/gi";
import { BsFuelPumpDieselFill } from "react-icons/bs";
import { PiSeatFill } from "react-icons/pi";



const ViewVehicles = () => {
  const { loading: queryLoading, error: queryError, data: queryData, refetch } = useQuery(GET_VEHICLES, { client });//Query for retrieving all vehicles
  const [deleteVehicle, { loading: mutationLoading, error: mutationError, data: mutationData }] = useMutation(DELETE_VEHICLE, { client });//Mutation for deleting vehicles
  const [showEdit,setShowedit]=useState(false)//state for managing the editcar modal
  const[showAdd,setShowAdd]=useState(false)
  const[id,setId]=useState('')

  useEffect(()=>
  {
    refetch()
  },[queryData])

  //Function for managing car deletion
  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: 'Are you sure you want to delete this vehicle?',
      okText: 'Yes',
      cancelText: 'No',
      onOk: async () => {
        try {
          const response = await deleteVehicle({ variables: { id } });
          console.log(response.data)
          if (response.data.deleteVehicle.status === true) {
            toast.success(response.data.deleteVehicle.message);
            refetch();
          } else {
            toast.error(response.data.deleteVehicle.message);
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

//Function for handling vehicle Edit
  const handleId=(id: string,type:string)=>
  {
    console.log(id)
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
      <h1 style={{ color: "rgb(117, 114, 109)" }}>Available Cars</h1>
      {showEdit && <EditCars  carid={id} editstate={setShowedit}/>}
      {showAdd &&<AddRent carid={id} addstate={setShowAdd} />}
        <div className={styles.grid}>
      {queryData?.getCarsData?.map((vehicle:any) => (
        <div key={vehicle?.id} className={styles.card}>
          <div className={styles.imageContainer}>
          <img
            src={vehicle?.fileurl}
            alt={`${vehicle?.Manufacturer.manufacturer} ${vehicle?.Manufacturer.model}`}
            className={styles.image}
          />
          </div>
          <div className={styles.secondaryImageContainer}>
          {
  vehicle?.secondaryImageUrls.map((image: string, index: number) => (
    <div key={index} className={styles.secondaryImages}>
      <img className={styles.secondaryImages} src={image} alt={`Secondary image ${index + 1}`} />
    </div>
  ))
}
</div>
          <div className={styles.content}>
            <h2 className={styles.title}>{vehicle?.Manufacturer.manufacturer} {vehicle?.Manufacturer.model}</h2>
            <p className={styles.description}>{vehicle?.description}</p>
            <div className={styles.details}>
              <div className={styles.feauturesfirst}>
              <p>Type: {vehicle?.type}</p> 
              <p>Year: {vehicle?.Manufacturer.year}</p>
              </div>
              <div className={styles.feautures}>
              <p className={styles.feauture}><BsFuelPumpDieselFill className={styles.icons}/>: {vehicle?.fuel}</p>
              <p className={styles.feauture}><GiGearStick className={styles.icons}/>: {vehicle?.transmission}</p>
              <p className={styles.feauture}>< PiSeatFill className={styles.icons}/>:{vehicle?.seats}</p>

              </div>
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
