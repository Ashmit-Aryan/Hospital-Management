import style from "../css/profileCard.module.css"
function ProfileCard(prop) {
  const data = prop.patients
  return (
    <div className={style.card}>
      <div className={style.card_image}>
        <span>👤</span>
      </div>
      <div className={style.card_content}>
        <h3>
          Name: <span className={style.highlight}>{data.name}</span>
        </h3>
        <p>
          Gender: <span className={style.highlight}>{data.gender}</span>
        </p>
        <p>
          Age: <span className={style.highlight}>{data.age}</span>
        </p>
        <p>
          Contact: <span className={style.highlight}>{data.contact}</span>
        </p>
        <p>
          Medical History:{" "}
          <span className={style.highlight}>{data.medicalHistory}</span>
        </p>
      </div>
    </div>
  );
}
export default ProfileCard;