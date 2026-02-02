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
  Chip,
  Divider,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import {
  getBillings,
  createBilling,
  updateBilling,
  deleteBilling,
} from "../api/billings.api";

import { getPatientsList, getAppointmentsList } from "../api/common.api";

/* ================= DEFAULT FORM ================= */
const emptyForm = {
  patientId: "",
  appointmentId: "",
  services: "",
  paymentMethod: "Cash",
  insuranceDetails: {
    provider: "",
    policyNumber: "",
    coverageAmount: 0,
  },
  discount: 0,
  tax: 0,
  totalAmount: 0,
  amountPaid: 0,
  dueDate: "",
  notes: "",
};

export default function Billings() {
  const [rows, setRows] = useState([]);
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [edit, setEdit] = useState(null);

  /* ================= LOAD ================= */
  const loadAll = async () => {
    const [b, p, a] = await Promise.all([
      getBillings(),
      getPatientsList(),
      getAppointmentsList(),
    ]);

    const patientsMap = Object.fromEntries(p.data.map((x) => [x._id, x.name]));

    const appointmentsMap = Object.fromEntries(
      a.data.map((x) => [x._id, `${x.date} ${x.time}`]),
    );

    setRows(
      b.data.map((x) => ({
        ...x,
        id: x._id,
        patientName: patientsMap[x.patientId] || "—",
        appointmentInfo: appointmentsMap[x.appointmentId] || "—",
      })),
    );
    setPatients(p.data);
    setAppointments(a.data);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAll();
  }, []);

  /* ================= CREATE ================= */
  const handleCreate = async () => {
    setForm({ ...form, invoiceNumber: `INV-${Date.now()}` });
    await createBilling(form);
    setForm(emptyForm);
    loadAll();
  };

  /* ================= UPDATE ================= */
  const handleUpdate = async () => {
    // clone edit state
    const payload = {
      services: edit.services,
      paymentMethod: edit.paymentMethod,
      insuranceDetails: edit.insuranceDetails,
      discount: edit.discount,
      tax: edit.tax,
      totalAmount: edit.totalAmount,
      amountPaid: edit.amountPaid,
      dueDate: edit.dueDate,
      notes: edit.notes,
    };

    await updateBilling(edit._id, payload);
    setEdit(null);
    loadAll();
  };
  /* ================= UI ================= */
  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Billing Management
      </Typography>

      {/* ================= CREATE ================= */}
      <TextField
        select
        label="Patient"
        fullWidth
        margin="normal"
        value={form.patientId}
        onChange={(e) => setForm({ ...form, patientId: e.target.value })}
      >
        {patients.map((p) => (
          <MenuItem key={p._id} value={p._id}>
            {p.name}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="Appointment"
        fullWidth
        margin="normal"
        value={form.appointmentId}
        onChange={(e) => setForm({ ...form, appointmentId: e.target.value })}
      >
        {appointments.map((a) => (
          <MenuItem key={a._id} value={a._id}>
            {a.date} {a.time}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        label="Services"
        fullWidth
        margin="normal"
        value={form.services}
        onChange={(e) => setForm({ ...form, services: e.target.value })}
      />

      <TextField
        select
        label="Payment Method"
        fullWidth
        margin="normal"
        value={form.paymentMethod}
        onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
      >
        {["Cash", "Credit Card", "Insurance"].map((m) => (
          <MenuItem key={m} value={m}>
            {m}
          </MenuItem>
        ))}
      </TextField>

      {form.paymentMethod === "Insurance" && (
        <>
          <TextField
            label="Insurance Provider"
            fullWidth
            margin="normal"
            value={form.insuranceDetails.provider}
            onChange={(e) =>
              setForm({
                ...form,
                insuranceDetails: {
                  ...form.insuranceDetails,
                  provider: e.target.value,
                },
              })
            }
          />
          <TextField
            label="Policy Number"
            fullWidth
            margin="normal"
            value={form.insuranceDetails.policyNumber}
            onChange={(e) =>
              setForm({
                ...form,
                insuranceDetails: {
                  ...form.insuranceDetails,
                  policyNumber: e.target.value,
                },
              })
            }
          />
          <TextField
            label="Coverage Amount"
            type="number"
            fullWidth
            margin="normal"
            value={form.insuranceDetails.coverageAmount}
            onChange={(e) =>
              setForm({
                ...form,
                insuranceDetails: {
                  ...form.insuranceDetails,
                  coverageAmount: Number(e.target.value),
                },
              })
            }
          />
        </>
      )}

      <TextField
        label="Discount"
        type="number"
        fullWidth
        margin="normal"
        value={form.discount}
        onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })}
      />

      <TextField
        label="Tax"
        type="number"
        fullWidth
        margin="normal"
        value={form.tax}
        onChange={(e) => setForm({ ...form, tax: Number(e.target.value) })}
      />

      <TextField
        label="Total Amount"
        type="number"
        fullWidth
        margin="normal"
        value={form.totalAmount}
        onChange={(e) =>
          setForm({ ...form, totalAmount: Number(e.target.value) })
        }
      />

      <TextField
        label="Amount Paid"
        type="number"
        fullWidth
        margin="normal"
        value={form.amountPaid}
        onChange={(e) =>
          setForm({ ...form, amountPaid: Number(e.target.value) })
        }
      />

      <TextField
        type="date"
        label="Due Date"
        fullWidth
        margin="normal"
        InputLabelProps={{ shrink: true }}
        value={form.dueDate}
        onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
      />

      <TextField
        label="Notes"
        fullWidth
        margin="normal"
        multiline
        rows={2}
        value={form.notes}
        onChange={(e) => setForm({ ...form, notes: e.target.value })}
      />

      <Button variant="contained" sx={{ mt: 2 }} onClick={handleCreate}>
        Generate Bill
      </Button>

      {/* ================= TABLE ================= */}
      <Box sx={{ height: 480, mt: 4 }}>
        <DataGrid
          rows={rows}
          columns={[
            {
              field: "invoiceNumber",
              headerName: "Invoice",
              flex: 1,
            },
            {
              field: "appointmentDate",
              headerName: "Date",
              flex: 1,
              renderCell: (params) =>
                params.row.appointmentId?.date
                  ? new Date(params.row.appointmentId.date).toLocaleDateString()
                  : "—",
            },
            {
              field: "appointmentTime",
              headerName: "Time",
              flex: 1,
              renderCell: (params) => params.row.appointmentId?.time || "—",
            },
            {
              field: "patient",
              headerName: "Patient",
              flex: 1.5,
              renderCell: (params) =>
                params.row.appointmentId?.patientId?.name || "—",
            },
            {
              field: "doctor",
              headerName: "Doctor",
              flex: 1.5,
              renderCell: (params) =>
                params.row.appointmentId?.doctorId?.name
                  ? `Dr. ${params.row.appointmentId.doctorId.name}`
                  : "—",
            },
            {
              field: "paymentStatus",
              headerName: "Status",
              flex: 1,
              renderCell: (params) => (
                <Chip
                  label={params.value}
                  size="small"
                  color={
                    params.value === "Paid"
                      ? "success"
                      : params.value === "Pending"
                        ? "warning"
                        : "default"
                  }
                />
              ),
            },
            {
              field: "totalAmount",
              headerName: "Total",
              flex: 1,
            },
            {
              field: "amountPaid",
              headerName: "Paid",
              flex: 1,
            },
            {
              field: "balance",
              headerName: "Balance",
              flex: 1,
            },
            {
              field:"actions",
              headerName: "Actions",
              width:200,
              renderCell: (params) => (
                console.log(params.row.paymentStatus),
                <>
                {params.row.paymentStatus !== "Paid" && <Button onClick={() => setEdit(params.row)}>Edit</Button>}
                  {params.row.paymentStatus !== "Paid" && <Button
                    color="error"
                    onClick={() => deleteBilling(params.row._id).then(loadAll)}
                  >
                    Delete
                  </Button> }
                </>
              )
            }
          ]}
        />
      </Box>

      {/* ================= UPDATE DIALOG ================= */}
      <Dialog
        open={!!edit}
        onClose={() => setEdit(null)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Edit Billing</DialogTitle>

        <DialogContent>
          {/* READ-ONLY INFO */}
          <Typography variant="subtitle2">
            Invoice: {edit?.invoiceNumber}
          </Typography>
          <Typography variant="subtitle2">
            Status: {edit?.paymentStatus}
          </Typography>

          <Divider sx={{ my: 2 }} />

          {/* EDITABLE FIELDS */}

          <TextField
            label="Services"
            fullWidth
            margin="normal"
            value={edit?.services || ""}
            onChange={(e) => setEdit({ ...edit, services: e.target.value })}
          />

          <TextField
            select
            label="Payment Method"
            fullWidth
            margin="normal"
            value={edit?.paymentMethod || "Cash"}
            onChange={(e) =>
              setEdit({ ...edit, paymentMethod: e.target.value })
            }
          >
            {["Cash", "Credit Card", "Insurance"].map((m) => (
              <MenuItem key={m} value={m}>
                {m}
              </MenuItem>
            ))}
          </TextField>

          {/* INSURANCE DETAILS */}
          {edit?.paymentMethod === "Insurance" && (
            <>
              <TextField
                label="Insurance Provider"
                fullWidth
                margin="normal"
                value={edit.insuranceDetails?.provider || ""}
                onChange={(e) =>
                  setEdit({
                    ...edit,
                    insuranceDetails: {
                      ...edit.insuranceDetails,
                      provider: e.target.value,
                    },
                  })
                }
              />

              <TextField
                label="Policy Number"
                fullWidth
                margin="normal"
                value={edit.insuranceDetails?.policyNumber || ""}
                onChange={(e) =>
                  setEdit({
                    ...edit,
                    insuranceDetails: {
                      ...edit.insuranceDetails,
                      policyNumber: e.target.value,
                    },
                  })
                }
              />

              <TextField
                label="Coverage Amount"
                type="number"
                fullWidth
                margin="normal"
                value={edit.insuranceDetails?.coverageAmount || 0}
                onChange={(e) =>
                  setEdit({
                    ...edit,
                    insuranceDetails: {
                      ...edit.insuranceDetails,
                      coverageAmount: Number(e.target.value),
                    },
                  })
                }
              />
            </>
          )}

          <TextField
            label="Discount"
            type="number"
            fullWidth
            margin="normal"
            value={edit?.discount ?? 0}
            onChange={(e) =>
              setEdit({ ...edit, discount: Number(e.target.value) })
            }
          />

          <TextField
            label="Tax"
            type="number"
            fullWidth
            margin="normal"
            value={edit?.tax ?? 0}
            onChange={(e) => setEdit({ ...edit, tax: Number(e.target.value) })}
          />

          <TextField
            label="Total Amount"
            type="number"
            fullWidth
            margin="normal"
            value={edit?.totalAmount ?? 0}
            onChange={(e) =>
              setEdit({ ...edit, totalAmount: Number(e.target.value) })
            }
          />

          <TextField
            label="Amount Paid"
            type="number"
            fullWidth
            margin="normal"
            value={edit?.amountPaid ?? 0}
            onChange={(e) =>
              setEdit({ ...edit, amountPaid: Number(e.target.value) })
            }
          />

          <TextField
            type="date"
            label="Due Date"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={edit?.dueDate?.slice(0, 10) || ""}
            onChange={(e) => setEdit({ ...edit, dueDate: e.target.value })}
          />

          <TextField
            label="Notes"
            fullWidth
            margin="normal"
            multiline
            rows={2}
            value={edit?.notes || ""}
            onChange={(e) => setEdit({ ...edit, notes: e.target.value })}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setEdit(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate}>
            Update Bill
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
