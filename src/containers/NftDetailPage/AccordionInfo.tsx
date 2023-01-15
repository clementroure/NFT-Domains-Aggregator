import { Disclosure } from "@headlessui/react";
import { ChevronUpIcon } from "@heroicons/react/solid";
import { domainToASCII } from "url";

export default function AccordionInfo(props:any) {



  return (
    <div className="w-full rounded-2xl">
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex justify-between w-full px-4 py-2 font-medium text-left bg-neutral-100 dark:bg-neutral-700 dark:hover:bg-neutral-500 rounded-lg hover:bg-neutral-200 focus:outline-none focus-visible:ring focus-visible:ring-neutral-500 focus-visible:ring-opacity-75">
              <span>Description</span>
              <ChevronUpIcon
                className={`${
                  open ? "transform rotate-180" : ""
                } w-5 h-5 text-neutral-500`}
              />
            </Disclosure.Button>
            <Disclosure.Panel
              className="px-4 pt-4 pb-2 text-neutral-500 text-sm dark:text-neutral-400"
              as="p"
            >
              {props.domain.metadata.description}
              
              <br/><br/>
              {props.domain.metadata.contract.openSea.description}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
        <Disclosure defaultOpen as="div" className="mt-4 md:mt-6">
        {({ open }) => (
          <>
            <Disclosure.Button className="flex justify-between w-full px-4 py-2 font-medium text-left bg-neutral-100 dark:bg-neutral-700 dark:hover:bg-neutral-500 rounded-lg hover:bg-neutral-200 focus:outline-none focus-visible:ring focus-visible:ring-neutral-500 focus-visible:ring-opacity-75">
              <span>Dates</span>
              <ChevronUpIcon
                className={`${
                  open ? "transform rotate-180" : ""
                } w-5 h-5 text-neutral-500`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pt-4 pb-2 flex flex-col text-xs text-neutral-500 dark:text-neutral-400 overflow-hidden break-all">
            {props.domain.provider == "ENS" ?
            <>
              <span>Creation Date</span>
              <span className="text-base text-neutral-900 dark:text-neutral-100 line-clamp-1">
               {new Date(parseInt(props.domain.metadata.rawMetadata!.attributes[0].value)).toLocaleDateString("fr")}
              </span>

              <br />
              <span>Registration Date</span>
              <span className="text-base text-neutral-900 dark:text-neutral-100 line-clamp-1">
               {props.domain.startDate.toLocaleDateString("fr")}
              </span>

              <br />
              <span>Expiration Date</span>
              <span className="text-base text-neutral-900 dark:text-neutral-100">
                {props.domain.endDate.toLocaleDateString("fr")}
              </span>
            </>
            :
            <>
            <span>Lifetime ownership</span>
            <span className="text-base text-neutral-900 dark:text-neutral-100">
              Unstoppable Domains never expire.
            </span>
            </>
            }
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      <Disclosure as="div" className="mt-4 md:mt-6">
        {({ open }) => (
          <>
            <Disclosure.Button className="flex justify-between w-full px-4 py-2 font-medium text-left bg-neutral-100 dark:bg-neutral-700 dark:hover:bg-neutral-500 rounded-lg hover:bg-neutral-200 focus:outline-none focus-visible:ring focus-visible:ring-neutral-500 focus-visible:ring-opacity-75">
              <span>Details</span>
              <ChevronUpIcon
                className={`${
                  open ? "transform rotate-180" : ""
                } w-5 h-5 text-neutral-500`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pt-4 pb-2 flex flex-col text-xs text-neutral-500 dark:text-neutral-400 overflow-hidden break-all">
              {/* <span>2000 x 2000 px.IMAGE(685KB)</span>
              <br /> */}
              <div className="flex flex-row">
                <span>Contract Address</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-3.5 h-3.5  ml-1">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </div>
              <a href={props.domain.blockchain == "Ethereum" ? `https://etherscan.io/address/${props.domain.metadata.contract.address}` : `https://polygonscan.com/address/${props.domain.metadata.contract.address}`} target="_blank"   className="text-base text-neutral-900 dark:text-neutral-100 line-clamp-1 hover:underline cursor-pointer">
                {props.domain.metadata.contract.address}
              </a>

              <br />
              <div className="flex flex-row">
                <span>Contract Deployer</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-3.5 h-3.5  ml-1">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </div>
              <a href={props.domain.blockchain == "Ethereum" ? `https://etherscan.io/address/${props.domain.metadata.contract.contractDeployer}` : `https://polygonscan.com/address/${props.domain.metadata.contract.contractDeployer}`} target="_blank"   className="text-base text-neutral-900 dark:text-neutral-100 hover:underline cursor-pointer">
                {props.domain.metadata.contract.contractDeployer}
              </a>

              <br />
              <div className="flex flex-row">
                <span>Token ID</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-3.5 h-3.5  ml-1">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </div>
              <a href={props.domain.blockchain == "Ethereum" ? `https://etherscan.io/token/${props.domain.metadata.contract.address}?a=${props.domain.metadata.tokenId}` : `https://polygonscan.com/token/${props.domain.metadata.contract.address}?a=${props.domain.metadata.tokenId}`} target="_blank"  className="text-base text-neutral-900 dark:text-neutral-100 hover:underline cursor-pointer">
                {props.domain.metadata.tokenId}
              </a>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
      <Disclosure defaultOpen as="div" className="mt-4 md:mt-6">
        {({ open }) => (
          <>
            <Disclosure.Button className="flex justify-between w-full px-4 py-2 font-medium text-left bg-neutral-100 dark:bg-neutral-700 dark:hover:bg-neutral-500 rounded-lg hover:bg-neutral-200 focus:outline-none focus-visible:ring focus-visible:ring-neutral-500 focus-visible:ring-opacity-75">
              <span>Other</span>
              <ChevronUpIcon
                className={`${
                  open ? "transform rotate-180" : ""
                } w-5 h-5 text-neutral-500`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="px-4 pt-4 pb-2 flex flex-col text-xs text-neutral-500 dark:text-neutral-400 overflow-hidden break-all">
            <div className="flex flex-row">
              <span>Deployed Block Number</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-3.5 h-3.5  ml-1">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </div>
              <a href={props.domain.blockchain == "Ethereum" ? `https://etherscan.io/block/${props.domain.metadata.contract.deployedBlockNumber}` : `https://polygonscan.com/block/${props.domain.metadata.contract.deployedBlockNumber}`} target="_blank" className="text-base text-neutral-900 dark:text-neutral-100 hover:underline cursor-pointer">
                {props.domain.metadata.contract.deployedBlockNumber}
              </a>

              <br />
              <span>Token Type</span>
              <span className="text-base text-neutral-900 dark:text-neutral-100">
                {props.domain.metadata.contract.tokenType}
              </span>

              {props.domain.provider == "ENS" &&
              <>
              <br />
              <span>Floor Price</span>
              <span className="text-base text-neutral-900 dark:text-neutral-100">
                {props.domain.metadata.contract.openSea.floorPrice.toFixed(6)} ETH
              </span>
              </>
              }
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
}
