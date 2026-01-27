import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import {
  getDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} from "../api/doctors.api";

/* ================= DEFAULT FORM ================= */
const emptyForm = {
  name: "",
  specialization: "",
  experience: "",
  qualifications: "",
  hospitalAffiliation: "",
  contact: "",
  languagesSpoken: "",
  availability: [],
};

export default function Doctors() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [edit, setEdit] = useState(null);
  const [slot, setSlot] = useState({ date: "", startTime: "", endTime: "" });

  /* ================= LOAD ================= */
  const load = async () => {
    const res = await getDoctors();
    setRows(
      res.data.map((d) => ({
        ...d,
        id: d._id,
        languagesDisplay: d.languagesSpoken?.join(", ") || "—",
        availabilityDisplay:
          d.availability?.length > 0 ? d.availability.length : 0,
      }))
    );
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  /* ================= NORMALIZE ================= */
const normalizePayload = (data) => ({
  ...data,
  experience: Number(data.experience),
  languagesSpoken: data.languagesSpoken
    .split(",")
    .map(l => l.trim())
    .filter(Boolean),
  availability: data.availability,   // ✅ KEEP AS ARRAY OF OBJECTS
});
  /* ================= CREATE ================= */
  const handleCreate = async () => {
    await createDoctor(normalizePayload(form));
    setForm(emptyForm);
    load();
  };

  /* ================= UPDATE ================= */
  const handleUpdate = async () => {
    await updateDoctor(edit._id, normalizePayload(edit));
    setEdit(null);
    load();
  };

  /* ================= AVAILABILITY ================= */
  const addSlot = (target, setTarget) => {
    if (!slot.date || !slot.startTime || !slot.endTime) return;
    setTarget({
      ...target,
      availability: [...target.availability, slot],
    });
    setSlot({ date: "", startTime: "", endTime: "" });
  };

  const removeSlot = (index, target, setTarget) => {
    setTarget({
      ...target,
      availability: target.availability.filter((_, i) => i !== index),
    });
  };

  /* ================= TABLE ================= */
  const columns = [
    { field: "name", headerName: "Name", flex: 1 },
    { field: "specialization", headerName: "Specialization", flex: 1 },
    { field: "experience", headerName: "Experience", width: 120 },
    { field: "languagesDisplay", headerName: "Languages", flex: 1 },
    {
      field: "availabilityDisplay",
      headerName: "Slots",
      width: 100,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 200,
      renderCell: (p) => (
        <>
          <Button
            onClick={() =>
              setEdit({
                ...p.row,
                languagesSpoken: p.row.languagesSpoken?.join(", ") || "",
              })
            }
          >
            Edit
          </Button>
          <Button
            color="error"
            onClick={() => deleteDoctor(p.row._id).then(load)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  /* ================= FORM ================= */
  const renderForm = (state, setState) => (
    <>
      {["name", "specialization", "experience", "qualifications", "hospitalAffiliation", "contact"].map((k) => (
        <TextField
          key={k}
          label={k}
          fullWidth
          margin="normal"
          value={state[k]}
          onChange={(e) => setState({ ...state, [k]: e.target.value })}
        />
      ))}

      <TextField
        label="Languages Spoken (comma separated)"
        fullWidth
        margin="normal"
        value={state.languagesSpoken}
        onChange={(e) =>
          setState({ ...state, languagesSpoken: e.target.value })
        }
      />

      <Typography sx={{ mt: 2 }}>Availability</Typography>

      <Box sx={{ display: "flex", gap: 1 }}>
        <TextField
          type="date"
          value={slot.date}
          onChange={(e) => setSlot({ ...slot, date: e.target.value })}
        />
        <TextField
          type="time"
          value={slot.startTime}
          onChange={(e) => setSlot({ ...slot, startTime: e.target.value })}
        />
        <TextField
          type="time"
          value={slot.endTime}
          onChange={(e) => setSlot({ ...slot, endTime: e.target.value })}
        />
        <Button onClick={() => addSlot(state, setState)}>Add</Button>
      </Box>

      {state.availability.map((s, i) => (
        <Box key={i} sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography>
            {s.date} {s.startTime}–{s.endTime}
          </Typography>
          <Button color="error" onClick={() => removeSlot(i, state, setState)}>
            Remove
          </Button>
        </Box>
      ))}
    </>
  );

  return (
    <Box>
      <Typography variant="h5">Doctors Management</Typography>

      {renderForm(form, setForm)}
      <Button variant="contained" onClick={handleCreate}>
        Add Doctor
      </Button>

      <Box sx={{ height: 450, mt: 3 }}>
        <DataGrid rows={rows} columns={columns} />
      </Box>

      <Dialog open={!!edit} onClose={() => setEdit(null)} fullWidth maxWidth="md">
        <DialogTitle>Edit Doctor</DialogTitle>
        <DialogContent>{edit && renderForm(edit, setEdit)}</DialogContent>
        <DialogActions>
          <Button onClick={() => setEdit(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate}>
            Update Doctor
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
