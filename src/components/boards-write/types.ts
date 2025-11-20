import { FetchBoardQuery } from '@/commons/graphql/graphql';

export interface IBoardsWriteProps {
  data?: FetchBoardQuery;
  isEdit: boolean;
}

export interface IUpdateBoardVariables {
  boardId: string;
  password?: string;
  updateBoardInput: {
    title?: string;
    contents?: string;
  };
}
