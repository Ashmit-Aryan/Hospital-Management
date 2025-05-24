
import "./css/style.css";
import Header from "./components/Header";
import { Analytics } from "@vercel/analytics/react"
import Billings from "./components/Billings";
import Home from "./components/Home";
import Patients from "./components/Patients";
import Appointments from "./components/Appointments";
import Doctors from "./components/Doctors";
import Footer from "./components/Footer";
function App() {


  return (
    <div className="Body">
      <Analytics/>
      <Header />
      <main>
        <Home />
        <Patients />
        <Appointments />
        <Doctors />
        <Billings />
        <Footer />
      </main>
    </div>
  );
}

export default App;
