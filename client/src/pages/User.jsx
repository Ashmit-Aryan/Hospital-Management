import { useEffect, useState } from "react";
import { Box, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { getUsers, updateUser, deleteUser } from "../api/user.api";

export default function Users(){
  const [rows,setRows]=useState([]);
  const [edit,setEdit]=useState(null);

  const load=async()=>{
    const res=await getUsers();
    setRows(res.data.map(u=>({...u,id:u._id})));
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(()=>{load();},[]);

  return (
    <Box sx={{height:450}}>
      <DataGrid
        rows={rows}
        columns={[
          {field:"name",headerName:"Name",flex:1},
          {field:"email",headerName:"Email",flex:1},
          {
            field:"actions",headerName:"Actions",width:180,
            renderCell:p=>(
              <>
                <Button onClick={()=>setEdit(p.row)}>Edit</Button>
                <Button color="error"
                  onClick={()=>deleteUser(p.row._id).then(load)}>
                  Delete
                </Button>
              </>
            )
          }
        ]}
      />

      {edit && (
        <Dialog open onClose={()=>setEdit(null)} fullWidth>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <TextField label="Name" fullWidth margin="normal"
              value={edit.name}
              onChange={e=>setEdit({...edit,name:e.target.value})}
            />
            <TextField label="Phone" fullWidth margin="normal"
              value={edit.phone}
              onChange={e=>setEdit({...edit,phone:e.target.value})}
            />
            <TextField label="Address" fullWidth margin="normal"
              value={edit.address}
              onChange={e=>setEdit({...edit,address:e.target.value})}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={()=>setEdit(null)}>Cancel</Button>
            <Button variant="contained"
              onClick={()=>updateUser(edit._id,edit).then(load)}>
              Update
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
