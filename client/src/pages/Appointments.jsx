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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from "../api/appointments.api";

import {
  getPatientsList,
  getDoctorsList,
} from "../api/common.api";

const emptyForm = {
  patientId: "",
  doctorId: "",
  appointmentReason: "",
  appointmentType: "In-Person",
  date: "",
  time: "",
  billnumber: "",
};

export default function Appointments() {
  const [rows, setRows] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [edit, setEdit] = useState(null);

  const loadAll = async () => {
    const [a, p, d] = await Promise.all([
      getAppointments(),
      getPatientsList(),
      getDoctorsList(),
    ]);

    setRows(a.data.map(x => ({ ...x, id: x._id })));
    setPatients(p.data);
    setDoctors(d.data);
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadAll(); }, []);

  const handleCreate = async () => {
    await createAppointment(form);
    setForm(emptyForm);
    loadAll();
  };

  const handleUpdate = async () => {
    await updateAppointment(edit._id, edit);
    setEdit(null);
    loadAll();
  };

  const columns = [
    {
      field: "patientId",
      headerName: "Patient",
      flex: 1,
      valueGetter: p =>
        patients.find(x => x._id === p.row.patientId)?.name || "—",
    },
    {
      field: "doctorId",
      headerName: "Doctor",
      flex: 1,
      valueGetter: p =>
        doctors.find(x => x._id === p.row.doctorId)?.name || "—",
    },
    { field: "date", headerName: "Date", width: 120 },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: p => (
        <>
          <Button onClick={() => setEdit(p.row)}>Edit</Button>
          <Button
            color="error"
            onClick={() =>
              deleteAppointment(p.row._id).then(loadAll)
            }
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  const renderFormFields = (state, setState) => (
    <>
      <TextField
        select
        label="Patient"
        fullWidth
        margin="normal"
        value={state.patientId}
        onChange={e =>
          setState({ ...state, patientId: e.target.value })
        }
      >
        {patients.map(p => (
          <MenuItem key={p._id} value={p._id}>{p.name}</MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Doctor"
        fullWidth
        margin="normal"
        value={state.doctorId}
        onChange={e =>
          setState({ ...state, doctorId: e.target.value })
        }
      >
        {doctors.map(d => (
          <MenuItem key={d._id} value={d._id}>{d.name}</MenuItem>
        ))}
      </TextField>

      {Object.keys(emptyForm)
        .filter(k => !["patientId", "doctorId"].includes(k))
        .map(k => (
          <TextField
            key={k}
            label={k}
            fullWidth
            margin="normal"
            value={state[k]}
            onChange={e =>
              setState({ ...state, [k]: e.target.value })
            }
          />
        ))}
    </>
  );

  return (
    <Box>
      {/* CREATE */}
      {renderFormFields(form, setForm)}
      <Button variant="contained" onClick={handleCreate}>
        Add Appointment
      </Button>

      {/* TABLE */}
      <Box sx={{ height: 450, mt: 3 }}>
        <DataGrid rows={rows} columns={columns} />
      </Box>

      {/* UPDATE */}
      <Dialog open={!!edit} onClose={() => setEdit(null)} fullWidth>
        <DialogTitle>Edit Appointment</DialogTitle>
        <DialogContent>
          {edit && renderFormFields(edit, setEdit)}
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
