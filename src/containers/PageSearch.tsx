import React, { FC, Fragment, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { getFingerprint } from "react-fingerprint";
import Pagination from "shared/Pagination/Pagination";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import HeaderFilterSearchPage from "components/HeaderFilterSearchPage";
import Input from "shared/Input/Input";
import ButtonCircle from "shared/Button/ButtonCircle";
import CardNFT from "components/CardNFT";
import { useLocation, useSearchParams } from "react-router-dom";
import { checkAllUD, registrarUD } from "methods/api/checkUD";
import { ethers } from "ethers";
import {contractAddress,contractABI} from "../contracts/ens/ens_contract"
import { CheckENS } from "methods/api/checkENS";
import Lottie from "lottie-react";
import loadingLottie from "../images/loading.json";
import { CSVLink } from "react-csv";
import { Popup } from "widgets/Popup";
import NftDetailPage from "./NftDetailPage/NftDetailPage";
import { addPolygonNetwork, switchToEthereum, switchToPolygon } from "methods/switchBlockchain";
import {contractAddress as contractAddressENS} from "../contracts/ens/ens_registrar_controller"
import {contractABI as contractABIens} from "../contracts/ens/ens_registrar_controller"
import { connectStorageEmulator } from "firebase/storage";
const ethereum = window.ethereum;

export interface PageSearchProps {
  className?: string;
}

const PageSearch: FC<PageSearchProps> = ({ className = "" }) => {

  const location = useLocation();
  const [searchParams] = useSearchParams();
  // check if new search input is different than last one
  const [oldDomainInput, setOldDomainInput] = useState("")
  // search input
  const [inputDomain, setInputDomain] = useState((location.state != null && location.state.inputDomain != undefined) ? location.state.inputDomain : "")
  // 1 result obj = 1 line
  const [results, setResults] = useState<{name: string, extension: string, available: boolean, provider: string, blockchain: string, price: number, renewalPrice: number, startDate: Date, endDate: Date, image:string, owner: string, transfers:any, nfts:any, metadata: any}[]>([])
  const [sortedResults, setSortedResults] = useState<{name: string, extension: string, available: boolean, provider: string, blockchain: string, price: number, renewalPrice: number, startDate: Date, endDate: Date, image:string, owner: string, transfers:any, nfts:any, metadata: any}[]>([])
  // just to update the UI
  const [resultsUI, setResultsUI] = useState<{isLoading: boolean}[]>([])
  // check if display table
  const [hasResults, setHasResults] = useState(false)
  // loadings
  const [isLoading, setIsLoading] = useState(false)
  const [isUDloading, setIsUDloading] = useState(false)
  const [isENSloading, setIsENSloading] = useState(false)
  // dialog popup
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [popup, setPopup] = useState<{title: string, subtitle: string, body: string, btn1: string, btn2: string, id: string}[]>([])
  // NFT detail page Visible
  const [isNftPageVisible, setIsNftPageVisible] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<{name: string, extension: string, available: boolean, provider: string, blockchain: string, price: number, renewalPrice: number, startDate: Date, endDate: Date, image:string, owner: string, transfers:any, nfts:any, metadata: any}>();
  // if user load page with a parameter in the url
  const [selectedDomainName, setSelectedDomainName] = useState("")
  // multiple query
  const [queryLengh, setQueryLength] = useState(0)

  const searchDomain = async (e:any = null) => {

    // wait loading end before new prompt
    if(isLoading){
      e.preventDefault();
      return;
    }
    // format input
    const formattedDomainInput = (inputDomain.replace(/,(\s+)?$/, '')).replace(/\s+/g, "");
    setInputDomain(formattedDomainInput)
    // separate multiple domains
    var domainList = (formattedDomainInput).split(",").map(function(item:any) {
      return item.trim();
    });
    setQueryLength(domainList.length);
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

            CheckENS(domainList[i].toLowerCase(), setIsENSloading, setResults);
        }
        else{
          setIsENSloading(false);
        }
      }
  }

  const buyCrypto = async () => {

    await ethereum.request({ method: 'eth_requestAccounts' }).then(async() => {
    // Get wallet
    const provider = new ethers.providers.Web3Provider(ethereum,'any');
    const signer = provider.getSigner();

    const { chainId } = await provider.getNetwork();
    const myAddress = await signer.getAddress();

    // check if on polygon network. if not switch
    if(selectedDomain?.blockchain! == "Polygon" && chainId != 137){
      try{
        switchToPolygon(ethereum);
      }
      catch(e){
        // try by adding the network to wallet
        addPolygonNetwork(ethereum);
        switchToPolygon(ethereum);
      }
      return;
    }
    // check if on ethereum network
    if(selectedDomain!.blockchain == "Ethereum" && chainId != 1){
      switchToEthereum(ethereum);
      return;
    }
    // get MATIC and ETH price
    await fetch(selectedDomain?.blockchain == "Polygon" ? `https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=MATIC` : `https://min-api.cryptocompare.com/data/price?fsym=USD&tsyms=ETH`)
    .then((res) => res.json())
    .then((data) => {
      const amount = selectedDomain?.blockchain == "Polygon" ? (data.MATIC * selectedDomain?.price) : (data.ETH * selectedDomain?.price!);
      const unit = selectedDomain?.blockchain == "Polygon" ? "MATIC" : "ETH";
      // cehck if balance > domain price
      provider.getBalance(myAddress).then(async (balance:any) => {
        // convert a currency unit from wei to ether
        const balanceInEth = ethers.utils.formatEther(balance)
        if(parseFloat(balanceInEth) <= amount){
          alert("Insufficient Fund: Price is " + (selectedDomain?.blockchain == "Polygon" ? amount.toFixed(2).toString() : amount.toFixed(4).toString())  + " " + unit);
          return;
        }
        //// REGISTRATION ////

        // ENS: https://docs.ens.domains/dapp-developer-guide/registering-and-renewing-names (smart contract call) (testnet: Goerli, same address)
        if(selectedDomain?.provider == "ENS"){

          const controller = new ethers.Contract(contractAddressENS, contractABIens, signer); 
          const register = async (name: string, owner:any, duration:any) => {
            // Generate a random value to mask our commitment
            const random = new Uint8Array(32);
            crypto.getRandomValues(random);
            const salt = "0x" + Array.from(random).map(b => b.toString(16).padStart(2, "0")).join("");
            // Submit our commitment to the smart contract
            const commitment = await controller.makeCommitment(name, owner, salt);
            console.log(commitment)
            const tx = await controller.commit(commitment);
            console.log(tx)
            // Add 10% to account for price fluctuation; the difference is refunded.
            const price = Math.round((await controller.rentPrice(name, duration)) * 1.1);
            console.log(price)
            // Wait 60 seconds before registering
            setTimeout(async () => {
              // Submit our registration request
              try{
                await controller.register(name, owner, duration, salt, {value: price});
              }
              catch(e){console.log(e)}
            }, 60000);
          }

          register(selectedDomain?.name, myAddress, 31536000); // 1 year
        }
        // UD: Partner API: https://docs.unstoppabledomains.com/openapi/reference/#operation/PostOrders (api call)
        else{
          // get entropy from browsers settings 
          // verify its the same user
          const fingerprint = await getFingerprint()
          const email = ""

          registrarUD(selectedDomain, myAddress, email, fingerprint)
        }
      });
    });
   })
  }

  // first search from home page
  useEffect(() => {
    // clear paramters if page reload
    if(searchParams.get("") == null){
      if (window.performance) {
        if (performance.navigation.type == 1) {
          window.history.replaceState(null, "NFT Domains", window.location.href.split('?')[0]);
        }
      }
    }
    else{
      if(searchParams.get("")!.includes('.')){
        setSelectedDomainName(searchParams.get("")!);
        setInputDomain(searchParams.get("")!.substring(0, searchParams.get("")!.indexOf(".")))
      }
      else
      setInputDomain(searchParams.get(""))
    }
    if(inputDomain != "")
    searchDomain()
  },[])

  // if the url contains a domain
  const [ignoreFirst4, setIgnoreFirst4] = useState(true)
  useEffect(() => {
    if(ignoreFirst4){setIgnoreFirst4(false); return;}

    if(searchParams.get("") != null)
    searchDomain()
  },[inputDomain])

   // called when ud or ens data ahs been loaded
   const [ignoreFirst, setIgnoreFirst] = useState(true)
   useEffect(() => {
    if(ignoreFirst){setIgnoreFirst(false); return;}

    if(results.length >= queryLengh * 9){ // more than ENS result only
      if(!isENSloading && !isUDloading){

        let _resultsUI: {isLoading: boolean}[] = []
        for(let i=0; i<results.length;i++){
          _resultsUI.push({isLoading: false})
        }
        setResultsUI(_resultsUI)

        // Sort according to filters
        setSortedResults(results.sort((a, b) => a.name.localeCompare(b.name)));

        setHasResults(true)

        console.log(results)
      }
    }

   },[results])

   const [ignoreFirst2, setIgnoreFirst2] = useState(false)
   useEffect(() => {
    if(ignoreFirst2){setIgnoreFirst2(false); return;}
    if(hasResults){

      setIsLoading(false)
      
      if(searchParams.get("") != null){

        if(selectedDomainName == "")
        window.history.replaceState(null, "NFT Domains", window.location.href.split('?')[0])
        else{
          const _selectedDomain = results.find((_domain) => {
            return _domain.name+_domain.extension == searchParams.get("");
          })
          setSelectedDomain(_selectedDomain)
          setIsNftPageVisible(true)
        }
      }
    }

   },[sortedResults]);

   useEffect(() => {
    window.scrollTo(0, 0)
   },[isNftPageVisible]);

  return (
    <div className={`nc-PageSearch  ${className} overflow-x-hidden`} data-nc-id="PageSearch">
      <Helmet>
        <title>NFT Domains</title>
      </Helmet>

      {!isNftPageVisible ?
      <>
      <div
        className={`nc-HeadBackgroundCommon h-16 2xl:h-20 top-0 left-0 right-0 w-full bg-primary-50 dark:bg-neutral-800/20 overflow-x-hidden`}
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

      <Popup buy={buyCrypto} isPopupOpen={isPopupOpen} setIsPopupOpen={setIsPopupOpen} popup={popup}/>

      {!isLoading ?
      <>
      {sortedResults.length > 0 ?
      <div className="container py-16 lg:pb-28 lg:pt-20 space-y-16 lg:space-y-28 overflow-x-hidden">
        <main>

          {/* FILTER */}
          <HeaderFilterSearchPage />

          {/* LOOP ITEMS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-8 gap-y-10 mt-8 lg:mt-10">
            {sortedResults.map((_domain, index) => (
              <CardNFT  setSelectedDomain={setSelectedDomain} setIsNftPageVisible={setIsNftPageVisible} setIsPopupOpen={setIsPopupOpen} setPopup={setPopup} domain={_domain} key={index} />
            ))}
          </div>

          {/* PAGINATION */}
          <div className="flex flex-col mt-12 lg:mt-16 space-y-5 sm:space-y-0 sm:space-x-3 sm:flex-row sm:justify-between sm:items-center">
            <Pagination />
            <ButtonPrimary loading>Show me more</ButtonPrimary>
          </div>
        </main>

        {/* <CSVLink data={results} separator={";"} filename={`Domains_`+ new Date().toLocaleDateString("fr")}
          className="fixed z-50 bottom-4 left-4 bg-gray-900 w-10 h-10 rounded-full drop-shadow-lg flex justify-center items-center text-white text-3xl hover:bg-gray-800 opacity-80 hover:drop-shadow-2xl animate-bounce">&#8659;
        </CSVLink> */}
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
    </>
    :
     <NftDetailPage setIsNftPageVisible={setIsNftPageVisible} domain={selectedDomain}/>
    }
    </div>
  );
};

export default PageSearch;
