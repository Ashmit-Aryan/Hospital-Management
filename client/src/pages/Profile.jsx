import {
  Box,
  Paper,
  Typography,
  Grid,
  Divider,
} from "@mui/material";
import { useAuth } from "../auth/AuthContext";

const Profile = () => {
  const { user } = useAuth();
  if (!user) {
    return (
      <Typography color="error">
        User information not available
      </Typography>
    );
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Profile
      </Typography>

      <Paper sx={{ p: 4, maxWidth: 700 }}>
        <Typography variant="h6" gutterBottom>
          Personal Information
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Name
            </Typography>
            <Typography variant="body1">
              {user._doc.name}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1">
              {user._doc.email}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Phone
            </Typography>
            <Typography variant="body1">
              {user._doc.phone}
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Typography variant="body2" color="text.secondary">
              Role
            </Typography>
            <Typography variant="body1">
              {Array.isArray(user._doc.roles)
                ? user._doc.roles.join(", ")
                : user._doc.roles}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary">
              Address
            </Typography>
            <Typography variant="body1">
              {user._doc.address}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Profile;
