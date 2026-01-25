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
  getBillings,
  createBilling,
  updateBilling,
  deleteBilling,
} from "../api/billings.api";

import {
  getPatientsList,
  getAppointmentsList,
} from "../api/common.api";

const emptyForm = {
  patientId: "",
  billnumber: "",
  services: "",
  totalAmount: "",
  amountPaid: "",
  dueDate: "",
};

export default function Billings() {
  const [rows, setRows] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [edit, setEdit] = useState(null);

  const loadAll = async () => {
    const [b, p, a] = await Promise.all([
      getBillings(),
      getPatientsList(),
      getAppointmentsList(),
    ]);

    setRows(b.data.map(x => ({ ...x, id: x._id })));
    setPatients(p.data);
    setAppointments(a.data);
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { loadAll(); }, []);

  const handleCreate = async () => {
    await createBilling(form);
    setForm(emptyForm);
    loadAll();
  };

  const handleUpdate = async () => {
    await updateBilling(edit._id, edit);
    setEdit(null);
    loadAll();
  };

  return (
    <Box>
      {/* CREATE */}
      <TextField
        select
        label="Patient"
        fullWidth
        margin="normal"
        value={form.patientId}
        onChange={e =>
          setForm({ ...form, patientId: e.target.value })
        }
      >
        {patients.map(p => (
          <MenuItem key={p._id} value={p._id}>{p.name}</MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Appointment Bill Number"
        fullWidth
        margin="normal"
        value={form.billnumber}
        onChange={e =>
          setForm({ ...form, billnumber: e.target.value })
        }
      >
        {appointments.map(a => (
          <MenuItem key={a._id} value={a.billnumber}>
            {a.billnumber}
          </MenuItem>
        ))}
      </TextField>

      {Object.keys(emptyForm)
        .filter(k => !["patientId", "billnumber"].includes(k))
        .map(k => (
          <TextField
            key={k}
            label={k}
            fullWidth
            margin="normal"
            value={form[k]}
            onChange={e =>
              setForm({ ...form, [k]: e.target.value })
            }
          />
        ))}

      <Button variant="contained" onClick={handleCreate}>
        Create Bill
      </Button>

      {/* TABLE */}
      <Box sx={{ height: 450, mt: 3 }}>
        <DataGrid
          rows={rows}
          columns={[
            {
              field: "patientId",
              headerName: "Patient",
              flex: 1,
              valueGetter: p =>
                patients.find(x => x._id === p.row.patientId)?.name || "—",
            },
            { field: "totalAmount", headerName: "Total", width: 120 },
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
                      deleteBilling(p.row._id).then(loadAll)
                    }
                  >
                    Delete
                  </Button>
                </>
              ),
            },
          ]}
        />
      </Box>

      {/* UPDATE */}
      <Dialog open={!!edit} onClose={() => setEdit(null)} fullWidth>
        <DialogTitle>Edit Billing</DialogTitle>
        <DialogContent>
          {edit &&
            Object.keys(emptyForm).map(k => (
              <TextField
                key={k}
                label={k}
                fullWidth
                margin="normal"
                value={edit[k]}
                onChange={e =>
                  setEdit({ ...edit, [k]: e.target.value })
                }
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
