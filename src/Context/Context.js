/** @format */

import React, { useEffect, useState } from "react";
import { createContext, useContext } from "react";

const CreateContext = createContext();

function CreateContextProvider({ children }) {
  const [pageType, setPageType] = React.useState("home");

//   useEffect(() => {
//     setBgColor(localStorage.getItem("bgColor") || "light");
//     setColor(localStorage.getItem("color") || "primary");
//     setDisableColor(
//       localStorage.getItem("color")
//         ? `disable_${localStorage.getItem("color")}`
//         : "disable_primary"
//     );
//   });

  return (
    <CreateContext.Provider
      value={{
        pageType,
        setPageType
      }}>
      {children}
    </CreateContext.Provider>
  );
}

export const GlobalContext = () => {
  return useContext(CreateContext);
};

export default CreateContextProvider;