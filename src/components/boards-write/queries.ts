import { gql } from '@apollo/client';

// 게시글 생성을 위한 GraphQL 뮤테이션
export const CREATE_BOARD = gql`
  mutation createBoard($createBoardInput: CreateBoardInput!) {
    createBoard(createBoardInput: $createBoardInput) {
      _id
      writer
      title
      contents
      youtubeUrl
      likeCount
      dislikeCount
      images
      boardAddress {
        zipcode
        address
        addressDetail
      }
      # user {
      #   _id
      #   email
      #   name
      # }
      # createdAt
      # updatedAt
      # deletedAt
    }
  }
`;
// 게시글 수정을 위한 GraphQL 뮤테이션
export const UPDATE_BOARD = gql`
  mutation updateBoard(
    $updateBoardInput: UpdateBoardInput! # 수정할 데이터
    $password: String # 비밀번호 검증용
    $boardId: ID! # 수정할 게시글 ID
  ) {
    updateBoard(
      updateBoardInput: $updateBoardInput
      password: $password
      boardId: $boardId
    ) {
      _id
      writer
      title
      contents
      youtubeUrl
      likeCount
      dislikeCount
      images
      boardAddress {
        zipcode
        address
        addressDetail
      }
      createdAt
      updatedAt
      deletedAt
    }
  }
`;
// 수정할 게시글 정보를 가져오기 위한 GraphQL 쿼리
export const FETCH_BOARD = gql`
  query fetchBoardForEdit($boardId: ID!) {
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
// 파일 업로드를 위한 GraphQL 뮤테이션
export const UPLOAD_FILE = gql`
  mutation uploadFile($file: Upload!) {
    uploadFile(file: $file) {
      url
    }
  }
`;
