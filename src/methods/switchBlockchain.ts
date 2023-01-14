export const switchToEthereum = async(ethereum: any) => {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x1' }],
    });
  }
export const switchToPolygon = async (ethereum: any) => {
    await ethereum.request({
      method: 'wallet_switchEthereumChain',
      // chainId must be in HEX with 0x in front: 137 -> 0x89
      params: [{ chainId: '0x89' }],
    });
  }
export const addPolygonNetwork = async(ethereum: any) => {
    await ethereum.request({
      method: "wallet_addEthereumChain",
      params: [{
          chainId: "0x89",
          rpcUrls: ["https://rpc-mainnet.matic.network/"],
          chainName: "Matic Mainnet",
          nativeCurrency: {
              name: "MATIC",
              symbol: "MATIC",
              decimals: 18
          },
          blockExplorerUrls: ["https://polygonscan.com/"]
        }]
    });
  }