import { useEffect, useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import {
  getDoctors, createDoctor, updateDoctor, deleteDoctor
} from "../api/doctors.api";

const empty = {
  name:"", specialization:"", experience:"",
  qualifications:"", hospitalAffiliation:"", contact:""
};

export default function Doctors() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(empty);
  const [edit, setEdit] = useState(null);

  const load = async () => {
    const res = await getDoctors();
    setRows(res.data.map(d => ({ ...d, id: d._id })));
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, []);

  const columns = [
    { field:"name", headerName:"Name", flex:1 },
    { field:"specialization", headerName:"Specialization", flex:1 },
    {
      field:"actions", headerName:"Actions", width:200,
      renderCell:p=>(
        <>
          <Button onClick={()=>setEdit(p.row)}>Edit</Button>
          <Button color="error"
            onClick={()=>deleteDoctor(p.row._id).then(load)}>
            Delete
          </Button>
        </>
      )
    }
  ];

  return (
    <Box>
      {Object.keys(form).map(k=>(
        <TextField key={k} label={k} fullWidth margin="normal"
          value={form[k]}
          onChange={e=>setForm({...form,[k]:e.target.value})}
        />
      ))}
      <Button onClick={()=>createDoctor(form).then(load)}>Add Doctor</Button>

      <Box sx={{height:450,mt:3}}>
        <DataGrid rows={rows} columns={columns}/>
      </Box>

      {edit && (
        <Dialog open onClose={()=>setEdit(null)} fullWidth>
          <DialogTitle>Edit Doctor</DialogTitle>
          <DialogContent>
            {Object.keys(empty).map(k=>(
              <TextField key={k} label={k} fullWidth margin="normal"
                value={edit[k]}
                onChange={e=>setEdit({...edit,[k]:e.target.value})}
              />
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={()=>setEdit(null)}>Cancel</Button>
            <Button variant="contained"
              onClick={()=>updateDoctor(edit._id,edit).then(load)}>
              Update
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
