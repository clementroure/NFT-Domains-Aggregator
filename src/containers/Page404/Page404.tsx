import ButtonPrimary from "shared/Button/ButtonPrimary";
import React from "react";
import { Helmet } from "react-helmet";
import NcImage from "shared/NcImage/NcImage";
import I404Png from "images/404.png";

const Page404: React.FC = () => (
  <div className="nc-Page404">
    <Helmet>
      <title>NFT Domains</title>
    </Helmet>
    <div className="container relative pt-5 pb-16 lg:pb-20 lg:pt-5">
      {/* HEADER */}
      <header className="text-center max-w-2xl mx-auto space-y-2">
        <NcImage src={I404Png} />
        {/* <NcImage containerClassName="h-80 w-80 object-cover mx-auto justify-center items-center rotate-12" src={I404Png} /> */}
        <span className="block text-sm text-neutral-800 sm:text-base dark:text-neutral-200 tracking-wider font-medium">
          The page you were looking doesn't exist.{" "}
        </span>
        <div className="pt-8">
          <ButtonPrimary href="/">Return Home Page</ButtonPrimary>
        </div>
      </header>
    </div>
  </div>
);

export default Page404;
