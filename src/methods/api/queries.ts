import { gql } from "@apollo/client";
// ENS queries
// Query 1
export const domainsQuery = gql`
  query domains($domainName : String!) {
    domains(where:{name: $domainName})
    {
      labelhash
    }
  }
`;
// Query 2
export const registrationsQuery = gql`
  query domains($labelHash : String!) {
    registrations(where: {id: $labelHash}) 
    {
      registrationDate
      expiryDate
      registrant {
        id
      }
      events {
        transactionID
      }
    }
  }
`;