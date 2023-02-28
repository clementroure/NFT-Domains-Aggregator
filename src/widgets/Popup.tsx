import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

export const Popup = (props: any) => {

   return(
        <Transition
        show={props.isPopupOpen}
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
        as={Fragment}
    >
        <Dialog
            open={props.isPopupOpen}
            onClose={props.setIsPopupOpen}
            as="div"
            className={
                "fixed inset-0 z-10 overflow-y-auto flex justify-center items-center"
            }
        >
            <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
            <div className="fixed flex flex-col bg-gray-800 text-white w-10/12 sm:w-96 py-8 px-4 text-center rounded-xl">
                <Dialog.Overlay />

                <Dialog.Title className={props.popup.id == "protected" ? `text-red-500 text-3xl` : `text-green-500 text-3xl`}>
                    {props.popup.title}
                </Dialog.Title>
                <Dialog.Description className="text-xl m-2">
                    {props.popup.subtitle}
                </Dialog.Description>

                <p className="text-md m-4">
                    {props.popup.body}
                </p>

                <button
                    className={props.popup.id == "protected" ? `w-11/12 m-4 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm` 
                              : `w-11/12 m-4 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm`
                              }
                    onClick={() => {
                        if(props.popup.id == "protected"){
                            window.open('https://unstoppabledomains.freshdesk.com/support/solutions/articles/48001186091-why-are-some-domains-protected-#:~:text=Protected%20domains%20are%20domains%20that,brands%20into%20the%20Web3%20era.', '_blank', 'noreferrer');
                        }
                        else if(props.popup.id == "available"){
                            props.buy();
                        }
                        props.setIsPopupOpen(false);
                    }}
                >
                    {props.popup.btn1}
                </button>
                <button
                    className="m-4 w-11/12 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => props.setIsPopupOpen(false)}
                >
                    {props.popup.btn2}
                </button>
            </div>
        </Dialog>
        </Transition>
   );
}