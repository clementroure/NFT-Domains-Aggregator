import React, {useState} from 'react';
import {useStripe, useElements, PaymentElement, CardElement} from '@stripe/react-stripe-js';
// https://stripe.com/docs/payments/accept-card-payments?platform=web&ui=elements&html-or-react=react

// https://dashboard.stripe.com/customers/cus_MIguekRBXg8PXd   customer url on stripe clementrourefb

const CheckoutForm = (props: any) => {
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event: any) => {

    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe not loaded yet
      return;
    }

    const {error} = await stripe.confirmSetup({
      elements,
      confirmParams: {
        return_url: 'https://gooogle.com',
      },
      redirect: "if_required",
    })

    // setupIntent_id -> retrieve pm_id from setupIntent -> use it for paymentIntent

    if (error) {
      // This point will only be reached if there is an immediate error when
      // confirming the payment. Show error to your customer (for example, payment
      // details incomplete)
      setErrorMessage(error.message!);

    } else {
      // Your customer will be redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer will be redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.

      // const uid = secureLocalStorage.getItem('myId') || "";
      // const ref = doc(db, "users", uid?.toString());

      // const pm_id = await getSetupIntentElements(props.setupIntentId)
      // if(pm_id != "" && pm_id != null){

      //   await updateDoc(ref, {
      //     pm_id: pm_id,
      //   });
      //   secureLocalStorage.setItem("pm_id", pm_id)

      //   console.log("Card added successfully !")

      //   props.handleClose(event, false)
      // }
    }

  };

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <PaymentElement />
      <button className="bg-gray-800 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded mt-6 shadow" disabled={!stripe}>Submit</button>
      <button onClick={() => props.setIsStripePopupOpen(false)} className="bg-gray-800 hover:bg-gray-800 text-white font-bold py-2 px-4 rounded mt-6 shadow" disabled={!stripe}>Cancel</button>
      {errorMessage && <div className='text-red-400 mt-4 text-sm'>{errorMessage}</div>}
    </form>
  )
};

export default CheckoutForm;