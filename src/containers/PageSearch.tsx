import React, { FC, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import BackgroundSection from "components/BackgroundSection/BackgroundSection";
import Pagination from "shared/Pagination/Pagination";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import SectionSliderCollections from "components/SectionSliderCollections";
import SectionBecomeAnAuthor from "components/SectionBecomeAnAuthor/SectionBecomeAnAuthor";
import HeaderFilterSearchPage from "components/HeaderFilterSearchPage";
import Input from "shared/Input/Input";
import ButtonCircle from "shared/Button/ButtonCircle";
import CardNFT from "components/CardNFT";
import { useLocation } from "react-router-dom";
import { checkAllUD } from "methods/api/checkUD";
import { ethers } from "ethers";
import {contractAddress,contractABI} from "../contracts/ens/ens_contract"
import { CheckENS } from "methods/api/checkENS";
import Lottie from "lottie-react";
import loadingLottie from "../images/loading.json";
const ethereum = window.ethereum;

export interface PageSearchProps {
  className?: string;
}

const PageSearch: FC<PageSearchProps> = ({ className = "" }) => {

  const location = useLocation();
  // check if new search input is different than last one
  const [oldDomainInput, setOldDomainInput] = useState("")
  // search input
  const [inputDomain, setInputDomain] = useState((location.state != null && location.state.inputDomain != undefined) ? location.state.inputDomain : "")
  // 1 result obj = 1 line
  const [results, setResults] = useState<{name: string, extension: string, available: boolean, provider: string, blockchain: string, price: number, renewalPrice: number, startDate: Date, endDate: Date, image:string, metadata: any}[]>([])
  // just to update the UI
  const [resultsUI, setResultsUI] = useState<{isLoading: boolean}[]>([])
  // check if display table
  const [hasResults, setHasResults] = useState(false)
  // loadings
  const [isLoading, setIsLoading] = useState(false)
  const [isUDloading, setIsUDloading] = useState(false)
  const [isENSloading, setIsENSloading] = useState(false)


  const searchDomain = async (e:any = null) => {

    // format input
    const formattedDomainInput = (inputDomain.replace(/,(\s+)?$/, '')).replace(/\s+/g, "");
    setInputDomain(formattedDomainInput)
    // separate multiple domains
    var domainList = (formattedDomainInput).split(",").map(function(item:any) {
      return item.trim();
    });
    // test if each domain doesnt contain special chars
    if(domainList[0].match(/^ *$/) !== null) { return; } else{ if(e!=null){e.preventDefault();} }
    const regex = new RegExp("^[A-Za-z0-9]+[a-zA-Z0-9-]*$")
    for(let i=0; i<domainList.length;i++){
      if(!regex.test(domainList[i])){
        alert("Error: The search input contains invalid characters.")
        return;
      }
    }

      setIsLoading(true);
      setIsENSloading(true);
      setIsUDloading(true);
      setResults([]);

      // if several domains
      for(let i=0; i<domainList.length;i++){

        checkAllUD(domainList[i], setResults, true, setIsUDloading);

        if(domainList[i].length >= 3){ // min 3 char for ENS domain

            CheckENS(domainList[i], setIsENSloading, setResults);
        }
        else{
          setIsENSloading(false);
        }
      }
  }

  useEffect(() => {
    if(inputDomain != "")
    searchDomain()
  },[])

   // called when ud or ens data ahs been loaded
   const [ignoreFirst, setIgnoreFirst] = useState(true)
   useEffect(() => {
    if(ignoreFirst){setIgnoreFirst(false); return;}

    if(results.length > 1){ // more than ENS result only
      if(!isENSloading && !isUDloading){

        let _resultsUI: {isLoading: boolean}[] = []
        for(let i=0; i<results.length;i++){
          _resultsUI.push({isLoading: false})
        }
        setResultsUI(_resultsUI)

        setHasResults(true)
        setIsLoading(false)
        console.log(results)
      }
    }

   },[results])

  return (
    <div className={`nc-PageSearch  ${className}`} data-nc-id="PageSearch">
      <Helmet>
        <title>NFT Domains</title>
      </Helmet>

      <div
        className={`nc-HeadBackgroundCommon h-24 2xl:h-28 top-0 left-0 right-0 w-full bg-primary-50 dark:bg-neutral-800/20 `}
        data-nc-id="HeadBackgroundCommon"
      />
      <div className="container">
        <header className="max-w-2xl mx-auto -mt-10 flex flex-col lg:-mt-7">
          <div className="relative w-full ">
            <label
              htmlFor="search-input"
              className="text-neutral-500 dark:text-neutral-300"
            >
              <span className="sr-only">Search all icons</span>
               <form>
                <Input
                  minLength={1} maxLength={1000} required
                  className="shadow-lg border-0 dark:border"
                  id="search-input"
                  type="search"
                  value={inputDomain}
                  onChange={(e) => setInputDomain(e.target.value)}
                  placeholder="Enter a name"
                  sizeClass="pl-14 py-5 pr-5 md:pl-16"
                  rounded="rounded-full"
                />
                <ButtonCircle
                  onClick={(e:any) => searchDomain(e)}
                  className="absolute right-2.5 top-1/2 transform -translate-y-1/2"
                  size=" w-11 h-11"
                  type="submit"
                >
                  <i className="las la-arrow-right text-xl"></i>
                </ButtonCircle>
                </form>
              <span className="absolute left-5 top-1/2 transform -translate-y-1/2 text-2xl md:left-6">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M22 22L20 20"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </label>
          </div>
        </header>
      </div>

      {!isLoading ?
      <>
      {hasResults ?
      <div className="container py-16 lg:pb-28 lg:pt-20 space-y-16 lg:space-y-28">
        <main>
          {/* FILTER */}
          <HeaderFilterSearchPage />

          {/* LOOP ITEMS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-10 mt-8 lg:mt-10">
            {results.map((_domain, index) => (
              <CardNFT domain={_domain} key={index} />
            ))}
          </div>

          {/* PAGINATION */}
          <div className="flex flex-col mt-12 lg:mt-16 space-y-5 sm:space-y-0 sm:space-x-3 sm:flex-row sm:justify-between sm:items-center">
            <Pagination />
            <ButtonPrimary loading>Show me more</ButtonPrimary>
          </div>
        </main>
      </div>
      :
      <div className="h-56">
        <p className="text-neutral-400 text-center justify-center items-center mt-40">No results.</p>
      </div>
      }
      </>
      :
      <div className="relative grid h-full place-items-center opacity-80">
         <div className="py-10">
           <Lottie style={{height: window.innerWidth >= 1024 ? 400 : 300, opacity: 1}} animationData={loadingLottie} loop={true} />
         </div>
      </div>
      }
    </div>
  );
};

export default PageSearch;
