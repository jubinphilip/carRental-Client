'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './sidebar.module.css'; 
import { RiAdminFill } from "react-icons/ri";
import { IoMdAdd } from "react-icons/io";
import { FaCarOn } from "react-icons/fa6";
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaHome } from "react-icons/fa";

const Sidebar = ({ sideBar, setSidebar }:any) => {
  const router = useRouter();

  const handleNavigation = (path:any) => {
    router.push(path);
  };

  return (
    <>
      {!sideBar && (
        <p className={styles.openiconcontainer}>
          <FaAngleDoubleRight className={styles.openicon} onClick={() => setSidebar(true)} />
        </p>
      )}
      {sideBar && (
        <div className={styles.sidebar}>
          <p className={styles.closeiconcontainer}>
            <FaAngleDoubleLeft className={styles.closeicon} onClick={() => setSidebar(false)} />
          </p>
          <div className={styles.header}>
            <RiAdminFill className={styles.headerLogo} />
            <h1 className={styles.headerText}>Admin</h1>
          </div>
          <div className={styles.sidebarItems}>
            <button className={styles.sidebarItem} onClick={() => handleNavigation('/admin/home')}>
              <FaHome /> Home
            </button>
            <button className={styles.sidebarItem} onClick={() => handleNavigation('/admin/add-model')}>
              <IoMdAdd /> Add Model
            </button>
            <button className={styles.sidebarItem} onClick={() => handleNavigation('/admin/add-vehicle')}>
              <IoMdAdd /> Add Vehicle
            </button>
            <button className={styles.sidebarItem} onClick={() => handleNavigation('/admin/view-bookings')}>
              <FaCarOn /> View Bookings
            </button>
            <button className={styles.sidebarItem} onClick={() => handleNavigation('/admin/view-vehicles')}>
              <FaCarOn /> View Cars
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;
