import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  getPatients,
  createPatient,
  updatePatient,
  deletePatient,
} from "../api/patients.api";

const emptyForm = {
  name: "",
  age: "",
  gender: "",
  address: "",
  contact: "",
  medicalHistory: "",
};

export default function Patients() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [edit, setEdit] = useState(null);

  const loadPatients = async () => {
    const res = await getPatients();
    setRows(res.data.map((p) => ({ ...p, id: p._id })));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadPatients();
  }, []);

  const normalizePayload = (data) => ({
    ...data,
    age: Number(data.age),
  });

  const handleCreate = async () => {
    await createPatient(normalizePayload(form));
    setForm(emptyForm);
    loadPatients();
  };

  const handleUpdate = async () => {
    await updatePatient(edit._id, normalizePayload(edit));
    setEdit(null);
    loadPatients();
  };

  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "age", headerName: "Age", width: 80 },
    { field: "gender", headerName: "Gender", width: 120 },
    { field: "contact", headerName: "Contact", flex: 1 },
    {
      field: "appointmentId",
      headerName: "Appointments",
      flex: 1,
      valueGetter: (params) => {
        const ids = params?.row?.appointmentId;
        return Array.isArray(ids) && ids.length > 0 ? ids.join(", ") : "—";
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (params) => (
        <>
          <Button onClick={() => setEdit(params.row)}>Edit</Button>
          <Button
            color="error"
            onClick={() => deletePatient(params.row._id).then(loadPatients)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Patients
      </Typography>

      {/* CREATE FORM */}
      <Box sx={{ maxWidth: 600 }}>
        <TextField
          label="Name"
          fullWidth
          required
          margin="normal"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <TextField
          label="Age"
          type="number"
          fullWidth
          required
          margin="normal"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
        />

        <TextField
          label="Gender"
          select
          fullWidth
          required
          margin="normal"
          value={form.gender}
          onChange={(e) => setForm({ ...form, gender: e.target.value })}
        >
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </TextField>

        <TextField
          label="Contact"
          fullWidth
          required
          margin="normal"
          value={form.contact}
          onChange={(e) => setForm({ ...form, contact: e.target.value })}
        />

        <TextField
          label="Address"
          fullWidth
          required
          multiline
          rows={2}
          margin="normal"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />

        <TextField
          label="Medical History"
          fullWidth
          required
          multiline
          rows={3}
          margin="normal"
          value={form.medicalHistory}
          onChange={(e) => setForm({ ...form, medicalHistory: e.target.value })}
        />

        <Button variant="contained" sx={{ mt: 2 }} onClick={handleCreate}>
          Add Patient
        </Button>
      </Box>

      {/* TABLE */}
      <Box sx={{ height: 450, mt: 4 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10]}
        />
      </Box>

      {/* EDIT DIALOG */}
      <Dialog open={!!edit} onClose={() => setEdit(null)} fullWidth>
        <DialogTitle>Edit Patient</DialogTitle>
        <DialogContent>
          {edit &&
            Object.keys(emptyForm).map((key) => (
              <TextField
                key={key}
                label={key}
                fullWidth
                required
                margin="normal"
                value={edit[key]}
                onChange={(e) => setEdit({ ...edit, [key]: e.target.value })}
              />
            ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEdit(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate}>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
