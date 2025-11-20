/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "\n  query fetchUserLoggedIn {\n    fetchUserLoggedIn {\n      _id\n      email\n      name\n      picture\n    }\n  }\n": typeof types.FetchUserLoggedInDocument,
    "\n  query fetchBoardComments($page: Int, $boardId: ID!) {\n    fetchBoardComments(page: $page, boardId: $boardId) {\n      _id\n      writer\n      contents\n      rating\n      createdAt\n      updatedAt\n      deletedAt\n    }\n  }\n": typeof types.FetchBoardCommentsDocument,
    "\n  mutation deleteBoardComment($password: String, $boardCommentId: ID!) {\n    deleteBoardComment(password: $password, boardCommentId: $boardCommentId)\n  }\n": typeof types.DeleteBoardCommentDocument,
    "\n  mutation createBoardComment(\n    $createBoardCommentInput: CreateBoardCommentInput!\n    $boardId: ID!\n  ) {\n    createBoardComment(\n      createBoardCommentInput: $createBoardCommentInput\n      boardId: $boardId\n    ) {\n      _id\n      writer\n      contents\n      rating\n    }\n  }\n": typeof types.CreateBoardCommentDocument,
    "\n  mutation updateBoardComment(\n    $updateBoardCommentInput: UpdateBoardCommentInput!\n    $password: String!\n    $boardCommentId: ID!\n  ) {\n    updateBoardComment(\n      updateBoardCommentInput: $updateBoardCommentInput\n      password: $password\n      boardCommentId: $boardCommentId\n    ) {\n      _id\n      writer\n      contents\n      rating\n    }\n  }\n": typeof types.UpdateBoardCommentDocument,
    "\n  query fetchBoard($boardId: ID!) {\n    fetchBoard(boardId: $boardId) {\n      _id # 게시글 고유 ID\n      writer # 작성자명\n      title # 제목\n      contents # 내용\n      youtubeUrl # 유튜브 링크\n      likeCount # 좋아요 수\n      dislikeCount # 싫어요 수\n      images # 첨부 이미지들\n      boardAddress {\n        zipcode\n        address\n        addressDetail\n      }\n      createdAt # 생성일\n      updatedAt # 수정일\n      deletedAt # 삭제일\n    }\n  }\n": typeof types.FetchBoardDocument,
    "\n  query fetchBoards(\n    $endDate: DateTime # 쿼리 변수 정의\n    $startDate: DateTime\n    $search: String\n    $page: Int\n  ) {\n    fetchBoards( # 서버의 fetchBoards 함수 호출\n      endDate: $endDate # 위에서 정의한 변수들을\n      startDate: $startDate # 함수의 매개변수로 전달\n      search: $search\n      page: $page\n    ) {\n      # 서버에서 받아올 데이터 필드들 지정\n      _id\n      writer\n      title\n      contents\n      createdAt\n    }\n  }\n": typeof types.FetchBoardsDocument,
    "\n  mutation deleteBoard($boardId: ID!) {\n    deleteBoard(boardId: $boardId)\n  }\n": typeof types.DeleteBoardDocument,
    "\n  mutation loginUser($email: String!, $password: String!) {\n    loginUser(email: $email, password: $password) {\n      accessToken\n    }\n  }\n": typeof types.LoginUserDocument,
    "\n  mutation createUser($createUserInput: CreateUserInput!) {\n    createUser(createUserInput: $createUserInput) {\n      _id\n      email\n      name\n    }\n  }\n": typeof types.CreateUserDocument,
    "\n  mutation createBoard($createBoardInput: CreateBoardInput!) {\n    createBoard(createBoardInput: $createBoardInput) {\n      _id\n      writer\n      title\n      contents\n      youtubeUrl\n      likeCount\n      dislikeCount\n      images\n      boardAddress {\n        zipcode\n        address\n        addressDetail\n      }\n      # user {\n      #   _id\n      #   email\n      #   name\n      # }\n      # createdAt\n      # updatedAt\n      # deletedAt\n    }\n  }\n": typeof types.CreateBoardDocument,
    "\n  mutation updateBoard(\n    $updateBoardInput: UpdateBoardInput! # 수정할 데이터\n    $password: String # 비밀번호 검증용\n    $boardId: ID! # 수정할 게시글 ID\n  ) {\n    updateBoard(\n      updateBoardInput: $updateBoardInput\n      password: $password\n      boardId: $boardId\n    ) {\n      _id\n      writer\n      title\n      contents\n      youtubeUrl\n      likeCount\n      dislikeCount\n      images\n      boardAddress {\n        zipcode\n        address\n        addressDetail\n      }\n      createdAt\n      updatedAt\n      deletedAt\n    }\n  }\n": typeof types.UpdateBoardDocument,
    "\n  query fetchBoardForEdit($boardId: ID!) {\n    fetchBoard(boardId: $boardId) {\n      _id # 게시글 고유 ID\n      writer # 작성자명\n      title # 제목\n      contents # 내용\n      youtubeUrl # 유튜브 링크\n      likeCount # 좋아요 수\n      dislikeCount # 싫어요 수\n      images # 첨부 이미지들\n      boardAddress {\n        zipcode\n        address\n        addressDetail\n      }\n      createdAt # 생성일\n      updatedAt # 수정일\n      deletedAt # 삭제일\n    }\n  }\n": typeof types.FetchBoardForEditDocument,
    "\n  mutation uploadFile($file: Upload!) {\n    uploadFile(file: $file) {\n      url\n    }\n  }\n": typeof types.UploadFileDocument,
};
const documents: Documents = {
    "\n  query fetchUserLoggedIn {\n    fetchUserLoggedIn {\n      _id\n      email\n      name\n      picture\n    }\n  }\n": types.FetchUserLoggedInDocument,
    "\n  query fetchBoardComments($page: Int, $boardId: ID!) {\n    fetchBoardComments(page: $page, boardId: $boardId) {\n      _id\n      writer\n      contents\n      rating\n      createdAt\n      updatedAt\n      deletedAt\n    }\n  }\n": types.FetchBoardCommentsDocument,
    "\n  mutation deleteBoardComment($password: String, $boardCommentId: ID!) {\n    deleteBoardComment(password: $password, boardCommentId: $boardCommentId)\n  }\n": types.DeleteBoardCommentDocument,
    "\n  mutation createBoardComment(\n    $createBoardCommentInput: CreateBoardCommentInput!\n    $boardId: ID!\n  ) {\n    createBoardComment(\n      createBoardCommentInput: $createBoardCommentInput\n      boardId: $boardId\n    ) {\n      _id\n      writer\n      contents\n      rating\n    }\n  }\n": types.CreateBoardCommentDocument,
    "\n  mutation updateBoardComment(\n    $updateBoardCommentInput: UpdateBoardCommentInput!\n    $password: String!\n    $boardCommentId: ID!\n  ) {\n    updateBoardComment(\n      updateBoardCommentInput: $updateBoardCommentInput\n      password: $password\n      boardCommentId: $boardCommentId\n    ) {\n      _id\n      writer\n      contents\n      rating\n    }\n  }\n": types.UpdateBoardCommentDocument,
    "\n  query fetchBoard($boardId: ID!) {\n    fetchBoard(boardId: $boardId) {\n      _id # 게시글 고유 ID\n      writer # 작성자명\n      title # 제목\n      contents # 내용\n      youtubeUrl # 유튜브 링크\n      likeCount # 좋아요 수\n      dislikeCount # 싫어요 수\n      images # 첨부 이미지들\n      boardAddress {\n        zipcode\n        address\n        addressDetail\n      }\n      createdAt # 생성일\n      updatedAt # 수정일\n      deletedAt # 삭제일\n    }\n  }\n": types.FetchBoardDocument,
    "\n  query fetchBoards(\n    $endDate: DateTime # 쿼리 변수 정의\n    $startDate: DateTime\n    $search: String\n    $page: Int\n  ) {\n    fetchBoards( # 서버의 fetchBoards 함수 호출\n      endDate: $endDate # 위에서 정의한 변수들을\n      startDate: $startDate # 함수의 매개변수로 전달\n      search: $search\n      page: $page\n    ) {\n      # 서버에서 받아올 데이터 필드들 지정\n      _id\n      writer\n      title\n      contents\n      createdAt\n    }\n  }\n": types.FetchBoardsDocument,
    "\n  mutation deleteBoard($boardId: ID!) {\n    deleteBoard(boardId: $boardId)\n  }\n": types.DeleteBoardDocument,
    "\n  mutation loginUser($email: String!, $password: String!) {\n    loginUser(email: $email, password: $password) {\n      accessToken\n    }\n  }\n": types.LoginUserDocument,
    "\n  mutation createUser($createUserInput: CreateUserInput!) {\n    createUser(createUserInput: $createUserInput) {\n      _id\n      email\n      name\n    }\n  }\n": types.CreateUserDocument,
    "\n  mutation createBoard($createBoardInput: CreateBoardInput!) {\n    createBoard(createBoardInput: $createBoardInput) {\n      _id\n      writer\n      title\n      contents\n      youtubeUrl\n      likeCount\n      dislikeCount\n      images\n      boardAddress {\n        zipcode\n        address\n        addressDetail\n      }\n      # user {\n      #   _id\n      #   email\n      #   name\n      # }\n      # createdAt\n      # updatedAt\n      # deletedAt\n    }\n  }\n": types.CreateBoardDocument,
    "\n  mutation updateBoard(\n    $updateBoardInput: UpdateBoardInput! # 수정할 데이터\n    $password: String # 비밀번호 검증용\n    $boardId: ID! # 수정할 게시글 ID\n  ) {\n    updateBoard(\n      updateBoardInput: $updateBoardInput\n      password: $password\n      boardId: $boardId\n    ) {\n      _id\n      writer\n      title\n      contents\n      youtubeUrl\n      likeCount\n      dislikeCount\n      images\n      boardAddress {\n        zipcode\n        address\n        addressDetail\n      }\n      createdAt\n      updatedAt\n      deletedAt\n    }\n  }\n": types.UpdateBoardDocument,
    "\n  query fetchBoardForEdit($boardId: ID!) {\n    fetchBoard(boardId: $boardId) {\n      _id # 게시글 고유 ID\n      writer # 작성자명\n      title # 제목\n      contents # 내용\n      youtubeUrl # 유튜브 링크\n      likeCount # 좋아요 수\n      dislikeCount # 싫어요 수\n      images # 첨부 이미지들\n      boardAddress {\n        zipcode\n        address\n        addressDetail\n      }\n      createdAt # 생성일\n      updatedAt # 수정일\n      deletedAt # 삭제일\n    }\n  }\n": types.FetchBoardForEditDocument,
    "\n  mutation uploadFile($file: Upload!) {\n    uploadFile(file: $file) {\n      url\n    }\n  }\n": types.UploadFileDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query fetchUserLoggedIn {\n    fetchUserLoggedIn {\n      _id\n      email\n      name\n      picture\n    }\n  }\n"): (typeof documents)["\n  query fetchUserLoggedIn {\n    fetchUserLoggedIn {\n      _id\n      email\n      name\n      picture\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query fetchBoardComments($page: Int, $boardId: ID!) {\n    fetchBoardComments(page: $page, boardId: $boardId) {\n      _id\n      writer\n      contents\n      rating\n      createdAt\n      updatedAt\n      deletedAt\n    }\n  }\n"): (typeof documents)["\n  query fetchBoardComments($page: Int, $boardId: ID!) {\n    fetchBoardComments(page: $page, boardId: $boardId) {\n      _id\n      writer\n      contents\n      rating\n      createdAt\n      updatedAt\n      deletedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deleteBoardComment($password: String, $boardCommentId: ID!) {\n    deleteBoardComment(password: $password, boardCommentId: $boardCommentId)\n  }\n"): (typeof documents)["\n  mutation deleteBoardComment($password: String, $boardCommentId: ID!) {\n    deleteBoardComment(password: $password, boardCommentId: $boardCommentId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createBoardComment(\n    $createBoardCommentInput: CreateBoardCommentInput!\n    $boardId: ID!\n  ) {\n    createBoardComment(\n      createBoardCommentInput: $createBoardCommentInput\n      boardId: $boardId\n    ) {\n      _id\n      writer\n      contents\n      rating\n    }\n  }\n"): (typeof documents)["\n  mutation createBoardComment(\n    $createBoardCommentInput: CreateBoardCommentInput!\n    $boardId: ID!\n  ) {\n    createBoardComment(\n      createBoardCommentInput: $createBoardCommentInput\n      boardId: $boardId\n    ) {\n      _id\n      writer\n      contents\n      rating\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateBoardComment(\n    $updateBoardCommentInput: UpdateBoardCommentInput!\n    $password: String!\n    $boardCommentId: ID!\n  ) {\n    updateBoardComment(\n      updateBoardCommentInput: $updateBoardCommentInput\n      password: $password\n      boardCommentId: $boardCommentId\n    ) {\n      _id\n      writer\n      contents\n      rating\n    }\n  }\n"): (typeof documents)["\n  mutation updateBoardComment(\n    $updateBoardCommentInput: UpdateBoardCommentInput!\n    $password: String!\n    $boardCommentId: ID!\n  ) {\n    updateBoardComment(\n      updateBoardCommentInput: $updateBoardCommentInput\n      password: $password\n      boardCommentId: $boardCommentId\n    ) {\n      _id\n      writer\n      contents\n      rating\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query fetchBoard($boardId: ID!) {\n    fetchBoard(boardId: $boardId) {\n      _id # 게시글 고유 ID\n      writer # 작성자명\n      title # 제목\n      contents # 내용\n      youtubeUrl # 유튜브 링크\n      likeCount # 좋아요 수\n      dislikeCount # 싫어요 수\n      images # 첨부 이미지들\n      boardAddress {\n        zipcode\n        address\n        addressDetail\n      }\n      createdAt # 생성일\n      updatedAt # 수정일\n      deletedAt # 삭제일\n    }\n  }\n"): (typeof documents)["\n  query fetchBoard($boardId: ID!) {\n    fetchBoard(boardId: $boardId) {\n      _id # 게시글 고유 ID\n      writer # 작성자명\n      title # 제목\n      contents # 내용\n      youtubeUrl # 유튜브 링크\n      likeCount # 좋아요 수\n      dislikeCount # 싫어요 수\n      images # 첨부 이미지들\n      boardAddress {\n        zipcode\n        address\n        addressDetail\n      }\n      createdAt # 생성일\n      updatedAt # 수정일\n      deletedAt # 삭제일\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query fetchBoards(\n    $endDate: DateTime # 쿼리 변수 정의\n    $startDate: DateTime\n    $search: String\n    $page: Int\n  ) {\n    fetchBoards( # 서버의 fetchBoards 함수 호출\n      endDate: $endDate # 위에서 정의한 변수들을\n      startDate: $startDate # 함수의 매개변수로 전달\n      search: $search\n      page: $page\n    ) {\n      # 서버에서 받아올 데이터 필드들 지정\n      _id\n      writer\n      title\n      contents\n      createdAt\n    }\n  }\n"): (typeof documents)["\n  query fetchBoards(\n    $endDate: DateTime # 쿼리 변수 정의\n    $startDate: DateTime\n    $search: String\n    $page: Int\n  ) {\n    fetchBoards( # 서버의 fetchBoards 함수 호출\n      endDate: $endDate # 위에서 정의한 변수들을\n      startDate: $startDate # 함수의 매개변수로 전달\n      search: $search\n      page: $page\n    ) {\n      # 서버에서 받아올 데이터 필드들 지정\n      _id\n      writer\n      title\n      contents\n      createdAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation deleteBoard($boardId: ID!) {\n    deleteBoard(boardId: $boardId)\n  }\n"): (typeof documents)["\n  mutation deleteBoard($boardId: ID!) {\n    deleteBoard(boardId: $boardId)\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation loginUser($email: String!, $password: String!) {\n    loginUser(email: $email, password: $password) {\n      accessToken\n    }\n  }\n"): (typeof documents)["\n  mutation loginUser($email: String!, $password: String!) {\n    loginUser(email: $email, password: $password) {\n      accessToken\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createUser($createUserInput: CreateUserInput!) {\n    createUser(createUserInput: $createUserInput) {\n      _id\n      email\n      name\n    }\n  }\n"): (typeof documents)["\n  mutation createUser($createUserInput: CreateUserInput!) {\n    createUser(createUserInput: $createUserInput) {\n      _id\n      email\n      name\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createBoard($createBoardInput: CreateBoardInput!) {\n    createBoard(createBoardInput: $createBoardInput) {\n      _id\n      writer\n      title\n      contents\n      youtubeUrl\n      likeCount\n      dislikeCount\n      images\n      boardAddress {\n        zipcode\n        address\n        addressDetail\n      }\n      # user {\n      #   _id\n      #   email\n      #   name\n      # }\n      # createdAt\n      # updatedAt\n      # deletedAt\n    }\n  }\n"): (typeof documents)["\n  mutation createBoard($createBoardInput: CreateBoardInput!) {\n    createBoard(createBoardInput: $createBoardInput) {\n      _id\n      writer\n      title\n      contents\n      youtubeUrl\n      likeCount\n      dislikeCount\n      images\n      boardAddress {\n        zipcode\n        address\n        addressDetail\n      }\n      # user {\n      #   _id\n      #   email\n      #   name\n      # }\n      # createdAt\n      # updatedAt\n      # deletedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation updateBoard(\n    $updateBoardInput: UpdateBoardInput! # 수정할 데이터\n    $password: String # 비밀번호 검증용\n    $boardId: ID! # 수정할 게시글 ID\n  ) {\n    updateBoard(\n      updateBoardInput: $updateBoardInput\n      password: $password\n      boardId: $boardId\n    ) {\n      _id\n      writer\n      title\n      contents\n      youtubeUrl\n      likeCount\n      dislikeCount\n      images\n      boardAddress {\n        zipcode\n        address\n        addressDetail\n      }\n      createdAt\n      updatedAt\n      deletedAt\n    }\n  }\n"): (typeof documents)["\n  mutation updateBoard(\n    $updateBoardInput: UpdateBoardInput! # 수정할 데이터\n    $password: String # 비밀번호 검증용\n    $boardId: ID! # 수정할 게시글 ID\n  ) {\n    updateBoard(\n      updateBoardInput: $updateBoardInput\n      password: $password\n      boardId: $boardId\n    ) {\n      _id\n      writer\n      title\n      contents\n      youtubeUrl\n      likeCount\n      dislikeCount\n      images\n      boardAddress {\n        zipcode\n        address\n        addressDetail\n      }\n      createdAt\n      updatedAt\n      deletedAt\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query fetchBoardForEdit($boardId: ID!) {\n    fetchBoard(boardId: $boardId) {\n      _id # 게시글 고유 ID\n      writer # 작성자명\n      title # 제목\n      contents # 내용\n      youtubeUrl # 유튜브 링크\n      likeCount # 좋아요 수\n      dislikeCount # 싫어요 수\n      images # 첨부 이미지들\n      boardAddress {\n        zipcode\n        address\n        addressDetail\n      }\n      createdAt # 생성일\n      updatedAt # 수정일\n      deletedAt # 삭제일\n    }\n  }\n"): (typeof documents)["\n  query fetchBoardForEdit($boardId: ID!) {\n    fetchBoard(boardId: $boardId) {\n      _id # 게시글 고유 ID\n      writer # 작성자명\n      title # 제목\n      contents # 내용\n      youtubeUrl # 유튜브 링크\n      likeCount # 좋아요 수\n      dislikeCount # 싫어요 수\n      images # 첨부 이미지들\n      boardAddress {\n        zipcode\n        address\n        addressDetail\n      }\n      createdAt # 생성일\n      updatedAt # 수정일\n      deletedAt # 삭제일\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation uploadFile($file: Upload!) {\n    uploadFile(file: $file) {\n      url\n    }\n  }\n"): (typeof documents)["\n  mutation uploadFile($file: Upload!) {\n    uploadFile(file: $file) {\n      url\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;