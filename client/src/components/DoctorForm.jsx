import { useState } from "react";
import styles from "../css/doctorForm.module.css";
import { setDoctors } from "../api";

const DoctorForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    specialization: "",
    contact: "",
    availability: [],
  });

  const [currentAvailability, setCurrentAvailability] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAvailabilityAdd = () => {
    if (currentAvailability) {
      setFormData({
        ...formData,
        availability: [...formData.availability, currentAvailability],
      });
      setCurrentAvailability("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setDoctors(formData);
    setFormData({
      name: "",
      specialization: "",
      contact: "",
      availability: [],
    });
  };

  return (
    <div className={styles.form_container}>
      <h2 className={styles.form_title}>Add Doctor</h2>
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
          <label htmlFor="specialization" className={styles.form_label}>
            Specialization:
          </label>
          <input
            type="text"
            id="specialization"
            name="specialization"
            className={styles.form_input}
            value={formData.specialization}
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
        <div className={styles.form_group}>
          <label htmlFor="availability" className={styles.form_label}>
            Availability:
          </label>
          <div className={styles.availability_group}>
            <input
              type="text"
              id="availability"
              name="availability"
              className={styles.form_input}
              placeholder="Add available day/time (e.g., Monday 9 AM - 5 PM)"
              value={currentAvailability}
              onChange={(e) => setCurrentAvailability(e.target.value)}
            />
            <button
              type="button"
              className={styles.availability_button}
              onClick={handleAvailabilityAdd}
            >
              Add
            </button>
          </div>
          <ul className={styles.availability_list}>
            {formData.availability.map((slot, index) => (
              <li key={index} className={styles.availability_item}>
                {slot}
              </li>
            ))}
          </ul>
        </div>
        <button type="submit" className={styles.form_button}>
          Add Doctor
        </button>
      </form>
    </div>
  );
};

export default DoctorForm;
