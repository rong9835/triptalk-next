/**
 * 📚 오늘 핫한 트립토크 컴포넌트용 커스텀 훅
 *
 * 🎯 이 훅이 하는 일:
 * → 인기 게시글 목록을 불러와서 카드 형식으로 표시
 * → 게시글 클릭 시 상세 페이지로 이동
 *
 * 💡 주요 기능:
 * 1️⃣ fetchBoardsOfTheBest 쿼리로 인기 게시글 로드
 * 2️⃣ 최대 6개까지 표시
 * 3️⃣ 게시글 카드 클릭 시 상세 페이지로 이동
 */

import { useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { FETCH_BOARDS_OF_THE_BEST } from './hot-trip-talk.queries';

// 게시글 데이터 타입 정의
export interface IBoard {
  _id: string;
  writer: string;
  title: string;
  contents: string;
  likeCount: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  images: string[];
  boardAddress: {
    _id: string;
    zipcode: string;
    address: string;
    addressDetail: string;
  } | null;
  user: {
    _id: string;
    email: string;
    name: string;
    picture: string;
  } | null;
}

interface IUseHotTripTalkProps {
  limit?: number; // 최대 표시 개수 (기본값: 6)
}

/**
 * 오늘 핫한 트립토크 훅
 * @param limit - 최대 표시 개수 (기본값: 6)
 * @returns 게시글 데이터, 로딩 상태, 에러, 클릭 핸들러
 */
export default function useHotTripTalk({ limit = 6 }: IUseHotTripTalkProps = {}) {
  // 페이지 이동을 위한 라우터
  const router = useRouter();

  // 인기 게시글 데이터 로드
  const { data, loading, error } = useQuery<{ fetchBoardsOfTheBest: IBoard[] }>(
    FETCH_BOARDS_OF_THE_BEST
  );

  // 게시글 목록 (최대 limit개까지만)
  const boards = useMemo(() => {
    if (!data?.fetchBoardsOfTheBest) return [];
    return data.fetchBoardsOfTheBest.slice(0, limit);
  }, [data, limit]);

  /**
   * 게시글 카드 클릭 이벤트
   * @param boardId - 클릭한 게시글 ID
   */
  const onClickCard = (boardId: string) => {
    console.log('🔍 클릭한 게시글 ID:', boardId);
    router.push(`/boards/detail/${boardId}`);
  };

  /**
   * 날짜를 상대 시간으로 변환
   * @param dateString - ISO 형식의 날짜 문자열
   * @returns 포맷된 날짜 문자열 (예: "2024.11.11")
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).replace(/\. /g, '.').replace(/\.$/, '');
  };

  /**
   * 썸네일 이미지 URL 가져오기
   * @param board - 게시글 데이터
   * @returns 썸네일 이미지 URL 또는 기본 이미지
   */
  const getThumbnailImage = (board: IBoard): string => {
    if (board.images && board.images.length > 0 && board.images[0]) {
      // GraphQL에서 받은 이미지 URL이 상대 경로인 경우 전체 URL로 변환
      const imageUrl = board.images[0];
      if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl;
      }
      // 상대 경로인 경우 CDN URL 추가
      return `https://storage.googleapis.com/${imageUrl}`;
    }
    return '/images/default-thumbnail.jpg'; // 기본 썸네일 이미지
  };

  /**
   * 프로필 이미지 URL 가져오기
   * @param board - 게시글 데이터
   * @returns 프로필 이미지 URL 또는 빈 문자열
   */
  const getProfileImage = (board: IBoard): string => {
    const picture = board.user?.picture;
    if (!picture) return '';

    // 이미 완전한 URL인 경우
    if (picture.startsWith('http://') || picture.startsWith('https://')) {
      return picture;
    }

    // 상대 경로인 경우 CDN URL 추가
    return `https://storage.googleapis.com/${picture}`;
  };

  return {
    boards, // 게시글 목록
    loading, // 로딩 상태
    error, // 에러
    onClickCard, // 카드 클릭 핸들러
    formatDate, // 날짜 포맷 함수
    getThumbnailImage, // 썸네일 이미지 함수
    getProfileImage, // 프로필 이미지 함수
  };
}
