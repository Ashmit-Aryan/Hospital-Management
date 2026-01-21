
import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Box,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import api from '../../services/api';
import { ENDPOINTS } from '../../services/endpoints';
import toast from 'react-hot-toast';

const PatientForm = ({ patient, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    contact: '',
  });

  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name || '',
        age: patient.age || '',
        gender: patient.gender || '',
        contact: patient.contact || '',
      });
    }
  }, [patient]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (patient) {
        await api.put(
          ENDPOINTS.PATIENTS.UPDATE(patient._id || patient.id),
          formData
        );
        toast.success('Patient updated successfully');
      } else {
        await api.post(ENDPOINTS.PATIENTS.CREATE, formData);
        toast.success('Patient created successfully');
      }
      onSuccess();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            required
            fullWidth
            label="Age"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth required>
            <InputLabel>Gender</InputLabel>
            <Select
              name="gender"
              value={formData.gender}
              label="Gender"
              onChange={handleChange}
            >
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Contact Number"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="contained">
          {patient ? 'Update' : 'Create'}
        </Button>
      </Box>
    </Box>
  );
};

export default PatientForm;