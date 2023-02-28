import React, { FC } from "react";

export interface PricesProps {
  className?: string;
  domain?: any;
  contentClass?: string;
  labelTextClassName?: string;
  labelText?: string;
}

const Prices: FC<PricesProps> = ({
  className = "pt-3",
  domain,
  contentClass = "py-1.5 md:py-2 px-2.5 md:px-3.5 text-sm sm:text-base font-semibold",
  labelTextClassName = "bg-white",
  labelText,
}) => {
  return (
    <div className={`${className}`}>
      <div
        className={domain.available == true ?  `flex items-baseline border-2 border-green-500 rounded-lg relative ${contentClass} ` : `flex items-baseline border-2 border-red-500 rounded-lg relative ${contentClass} `}
      >
        <span
          className={`block absolute font-normal bottom-full translate-y-1 p-1 -mx-1 text-xs text-neutral-500 dark:text-neutral-400 ${labelTextClassName}`}
        >
          {labelText}
        </span>
        <span className={domain.available == true ? `text-green-500 !leading-none` : `text-red-500 !leading-none`}>{domain.available == true ?  domain.provider == "UD" ? ("$"+ domain.price) : ("$"+ domain.price+"/year") : (domain.metadata=="protected" ? "LOCKED" : "SOLD")}</span>
      </div>
    </div>
  );
};

export default Prices;
