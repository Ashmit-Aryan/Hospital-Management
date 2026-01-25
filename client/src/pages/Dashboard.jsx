import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import {
  People,
  LocalHospital,
  EventAvailable,
  ReceiptLong,
} from "@mui/icons-material";

const DashboardCard = ({ title, value, icon }) => (
  <Paper
    elevation={4}
    sx={{
      p: 3,
      display: "flex",
      alignItems: "center",
      gap: 2,
    }}
  >
    {icon}
    <Box>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h5" fontWeight={600}>
        {value}
      </Typography>
    </Box>
  </Paper>
);

const Dashboard = () => {
  // Later you can replace these with API calls
  const [stats, setStats] = useState({
    patients: 0,
    doctors: 0,
    appointments: 0,
    bills: 0,
  });

  useEffect(() => {
    // Placeholder – safe default
    // You can later fetch counts from backend
    
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStats({
      patients: 124,
      doctors: 18,
      appointments: 42,
      bills: 31,
    });
  }, []);

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Dashboard
      </Typography>

      <Typography variant="body2" color="text.secondary" gutterBottom>
        Hospital Management System Overview
      </Typography>

      <Grid container spacing={3} mt={1}>
        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Total Patients"
            value={stats.patients}
            icon={<People color="primary" fontSize="large" />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Doctors"
            value={stats.doctors}
            icon={<LocalHospital color="success" fontSize="large" />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Appointments"
            value={stats.appointments}
            icon={<EventAvailable color="warning" fontSize="large" />}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <DashboardCard
            title="Pending Bills"
            value={stats.bills}
            icon={<ReceiptLong color="error" fontSize="large" />}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
