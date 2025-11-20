import { gql } from '@apollo/client';

// 숙소 상세 정보를 가져오기 위한 GraphQL 쿼리
export const FETCH_TRAVELPRODUCT = gql`
  query fetchTravelproduct($travelproductId: ID!) {
    fetchTravelproduct(travelproductId: $travelproductId) {
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
        zipcode
        address
        addressDetail
        lat
        lng
      }
      buyer {
        _id
        email
        name
        picture
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

// 찜하기 토글을 위한 GraphQL 뮤테이션
export const TOGGLE_TRAVELPRODUCT_PICK = gql`
  mutation toggleTravelproductPick($travelproductId: ID!) {
    toggleTravelproductPick(travelproductId: $travelproductId)
  }
`;
