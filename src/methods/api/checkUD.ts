import { Network, Alchemy } from "alchemy-sdk";

const getUDtokenId = (domainName: string) => {

  const { default: Resolution } = require('@unstoppabledomains/resolution');
  const resolution = new Resolution();

  let tokenId = resolution.namehash(domainName, "UNS");
  return tokenId;
}

const checkAllUD = (domainName: string, setResults: any, searchMetadata: boolean, setIsUDloading: any) => {

    // get metadata
    const settings_ethereum = {
      apiKey: `${process.env.REACT_APP_ALCHEMY_ETHEREUM_KEY}`,
      network: Network.ETH_MAINNET, 
    }; 
    const alchemy_ethereum = new Alchemy(settings_ethereum);

    const settings_polygon = {
      apiKey: `${process.env.REACT_APP_ALCHEMY_POLYGON_KEY}`,
      network: Network.MATIC_MAINNET, 
    }; 
    const alchemy_polygon = new Alchemy(settings_polygon);

    const UDVerifyDisponibility = () => {

      let _results: {name: string, extension: string, available: boolean, provider: string, blockchain: string, price: number, renewalPrice: number, startDate: Date, endDate: Date, image:string, metadata: any}[] = []

      fetch(`https://unstoppabledomains.com/api/domain/search?q=${domainName}`)
      .then((res) => res.json())
      .then(async (data) => {
        for (let i =0; i< 9; i++){

          var index = data.exact[i].productCode.indexOf(".");  // Gets the first index where a space occours
          var name = data.exact[i].productCode.substr(0, index); // Gets the first part
          var extension = "."+data.exact[i].productCode.substr(index + 1);  // Gets the text part

          const _price = data.exact[i].price != -1 ? data.exact[i].price / 100 : -1
          const _available = data.exact[i].availability
          const image = `https://metadata.unstoppabledomains.com/image-src/${name+extension}.svg`

          const metadata = await alchemy_polygon.nft.getNftMetadata(
            "0xa9a6A3626993D487d2Dbda3173cf58cA1a9D9e9f", //ud eth 0xd1e5b0ff1287aa9f9a268759062e4ab08b9dacbe //ens 0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85
            getUDtokenId(name+extension).toString(),
          )

          // available
          if(metadata.metadataError != undefined){

            _results.push({name: name, extension: extension, provider: "UD", blockchain: extension == ".crypto" ? "Ethereum" : "Polygon", available: _available, price: _price, renewalPrice: 0, startDate: new Date(), endDate: new Date(), image: image,  metadata: ""})

          }
          else{
            _results.push({name: name, extension: extension, provider: "UD", blockchain: extension == ".crypto" ? "Ethereum" : "Polygon", available: _available, price: _price, renewalPrice: 0, startDate: new Date(), endDate: new Date(), image: image, metadata: metadata})
          }
        }

        setResults((prevData: any) => [...prevData, ..._results]);
        setIsUDloading(false);
        
      })
      .catch((err) => {
        console.log(err.message);
      });

    }

    UDVerifyDisponibility();
}

const registrarUD = async (_domain: any, _myAddress: string, _email: string, _fingerprint: any) => {

  const resellerId = `${process.env.REACT_APP_RESELLER_ID}`;
  const udApiSecret = `${process.env.REACT_APP_UD_KEY}`;

  // get JWS token
  const _res = await fetch(
    `https://auth.unstoppabledomains.com/.well-known/jwks.json`,
    {method: 'GET'}
  );
  const jws = JSON.parse(await _res.text());
  const jws_key = jws.keys[0].n

  const resp = await fetch(
    //`https://unstoppabledomains.com/api/v2/resellers/${resellerId}/orders`,
    `https://api.ud-sandbox.com/api/v2/resellers/${resellerId}/orders`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jws_key}`
      },
      body: JSON.stringify({
        payment: {
          method: 'free',
          // properties: {
          //   tokenId: 'tok_1FAeVFG8PQyZCUJhJp7emswP'
          // }
        },
        security: [
          {
            type: 'fingerprintjs',
            identifier: _fingerprint
          }
        ],
        domains: [
          {
            name: _domain.name + _domain.extension,
            ownerAddress: _myAddress,
            //email: _email,
            resolution: {
              'crypto.ETH.address': _myAddress,
              //'crypto.BTC.address': 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'
            },
          }
        ]
      })
    }
  );

  const result = await resp.json();
  console.log(result);
}

// Check if transaction has been mined
const orderStatus = async (_orderNumber: string) => {

  const resellerId = `${process.env.REACT_APP_RESELLER_ID}`;

  const resp = await fetch(
    `https://unstoppabledomains.com/api/v2/resellers/${resellerId}/orders/${_orderNumber}`,
    {method: 'GET'}
  );

  const data = await resp.text();
  console.log(data);
}

export {checkAllUD, registrarUD, orderStatus};

// Get suggestions of similars domains
// https://docs.unstoppabledomains.com/openapi/reference/#operation/GetDomainsSuggestions