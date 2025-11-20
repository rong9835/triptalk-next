import { useMutation, useQuery } from '@apollo/client';
import { FETCH_BOARD_COMMENTS, DELETE_BOARD_COMMENT } from './queries';
import { UseCommentListParams, UseCommentListReturn, FetchBoardCommentsData } from './types';
import { MouseEvent, useState } from 'react';

export default function useCommentList({ boardId }: UseCommentListParams): UseCommentListReturn {
  const [deleteBoardComment] = useMutation(DELETE_BOARD_COMMENT);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // 🔥 현재 페이지 상태 (댓글 작성 후 리셋용)
  const [lastDataLength, setLastDataLength] = useState(0); // 🔥 이전 데이터 길이 (변화 감지용)

  const { data, fetchMore, error } = useQuery<FetchBoardCommentsData>(FETCH_BOARD_COMMENTS, {
    variables: { boardId: boardId, page: 1 },
  });
  console.log('boardId:', boardId);
  console.log('data:', data);
  console.log('error:', error);

  // 🔥 핵심: 댓글 작성 후 데이터 변화 감지 및 자동 페이지 리셋
  const currentDataLength = data?.fetchBoardComments?.length || 0;
  if (currentDataLength !== lastDataLength) {
    if (currentDataLength < lastDataLength && currentPage > 1) {
      // 🔥 데이터가 줄어들었으면 (댓글 작성 후 refetchQueries) 페이지 상태 리셋
      console.log('데이터 감소 감지! 페이지 리셋:', lastDataLength, '→', currentDataLength);
      setCurrentPage(1); // 다시 1페이지부터 시작
      setHasMore(true); // 무한스크롤 재개
    }
    setLastDataLength(currentDataLength); // 현재 길이를 이전 길이로 저장
  }

  const onNext = () => {
    console.log('onNext 호출됨 - currentPage:', currentPage, 'data length:', currentDataLength);
    if (data === undefined) return;

    // 🔥 핵심: 강의 코드와 다른 점 - 데이터 길이 계산 대신 currentPage 사용
    const nextPage = currentPage + 1; // 강의: Math.ceil(data.length / 10) + 1
    console.log('fetchMore 요청: nextPage =', nextPage);
    fetchMore({
      variables: {
        page: nextPage,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult.fetchBoardComments?.length) {
          setHasMore(false); // 더 이상 데이터 없음
          return prev;
        }
        setCurrentPage(nextPage); // 🔥 중요: 성공하면 페이지 상태 업데이트
        return {
          fetchBoardComments: [
            ...prev.fetchBoardComments, // 기존 댓글
            ...fetchMoreResult.fetchBoardComments, // 새로운 댓글
          ],
        };
      },
    });
  };

  const onClickDeleteComment = async (event: MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget as HTMLButtonElement;
    const boardCommentId = button.id;
    if (!boardCommentId) {
      setModalMessage('댓글 ID를 찾을 수 없습니다.');
      setModalOpen(true);
      return;
    }

    // 비밀번호 입력 받기
    const password = prompt('게시글을 삭제하려면 비밀번호를 입력하세요:');

    // 비밀번호가 입력되지 않으면 삭제 중단
    if (!password) {
      setModalMessage('비밀번호를 입력해야 삭제할 수 있습니다.');
      setModalOpen(true);
      return;
    }

    try {
      // 삭제 뮤테이션 실행
      await deleteBoardComment({
        variables: {
          boardCommentId: boardCommentId,
          password: password,
        },
        refetchQueries: [
          {
            query: FETCH_BOARD_COMMENTS,
            variables: { boardId: boardId, page: 1 },
          },
        ], // 삭제 후 목록 다시 불러오기
      });
      setModalMessage('댓글이 삭제되었습니다.');
      setModalOpen(true);
    } catch (error) {
      console.error('삭제 실패:', error); // 에러 로그
      setModalMessage('삭제에 실패했습니다.');
      setModalOpen(true);
    }
  };
  const closeModal = () => {
    setModalOpen(false);
  };

  return {
    data,
    hasMore,
    onNext,
    onClickDeleteComment,
    modalOpen,
    modalMessage,
    closeModal
  };
}