import style from "../css/billCard.module.css";
function BillsCard(prop){
  const {bill}=prop;
    return(
        <div className={style.bill_card}>
    <div className={style.bill_header}>
      Medical Bill
    </div>
    <div className={style.bill_content}>
      <p>Patient ID: <span>{bill.patientId}</span></p>
      <p>Amount: <span>₹{bill.amount}</span></p>
      <p>Service: <span>{bill.services}</span></p>
      <p>Payment Status: <span className={style.status_paid}>{bill.paymentStatus}</span></p>
      <p>Date: <span>{bill.date}</span></p>
    </div>
    <div className={style.bill_footer}>
      Thank you for choosing our service!
    </div>
  </div>
    )
}
export default BillsCard;