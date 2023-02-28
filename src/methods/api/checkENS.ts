import { useQuery } from "@apollo/client";
import { darkTheme } from "@rainbow-me/rainbowkit";
import { Alchemy, AssetTransfersCategory, fromHex, Network, SortingOrder } from "alchemy-sdk";
import { BigNumber, ethers } from "ethers";
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
    console.log(metadata)

    // get owner of nft 
    let owner:any;
    try{
      owner = await alchemy_ethereum.nft.getOwnersForNft("0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85", tokenId);
    }
    catch(e){owner = ""}

    // al nfts owned by an address
    // const nfts = await alchemy_ethereum.nft.getNftsForOwner(owner.owners[0], {
    //   contractAddresses: ["0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85",],
    // });
    
    // const response = await alchemy_ethereum.core.getAssetTransfers({
    //   fromBlock: "0x0",
    //   contractAddresses: ["0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85"],
    //   order: SortingOrder.DESCENDING,
    //   category: [AssetTransfersCategory.ERC721],
    //   excludeZeroValue: false,
    // });
    // console.log(response)
    // const test = BigNumber.from(tokenId)
    // console.log(test.toHexString())
    // const test2=BigNumber.from(("0x44EBBCCC4D714A09FFBFB14FEBD794D62009152A19F8F3DB66BCAAF33ACF9785").toLowerCase())
    // console.log(test2.toHexString())
    // console.log(test2.toHexString()==test.toHexString())

    // const transfers = response.transfers.filter(
    //   (txn) =>  (BigNumber.from(txn!.erc721TokenId!)).toHexString() == test.toHexString()
    // );

    // .eth -> address
    // const _owner = await alchemy_ethereum.core.resolveName("mike.eth");
    // console.log(_owner)
    // get last sale price
    // alchemy_ethereum.nft
    // .getNftSales({
    //   fromBlock: "latest",
    //   order: SortingOrder.DESCENDING,
    //   contractAddress: "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85",
    //   tokenId: tokenId,
    // })
    // .then((data) =>
    //   console.log(data)
    // );
    // get transfers

    // taken
    if(metadata.metadataError == undefined){

      let registrationDate= new Date(); 
      let expirationDate = new Date();
      if(metadata!.rawMetadata!.attributes != undefined){
        registrationDate = new Date(parseInt(metadata.rawMetadata!.attributes[4].value));
        expirationDate = new Date(parseInt(metadata.rawMetadata!.attributes[5].value));
      }

      setResults((prevData:any) => [{name: domainInput, extension:".eth", provider: "ENS", blockchain: "Ethereum", startDate: registrationDate, endDate: expirationDate, price: basePrice, renewalPrice: basePrice, available: false, image: `https://metadata.ens.domains/preview/${domainInput}.eth`, owner: owner.owners[0], transfers: "transfers", nfts: "", metadata: metadata}, ...prevData])
    }
    // available
    else{

      setResults((prevData:any) => [{name: domainInput, extension:".eth", provider: "ENS", blockchain: "Ethereum", startDate: new Date(), endDate: new Date(), price: basePrice, renewalPrice: basePrice, available: true, image: `https://metadata.ens.domains/preview/${domainInput}.eth`,owner: undefined, transfers: "transfers", nfts: "", metadata: tokenId}, ...prevData])
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