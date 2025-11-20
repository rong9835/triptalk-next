'use client';
import CommentListItem from '../comment-list-item';
//댓글 목록

import useCommentList from './hooks';

import InfiniteScroll from 'react-infinite-scroll-component';
import AllModal from '@/components/all-modal';

interface CommentListProps {
  boardId: string;
}

export default function CommentList({ boardId }: CommentListProps) {
  const {
    data,
    hasMore,
    onNext,
    onClickDeleteComment,
    modalOpen,
    modalMessage,
    closeModal,
  } = useCommentList({ boardId });
  return (
    <div className="container">
      <div>
        <InfiniteScroll
          dataLength={data?.fetchBoardComments.length ?? 0}
          hasMore={hasMore}
          next={onNext}
          loader={<div>로딩중입니다</div>}
        >
          {data?.fetchBoardComments?.map((el) => {
            return (
              <CommentListItem
                key={el._id}
                comment={el}
                onClickDeleteComment={onClickDeleteComment}
              />
            );
          })}
        </InfiniteScroll>
        <AllModal
          open={modalOpen}
          message={modalMessage}
          onClose={closeModal}
        />
      </div>
    </div>
  );
}
