/** @format */

import { Box } from "@chakra-ui/react";
import React, { useState } from "react";
import { GlobalContext } from "../Context/Context";
import SideNavbar from "../Components/SideNavbar/SideNavbar";
import MainHeader from "../Components/MainHeader/MainHeader";

const SideNavbarComponent = ({pageType}) => {
  if(pageType === "tournament_details") {
    return null;
  } else {
    return <SideNavbar />
  }
}

const Layout = ({ children, isLoading }) => {
  const { position, pageType, bgColor } = GlobalContext();
  return (
    <Box className='layout'>
      <MainHeader />
      <Box className="app_section_container">
        {/* <SideNavbar /> */}
        <SideNavbarComponent pageType={pageType} />
        <Box className="app_container">
        {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;