import {  useState } from "react";
import styles from "../css/profileForm.module.css";
import { setPatients } from "../api";
const PatientForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    medicalHistory: "",
    dob: "",
    contact: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };



  const handleSubmit = (e) => {
    e.preventDefault();
    setPatients(formData);
    setFormData({
      name: "",
      age: "",
      gender: "",
      medicalHistory: "",
      dob: "",
      contact: "",
    })
  };

  return (
    <div className={styles.form_container}>
      <h2 className={styles.form_title}>Add Patient</h2>
      <form className={styles.form_body} onSubmit={handleSubmit}>
        <div className={styles.form_group}>
          <label htmlFor="name" className={styles.form_label}>
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            className={styles.form_input}
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.form_group}>
          <label htmlFor="age" className={styles.form_label}>
            Age:
          </label>
          <input
            type="number"
            id="age"
            name="age"
            className={styles.form_input}
            value={formData.age}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.form_group}>
          <label htmlFor="gender" className={styles.form_label}>
            Gender:
          </label>
          <select
            id="gender"
            name="gender"
            className={styles.form_select}
            value={formData.gender}
            onChange={handleChange}
            required
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div className={styles.form_group}>
          <label htmlFor="medicalHistory" className={styles.form_label}>
            Medical Condition:
          </label>
          <textarea
            id="medicalHistory"
            name="medicalHistory"
            className={styles.form_textarea}
            value={formData.medicalHistory}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className={styles.form_group}>
          <label htmlFor="dob" className={styles.form_label}>
            Date of Birth:
          </label>
          <input
            type="date"
            id="dob"
            name="dob"
            className={styles.form_input}
            value={formData.dob}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.form_group}>
          <label htmlFor="contact" className={styles.form_label}>
            Contact:
          </label>
          <input
            type="tel"
            id="contact"
            name="contact"
            className={styles.form_input}
            value={formData.contact}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className={styles.form_button}>
          Add Patient
        </button>
      </form>
    </div>
  );
};

export default PatientForm;
