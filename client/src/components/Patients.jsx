import HorizontalSwipe from "./HorizontalSwipe";
import { useState, useEffect } from "react";
import { getPatient } from "../api";
import ProfileCard from "../components/ProfileCard";
import PatientForm from "./PatientsForm";
function Patients() {
  const [patient, setPatient] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visible,setVisible] = useState(false);
  const [visibleForm,setVisibleForm] = useState(false);

  useEffect(() => {
    getPatient()
      .then((data) => {
        setPatient(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [visible]);
  return (
    <section id="patients" className="section">
      <div className="container">
        <h2>Patient Management</h2>
        <div className="card">
          <i className="fas fa-user-plus"></i>
          <h3>Add Patient</h3>
          <button id="add-patient-btn" className="btn" onClick={()=>{setVisibleForm(!visibleForm)}}>
            Add Patient
          </button>
          <button id="see-patient-btn" className="btn" onClick={()=>{setVisible(!visible);}}>
            Show Patient
          </button>
        </div>
        {visible && 
        <div id="patients-list" className="list">
          <HorizontalSwipe>
            {
            patient!=[] ? patient.map((data,index)=>{return <ProfileCard key={index} patients={data}/>}) : <p>No Info</p>  
            }
          </HorizontalSwipe>
        </div>
        }
        {visibleForm &&
        <div className="form">
          <PatientForm/>
        </div>
        }
      </div>
    </section>
  );
}

export default Patients;
