'use client'
import React, { useState, useEffect } from 'react';
import { EDIT_VEHICLE, GET_CAR_DATA, GET_MANUFACTURERS } from '../../queries/admin-queries';
import { useQuery, useMutation } from '@apollo/client';
import client from '@/services/apollo-client';
import { IoClose } from "react-icons/io5";
import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './editcars.module.css';
import Loader from '@/components/Preloader/PreLoader';
//The vehicle details such as primary image and basic information can be ddited form this modal
interface EditCarsProps {
  carid: string | null;
  editstate: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Manufacturer {
  id: string;
  manufacturer: string;
  model: string;
  year: string;
}

const EditCars: React.FC<EditCarsProps> = ({ carid, editstate }) => {
  const [record, setRecord] = useState({
    id: carid,
    description: '',
    manufacturer_id: '',
    type: '',
    transmission: '',
    fuel: '',
    seats: ''
  });
  
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | undefined>(undefined);
  const [secondaryImages, setSecondaryImages] = useState<(File | null)[]>([null, null, null]);
  const [secondaryImagePreviews, setSecondaryImagePreviews] = useState<(string | undefined)[]>([undefined, undefined, undefined]);
  const [brand, setBrand] = useState('');
   //Getting all manufacturers
  const { loading, error, data } = useQuery(GET_MANUFACTURERS, { client });
    //Getting the details of the particular car
  const { loading: queryLoading, error: queryError, data: queryData } = useQuery(GET_CAR_DATA, { variables: { id: carid }, client });
   //Mutaion for editing vehicle data
  const [editVehicle] = useMutation(EDIT_VEHICLE, { client });


  //Arrays of types,fuel,transmission and seatoptions  
  const types = ['HatchBack', 'Sedan', 'MUV', 'Compact SUV', 'SUV', 'Luxury'];
  const fuel = ['Diesel', 'Petrol', 'Electric'];
  const transmission = ['Manual', 'Automatic'];
  const seatOptions = [2, 4, 5, 6, 7, 8];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'manufacturer') {
      setBrand(value);
    } else {
      setRecord((prevRecord) => ({ ...prevRecord, [name]: value }));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setImage(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    } else {
      setImagePreview(undefined);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Filter out null values from secondaryImages
    const validSecondaryImages = secondaryImages.filter((img): img is File => img !== null);
    
    try {
      const { data: response } = await editVehicle({
        variables: {
          file: image,
          input: record 
        }
      });
      
      if(response.editVehicle.status === true) {
        toast.success(response.editVehicle.message);
        setTimeout(() => {
          handleClose();
        }, 1000);
      } else {
        toast.error(response.editVehicle.message);
      }
    } catch (error) {
      console.log("Error", error);
      toast.error("Failed to update vehicle");
    }
  };

  useEffect(() => {
    if (data && data.getManufacturers) {
      setManufacturers(data.getManufacturers);
    }

    if (queryData?.getCarData) {
      const carData = queryData.getCarData;
      setRecord({
        id: carid,
        description: carData.description || '',
        manufacturer_id: carData.Manufacturer.id || '',
        type: carData.type || '',
        transmission: carData.transmission || '',
        fuel: carData.fuel || '',
        seats: carData.seats || ''
      });
      // Convert null to undefined for image previews
      setImagePreview(carData.fileurl || undefined);
      setBrand(carData.Manufacturer.manufacturer || '');
      // Convert null values to undefined in the array
      const convertedPreviews = carData.secondaryImageUrls.map((url: string | null) => url || undefined);
      setSecondaryImagePreviews(convertedPreviews);
    }
  }, [data, queryData, carid]);

  if (loading || queryLoading) return <p><Loader/></p>;
  if (error || queryError) return <p>Error: {error?.message || queryError?.message}</p>;

  const uniqueManufacturers = Array.from(new Set(manufacturers.map(m => m.manufacturer)));
  const models = manufacturers.filter(m => m.manufacturer === brand);

  const handleClose = () => {
    editstate(false);
  };

  const handleSecondaryImagesChange = (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const updatedImages = [...secondaryImages];
    const updatedPreviews = [...secondaryImagePreviews];

    if (files && files[0]) {
      const file = files[0]; 
      updatedImages[index] = file; 
      updatedPreviews[index] = URL.createObjectURL(file);
    } else {
      updatedImages[index] = null;
      updatedPreviews[index] = undefined; // Change null to undefined
    }

    setSecondaryImages(updatedImages);
    setSecondaryImagePreviews(updatedPreviews);
  };

  return (
    <div className={styles.overlay}>
      <ToastContainer/>
      <div className={styles.popup}>
        <button className={styles.closeButton} onClick={handleClose}>
          <IoClose />
        </button>
        <h2>Edit Vehicle</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            name="description" 
            placeholder='Enter vehicle description' 
            value={record.description} 
            onChange={handleChange} 
          />

          <select 
            name="manufacturer"
            value={brand} 
            onChange={handleChange}>
            <option value="">Select Manufacturer</option>
            {uniqueManufacturers.map((manufacturer) => (
              <option key={manufacturer} value={manufacturer}>{manufacturer}</option>
            ))}
          </select>

          <select 
            name="manufacturer_id"
            value={record.manufacturer_id}
            onChange={handleChange}
          >
            <option value="">Select Model</option>
            {models.map((model) => (
              <option key={model.id} value={model.id}>{model.model}</option>
            ))}
          </select>

          <select 
            name="type"
            value={record.type} 
            onChange={handleChange}
          >
            <option value="">Select Type</option>
            {types.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <p className={styles.text}>Select Transmission</p>
          <div className={styles.radioGroup}>
            {transmission.map((trans) => (
              <label key={trans} className={styles.radioLabel}>
                <input
                  type="radio"
                  name="transmission"
                  value={trans}
                  checked={record.transmission === trans}
                  onChange={handleChange}
                />
                {trans}
              </label>
            ))}
          </div>

          <p className={styles.text}>Fuel Type</p>
          <div className={styles.radioGroup}>
            {fuel.map((fuelType) => (
              <label key={fuelType} className={styles.radioLabel}>
                <input
                  type="radio"
                  name="fuel"
                  value={fuelType}
                  checked={record.fuel === fuelType}
                  onChange={handleChange}
                />
                {fuelType}
              </label>
            ))}
          </div>

          <select 
            name="seats"
            value={record.seats} 
            onChange={handleChange}
          >
            <option value="">Select Seats</option>
            {seatOptions.map((seats) => (
              <option key={seats} value={seats.toString()}>{seats}</option>
            ))}
          </select>

          <p>Edit Primary Image</p>
          <div className={styles.imageInputWrapper}>
            <label htmlFor="upload">
              <img src="/assets/imageadd.png" className={styles.imageAdd} alt="" />
            </label>
            <input type="file" id='upload' accept=".jpg, .jpeg, .png, .webp, .avif" className={styles.primaryImageInput} onChange={handleFileChange} />
          </div>

          <button type="submit" className={styles.submitButton}>Submit</button>
        </form>

        {imagePreview && (
          <div className={styles.imagePreview}>
            <h3>Image Preview:</h3>
            <img src={imagePreview} alt="Preview" />
          </div>
        )}

        <div>
          <p>Edit Secondary Images</p>
          <div className={styles.secondaryImagesWrapper}>
            {secondaryImagePreviews && secondaryImagePreviews.map((image, index) => (
              <div key={index} className={styles.secondaryImageContainer}>
                {image && <img src={image} className={styles.secondaryImage} alt={`Secondary image ${index + 1}`} />}
                <div className={styles.secondaryImageInputWrapper}>
                  <label htmlFor={`uploadFile${index}`}>
                    <img src="/assets/imageadd.png" className={styles.secondaryImageAdd} alt="" />
                  </label>
                  <input
                    type="file"
                    id={`uploadFile${index}`}
                    accept=".jpg, .jpeg, .png, .webp, .avif"
                    className={styles.secondaryImageInput} 
                    onChange={handleSecondaryImagesChange(index)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditCars;