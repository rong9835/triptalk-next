import { gql } from '@apollo/client';

// 인기 게시글(Best 게시글) 조회 쿼리
export const FETCH_BOARDS_OF_THE_BEST = gql`
  query fetchBoardsOfTheBest {
    fetchBoardsOfTheBest {
      _id
      writer
      title
      contents
      likeCount
      createdAt
      updatedAt
      deletedAt
      images
      boardAddress {
        _id
        zipcode
        address
        addressDetail
      }
      user {
        _id
        email
        name
        picture
      }
    }
  }
`;

// 일반 게시글 조회 쿼리 (정렬 옵션 포함 가능)
export const FETCH_BOARDS = gql`
  query fetchBoards(
    $endDate: DateTime
    $startDate: DateTime
    $search: String
    $page: Int
  ) {
    fetchBoards(
      endDate: $endDate
      startDate: $startDate
      search: $search
      page: $page
    ) {
      _id
      writer
      title
      contents
      likeCount
      createdAt
      updatedAt
      deletedAt
      images
      boardAddress {
        _id
        zipcode
        address
        addressDetail
      }
      user {
        _id
        email
        name
        picture
      }
    }
  }
`;
