import { gql } from '@apollo/client';

export const FETCH_TRAVELPRODUCTS = gql`
  query fetchTravelproducts(
    $isSoldout: Boolean
    $search: String
    $page: Int
  ) {
    fetchTravelproducts(
      isSoldout: $isSoldout
      search: $search
      page: $page
    ) {
      _id
      name
      remarks
      contents
      price
      tags
      images
      pickedCount
      travelproductAddress {
        _id
        address
        addressDetail
        lat
        lng
      }
      buyer {
        _id
        email
        name
      }
      seller {
        _id
        email
        name
        picture
      }
      soldAt
      createdAt
      updatedAt
      deletedAt
    }
  }
`;

export const FETCH_TRAVELPRODUCTS_OF_THE_BEST = gql`
  query fetchTravelproductsOfTheBest {
    fetchTravelproductsOfTheBest {
      _id
      name
      remarks
      contents
      price
      tags
      images
      pickedCount
      travelproductAddress {
        _id
        address
        addressDetail
        lat
        lng
      }
      buyer {
        _id
        email
        name
      }
      seller {
        _id
        email
        name
        picture
      }
      soldAt
      createdAt
      updatedAt
      deletedAt
    }
  }
`;
