
'use client';
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation'; 
import styles from './dashboard.module.css';
import Sidebar from './components/sidebar/Sidebar'; 

const AdminLayout = ({ children }:any) => {
  const [sideBar, setSidebar] = useState(true);//State for managing the sidebar
  const pathname = usePathname(); 

  const isLoginPage = pathname === '/admin/login';//if the admin is in login page dont show the sidebar

  return (
    <div className={styles.mainContainer}>
      {!isLoginPage && ( 
        <Sidebar sideBar={sideBar} setSidebar={setSidebar} />
      )}

      <div className={styles.mainItems}>
        {children}
      </div>
    </div>
  );
};

export default AdminLayout;
