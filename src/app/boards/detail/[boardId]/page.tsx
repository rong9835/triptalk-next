'use client';
import CommentList from '@/components/boards-detail/comment-list';
import CommentWrite from '@/components/boards-detail/comment-write';
// 상세페이지
import BoardsDetail from '@/components/boards-detail/detail'; // 분리한 컴포넌트 import
import { withAuth } from '@/commons/hocs/auth'; // 인증 HOC import

// 게시글 상세보기 페이지 컴포넌트
export default withAuth(function BoardsDetailPage({
  params,
}: {
  params: { boardId: string };
}) {
  return (
    <>
      <BoardsDetail />
      <CommentWrite />
      <CommentList boardId={params.boardId} />
    </>
  );
});
