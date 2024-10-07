'use client'
import React, { useState } from 'react'
import styles from './dashboard.module.css'
import { RiAdminFill } from "react-icons/ri";
import { IoMdAdd } from "react-icons/io";
import { FaCarOn } from "react-icons/fa6";
import Addmodel from '../components/add-model/AddModel';
import AddVehicle from '../components/add-vehicle/AddVehicle';
import ViewVehicles from '../components/view-vehicles/ViewVehicles';
import { FaAngleDoubleLeft,FaAngleDoubleRight } from "react-icons/fa";
import ViewBookings from '../components/view-bookings/View-Bookings';
import { FaHome } from "react-icons/fa";
import Home from '../components/home/user-home';

function Dashboard() {
  const [content,setContent]=useState('home')
  const [sideBar,setSidebar]=useState(true)
  return (
    <div  className={styles.mainContainer}>
      {!sideBar && <p className={styles.openiconcontainer}><FaAngleDoubleRight className={styles.openicon} onClick={()=>setSidebar(true)}/></p>}
     { sideBar && <div className={styles.sidebar}>
        <p className={styles.closeiconcontainer}><FaAngleDoubleLeft className={styles.closeicon} onClick={()=>setSidebar(false)}/></p>
      <div className={styles.header}><RiAdminFill className={styles.headerLogo} /><h1 className={styles.headerText}>Admin</h1></div>
      <div className={styles.sidebarItems}>
      <button className={styles.sidebarItem} onClick={()=>setContent('home')}><FaHome/>Home</button>
        <button className={styles.sidebarItem} onClick={()=>setContent('addmodel')}><IoMdAdd/>Add Model</button>
        <button className={styles.sidebarItem} onClick={()=>setContent('addvehicle')}><IoMdAdd/>Add Vehicle</button>
        <button className={styles.sidebarItem} onClick={()=>setContent('viewbookings')}><FaCarOn/>View Bookings</button>
        <button className={styles.sidebarItem} onClick={()=>setContent('viewcars')}><FaCarOn/>View Cars</button>
      </div>
      </div>}
      <div className={styles.mainItems}> 
        {content==='home' && <Home/>}
      {content==='viewcars' && <ViewVehicles/>}
      {content==='addmodel' && <Addmodel/>}
      {content==='addvehicle' && <AddVehicle/>}
      {content==='viewbookings' && <ViewBookings/>}
      </div>
    </div>
  )
}

export default Dashboard
