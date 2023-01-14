import axios from "axios";
// OpenSea API - Key Needed: https://docs.opensea.io/reference/request-an-api-key
// tokenId -> metadata associated
// => Display all the infos in our page instead of redirecting user to the OpenSea page

export const getMetadata = async (_contractAddress: string, _tokenId: string) => {
    const options = {
    method: 'GET',
    url: 'https://api.opensea.io/api/v1/assets',
    params: {
        token_ids: _tokenId,
        order_direction: 'desc',
        asset_contract_address: _contractAddress,
        limit: '1',
        include_orders: 'false'
    },
    headers: {accept: 'application/json'}
    };  

    await axios
    .request(options)
    .then(function (response) {
        console.log(response.data);
    })
    .catch(function (error) {
        console.error(error);
    });
}