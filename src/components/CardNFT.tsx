import React, { FC } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import NcImage from "shared/NcImage/NcImage";
import Prices from "./Prices";

export interface CardNFTProps {
  className?: string;
  domain?: any;
}

const CardNFT: FC<CardNFTProps> = ({ className = "", domain }) => {

  const navigate = useNavigate();

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
        <h2 className={`text-lg font-medium`}>
          {domain.name + domain.extension}
        </h2>

        <div className="w-2d4 w-full border-b border-neutral-100 dark:border-neutral-700"></div>

        <div className="flex justify-between items-end ">
          <Prices labelText="Price" price="0.5 ETH" labelTextClassName="bg-white dark:bg-neutral-900 dark:group-hover:bg-neutral-800 group-hover:bg-neutral-50" />
          <div className="flex items-center text-sm text-neutral-500 dark:text-neutral-400">
             <span className="ml-1 mt-0.5">
              {domain.available ? "Available" : "Buy"}
            </span> 
          </div>
        </div>
      </div>

      <button onClick={() => navigate("/nft-detailt", { state: { domain } })} className="absolute inset-0"></button>
    </div>
  );
};

export default CardNFT;
