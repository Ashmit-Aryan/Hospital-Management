import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
} from '@mui/material';
import {
  People as PeopleIcon,
  MedicalServices as MedicalServicesIcon,
  CalendarToday as CalendarIcon,
  Receipt as ReceiptIcon,
} from '@mui/icons-material';
import AppointmentList from '../components/Appointments/AppointmentList';
import PatientList from '../components/Patients/PatientList';

const StatCard = ({ title, value, icon, color }) => (
  <Card>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="textSecondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4">{value}</Typography>
        </Box>
        <Box sx={{ color: `${color}.main` }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const stats = [
    { title: 'Total Patients', value: '1,234', icon: <PeopleIcon fontSize="large" />, color: 'primary' },
    { title: 'Total Doctors', value: '45', icon: <MedicalServicesIcon fontSize="large" />, color: 'secondary' },
    { title: 'Today\'s Appointments', value: '23', icon: <CalendarIcon fontSize="large" />, color: 'success' },
    { title: 'Pending Bills', value: '12', icon: <ReceiptIcon fontSize="large" />, color: 'warning' },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Appointments
            </Typography>
            <AppointmentList/>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Recent Patients
            </Typography>
            <PatientList />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;