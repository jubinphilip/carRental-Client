'use client';
import React, { useState, useEffect } from 'react';
import styles from './addvehicle.module.css';
import { GET_MANUFACTURERS, ADD_VEHICLE } from '../../queries/admin-queries';
import { useQuery, useMutation } from '@apollo/client';
import client from '@/app/services/apollo-client';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Manufacturer {
  id: string;
  manufacturer: string;
  model: string;
  year: string;
}

function AddVehicle() {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [image, setImage] = useState<File | null>(null);

  const [primaryImage, setPrimaryImage] = useState<File | null>(null);
  const [secondaryImages, setSecondaryImages] = useState<File[]>([]);
  const [primaryImagePreview, setPrimaryImagePreview] = useState<string | null>(null);
  const [secondaryImagePreviews, setSecondaryImagePreviews] = useState<string[]>([]);
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [addvehicle] = useMutation(ADD_VEHICLE, { client });
  const [brand, setBrand] = useState('');
  const [record, setRecord] = useState({
    description: '',
    manufacturer_id: '',
    type: '',
    transmission: '',
    fuel: '',
    seats: ''
  });

  const { loading, error, data } = useQuery(GET_MANUFACTURERS, { client });
  const types = ['HatchBack', 'Sedan', 'MUV', 'Compact SUV', 'SUV', 'Luxury'];
  const fuelOptions = ['Diesel', 'Petrol', 'Electric'];
  const transmissionOptions = ['Manual', 'Automatic'];
  const seatOptions = [2, 4, 5, 6, 7, 8];

  useEffect(() => {
    if (data && data.getManufacturers) {
      setManufacturers(data.getManufacturers);
      console.log(data.getManufacturers);
    }
  }, [data]);


  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'manufacturer') {
      setBrand(value);
    } else {
      setRecord((prevRecord) => ({ ...prevRecord, [name]: value }));
    }
  };

  const handlePrimaryImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setPrimaryImage(file);
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setPrimaryImagePreview(previewUrl);
    } else {
      setPrimaryImagePreview(null);
    }
  };

  const handleSecondaryImagesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setSecondaryImages(fileArray);
  
      const previewUrls = fileArray.map(file => URL.createObjectURL(file));
      setSecondaryImagePreviews(previewUrls);
    } else {
      setSecondaryImagePreviews([]);
    }
  };
  



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Record Data: ", record, primaryImage, secondaryImages);
    try {
      const { data: response } = await addvehicle({
        variables: {
          primaryFile: primaryImage,
          secondaryFiles: secondaryImages,
          input: record,
        },
      });
      console.log("Response", response);
      if (response.addVehicle.status === "Success") {
        toast.success("Vehicle Added");
      } else {
        toast.error("Error Adding Vehicle");
      }
    } catch (error) {
      console.log("Error", error);
    }
  };
  

  if (loading) return <p>Loading manufacturers...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const uniqueManufacturers = Array.from(new Set(manufacturers.map(m => m.manufacturer)));
  const models = manufacturers.filter(m => m.manufacturer === brand);

  return (
    <div className={styles.mainContainer}>
      <ToastContainer />
      <div className={styles.container}>
        <h1 className={styles.head}>Add Car </h1>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input type="text" name="description" placeholder="Enter vehicle description" onChange={handleChange} className={styles.inputbox} />

          <select className={styles.inputbox} name="manufacturer" onChange={handleChange}>
            <option value="">Select Manufacturer</option>
            {uniqueManufacturers.map((manufacturer) => (
              <option key={manufacturer} value={manufacturer}>
                {manufacturer}
              </option>
            ))}
          </select>

          <select className={styles.inputbox} name="manufacturer_id" onChange={handleChange}>
            <option value="">Select Model</option>
            {models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.model}
              </option>
            ))}
          </select>

          <select name="type" value={record.type} onChange={handleChange} className={styles.inputbox}>
            <option value="">Select Type</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <p className={styles.inputhead}>Select Transmission</p>
          <div className={styles.radioContainer}>
            {transmissionOptions.map((transmission) => (
              <label key={transmission}>
                <input
                  type="radio"
                  name="transmission"
                  value={transmission}
                  checked={record.transmission === transmission}
                  onChange={handleChange}
                />
                {transmission}
              </label>
            ))}
          </div>

          <p className={styles.inputhead}>Select Fuel</p>
          <div className={styles.radioContainer}>
            {fuelOptions.map((fuel) => (
              <label key={fuel}>
                <input
                  type="radio"
                  name="fuel"
                  value={fuel}
                  checked={record.fuel === fuel}
                  onChange={handleChange}
                />
                {fuel}
              </label>
            ))}
          </div>

          <select name="seats" value={record.seats} onChange={handleChange} className={styles.inputbox}>
            <option value="">Select Seats</option>
            {seatOptions.map((seats) => (
              <option key={seats} value={seats}>
                {seats}
              </option>
            ))}
          </select>

          <label>Primary Image:</label>
<input type="file" onChange={handlePrimaryImageChange} />

<label>Secondary Images:</label>
<input type="file" multiple onChange={handleSecondaryImagesChange} />

          {primaryImagePreview && (
  <div>
    <h4>Primary Image Preview:</h4>
    <img src={primaryImagePreview} alt="Primary Preview" style={{ width: '200px', height: 'auto' }} />
  </div>
)}

{secondaryImagePreviews.map((preview, index) => (
  <div key={index}>
    <h4>Secondary Image Preview {index + 1}:</h4>
    <img src={preview} alt={`Secondary Preview ${index + 1}`} style={{ width: '200px', height: 'auto' }} />
  </div>
))}


          <button type="submit" className={styles.submitdata}>
            Submit
          </button>
        </form>
      
      </div>
    </div>
  );
}

export default AddVehicle;
