import { useState } from "react";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState({ email: "", password: "" });

 const submit = async () => {
  try {
    await login(data);
    navigate("/");
  } catch (err) {
    console.error(err);
    alert(
      err.response?.data?.error ||
      err.message ||
      "Login failed"
    );
  }
};


  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Paper sx={{ p: 4, width: 380 }}>
        <Typography variant="h5" align="center">Hospital Login</Typography>
        <TextField label="Email" fullWidth margin="normal"
          onChange={e => setData({ ...data, email: e.target.value })} />
        <TextField label="Password" type="password" fullWidth margin="normal"
          onChange={e => setData({ ...data, password: e.target.value })} />
        <Button variant="contained" fullWidth sx={{ mt: 2 }} onClick={submit}>
          Login
        </Button>
      </Paper>
    </Box>
  );
};

export default Login;
