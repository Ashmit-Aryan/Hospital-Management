
import styles from "../css/doctorProfileCard.module.css";

const DoctorProfileCard = (prop) => {
    const {doctor} = prop
  return (
    <div className={styles.card}>
      <h2 className={styles.card_name}>{doctor.name}</h2>
      <p className={styles.card_specialization}>
        <strong>Specialization:</strong> {doctor.specialization}
      </p>
      <p className={styles.card_contact}>
        <strong>Contact:</strong> {doctor.contact}
      </p>
      <div className={styles.card_availability}>
        <strong>Availability:</strong>
        <ul className={styles.card_availability_list}>
          {doctor.availability.map((time, index) => (
            <li key={index} className={styles.card_availability_item}>
              {time}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DoctorProfileCard;
