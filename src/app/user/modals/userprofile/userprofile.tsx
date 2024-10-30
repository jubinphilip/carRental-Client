import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import client from '@/services/apollo-client';
import { GET_USER, EDIT_USER } from '../../queries/user-queries';
import { IoClose } from "react-icons/io5";
import styles from './UserProfile.module.css';
import ChangePassWord from '../changePassword/change-Password';
import { toast } from 'react-toastify';
import { Loader } from 'lucide-react';

interface UserProps {
  modalstate: React.Dispatch<React.SetStateAction<boolean>>;
}

const UserProfile: React.FC<UserProps> = ({ modalstate }) => {
  const [edit, setEdit] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editUser] = useMutation(EDIT_USER, { client });
  const [errorMessage, setErrorMessage] = useState('');
  const [editPassword, setEditPassword] = useState(false);
  const [changedFields, setChangedFields] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    userid: '',
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
    setChangedFields({}); // Reset changed fields when entering edit mode
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage('');
    const { name, value } = e.target;
    
    // Update formData for display purposes
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));

    // Track only changed fields by comparing with original data
    if (value !== data?.getUser[name]) {
      setChangedFields(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      // Remove field if it's been changed back to original value
      const updatedChanges = { ...changedFields };
      delete updatedChanges[name];
      setChangedFields(updatedChanges);
    }
  };

  //Function for uploadin profile image
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

  const handleSubmit = async (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setEdit(false);

    // Only submit if there are changes or a new image
    if (Object.keys(changedFields).length === 0 && !image) {
      toast.info('No changes to update');
      return;
    }

    // Create submission object with only changed fields and userid
    const submissionData = {
      userid: formData.userid,
      ...changedFields
    };

    try {
      const { data: response } = await editUser({
        variables: {
          file: image,
          input: submissionData
        }
      });

      if (response.editUser.status === true) {
        toast.success(response.editUser.message);
        refetch();
      } else {
        setErrorMessage(response.editUser.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const userid = sessionStorage.getItem('userid');
  const { loading, error, data, refetch } = useQuery(GET_USER, {
    variables: { id: userid },
    client,
    onCompleted: (data) => {
      if (data?.getUser) {
        setFormData({
          userid: userid ?? '',
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

  if (loading) return <Loader/>;
  if (error) return <div className={styles.loadingError}>Error: {error.message}</div>;

  const user = data?.getUser;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        {editPassword && <ChangePassWord userid={userid} modalstate={setEditPassword}/>}
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
              <div className={styles.imageInputWrapper}>
                <label htmlFor="upload">
                  <img src="/assets/imageadd.png" className={styles.imageAdd} alt="" />
                </label>
                <input 
                  type="file" 
                  id='upload' 
                  accept=".jpg, .jpeg, .png, .webp, .avif .svg .SVG" 
                  className={styles.primaryImageInput} 
                  onChange={handleFileChange} 
                />
              </div>
            )}
            
            <h2 className={styles.title}>Hi {user.username}!</h2>
            <div className={styles.grid}>
              <div className={styles.gridItem}>
                <p className={styles.label}>Name:</p>
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
              
              {errorMessage && <p className={styles.error}>{errorMessage}</p>}
              {edit ? (
                <div className={styles.buttonContainer}>
                  <button onClick={() => setEditPassword(true)}  className={styles.button}>Change Password</button>
                  <button onClick={handleSubmit} className={styles.button}>Submit</button>
                </div>
              ) : (
                <button onClick={handleEditClick} className={styles.button}>Edit</button>
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