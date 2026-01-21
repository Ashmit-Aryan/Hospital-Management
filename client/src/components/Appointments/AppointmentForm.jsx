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
  Autocomplete,
  InputAdornment,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import api from '../../services/api';
import { ENDPOINTS } from '../../services/endpoints';
import toast from 'react-hot-toast';

const AppointmentForm = ({ appointment, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    appointmentDate: new Date(),
    reason: '',
    status: 'Scheduled'
  });

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    fetchPatients();
    fetchDoctors();
    if (appointment) {
      setFormData({
        patientId: appointment.patientId || '',
        doctorId: appointment.doctorId || '',
        appointmentDate: new Date(appointment.appointmentDate) || new Date(),
        reason: appointment.reason || '',
        status: appointment.status || 'Scheduled'
      });
    }
  }, [appointment]);

  const fetchPatients = async () => {
    try {
      const response = await api.get(ENDPOINTS.PATIENTS.GET_ALL);
      setPatients(response.data);
    } catch (error) {
      toast.error('Failed to fetch patients');
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await api.get(ENDPOINTS.DOCTORS.GET_ALL);
      setDoctors(response.data);
    } catch (error) {
      toast.error('Failed to fetch doctors');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      appointmentDate: date,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        appointmentDate: formData.appointmentDate.toISOString(),
      };

      if (appointment) {
        await api.put(
          ENDPOINTS.APPOINTMENTS.UPDATE(appointment._id || appointment.id),
          payload
        );
        toast.success('Appointment updated successfully');
      } else {
        await api.post(ENDPOINTS.APPOINTMENTS.CREATE, payload);
        toast.success('Appointment scheduled successfully');
      }
      onSuccess();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Patient</InputLabel>
              <Select
                name="patientId"
                value={formData.patientId}
                label="Patient"
                onChange={handleChange}
              >
                {patients.map((patient) => (
                  <MenuItem key={patient._id || patient.id} value={patient._id || patient.id}>
                    {patient.name} ({patient.age}y)
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth required>
              <InputLabel>Doctor</InputLabel>
              <Select
                name="doctorId"
                value={formData.doctorId}
                label="Doctor"
                onChange={handleChange}
              >
                {doctors.map((doctor) => (
                  <MenuItem key={doctor._id || doctor.id} value={doctor._id || doctor.id}>
                    Dr. {doctor.name} - {doctor.specialization}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} md={6}>
            <DateTimePicker
              label="Appointment Date & Time"
              value={formData.appointmentDate}
              onChange={handleDateChange}
              renderInput={(params) => (
                <TextField {...params} fullWidth required />
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                label="Status"
                onChange={handleChange}
              >
                <MenuItem value="Scheduled">Scheduled</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
                <MenuItem value="Cancelled">Cancelled</MenuItem>
                <MenuItem value="Pending">Pending</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              multiline
              rows={3}
              label="Reason for Visit"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="submit" variant="contained">
            {appointment ? 'Update' : 'Schedule'}
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default AppointmentForm;