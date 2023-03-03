import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { Elements } from "@stripe/react-stripe-js"
import CheckoutForm from "methods/stripe/checkoutForm";

export const StripePopup = (props: any) => {

    const clientSecret = props.clientSecret;

   return(
        <Transition
        show={props.isStripePopupOpen}
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
        as={Fragment}
    >
        <Dialog
            open={props.isStripePopupOpen}
            onClose={props.setIsStripePopupOpen}
            as="div"
            className={
                "fixed inset-0 z-10 overflow-y-auto flex justify-center items-center"
            }
        >
            <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
            <div className="fixed flex flex-col bg-gray-800 text-white w-10/12 sm:w-96 py-8 px-4 text-center rounded-xl">
             
            <Elements stripe={props.stripePromise} options={{clientSecret, appearance: {theme: "night", labels: 'floating', variables: {colorPrimary: "#141414"}}}}>
                <CheckoutForm setIsStripePopupOpen={props.setIsStripePopupOpen}/>
            </Elements>

            </div>
        </Dialog>
        </Transition>
   );
}