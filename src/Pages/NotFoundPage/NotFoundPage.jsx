import React from 'react';
import lottie from "lottie-web";
import reactLogo from "../../Assets/Animation.json";
import { Box } from '@chakra-ui/react';
import "./NotFound.css"
const NotFoundPage = () => {

    React.useEffect(() => {
        lottie.loadAnimation({
            container: document.querySelector("#react-logo"),
            animationData: reactLogo,
            renderer: "svg", // "canvas", "html"
            loop: true, // boolean
            autoplay: true, // boolean
        });
      }, []);


  return (
    <Box className='page_not_found_container'>
        <Box className='inner_section'>
            <Box id="react-logo" />
            <Box className="not_found_text">Page Not found</Box>
        </Box>
    </Box>
  )
}

export default NotFoundPage