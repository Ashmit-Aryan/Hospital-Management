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
  FormControlLabel,
  Switch,
  Typography,
} from '@mui/material';
import api from '../../services/api';
import { ENDPOINTS } from '../../services/endpoints';
import toast from 'react-hot-toast';

const roles = [
  'admin',
  'doctor',
  'nurse',
  'receptionist',
  'patient'
];

const UserForm = ({ user, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient',
    isActive: true,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        password: '', // Don't pre-fill password
        role: user.role || 'patient',
        isActive: user.isActive !== undefined ? user.isActive : true,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'isActive' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!user && !formData.password) {
      toast.error('Password is required for new users');
      return;
    }

    try {
      const payload = { ...formData };
      // Remove password field if it's empty (for updates)
      if (!payload.password && user) {
        delete payload.password;
      }

      if (user) {
        await api.put(
          ENDPOINTS.USERS.UPDATE(user._id || user.id),
          payload
        );
        toast.success('User updated successfully');
      } else {
        await api.post(ENDPOINTS.AUTH.CREATE_USER, payload);
        toast.success('User created successfully');
      }
      onSuccess();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
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

        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!!user} // Don't allow email changes after creation
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label={user ? 'New Password (leave blank to keep current)' : 'Password'}
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required={!user}
            helperText={user ? 'Leave blank to keep current password' : 'Set a secure password'}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth required>
            <InputLabel>Role</InputLabel>
            <Select
              name="role"
              value={formData.role}
              label="Role"
              onChange={handleChange}
            >
              {roles.map((role) => (
                <MenuItem key={role} value={role}>
                  <Box sx={{ textTransform: 'capitalize' }}>
                    {role}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={handleChange}
                name="isActive"
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: formData.isActive ? 'success.main' : 'error.main',
                  }}
                />
                <Typography>
                  {formData.isActive ? 'Active' : 'Inactive'}
                </Typography>
              </Box>
            }
            sx={{ mt: 2 }}
          />
        </Grid>

        {formData.role === 'doctor' && (
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              Note: Doctor users will need additional profile setup in the Doctors section.
            </Typography>
          </Grid>
        )}
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="contained">
          {user ? 'Update User' : 'Create User'}
        </Button>
      </Box>
    </Box>
  );
};

export default UserForm;