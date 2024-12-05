import styles from "../css/appointmentCard.module.css"
function AppointmentCard(prop){
  const {data} = prop;
    return(
        <div className={styles.card}>
        <div className={styles.card_header}>
          Appointment Details
        </div>
        <div className={styles.card_content}>
          <p>Patient ID: <span>{data.patientId}</span></p>
          <p>Doctor ID: <span>{data.doctorId}</span></p>
          <p>Date: <span>{data.date}</span></p>
        </div>
        <div className={styles.card_status.status_confirmed} >
          Status: {data.status}
        </div>
      </div>
    )
}
export default AppointmentCard;