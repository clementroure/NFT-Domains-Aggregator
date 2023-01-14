import { useQuery } from "@apollo/client";
import { Alchemy, Network } from "alchemy-sdk";
import { ethers } from "ethers";
import { useEffect } from "react";
import { domainsQuery, registrationsQuery } from "./queries";

export const CheckENS = async (domainInput: string, setIsENSloading: any, setResults: any) => {

    // get tokenID from domain.eth -> https://docs.ens.domains/dapp-developer-guide/ens-as-nft
    const getTokenId = (_name: string) => {

      const BigNumber = ethers.BigNumber
      const utils = ethers.utils
      const labelHash = utils.keccak256(utils.toUtf8Bytes(_name))
      const tokenId = BigNumber.from(labelHash).toString()
      return tokenId;
    }

    // get metadata
    const settings_ethereum = {
      apiKey: `${process.env.REACT_APP_ALCHEMY_ETHEREUM_KEY}`,
      network: Network.ETH_MAINNET, 
    }; 
    const alchemy_ethereum = new Alchemy(settings_ethereum);

    const tokenId = getTokenId(domainInput);

    let basePrice = 5;
    if(domainInput.length == 4)
    basePrice = 160;
    else if(domainInput.length == 3)
    basePrice = 640;

    const metadata = await alchemy_ethereum.nft.getNftMetadata(
      "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85",
      tokenId.toString()
    );

    // available
    if(metadata.metadataError != undefined){

      setResults((prevData:any) => [{name: domainInput, extension:".eth", provider: "ENS", blockchain: "Ethereum", startDate: new Date(), endDate: new Date(), price: basePrice, renewalPrice: basePrice, available: false, image: `https://metadata.ens.domains/preview/${domainInput}.eth`, metadata: tokenId}, ...prevData])
    }
    // taken -> get metadata
    else{

      setResults((prevData:any) => [{name: domainInput, extension:".eth", provider: "ENS", blockchain: "Ethereum", startDate: new Date(), endDate: new Date(), price: basePrice, renewalPrice: basePrice, available: true, image: `https://metadata.ens.domains/preview/${domainInput}.eth`, metadata: metadata}, ...prevData])
    }

    setIsENSloading(false);
}



export const getENSgasPrice = async (results: any, setResults: any, index: number, resultsUI: any, setResultsUI: any) => {

  await fetch(`https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=${process.env.REACT_APP_ETHERSCAN_KEY}`)
    .then((res) => res.json())
    .then(async (gas) => {

      const gasPrice = gas.result.ProposeGasPrice * 10**9
      const ethPrice = parseFloat(ethers.utils.formatEther(gasPrice)) * 311000; // ens uses 311 000 gas units

      await fetch(`https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD`)
      .then((res) => res.json())
      .then((data) => {
        const gasPrice = parseFloat(data.USD) * ethPrice;
        const totalPrice = results[index].price + gasPrice;

        setResultsUI((_resultsUI:any)=> _resultsUI.map((_resultUI:any, i:number) => i === index ? {isLoading: false} : _resultUI));
        setResults((_results:any)=> _results.map((_result:any, i:number) => i === index ? {name: _result.name, extension:".eth", provider: "ENS", blockchain: "Ethereum", startDate: _result.startDate, endDate: _result.endDate, price: totalPrice, renewalPrice: totalPrice + 0.0001, available: _result.available, image: "", metadata: _result.metadata} : _result));
      });
  });
}