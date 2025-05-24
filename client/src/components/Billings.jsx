import HorizontalSwipe from "./HorizontalSwipe";
import { useEffect, useState } from "react";
import BillingsForms from './BillingsForms'
import { getBillings } from "../api";
import BillsCard from './BillsCard'
function Billings(){
  const [bills,setBills] = useState([]);
  const [visibleForm,setVisibleForm] = useState(false);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getBillings()
      .then((data) => {
        setBills(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, [visible]);
    return(
        <section id="billing" className="section">
          <div className="container">
            <h2>Billing</h2>
            <div className="card">
              <i className="fas fa-file-invoice"></i>
              <h3>Generate Bill</h3>
              <button id="generate-bill-btn" className="btn" onClick={()=>{setVisibleForm(!visibleForm)}}>
                Generate Bill
              </button><button id="see-bill-btn" className="btn" onClick={()=>{setVisible(!visible)}}>
                See Bills
              </button>
            </div>
            {visible && 
            <div id="billing-info" className="list">
              <HorizontalSwipe>
                {
                  bills != [] ? bills.map((data,index)=>{return <BillsCard key={index} bill={data}/>}) : <p>no info</p>
                }
              </HorizontalSwipe>
            </div>
            }
            {
              visibleForm &&
              <div className="form">
                <BillingsForms/>
              </div>
            }
          </div>
        </section>
      
    )
}
export default Billings;