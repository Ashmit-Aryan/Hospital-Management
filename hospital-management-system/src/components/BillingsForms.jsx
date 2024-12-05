import { useState } from "react";
import styles from "../css/billingsForm.module.css";
import { setBillis } from "../api";

const BillingForm = () => {
  const [formData, setFormData] = useState({
    patientId: "",
    amount: "",
    services: "",
    paymentStatus: "Pending",
    date: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setBillis(formData);
    setFormData({
      patientId: "",
      amount: "",
      services: "",
      paymentStatus: "Pending",
      date: "",
    });
  };

  return (
    <div className={styles.form_container}>
      <h2 className={styles.form_title}>Add Billing Record</h2>
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
          <label htmlFor="amount" className={styles.form_label}>
            Amount:
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            className={styles.form_input}
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>
        <div className={styles.form_group}>
          <label htmlFor="services" className={styles.form_label}>
            Services:
          </label>
          <textarea
            id="services"
            name="services"
            className={styles.form_textarea}
            value={formData.services}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className={styles.form_group}>
          <label htmlFor="paymentStatus" className={styles.form_label}>
            Payment Status:
          </label>
          <select
            id="paymentStatus"
            name="paymentStatus"
            className={styles.form_select}
            value={formData.paymentStatus}
            onChange={handleChange}
            required
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
          </select>
        </div>
        <div className={styles.form_group}>
          <label htmlFor="date" className={styles.form_label}>
            Date:
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
        <button type="submit" className={styles.form_button}>
          Add Billing Record
        </button>
      </form>
    </div>
  );
};

export default BillingForm;
