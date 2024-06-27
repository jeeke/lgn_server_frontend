import React, {useEffect, useState} from 'react';
import { Box, useToast } from '@chakra-ui/react';
import "./SideNavbar.css";
import { GoHome } from "react-icons/go";
import { PiFlagBannerFill } from "react-icons/pi";
import { FaUser } from "react-icons/fa";
import { FaTrophy } from "react-icons/fa";
import { FaBell } from "react-icons/fa";
import { BiSupport } from "react-icons/bi";
import { useNavigate, NavLink } from "react-router-dom";
import {useSocket, socket} from "../../socket/socket";
import {GlobalContext} from "../../Context/Context";

const SideNavbar = () => {  
  const toast = useToast()
  const {notificationsCount, setNotificationsCount} = GlobalContext();
  useSocket();
  
  // useEffect(() => {
  //   socket.on("GET admin notification", data => {
  //     // console.log("GET admin notification", data);
  //     setNotificationsCount(prev => prev + 1)
  //   });
  // })

  useEffect(() => {
    const handleNotification = data => {
      setNotificationsCount(prev => prev + 1);
      toast({
        title: `A new notification received`,
        variant: 'left-accent',
        isClosable: true,
        position: "top-right"
      })
    };

    socket.on("GET admin notification", handleNotification);

    // Cleanup function to avoid adding multiple listeners
    return () => {
      socket.off("GET admin notification", handleNotification);
    };
  }, []); 
  
  return (
    <Box className='sidnavbar_container'>
      {/* Home */}
      <NavLink
            to='/'
            className={(navData) =>
              navData.isActive
                ? `navitem active_navitem`
                : `navitem`
            }>
            <GoHome className='navitem_icon' />
            <Box className='navitem_name'>Dashboard</Box>
      </NavLink>

      {/* Banner management */}
      <NavLink
            to='/banner'
            className={(navData) =>
              navData.isActive
                ? `navitem active_navitem`
                : `navitem`
            }>
            <PiFlagBannerFill className='navitem_icon' />
            <Box className='navitem_name'>Banner Management</Box>
      </NavLink>

      {/* User management */}
      <NavLink
            to='/user'
            className={(navData) =>
              navData.isActive
                ? `navitem active_navitem`
                : `navitem`
            }>
            <FaUser className='navitem_icon' />
            <Box className='navitem_name'>User Management</Box>
      </NavLink>

      {/* tournament management */}
      <NavLink
            to='/tournament'
            className={(navData) =>
              navData.isActive
                ? `navitem active_navitem`
                : `navitem`
            }>
            <FaTrophy className='navitem_icon' />
            <Box className='navitem_name'>Tournament Management</Box>
      </NavLink>

      {/* Notificatin management */}
      <NavLink
            to='/notification'
            className={(navData) =>
              navData.isActive
                ? `navitem active_navitem`
                : `navitem`
            }>
            <FaBell className='navitem_icon' />
            <Box className='navitem_name'>Notification Management</Box>
            <Box className='navitem_name'>{notificationsCount> 0 && notificationsCount}</Box>
      </NavLink>

      {/* Notificatin management */}
      <NavLink
            to='/support'
            className={(navData) =>
              navData.isActive
                ? `navitem active_navitem`
                : `navitem`
            }>
            <BiSupport className='navitem_icon' />
            <Box className='navitem_name'>Support Tickets</Box>
      </NavLink>
    </Box>
  )
}

export default SideNavbar