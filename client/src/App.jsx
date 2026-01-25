import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Patients from "./pages/Patients";
import DashboardLayout from "./layouts/DashboardLayout";
import PrivateRoute from "./auth/PrivateRoute";
import Dashboard from "./pages/Dashboard";
import Doctors from "./pages/Doctors";
import Appointments from "./pages/Appointments";
import Billings from "./pages/Billings";
import Users from "./pages/User";
import Profile from "./pages/Profile";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <PrivateRoute>
            <DashboardLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="patients" element={<Patients />} />
        <Route path="doctors" element={<Doctors />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="billings" element={<Billings />} />
        <Route path="users" element={<Users />} />

        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
