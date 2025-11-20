/**
 * 📚 게시글 상세보기 페이지용 커스텀 훅 (초보자용 가이드)
 *
 * 🎯 이 훅이 하는 일:
 * → 특정 게시글 하나의 상세한 정보를 가져와서 화면에 보여주기
 *
 * 💡 쉬운 비유:
 * - 인스타그램에서 특정 게시물을 클릭했을 때 나오는 상세 화면과 같음
 * - URL에 있는 게시글 번호로 해당 게시글의 모든 정보를 가져옴
 *
 * 🔧 주요 기능:
 * 1️⃣ 게시글 데이터 가져오기 (제목, 내용, 이미지, 작성자 등)
 * 2️⃣ 수정 페이지로 이동하기
 * 3️⃣ 목록 페이지로 돌아가기
 *
 * ⚡ 핵심 개념:
 * - useQuery = 서버에서 데이터 가져오는 훅 (READ 전용)
 * - useParams = URL에 있는 값들을 가져오는 훅
 * - router.push = 다른 페이지로 이동하는 함수
 */
'use client';

import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation } from '@apollo/client'; // GraphQL 데이터 조회/변경 훅
import { useParams, useRouter } from 'next/navigation'; // Next.js 라우팅 훅들
import { FETCH_BOARD, LIKE_BOARD, DISLIKE_BOARD } from './queries'; // GraphQL 쿼리 정의

/**
 * 게시글 상세보기를 위한 커스텀 훅
 * @returns {Object} 게시글 데이터, 좋아요/싫어요 함수들, 페이지 이동 함수들
 */
export default function useBoardsDetail() {
  // === Next.js 라우팅 관련 훅들 ===
  const router = useRouter(); // 페이지 이동을 위한 라우터 훅
  const params = useParams(); // URL에서 파라미터 추출 (예: /boards/detail/123 → boardId: "123")

  // === 좋아요/싫어요 상태 관리 ===
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const initialized = useRef(false);

  console.log('🔍 현재 보고 있는 게시글 ID:', params.boardId); // 디버깅용

  // === 게시글 데이터 가져오기 ===
  const { data } = useQuery(FETCH_BOARD, {
    variables: {
      boardId: params.boardId, // URL에서 가져온 게시글 ID를 서버로 전달
    },
  });

  // 초기 데이터 설정 (한 번만 실행)
  useEffect(() => {
    if (data?.fetchBoard && !initialized.current) {
      setLikeCount(data.fetchBoard.likeCount || 0);
      setDislikeCount(data.fetchBoard.dislikeCount || 0);
      initialized.current = true;
    }
  }, [data]);

  // === 좋아요/싫어요 뮤테이션 ===
  const [likeBoard] = useMutation(LIKE_BOARD);
  const [dislikeBoard] = useMutation(DISLIKE_BOARD);

  /**
   * 좋아요 버튼 클릭 핸들러
   * - 좋아요 추가/취소 토글
   * - 좋아요 추가 시 싫어요 자동 해제 (상호 배타적)
   */
  const handleLike = async () => {
    const prevIsLiked = isLiked;
    const prevIsDisliked = isDisliked;
    const prevLikeCount = likeCount;
    const prevDislikeCount = dislikeCount;

    try {
      // 낙관적 업데이트
      if (isLiked) {
        // 좋아요 취소
        setIsLiked(false);
        setLikeCount((prev) => prev - 1);
      } else {
        // 좋아요 추가
        setIsLiked(true);
        setLikeCount((prev) => prev + 1);

        // 싫어요가 활성화되어 있으면 해제
        if (isDisliked) {
          setIsDisliked(false);
          setDislikeCount((prev) => prev - 1);
        }
      }

      // 서버에 좋아요 요청
      await likeBoard({ variables: { boardId: params.boardId } });
    } catch (error) {
      // 에러 발생 시 롤백
      setIsLiked(prevIsLiked);
      setIsDisliked(prevIsDisliked);
      setLikeCount(prevLikeCount);
      setDislikeCount(prevDislikeCount);
      console.error('좋아요 처리 실패:', error);
    }
  };

  /**
   * 싫어요 버튼 클릭 핸들러
   * - 싫어요 추가/취소 토글
   * - 싫어요 추가 시 좋아요 자동 해제 (상호 배타적)
   */
  const handleDislike = async () => {
    const prevIsLiked = isLiked;
    const prevIsDisliked = isDisliked;
    const prevLikeCount = likeCount;
    const prevDislikeCount = dislikeCount;

    try {
      // 낙관적 업데이트
      if (isDisliked) {
        // 싫어요 취소
        setIsDisliked(false);
        setDislikeCount((prev) => prev - 1);
      } else {
        // 싫어요 추가
        setIsDisliked(true);
        setDislikeCount((prev) => prev + 1);

        // 좋아요가 활성화되어 있으면 해제
        if (isLiked) {
          setIsLiked(false);
          setLikeCount((prev) => prev - 1);
        }
      }

      // 서버에 싫어요 요청
      await dislikeBoard({ variables: { boardId: params.boardId } });
    } catch (error) {
      // 에러 발생 시 롤백
      setIsLiked(prevIsLiked);
      setIsDisliked(prevIsDisliked);
      setLikeCount(prevLikeCount);
      setDislikeCount(prevDislikeCount);
      console.error('싫어요 처리 실패:', error);
    }
  };

  // === 페이지 이동 함수들 ===
  const onClickEdit = () => {
    console.log('✏️ 수정 페이지로 이동 중...');
    router.push(`/boards/detail/${params.boardId}/edit`);
  };

  const onClickList = () => {
    console.log('📋 목록 페이지로 이동 중...');
    router.push('/boards');
  };

  // === 컴포넌트에서 사용할 데이터와 함수들 반환 ===
  return {
    data, // 게시글 상세 정보
    boardId: params.boardId as string, // 게시글 ID
    isLiked, // 좋아요 활성화 상태
    isDisliked, // 싫어요 활성화 상태
    likeCount, // 좋아요 개수
    dislikeCount, // 싫어요 개수
    handleLike, // 좋아요 클릭 함수
    handleDislike, // 싫어요 클릭 함수
    onClickEdit, // 수정 페이지로 이동하는 함수
    onClickList, // 목록 페이지로 이동하는 함수
  };
}

/**
 * 🎓 시험 대비 핵심 포인트:
 *
 * 📝 자주 나오는 패턴:
 * - URL 파라미터 가져오기: useParams()
 * - 데이터 조회: useQuery(쿼리, { variables: { id: 값 } })
 * - 페이지 이동: router.push('/경로')
 *
 * ⚠️ 주의사항:
 * - useQuery는 컴포넌트가 렌더링될 때 자동으로 실행됨
 * - params.boardId는 문자열 타입임 (숫자가 아님!)
 * - router.push는 즉시 페이지를 이동시킴
 *
 * 🎯 실제 사용 예시:
 * - data?.fetchBoard.title → 게시글 제목
 * - data?.fetchBoard.contents → 게시글 내용
 * - data?.fetchBoard.images → 게시글 이미지 배열
 */
