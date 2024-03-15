// MyForm.js
import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';

function MyForm() {
  // State for form data
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  // Handle change in input fields
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData); // You can replace this with your form submission logic
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField 
        name="name"
        label="Name"
        variant="outlined"
        fullWidth
        margin="normal"
        value={formData.name}
        onChange={handleChange}
      />
      <TextField 
        name="email"
        label="Email"
        type="email"
        variant="outlined"
        fullWidth
        margin="normal"
        value={formData.email}
        onChange={handleChange}
      />
      <Button type="submit" variant="contained" color="primary">
        Submit
      </Button>
    </form>
  );
}

export default MyForm;
