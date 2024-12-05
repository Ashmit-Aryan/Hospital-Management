import { useState, useEffect} from "react";
import HorizontalSwipe from "../components/HorizontalSwipe";
import DoctorForm from "./DoctorForm";
import { getDoctor } from "../api";
import DoctorProfileCard from "./DoctorCard";
function Doctors() {
  const [doctor,setDoctor] = useState([])
  const [visible, setVisible] = useState(false);
  const [visibleForm,setVisibleForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDoctor()
      .then((data) => {
        setDoctor(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [visible]);

  return (
    <section id="doctors" className="section">
      <div className="container">
        <h2>Doctors</h2>
        <div className="card">
          <i className="fas fa-user-md"></i>
          <h3>Add Doctor</h3>
          <button id="add-doctor-btn" className="btn" onClick={()=>{setVisibleForm(!visibleForm)}}>
            Add Doctor
          </button>
          <button
            id="see-doctor-btn"
            className="btn"
            onClick={() => {
              setVisible(!visible);
            }}
          >
            See Doctor
          </button>
        </div>
        {visible && (
          <div id="doctors-list" className="list">
            <HorizontalSwipe >
              {
                doctor != [] ? doctor.map((data,index)=>{return <DoctorProfileCard key={index} doctor={data}/>}): <p>no info</p> 
              }
            </HorizontalSwipe>
          </div>
        )}
        {visibleForm && 
        <div className="form">
          <DoctorForm/>
        </div>
        }
      </div>
    </section>
  );
}

export default Doctors;
