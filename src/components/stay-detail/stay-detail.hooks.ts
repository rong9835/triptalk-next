/**
 * 숙소 상세보기 페이지용 커스텀 훅
 *
 * 주요 기능:
 * 1. 숙소 상세 정보 조회
 * 2. 이미지 갤러리 슬라이더
 * 3. 찜하기 기능
 * 4. 구매하기 기능
 * 5. 카카오맵 지도 표시
 */
'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useParams, useRouter } from 'next/navigation';
import {
  FETCH_TRAVELPRODUCT,
  TOGGLE_TRAVELPRODUCT_PICK,
} from './stay-detail.queries';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kakao: any;
  }
}

export default function useStayDetail() {
  const router = useRouter();
  const params = useParams();

  // stayid 파라미터 안전하게 추출 (배열이거나 undefined일 수 있음)
  const stayId =
    typeof params.stayid === 'string'
      ? params.stayid
      : Array.isArray(params.stayid)
      ? params.stayid[0]
      : undefined;

  // 이미지 슬라이더 상태 관리
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // 지도 관련 상태 및 ref
  const [mapLoaded, setMapLoaded] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerRef = useRef<any>(null);
  const scriptPromiseRef = useRef<Promise<void> | null>(null);

  const kakaoMapKey = useMemo(
    () => process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY,
    []
  );

  // 숙소 상세 데이터 가져오기
  const { data, loading, error, refetch } = useQuery(FETCH_TRAVELPRODUCT, {
    variables: {
      travelproductId: stayId,
    },
    skip: !stayId, // stayId가 없으면 쿼리 실행하지 않음
  });

  // 찜하기 뮤테이션
  const [togglePick] = useMutation(TOGGLE_TRAVELPRODUCT_PICK);

  // 이미지 개수
  const imageCount = data?.fetchTravelproduct?.images?.length || 0;

  // 이전 이미지로 이동
  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? imageCount - 1 : prev - 1));
  };

  // 다음 이미지로 이동
  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === imageCount - 1 ? 0 : prev + 1));
  };

  // 특정 이미지로 이동 (썸네일 클릭)
  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
  };

  // 찜하기 토글
  const handleTogglePick = async () => {
    try {
      // 로그인 확인 (localStorage에서 토큰 확인)
      const token = localStorage.getItem('accessToken');
      if (!token) {
        alert('로그인이 필요합니다.');
        router.push('/login');
        return;
      }

      if (!stayId) {
        alert('숙소 정보를 찾을 수 없습니다.');
        return;
      }

      await togglePick({
        variables: {
          travelproductId: stayId,
        },
      });

      // 데이터 다시 가져오기 (찜 개수 업데이트를 위해)
      await refetch();
    } catch (error) {
      console.error('찜하기 토글 에러:', error);
      alert('찜하기 처리 중 오류가 발생했습니다.');
    }
  };

  // 구매하기 버튼 클릭
  const handlePurchase = () => {
    // 로그인 확인
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('로그인이 필요합니다.');
      router.push('/login');
      return;
    }

    // 이미 판매된 상품인지 확인
    if (data?.fetchTravelproduct?.soldAt) {
      alert('이미 판매 완료된 상품입니다.');
      return;
    }

    // 본인이 판매한 상품인지 확인
    // TODO: 현재 로그인한 사용자 정보와 비교 필요

    // 구매 페이지로 이동 또는 모달 표시
    // TODO: 구매 로직 구현
    console.log('구매하기 클릭');
  };

  // 목록으로 돌아가기
  const handleBackToList = () => {
    router.push('/stay');
  };

  // 카카오맵 SDK 로드
  const loadKakaoMaps = useCallback((): Promise<void> => {
    if (typeof window === 'undefined') {
      return Promise.resolve();
    }

    if (window.kakao && window.kakao.maps) {
      return new Promise((resolve) => {
        window.kakao.maps.load(() => resolve());
      });
    }

    if (scriptPromiseRef.current) {
      return scriptPromiseRef.current;
    }

    scriptPromiseRef.current = new Promise<void>((resolve, reject) => {
      if (!kakaoMapKey) {
        reject(new Error('Kakao map key is missing'));
        return;
      }

      const existingScript = document.getElementById('kakao-map-sdk');

      const handleLoad = () => {
        window.kakao.maps.load(() => resolve());
      };

      if (existingScript) {
        existingScript.addEventListener('load', handleLoad, { once: true });
        existingScript.addEventListener(
          'error',
          () => reject(new Error('Failed to load Kakao map script')),
          { once: true }
        );
        return;
      }

      const script = document.createElement('script');
      script.id = 'kakao-map-sdk';
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapKey}&autoload=false&libraries=services`;
      script.onload = handleLoad;
      script.onerror = () =>
        reject(new Error('Failed to load Kakao map script'));
      document.head.appendChild(script);
    });

    return scriptPromiseRef.current;
  }, [kakaoMapKey]);

  // 지도 렌더링
  const renderMap = useCallback((latitude: number, longitude: number) => {
    if (typeof window === 'undefined' || !window.kakao?.maps) {
      return;
    }

    const container = document.getElementById('stay-detail-map');
    if (!container) return;

    const position = new window.kakao.maps.LatLng(latitude, longitude);

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new window.kakao.maps.Map(container, {
        center: position,
        level: 3,
      });
    } else {
      mapInstanceRef.current.setCenter(position);
    }

    if (!markerRef.current) {
      markerRef.current = new window.kakao.maps.Marker({
        position,
      });
      markerRef.current.setMap(mapInstanceRef.current);
    } else {
      markerRef.current.setPosition(position);
    }

    setMapLoaded(true);
  }, []);

  // 데이터 로드 후 지도 표시
  useEffect(() => {
    const addressData = data?.fetchTravelproduct?.travelproductAddress;
    if (addressData?.lat && addressData?.lng) {
      const loadAndRenderMap = async () => {
        try {
          await loadKakaoMaps();
          renderMap(Number(addressData.lat), Number(addressData.lng));
        } catch (error) {
          console.error('지도 로딩 중 오류 발생:', error);
        }
      };
      loadAndRenderMap();
    }
  }, [data, loadKakaoMaps, renderMap]);

  return {
    data,
    loading,
    error,
    currentImageIndex,
    imageCount,
    handlePrevImage,
    handleNextImage,
    handleImageClick,
    handleTogglePick,
    handlePurchase,
    handleBackToList,
    mapLoaded,
  };
}
