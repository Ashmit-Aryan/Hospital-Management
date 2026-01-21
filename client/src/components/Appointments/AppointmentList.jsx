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
  Avatar,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import api from '../../services/api';
import { ENDPOINTS } from '../../services/endpoints';
import AppointmentForm from './AppointmentForm';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const AppointmentList = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [searchTerm, selectedDate, appointments]);

  const fetchAppointments = async () => {
    try {
      const response = await api.get(ENDPOINTS.APPOINTMENTS.GET_ALL);
      setAppointments(response.data);
      setFilteredAppointments(response.data);
    } catch (error) {
      toast.error('Failed to fetch appointments');
    }
  };

  const filterAppointments = () => {
    let filtered = appointments;

    if (searchTerm) {
      filtered = filtered.filter(appointment =>
        appointment.patientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.doctorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appointment.reason?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDate) {
      const selectedDateStr = selectedDate.toISOString().split('T')[0];
      filtered = filtered.filter(appointment =>
        appointment.appointmentDate?.split('T')[0] === selectedDateStr
      );
    }

    setFilteredAppointments(filtered);
  };

  const handleCreate = () => {
    setSelectedAppointment(null);
    setOpenDialog(true);
  };

  const handleEdit = (appointment) => {
    setSelectedAppointment(appointment);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      try {
        await api.delete(ENDPOINTS.APPOINTMENTS.DELETE(id));
        toast.success('Appointment deleted successfully');
        fetchAppointments();
      } catch (error) {
        toast.error('Failed to delete appointment');
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAppointment(null);
  };

  const handleSuccess = () => {
    handleCloseDialog();
    fetchAppointments();
  };

  const getStatusColor = (status) => {
    const colors = {
      'Scheduled': 'primary',
      'Completed': 'success',
      'Cancelled': 'error',
      'Pending': 'warning',
    };
    return colors[status] || 'default';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Appointments</Typography>
        {isAdmin() && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            New Appointment
          </Button>
        )}
      </Box>

      <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          placeholder="Search appointments..."
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
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Filter by date"
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
            renderInput={(params) => <TextField {...params} size="small" />}
          />
        </LocalizationProvider>
        {selectedDate && (
          <Button
            variant="outlined"
            size="small"
            onClick={() => setSelectedDate(null)}
          >
            Clear Date Filter
          </Button>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient</TableCell>
              <TableCell>Doctor</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAppointments.map((appointment) => (
              <TableRow key={appointment._id || appointment.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ width: 32, height: 32 }}>
                      {appointment.patientName?.charAt(0)}
                    </Avatar>
                    <Typography variant="body2">{appointment.patientName}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={appointment.doctorName}
                    size="small"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CalendarIcon fontSize="small" />
                    <Typography variant="body2">
                      {formatDate(appointment.appointmentDate)}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                    {appointment.reason}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={appointment.status || 'Scheduled'}
                    color={getStatusColor(appointment.status || 'Scheduled')}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {isAdmin() && (
                    <>
                      <IconButton
                        color="secondary"
                        size="small"
                        onClick={() => handleEdit(appointment)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => handleDelete(appointment._id || appointment.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedAppointment ? 'Edit Appointment' : 'Schedule New Appointment'}
        </DialogTitle>
        <DialogContent>
          <AppointmentForm
            appointment={selectedAppointment}
            onSuccess={handleSuccess}
            onCancel={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AppointmentList;