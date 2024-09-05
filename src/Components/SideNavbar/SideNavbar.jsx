import React, {useEffect, useState} from 'react';
import { Box, useToast } from '@chakra-ui/react';
import "./SideNavbar.css";
import { GoHome } from "react-icons/go";
import { PiFlagBannerFill } from "react-icons/pi";
import { FaBell, FaGift, FaTrophy, FaUser } from "react-icons/fa";
import { BiSupport } from "react-icons/bi";
import { useNavigate, NavLink } from "react-router-dom";
import { BsCameraReels } from "react-icons/bs";
import {GlobalContext} from "../../Context/Context";


const SideNavbar = () => {  
  const toast = useToast()
  const {notificationsCount, setNotificationsCount} = GlobalContext();
  
  
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

      {/* Support management */}
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

      {/* Store management */}
      <NavLink
            to='/store'
            className={(navData) =>
              navData.isActive
                ? `navitem active_navitem`
                : `navitem`
            }>
            <BiSupport className='navitem_icon' />
            <Box className='navitem_name'>Store</Box>
      </NavLink>

      {/* Reels management */}
      <NavLink
            to='/reels'
            className={(navData) =>
              navData.isActive
                ? `navitem active_navitem`
                : `navitem`
            }>
            <BsCameraReels className='navitem_icon' />
            <Box className='navitem_name'>Reels</Box>
      </NavLink>
    </Box>
  )
}

export default SideNavbar