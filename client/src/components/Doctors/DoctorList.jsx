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
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  MedicalServices as MedicalServicesIcon,
} from '@mui/icons-material';
import api from '../../services/api';
import { ENDPOINTS } from '../../services/endpoints';
import DoctorForm from './DoctorForm';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const { isAdmin } = useAuth();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await api.get(ENDPOINTS.DOCTORS.GET_ALL);
      setDoctors(response.data);
    } catch (error) {
      toast.error('Failed to fetch doctors');
    }
  };

  const handleCreate = () => {
    setSelectedDoctor(null);
    setOpenDialog(true);
  };

  const handleEdit = (doctor) => {
    setSelectedDoctor(doctor);
    setOpenDialog(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await api.delete(ENDPOINTS.DOCTORS.DELETE(id));
        toast.success('Doctor deleted successfully');
        fetchDoctors();
      } catch (error) {
        toast.error('Failed to delete doctor');
      }
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedDoctor(null);
  };

  const handleSuccess = () => {
    handleCloseDialog();
    fetchDoctors();
  };

  const getSpecializationColor = (specialization) => {
    const colors = {
      'Cardiology': 'error',
      'Neurology': 'info',
      'Pediatrics': 'success',
      'Orthopedics': 'warning',
      'Dermatology': 'secondary',
      'General': 'default'
    };
    return colors[specialization] || 'default';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Doctors</Typography>
        {isAdmin() && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreate}
          >
            Add Doctor
          </Button>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Doctor</TableCell>
              <TableCell>Specialization</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {doctors.map((doctor) => (
              <TableRow key={doctor._id || doctor.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar>
                      <MedicalServicesIcon />
                    </Avatar>
                    <Typography variant="body1">{doctor.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={doctor.specialization}
                    color={getSpecializationColor(doctor.specialization)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{doctor.contact}</TableCell>
                <TableCell>
                  {isAdmin() && (
                    <>
                      <IconButton
                        color="secondary"
                        onClick={() => handleEdit(doctor)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(doctor._id || doctor.id)}
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

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedDoctor ? 'Edit Doctor' : 'Add New Doctor'}
        </DialogTitle>
        <DialogContent>
          <DoctorForm
            doctor={selectedDoctor}
            onSuccess={handleSuccess}
            onCancel={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default DoctorList;