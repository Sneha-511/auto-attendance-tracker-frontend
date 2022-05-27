import { TextField } from '@mui/material';
import React from 'react';

const fieldType = (value) => {
  if (value === 'name' || value === 'admNo') {
    return 'text';
  } else {
    return 'url';
  }
};

const FormTextField = ({ attr, data, setData, label }) => {
  return (
    <TextField
      variant="outlined"
      margin="normal"
      id={`${attr.charAt(0).toUpperCase() + attr.slice(1)}`}
      name={`${attr.charAt(0).toUpperCase() + attr.slice(1)}`}
      label={label}
      type={fieldType(attr)}
      fullWidth
      value={data[attr]}
      onChange={(e) => {
        setData({ ...data, [attr]: e.target.value });
      }}
      required={attr === 'name' || attr === 'admNo' || attr === 'imageUrl' ? true : false}
    />
  );
};

export default FormTextField;
