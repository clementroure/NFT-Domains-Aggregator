import React, { FC } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NcImage from "shared/NcImage/NcImage";
import Prices from "./Prices";

export interface CardNFTProps {
  className?: string;
  domain?: any;
  setIsPopupOpen?: any;
  setPopup?: any;
  setIsNftPageVisible?: any;
  setSelectedDomain?: any;
}

const CardNFT: FC<CardNFTProps> = ({ className = "", domain, setIsPopupOpen, setPopup, setIsNftPageVisible, setSelectedDomain}) => {

  const buyDomain = () => {

    setSelectedDomain(domain)
    setPopup({
      title: "Domain Available", subtitle: "You can buy it", body:`Buy this domain name for: $${domain.price}`, 
      btn1: "Buy now", btn2: "Cancel", id: "available"
    })
    setIsPopupOpen(true)
  }

  const protectedDomain = () => {

    setSelectedDomain(domain)
    setPopup({
      
      title: "Domain Protected", subtitle: "You can't buy it", body:`Search for another domain.`, 
      btn1: "Learn more", btn2: "Cancel", id: "protected"
    })
    setIsPopupOpen(true)
  }

  const navigateToNftPage = () => {

    let currentPage = new URL(window.location.href);
    window.history.replaceState(null, "NFT Domains", currentPage+"?="+domain.name+domain.extension)
    setSelectedDomain(domain)
    setIsNftPageVisible(true)
  }

  return (
    <div
      className={`nc-CardNFT relative flex flex-col group !border-0 [ nc-box-has-hover nc-dark-box-bg-has-hover ] ${className}`}
      data-nc-id="CardNFT"
    >
      <div className="relative flex-shrink-0 ">
        <div>
          <NcImage
            containerClassName="flex aspect-w-11 aspect-h-12 w-full h-0 rounded-3xl overflow-hidden z-0"
            // src={nftsImgs[Math.floor(Math.random() * nftsImgs.length)]}
            src={domain.image}
            className="object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-300 ease-in-out will-change-transform"
          />
        </div>
        <div className="absolute top-3 inset-x-3 flex"></div>
      </div>

      <div className="p-4 py-5 space-y-3">
        <h2 className={`text-lg font-medium truncate`}>
          {domain.name + domain.extension}
        </h2>

        <div className="w-2d4 w-full border-b border-neutral-100 dark:border-neutral-700"></div>

        <div className="flex justify-between items-end ">
          <Prices labelText="Price" domain={domain} labelTextClassName="bg-white dark:bg-neutral-900 dark:group-hover:bg-neutral-800 group-hover:bg-neutral-50" />
          <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400">
             <span className="ml-1 mt-0.5">
              {domain.available ? "Buy now" : "More details"}
            </span> 
          </div>
        </div>
      </div>

      {domain.provider == "UD" ?
      <button onClick={() => !domain.available ? (domain.metadata == "protected" ? protectedDomain() : navigateToNftPage() ): buyDomain() } className="absolute inset-0"></button>
      :
      <button onClick={() => !domain.available ? navigateToNftPage() : buyDomain() } className="absolute inset-0"></button>
      }
    </div>
  );
};

export default CardNFT;
