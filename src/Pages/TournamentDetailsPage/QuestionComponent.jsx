import React from 'react';
import { Box, Input } from '@material-ui/core'; // Adjust import according to your setup

const OptionComponent = ({ option, index, handleTextChange, handleImageChange }) => {
  return (
    <Box className='option_box'>
      <Box className='option_header'>Option {String.fromCharCode(65 + index)}</Box>
      <Input
        type='text'
        placeholder={`Enter option ${String.fromCharCode(65 + index)}`}
        className={"option_input"}
        value={option.text}
        onChange={(e) => handleTextChange(e, index)}
      />
      <br />
      <Input
        type='file'
        className={"option_input"}
        onChange={(e) => handleImageChange(e, index)}
      />
    </Box>
  );
};

export default OptionComponent;
