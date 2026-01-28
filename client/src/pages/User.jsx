import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import {
  getUsers,
  updateUser,
  deleteUser,
} from "../api/user.api";
import { createUser } from "../api/auth.api";
import {jwtDecode} from "jwt-decode";
export default function Users() {
  const [rows, setRows] = useState([]);
  const [edit, setEdit] = useState(null);
  const [openCreate, setOpenCreate] = useState(false);

  // 🔐 Get logged-in user
  const token = localStorage.getItem("token");
  const currentUser = jwtDecode(token);
  const isAdmin = currentUser?._doc?.roles?.includes("admin");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    roles: [],
  });

  const load = async () => {
    const res = await getUsers();
    setRows(res.data.map((u) => ({ ...u, id: u._id })));
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, []);

  /* ================= CREATE USER (ADMIN ONLY) ================= */
  const handleCreate = async () => {
    await createUser(form);
    setOpenCreate(false);
    setForm({
      name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      roles: [],
    });
    load();
  };

  return (
    <Box sx={{ height: 450 }}>
      {/* ✅ ADMIN ONLY: ADD USER BUTTON */}
      {isAdmin && (
        <Button
          variant="contained"
          sx={{ mb: 2 }}
          onClick={() => setOpenCreate(true)}
        >
          Add User
        </Button>
      )}

      <DataGrid
        rows={rows}
        columns={[
          { field: "name", headerName: "Name", flex: 1 },
          { field: "email", headerName: "Email", flex: 1 },
          {
            field: "actions",
            headerName: "Actions",
            width: 200,
            renderCell: (p) => (
              <>
                <Button onClick={() => setEdit(p.row)}>Edit</Button>

                {/* ❌ Only admin can delete users */}
                {isAdmin && (
                  <Button
                    color="error"
                    onClick={() => deleteUser(p.row._id).then(load)}
                  >
                    Delete
                  </Button>
                )}
              </>
            ),
          },
        ]}
      />

      {/* ================= CREATE USER DIALOG (ADMIN ONLY) ================= */}
      {isAdmin && (
        <Dialog open={openCreate} onClose={() => setOpenCreate(false)} fullWidth>
          <DialogTitle>Create User</DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />
            <TextField
              label="Phone"
              fullWidth
              margin="normal"
              value={form.phone}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value })
              }
            />
            <TextField
              label="Address"
              fullWidth
              margin="normal"
              value={form.address}
              onChange={(e) =>
                setForm({ ...form, address: e.target.value })
              }
            />
            <TextField
              label="Roles (comma separated)"
              fullWidth
              margin="normal"
              value={form.roles.join(",")}
              onChange={(e) =>
                setForm({ ...form, roles: e.target.value.split(",") })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleCreate}>
              Create
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* ================= EDIT USER ================= */}
      {edit && (
        <Dialog open onClose={() => setEdit(null)} fullWidth>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              value={edit.name}
              onChange={(e) =>
                setEdit({ ...edit, name: e.target.value })
              }
            />
            <TextField
              label="Phone"
              fullWidth
              margin="normal"
              value={edit.phone}
              onChange={(e) =>
                setEdit({ ...edit, phone: e.target.value })
              }
            />
            <TextField
              label="Address"
              fullWidth
              margin="normal"
              value={edit.address}
              onChange={(e) =>
                setEdit({ ...edit, address: e.target.value })
              }
            />
            
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEdit(null)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={() =>
                updateUser(edit._id, edit).then(load)
              }
            >
              Update
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
