import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import client from '@/app/services/apollo-client';
import { GET_USER } from '../../queries/user-queries';
import { IoClose } from "react-icons/io5";
import styles from './UserProfile.module.css';

interface UserProps {
  modalstate: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserProfile: React.FC<UserProps> = ({ modalstate }) => {
  const [edit, setEdit] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    city: '',
    state: '',
    country: '',
    pincode: ''
  });

  const handleClose = () => {
    modalstate(false);
  };

  const handleEditClick = () => {
    setEdit(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setImage(file); 
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl); 
    } else {
      setImagePreview(null); 
    }
  };

  const handleSubmit = () => {
    // Implement the submit logic here
    console.log('Submitting form data:', formData);
    console.log('Submitting image:', image);
    setEdit(false);
  };

  const userid = sessionStorage.getItem('userid');
  
  const { loading, error, data } = useQuery(GET_USER, {
    variables: { id: userid },
    client,
    onCompleted: (data) => {
      if (data?.getUser) {
        setFormData({
          username: data.getUser.username,
          email: data.getUser.email,
          phone: data.getUser.phone,
          city: data.getUser.city,
          state: data.getUser.state,
          country: data.getUser.country,
          pincode: data.getUser.pincode,
        });
      }
    }
  });

  if (loading) return <div className={styles.loadingError}>Loading...</div>;
  if (error) return <div className={styles.loadingError}>Error: {error.message}</div>;

  const user = data?.getUser;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <button onClick={handleClose} className={styles.closeButton}>
          <IoClose size={24} />
        </button>
        
        {user ? (
          <div className={styles.content}>
            <div className={styles.imageContainer}>
              {!imagePreview && <img src={user.fileurl} alt="User profile" className={styles.image} />}
              {imagePreview && (
                <div>
                  <img src={imagePreview} alt="Preview" className={styles.image} />
                </div>
              )}
            </div>
            {edit && (
              <input 
                type="file" 
                onChange={handleFileChange} 
              />
            )}
            <h2 className={styles.title}>Hi {user.username}!</h2>
            <div className={styles.grid}>
              <div className={styles.gridItem}>
                <p className={styles.label}>Username:</p>
                {edit ? (
                  <input 
                    type="text" 
                    name="username" 
                    value={formData.username} 
                    onChange={handleInputChange} 
                    placeholder="Enter your username" 
                  />
                ) : (
                  <p>{user.username}</p>
                )}
              </div>
              <div className={styles.gridItem}>
                <p className={styles.label}>Email:</p>
                {edit ? (
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleInputChange} 
                    placeholder="Enter your email" 
                  />
                ) : (
                  <p>{user.email}</p>
                )}
              </div>
              <div className={styles.gridItem}>
                <p className={styles.label}>Phone:</p>
                {edit ? (
                  <input 
                    type="text" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleInputChange} 
                    placeholder="Enter your phone number" 
                  />
                ) : (
                  <p>{user.phone}</p>
                )}
              </div>
              <div className={styles.gridItem}>
                <p className={styles.label}>City:</p>
                {edit ? (
                  <input 
                    type="text" 
                    name="city" 
                    value={formData.city} 
                    onChange={handleInputChange} 
                    placeholder="Enter your city" 
                  />
                ) : (
                  <p>{user.city}</p>
                )}
              </div>
              <div className={styles.gridItem}>
                <p className={styles.label}>State:</p>
                {edit ? (
                  <input 
                    type="text" 
                    name="state" 
                    value={formData.state} 
                    onChange={handleInputChange} 
                    placeholder="Enter your state" 
                  />
                ) : (
                  <p>{user.state}</p>
                )}
              </div>
              <div className={styles.gridItem}>
                <p className={styles.label}>Country:</p>
                {edit ? (
                  <input 
                    type="text" 
                    name="country" 
                    value={formData.country} 
                    onChange={handleInputChange} 
                    placeholder="Enter your country" 
                  />
                ) : (
                  <p>{user.country}</p>
                )}
              </div>
              <div className={styles.gridItem}>
                <p className={styles.label}>Pincode:</p>
                {edit ? (
                  <input 
                    type="text" 
                    name="pincode" 
                    value={formData.pincode} 
                    onChange={handleInputChange} 
                    placeholder="Enter your pincode" 
                  />
                ) : (
                  <p>{user.pincode}</p>
                )}
              </div>
              {edit ? (
                <button onClick={handleSubmit}>Submit</button>
              ) : (
                <button onClick={handleEditClick}>Edit</button>
              )}
            </div>
          </div>
        ) : (
          <p className={styles.noData}>No user data available.</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;