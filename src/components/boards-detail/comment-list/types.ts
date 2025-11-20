import { MouseEvent } from 'react';

export interface Comment {
  _id: string;
  writer: string;
  contents: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface FetchBoardCommentsData {
  fetchBoardComments: Comment[];
}

export interface UseCommentListParams {
  boardId: string;
}

export interface UseCommentListReturn {
  data: FetchBoardCommentsData | undefined;
  hasMore: boolean;
  onNext: () => void;
  onClickDeleteComment: (event: MouseEvent<HTMLButtonElement>) => Promise<void>;
  modalOpen: boolean;
  modalMessage: string;
  closeModal: () => void;
}