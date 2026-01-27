/* eslint-disable no-unused-vars */
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
  Chip,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

import {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  updateAppointmentStatus,
} from "../api/appointments.api";

import { getPatientsList, getDoctorsList } from "../api/common.api";

const emptyForm = {
  patientId: "",
  doctorId: "",
  appointmentReason: "",
  appointmentType: "In-Person",
  date: null,
  time: "",
};

export default function Appointments() {
  const [rows, setRows] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [edit, setEdit] = useState(null);

  const [cancelId, setCancelId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  /* ================= LOAD & NORMALIZE ================= */
  const loadAll = async () => {
    const [appointmentsRes, patientsRes, doctorsRes] = await Promise.all([
      getAppointments(),
      getPatientsList(),
      getDoctorsList(),
    ]);

    const patientsMap = Object.fromEntries(
      patientsRes.data.map((p) => [p._id, p.name]),
    );

    const doctorsMap = Object.fromEntries(
      doctorsRes.data.map((d) => [d._id, d.name]),
    );

    setRows(
      appointmentsRes.data.map((a) => ({
        ...a,
        id: a._id,
        date: a.date ? dayjs(a.date) : null,
        patientName: patientsMap[a.patientId] || "—",
        doctorName: doctorsMap[a.doctorId] || "—",
      })),
    );

    setPatients(patientsRes.data);
    setDoctors(doctorsRes.data);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAll();
  }, []);

  const normalizePayload = (data) => ({
    ...data,
    date: data.date ? data.date.toISOString() : null,
    followUpDate: data.followUpDate
      ? new Date(data.followUpDate).toISOString()
      : null,
  });

  const sanitizeAppointmentUpdate = (data) => {
    const {
      _id,
      createdBy,
      updatedBy,
      createdAt,
      updatedAt,
      appointmentStatus,
      ...allowed
    } = data;

    return {
      ...allowed,
      updatedBy: undefined, // backend will set this
    };
  };

  /* ================= CREATE / UPDATE ================= */
  const handleCreate = async () => {
    setForm({ ...form, billNumber: 0 });
    await createAppointment(normalizePayload(form));
    setForm(emptyForm);
    loadAll();
  };

  const handleUpdate = async () => {
    const payload = sanitizeAppointmentUpdate(normalizePayload(edit));

    await updateAppointment(edit._id, payload);
    setEdit(null);
    loadAll();
  };

  /* ================= STATUS ACTIONS ================= */
  const markCompleted = async (id) => {
    await updateAppointmentStatus(id, {
      appointmentStatus: "Completed",
    });
    loadAll();
  };

  const confirmCancel = async () => {
    await updateAppointmentStatus(cancelId, {
      appointmentStatus: "Cancelled",
      cancelReason,
    });
    setCancelId(null);
    setCancelReason("");
    loadAll();
  };

  /* ================= FORM ================= */
  const renderFormFields = (state, setState) => (
    <>
      <TextField
        select
        label="Patient"
        fullWidth
        margin="normal"
        value={state.patientId}
        onChange={(e) => setState({ ...state, patientId: e.target.value })}
      >
        {patients.map((p) => (
          <MenuItem key={p._id} value={p._id}>
            {p.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Doctor"
        fullWidth
        margin="normal"
        value={state.doctorId}
        onChange={(e) => setState({ ...state, doctorId: e.target.value })}
      >
        {doctors.map((d) => (
          <MenuItem key={d._id} value={d._id}>
            {d.name}
          </MenuItem>
        ))}
      </TextField>

      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Appointment Date"
          value={state.date}
          onChange={(newValue) => setState({ ...state, date: newValue })}
          slotProps={{
            textField: { fullWidth: true, margin: "normal" },
          }}
        />
      </LocalizationProvider>

      <TextField
        label="Time"
        type="time"
        fullWidth
        margin="normal"
        value={state.time}
        onChange={(e) => setState({ ...state, time: e.target.value })}
      />

      <TextField
        label="Reason"
        fullWidth
        margin="normal"
        value={state.appointmentReason}
        onChange={(e) =>
          setState({ ...state, appointmentReason: e.target.value })
        }
      />
    </>
  );

  /* ================= TABLE ================= */
  const columns = [
    { field: "patientName", headerName: "Patient", flex: 1 },
    { field: "doctorName", headerName: "Doctor", flex: 1 },
    {
      field: "date",
      headerName: "Date",
      width: 130,
      valueFormatter: (p) =>
        p.value ? dayjs(p.value).format("DD-MM-YYYY") : "—",
    },
    {
      field: "appointmentStatus",
      headerName: "Status",
      width: 140,
      renderCell: (p) => (
        <Chip
          label={p.value}
          color={
            p.value === "Completed"
              ? "success"
              : p.value === "Cancelled"
                ? "error"
                : "warning"
          }
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 360,
      renderCell: (p) => {
        if (p.row.appointmentStatus !== "Scheduled") return null;

        return (
          <>
            <Button onClick={() => setEdit(p.row)}>Edit</Button>

            <Button onClick={() => markCompleted(p.row._id)}>Complete</Button>

            <Button color="error" onClick={() => setCancelId(p.row._id)}>
              Cancel
            </Button>

            <Button
              color="error"
              onClick={async () => {
                await deleteAppointment(p.row._id);
                loadAll();
              }}
            >
              Delete
            </Button>
          </>
        );
      },
    },
  ];

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
          {/* EXISTING FIELDS */}
          {edit && renderFormFields(edit, setEdit)}

          {/* ================= FOLLOW-UP SECTION ================= */}
          <Box sx={{ mt: 2 }}>
            <TextField
              select
              label="Follow Up Required?"
              fullWidth
              margin="normal"
              value={edit?.followUp ? "yes" : "no"}
              onChange={(e) =>
                setEdit({
                  ...edit,
                  followUp: e.target.value === "yes",
                })
              }
            >
              <MenuItem value="no">No</MenuItem>
              <MenuItem value="yes">Yes</MenuItem>
            </TextField>

            {edit?.followUp && (
              <>
                <TextField
                  type="date"
                  label="Follow Up Date"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  value={
                    edit?.followUpDate
                      ? dayjs(edit.followUpDate).format("YYYY-MM-DD")
                      : ""
                  }
                  onChange={(e) =>
                    setEdit({
                      ...edit,
                      followUpDate: e.target.value,
                    })
                  }
                />

                <TextField
                  type="time"
                  label="Follow Up Time"
                  fullWidth
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  value={edit?.followUpTime || ""}
                  onChange={(e) =>
                    setEdit({
                      ...edit,
                      followUpTime: e.target.value,
                    })
                  }
                />

                <TextField
                  label="Follow Up Reason"
                  fullWidth
                  margin="normal"
                  value={edit?.followUpReason || ""}
                  onChange={(e) =>
                    setEdit({
                      ...edit,
                      followUpReason: e.target.value,
                    })
                  }
                />

                <TextField
                  label="Follow Up Notes"
                  fullWidth
                  margin="normal"
                  multiline
                  rows={2}
                  value={edit?.followUpNotes || ""}
                  onChange={(e) =>
                    setEdit({
                      ...edit,
                      followUpNotes: e.target.value,
                    })
                  }
                />
              </>
            )}
          </Box>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setEdit(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate}>
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* CANCEL DIALOG */}
      <Dialog open={!!cancelId} onClose={() => setCancelId(null)}>
        <DialogTitle>Cancel Appointment</DialogTitle>
        <DialogContent>
          <TextField
            label="Cancellation Reason"
            fullWidth
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCancelId(null)}>Close</Button>
          <Button color="error" onClick={confirmCancel}>
            Confirm Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
