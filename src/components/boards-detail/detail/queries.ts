import { gql } from '@apollo/client';

// 게시글 상세 정보를 가져오기 위한 GraphQL 쿼리
export const FETCH_BOARD = gql`
  query fetchBoard($boardId: ID!) {
    fetchBoard(boardId: $boardId) {
      _id # 게시글 고유 ID
      writer # 작성자명
      title # 제목
      contents # 내용
      youtubeUrl # 유튜브 링크
      likeCount # 좋아요 수
      dislikeCount # 싫어요 수
      images # 첨부 이미지들
      boardAddress {
        zipcode
        address
        addressDetail
      }
      createdAt # 생성일
      updatedAt # 수정일
      deletedAt # 삭제일
    }
  }
`;

// 게시글 좋아요 토글 뮤테이션
export const LIKE_BOARD = gql`
  mutation likeBoard($boardId: ID!) {
    likeBoard(boardId: $boardId)
  }
`;

// 게시글 싫어요 토글 뮤테이션
export const DISLIKE_BOARD = gql`
  mutation dislikeBoard($boardId: ID!) {
    dislikeBoard(boardId: $boardId)
  }
`;
