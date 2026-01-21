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

const specializations = [
  'Cardiology',
  'Neurology',
  'Pediatrics',
  'Orthopedics',
  'Dermatology',
  'General Medicine',
  'Surgery',
  'Gynecology',
  'Psychiatry',
  'Radiology'
];

const DoctorForm = ({ doctor, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    contact: '',
  });

  useEffect(() => {
    if (doctor) {
      setFormData({
        name: doctor.name || '',
        specialization: doctor.specialization || '',
        contact: doctor.contact || '',
      });
    }
  }, [doctor]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (doctor) {
        await api.put(
          ENDPOINTS.DOCTORS.UPDATE(doctor._id || doctor.id),
          formData
        );
        toast.success('Doctor updated successfully');
      } else {
        await api.post(ENDPOINTS.DOCTORS.CREATE, formData);
        toast.success('Doctor created successfully');
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
            label="Doctor Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth required>
            <InputLabel>Specialization</InputLabel>
            <Select
              name="specialization"
              value={formData.specialization}
              label="Specialization"
              onChange={handleChange}
            >
              {specializations.map((spec) => (
                <MenuItem key={spec} value={spec}>
                  {spec}
                </MenuItem>
              ))}
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
          {doctor ? 'Update' : 'Create'}
        </Button>
      </Box>
    </Box>
  );
};

export default DoctorForm;