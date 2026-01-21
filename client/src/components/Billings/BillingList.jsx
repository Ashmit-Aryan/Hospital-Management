import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Chip,
  TextField,
  InputAdornment,
  Avatar,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Receipt as ReceiptIcon,
  Payment as PaymentIcon,
  Download as DownloadIcon,
} from '@mui/icons-material';
import api from '../../services/api';
import { ENDPOINTS } from '../../services/endpoints';
import BillingForm from './BillingForm';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const BillingList = () => {
  const [billings, setBillings] = useState([]);
  const [filteredBillings, setFilteredBillings] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBilling, setSelectedBilling] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchBillings();
  }, []);

  useEffect(() => {
    filterBillings();
  }, [searchTerm, filterStatus, billings]);

  const fetchBillings = async () => {
    try {
      const response = await api.get(ENDPOINTS.BILLINGS.GET_ALL);
      setBillings(response.data);
      setFilteredBillings(response.data);
    } catch (error) {
      toast.error('Failed to fetch bills');
    }
  };

  const filterBillings = () => {
    let filtered = billings;

    if (searchTerm) {
      filtered = filtered.filter(billing =>
        billing.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        billing.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        billing.services?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== 'All') {
      filtered = filtered.filter(billing => billing.paymentStatus === filterStatus);
    }

    setFilteredBillings(filtered);
  };

  const handleCreate = () => {
    setSelectedBilling(null);
    setOpenDialog(true);
  };

  const handleEdit = (billing) => {
    setSelectedBilling(billing);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      try {
        await api.delete(ENDPOINTS.BILLINGS.DELETE(id));
        toast.success('Bill deleted successfully');
        fetchBillings();
      } catch (error) {
        toast.error('Failed to delete bill');
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBilling(null);
  };

  const handleSuccess = () => {
    handleCloseDialog();
    fetchBillings();
  };

  const getStatusColor = (status) => {
    const colors = {
      'Paid': 'success',
      'Pending': 'warning',
      'Overdue': 'error',
      'Partial': 'info',
    };
    return colors[status] || 'default';
  };

  const getPaymentMethodColor = (method) => {
    const colors = {
      'Cash': 'success',
      'Credit Card': 'primary',
      'Insurance': 'info',
      'Online': 'secondary',
    };
    return colors[method] || 'default';
  };

  const calculateBalance = (total, paid) => {
    const balance = total - paid;
    return {
      amount: balance,
      isOverdue: balance > 0 && balance !== total
    };
  };

  const handleDownloadInvoice = (billing) => {
    toast.success(`Invoice ${billing.invoiceNumber} downloaded (mock)`);
    // In a real app, you would generate and download a PDF
  };

  const handleMarkAsPaid = async (billing) => {
    try {
      await api.put(ENDPOINTS.BILLINGS.UPDATE(billing._id || billing.id), {
        ...billing,
        paymentStatus: 'Paid',
        amountPaid: billing.totalAmount,
        balance: 0
      });
      toast.success('Marked as paid');
      fetchBillings();
    } catch (error) {
      toast.error('Failed to update payment status');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Billings</Typography>
        {isAdmin() && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            Create Bill
          </Button>
        )}
      </Box>

      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search bills..."
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flexGrow: 1, maxWidth: 300 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          {['All', 'Pending', 'Paid', 'Overdue', 'Partial'].map((status) => (
            <Chip
              key={status}
              label={status}
              onClick={() => setFilterStatus(status)}
              color={filterStatus === status ? 'primary' : 'default'}
              variant={filterStatus === status ? 'filled' : 'outlined'}
            />
          ))}
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Invoice</TableCell>
              <TableCell>Patient</TableCell>
              <TableCell>Services</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Balance</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredBillings.map((billing) => {
              const balance = calculateBalance(billing.totalAmount || 0, billing.amountPaid || 0);
              
              return (
                <TableRow key={billing._id || billing.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ReceiptIcon fontSize="small" color="action" />
                      <Typography variant="body2" fontWeight="medium">
                        {billing.invoiceNumber}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {billing.patientName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                      {billing.services}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">
                      ${billing.totalAmount?.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="success.main">
                      ${billing.amountPaid?.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      color={balance.isOverdue ? 'error' : 'text.secondary'}
                      fontWeight={balance.isOverdue ? 'bold' : 'normal'}
                    >
                      ${balance.amount?.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={billing.paymentStatus}
                      color={getStatusColor(billing.paymentStatus)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={billing.paymentMethod}
                      color={getPaymentMethodColor(billing.paymentMethod)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleDownloadInvoice(billing)}
                        title="Download Invoice"
                      >
                        <DownloadIcon fontSize="small" />
                      </IconButton>
                      {billing.paymentStatus !== 'Paid' && isAdmin() && (
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleMarkAsPaid(billing)}
                          title="Mark as Paid"
                        >
                          <PaymentIcon fontSize="small" />
                        </IconButton>
                      )}
                      {isAdmin() && (
                        <>
                          <IconButton
                            size="small"
                            color="secondary"
                            onClick={() => handleEdit(billing)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleDelete(billing._id || billing.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Showing {filteredBillings.length} of {billings.length} bills
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Typography variant="body2">
            Total Pending: $
            {filteredBillings
              .filter(b => b.paymentStatus === 'Pending')
              .reduce((sum, b) => sum + (b.totalAmount || 0) - (b.amountPaid || 0), 0)
              .toFixed(2)}
          </Typography>
        </Box>
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedBilling ? 'Edit Bill' : 'Create New Bill'}
        </DialogTitle>
        <DialogContent>
          <BillingForm
            billing={selectedBilling}
            onSuccess={handleSuccess}
            onCancel={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default BillingList;