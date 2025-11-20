/**
 * 숙소 리스트 페이지용 커스텀 훅
 *
 * 주요 기능:
 * 1. fetchTravelproductsOfTheBest GraphQL 쿼리로 추천 숙소 데이터 가져오기
 * 2. fetchTravelproducts GraphQL 쿼리로 일반 숙소 데이터 가져오기
 * 3. 페이지네이션 처리
 * 4. 카드 클릭 시 상세 페이지 이동
 * 5. 판매하기 버튼 클릭 처리
 * 6. 상단 추천 숙소 슬라이더 기능 (2개씩 표시)
 */
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  FETCH_TRAVELPRODUCTS,
  FETCH_TRAVELPRODUCTS_OF_THE_BEST,
} from './stay-list.queries';

interface TravelproductAddress {
  _id: string;
  address: string;
  addressDetail?: string;
  lat: number;
  lng: number;
}

interface User {
  _id: string;
  email: string;
  name: string;
  picture?: string;
}

export interface ITravelproduct {
  _id: string;
  name: string;
  remarks: string;
  contents: string;
  price: number;
  tags?: string[];
  images?: string[];
  pickedCount: number;
  travelproductAddress?: TravelproductAddress;
  buyer?: User;
  seller?: User;
  soldAt?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export default function useStayList() {
  const router = useRouter();

  // 슬라이더 현재 인덱스 상태
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // fetchTravelproductsOfTheBest 쿼리 실행 (상단 추천 숙소용)
  const {
    data: bestData,
    loading: bestLoading,
    error: bestError,
  } = useQuery(FETCH_TRAVELPRODUCTS_OF_THE_BEST);

  // fetchTravelproducts 쿼리 실행 (메인 리스트용)
  const { data, loading, error } = useQuery(FETCH_TRAVELPRODUCTS, {
    variables: {
      isSoldout: false, // 판매 가능한 숙소만 조회
      page: 1,
    },
  });

  // 추천 숙소 데이터
  const bestProducts: ITravelproduct[] =
    bestData?.fetchTravelproductsOfTheBest ?? [];

  // 전체 숙소 데이터
  const travelproducts: ITravelproduct[] = data?.fetchTravelproducts ?? [];

  // 첫 번째 섹션에 표시할 추천 숙소 (2개씩 슬라이드)
  const ITEMS_PER_SLIDE = 2;
  const totalSlides = Math.ceil(bestProducts.length / ITEMS_PER_SLIDE);
  const startIndex = currentSlideIndex * ITEMS_PER_SLIDE;
  const featuredProducts = bestProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_SLIDE
  );

  // 메인 카드 영역에 표시할 숙소 (나머지 모든 숙소)
  const cardProducts = travelproducts.slice(0);

  /**
   * 카드 클릭 시 상세 페이지로 이동
   */
  const handleCardClick = (stayId: string) => () => {
    router.push(`/stay/detail/${stayId}`);
  };

  /**
   * 판매하기 버튼 클릭
   */
  const onClickSellButton = () => {
    router.push('/stay/new');
  };

  /**
   * 이전 슬라이드로 이동
   */
  const handlePrevSlide = () => {
    setCurrentSlideIndex((prev) => {
      if (prev === 0) return totalSlides - 1; // 첫 슬라이드에서 마지막으로
      return prev - 1;
    });
  };

  /**
   * 다음 슬라이드로 이동
   */
  const handleNextSlide = () => {
    setCurrentSlideIndex((prev) => {
      if (prev === totalSlides - 1) return 0; // 마지막 슬라이드에서 첫 번째로
      return prev + 1;
    });
  };

  /**
   * 이미지 URL을 절대 경로로 변환
   */
  const ensureAbsoluteImageUrl = (url?: string): string | null => {
    if (!url) return null;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://storage.googleapis.com/${url}`;
  };

  /**
   * 이미지 배열에서 썸네일 추출
   * 이미지가 없으면 기본 placeholder 이미지 반환 (여러 개 중 랜덤하게 선택)
   */
  const getThumbnail = (images?: string[], index?: number): string => {
    if (!images || images.length === 0) {
      // 기본 placeholder 이미지들 (banner1, banner2, banner3)
      const placeholders = ['/images/banner1.png', '/images/banner2.png', '/images/banner3.png'];
      // index를 기반으로 선택하여 같은 게시글은 항상 같은 이미지 사용
      const placeholderIndex = (index ?? 0) % placeholders.length;
      return placeholders[placeholderIndex];
    }
    const firstImage = images[0];
    const absoluteUrl = ensureAbsoluteImageUrl(firstImage);
    return absoluteUrl || '/images/banner1.png'; // URL 변환 실패 시에도 기본 이미지 반환
  };

  /**
   * 가격 포맷팅 (천 단위 콤마)
   */
  const formatPrice = (price?: number): string => {
    if (price == null) return '';
    return price.toLocaleString('ko-KR');
  };

  /**
   * 태그 포맷팅 (첫 번째 태그만 표시)
   */
  const formatTags = (tags?: string[]): string => {
    if (!tags || tags.length === 0) return '';
    return `#${tags[0]}`;
  };

  return {
    // 데이터
    travelproducts,
    featuredProducts,
    cardProducts,
    loading: loading || bestLoading,
    error: error || bestError,

    // 슬라이더
    currentSlideIndex,
    totalSlides,
    handlePrevSlide,
    handleNextSlide,

    // 함수
    handleCardClick,
    onClickSellButton,
    getThumbnail,
    formatPrice,
    formatTags,
    ensureAbsoluteImageUrl,
  };
}
