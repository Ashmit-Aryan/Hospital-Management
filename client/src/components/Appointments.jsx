import { useState,useEffect } from "react";
import AppointmentsForm from './AppointmentsForm'
import { getAppointments } from "../api";
import AppointmentCard from './AppointmentCard'
import HorizontalSwipe from "./HorizontalSwipe";
function Appointments(){
  const [appointment,setAppointment] = useState([]);
  const [visible, setVisible] = useState(false);
  const [visibleForm, setVisibleForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAppointments()
      .then((data) => {
        setAppointment(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [visible]);
    return(
        <section id="appointments" className="section">
        <div className="container">
          <h2>Appointments</h2>
          <div className="card">
            <i className="fas fa-calendar-check"></i>
            <h3>Schedule Appointment</h3>
            <button id="add-appointment-btn" className="btn"onClick={()=>{setVisibleForm(!visibleForm)}}>
              Schedule Appointment
            </button>
            <button id="see-appointment-btn" className="btn" onClick={()=>{setVisible(!visible)}}>
              See Appointment
            </button>
          </div>
          {visible &&
          <div id="appointments-list" className="list">
            <HorizontalSwipe>
            {
              appointment != [] ? appointment.map((data,index)=>{return <AppointmentCard key={index} data={data}/>}) : <p>no info</p>
            }
            </HorizontalSwipe>
          </div>
          }
          {
            visibleForm &&
            <div className="form">
              <AppointmentsForm/>
            </div>
          }
        </div>
      </section>
    )
}
export default Appointments;