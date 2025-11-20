import { gql } from '@apollo/client';

export const FETCH_BOARDS = gql`
  query fetchBoards(
    $endDate: DateTime # 쿼리 변수 정의
    $startDate: DateTime
    $search: String
    $page: Int
  ) {
    fetchBoards( # 서버의 fetchBoards 함수 호출
      endDate: $endDate # 위에서 정의한 변수들을
      startDate: $startDate # 함수의 매개변수로 전달
      search: $search
      page: $page
    ) {
      # 서버에서 받아올 데이터 필드들 지정
      _id
      writer
      title
      contents
      createdAt
    }
  }
`;

// 게시글을 삭제하는 GraphQL 뮤테이션
export const DELETE_BOARD = gql`
  mutation deleteBoard($boardId: ID!) {
    deleteBoard(boardId: $boardId)
  }
`;
