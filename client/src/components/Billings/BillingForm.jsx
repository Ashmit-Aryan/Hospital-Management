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
  InputAdornment,
  Typography,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableRow,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import api from '../../services/api';
import { ENDPOINTS } from '../../services/endpoints';
import toast from 'react-hot-toast';

const BillingForm = ({ billing, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    patientId: '',
    services: '',
    paymentStatus: 'Pending',
    paymentMethod: 'Cash',
    totalAmount: 0,
    amountPaid: 0,
    balance: 0,
    invoiceNumber: `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
  });

  const [patients, setPatients] = useState([]);
  const [serviceItems, setServiceItems] = useState([
    { service: '', amount: 0 }
  ]);

  useEffect(() => {
    fetchPatients();
    if (billing) {
      setFormData({
        patientId: billing.patientId || '',
        services: billing.services || '',
        paymentStatus: billing.paymentStatus || 'Pending',
        paymentMethod: billing.paymentMethod || 'Cash',
        totalAmount: billing.totalAmount || 0,
        amountPaid: billing.amountPaid || 0,
        balance: billing.balance || 0,
        invoiceNumber: billing.invoiceNumber || `INV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      });
      
      // Parse services if they exist
      if (billing.services) {
        const parsedServices = billing.services.split(',').map(s => {
          const [service, amount] = s.trim().split(':$');
          return {
            service: service || '',
            amount: parseFloat(amount) || 0
          };
        });
        setServiceItems(parsedServices.length > 0 ? parsedServices : [{ service: '', amount: 0 }]);
      }
    }
  }, [billing]);

  useEffect(() => {
    calculateTotal();
  }, [serviceItems]);

  const fetchPatients = async () => {
    try {
      const response = await api.get(ENDPOINTS.PATIENTS.GET_ALL);
      setPatients(response.data);
    } catch (error) {
      toast.error('Failed to fetch patients');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Calculate balance when amountPaid changes
    if (name === 'amountPaid') {
      const paid = parseFloat(value) || 0;
      const total = formData.totalAmount;
      const balance = total - paid;
      setFormData(prev => ({
        ...prev,
        balance,
        paymentStatus: balance === 0 ? 'Paid' : balance === total ? 'Pending' : 'Partial'
      }));
    }
  };

  const handleServiceChange = (index, field, value) => {
    const newItems = [...serviceItems];
    newItems[index][field] = field === 'amount' ? parseFloat(value) || 0 : value;
    setServiceItems(newItems);
  };

  const addServiceItem = () => {
    setServiceItems([...serviceItems, { service: '', amount: 0 }]);
  };

  const removeServiceItem = (index) => {
    if (serviceItems.length > 1) {
      const newItems = serviceItems.filter((_, i) => i !== index);
      setServiceItems(newItems);
    }
  };

  const calculateTotal = () => {
    const total = serviceItems.reduce((sum, item) => sum + (item.amount || 0), 0);
    setFormData(prev => ({
      ...prev,
      totalAmount: total,
      balance: total - (prev.amountPaid || 0)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Combine service items into a string
    const servicesString = serviceItems
      .filter(item => item.service && item.amount > 0)
      .map(item => `${item.service}:$${item.amount}`)
      .join(', ');

    const payload = {
      ...formData,
      services: servicesString,
      balance: formData.totalAmount - formData.amountPaid
    };

    try {
      if (billing) {
        await api.put(
          ENDPOINTS.BILLINGS.UPDATE(billing._id || billing.id),
          payload
        );
        toast.success('Bill updated successfully');
      } else {
        await api.post(ENDPOINTS.BILLINGS.CREATE, payload);
        toast.success('Bill created successfully');
      }
      onSuccess();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  return (
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
                  {patient.name} ({patient.age}y) - {patient.contact}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Invoice Number"
            name="invoiceNumber"
            value={formData.invoiceNumber}
            onChange={handleChange}
            required
            InputProps={{
              readOnly: !!billing,
            }}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Services
          </Typography>
          {serviceItems.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                label="Service Description"
                value={item.service}
                onChange={(e) => handleServiceChange(index, 'service', e.target.value)}
                sx={{ flex: 2 }}
              />
              <TextField
                label="Amount"
                type="number"
                value={item.amount}
                onChange={(e) => handleServiceChange(index, 'amount', e.target.value)}
                sx={{ flex: 1 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
              />
              <IconButton
                color="error"
                onClick={() => removeServiceItem(index)}
                disabled={serviceItems.length === 1}
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button
            startIcon={<AddIcon />}
            onClick={addServiceItem}
            variant="outlined"
            size="small"
          >
            Add Service
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Divider />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Total Amount"
            name="totalAmount"
            value={formData.totalAmount}
            InputProps={{
              readOnly: true,
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Amount Paid"
            name="amountPaid"
            type="number"
            value={formData.amountPaid}
            onChange={handleChange}
            InputProps={{
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <TextField
            fullWidth
            label="Balance"
            name="balance"
            value={formData.balance}
            InputProps={{
              readOnly: true,
              startAdornment: <InputAdornment position="start">$</InputAdornment>,
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Payment Status</InputLabel>
            <Select
              name="paymentStatus"
              value={formData.paymentStatus}
              label="Payment Status"
              onChange={handleChange}
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Paid">Paid</MenuItem>
              <MenuItem value="Partial">Partial</MenuItem>
              <MenuItem value="Overdue">Overdue</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel>Payment Method</InputLabel>
            <Select
              name="paymentMethod"
              value={formData.paymentMethod}
              label="Payment Method"
              onChange={handleChange}
            >
              <MenuItem value="Cash">Cash</MenuItem>
              <MenuItem value="Credit Card">Credit Card</MenuItem>
              <MenuItem value="Insurance">Insurance</MenuItem>
              <MenuItem value="Online">Online Payment</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="submit" variant="contained" color="primary">
          {billing ? 'Update Bill' : 'Create Bill'}
        </Button>
      </Box>
    </Box>
  );
};

export default BillingForm;