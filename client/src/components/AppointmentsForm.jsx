import { useState } from "react";
import styles from "../css/appointmentsForm.module.css";
import { setAppointments } from "../api";
const AppointmentsForm = () => {
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    date: "",
    status: "Scheduled",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setAppointments(formData);
    setFormData({
      patientId: "",
      doctorId: "",
      date: "",
      status: "Scheduled",
    });
  };

  return (
    <div className={styles.form_container}>
      <h2 className={styles.form_title}>Add Appointment</h2>
      <form className={styles.form_body} onSubmit={handleSubmit}>
        <div className={styles.form_group}>
          <label htmlFor="patientId" className={styles.form_label}>
            Patient ID:
          </label>
          <input
            type="text"
            id="patientId"
            name="patientId"
            className={styles.form_input}
            value={formData.patientId}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.form_group}>
          <label htmlFor="doctorId" className={styles.form_label}>
            Doctor ID:
          </label>
          <input
            type="text"
            id="doctorId"
            name="doctorId"
            className={styles.form_input}
            value={formData.doctorId}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.form_group}>
          <label htmlFor="date" className={styles.form_label}>
            Appointment Date:
          </label>
          <input
            type="date"
            id="date"
            name="date"
            className={styles.form_input}
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.form_group}>
          <label htmlFor="status" className={styles.form_label}>
            Status:
          </label>
          <select
            id="status"
            name="status"
            className={styles.form_select}
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="Scheduled">Scheduled</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <button type="submit" className={styles.form_button}>
          Add Appointment
        </button>
      </form>
    </div>
  );
};

export default AppointmentsForm;
