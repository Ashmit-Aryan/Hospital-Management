import React from 'react';
import BillingForm from '../components/Billings/BillingForm';
import BillingList from '../components/Billings/BillingList';

export default function BillingsPage(){
  return (
    <div>
      <h2>Billings</h2>
      <BillingForm />
      <BillingList />
    </div>
  );
}
