// 상세페이지 컴포넌트 - 영화의 상세 정보를 보여주는 페이지
'use client'; // 클라이언트 컴포넌트로 설정 (useState, useEffect 등 사용 가능)

// React 훅들 import
import { useState, useEffect } from 'react';
// Next.js 라우팅 관련 훅들 import
import { useParams, useRouter } from 'next/navigation';
// Supabase 클라이언트 import
import { supabase } from '@/commons/libraries/supabase';

/**
 * 영화 상세보기 컴포넌트
 * 역할: URL에서 영화 ID를 받아서 해당 영화의 상세 정보를 표시
 * 경로: /myapis/detail/[boardId] 에서 사용됨
 */
export default function MyApisDetail() {
  // useParams(): URL의 동적 파라미터를 가져오는 훅 ([boardId] 부분)
  const params = useParams();

  // useRouter(): 페이지 이동을 위한 라우터 훅
  const router = useRouter();

  // useState(): 영화 데이터를 저장할 상태 (초기값: null)
  interface Movie {
    id: number;
    title: string;
    director: string;
    rating: number;
    content: string;
  }
  const [movie, setMovie] = useState<Movie | null>(null);

  // URL에서 영화 ID 추출 (예: /myapis/detail/123 → movieId = "123")
  const movieId = params.boardId;

  /**
   * 수정 페이지로 이동하는 함수
   * 클릭 시 /myapis/detail/[id]/edit 경로로 이동
   */
  const onClickEdit = () => {
    router.push(`/myapis/detail/${movieId}/edit`);
  };

  /**
   * 영화 삭제 함수
   * 1. 사용자에게 삭제 확인 팝업 표시
   * 2. 확인 시 Supabase에서 해당 영화 데이터 삭제
   * 3. 삭제 완료 후 목록 페이지로 이동
   */
  const onClickDelete = async () => {
    // confirm(): 브라우저 기본 확인 대화상자
    if (confirm('정말 삭제하시겠습니까?')) {
      // Supabase DELETE 쿼리
      // .from('movies'): movies 테이블에서
      // .delete(): 삭제 작업
      // .eq('id', movieId): id가 movieId와 같은 행을 삭제
      const result = await supabase
        .from('movies')
        .delete()
        .eq('id', movieId);

      // 에러 처리
      if (result.error) {
        alert('삭제에 실패했습니다.');
      } else {
        alert('삭제되었습니다.');
        router.push('/myapis'); // 목록 페이지로 이동
      }
    }
  };

  /**
   * useEffect(): 컴포넌트가 마운트될 때 실행되는 훅
   * 의존성 배열: [movieId] - movieId가 변경될 때마다 실행
   * 역할: 페이지 로드 시 자동으로 영화 데이터를 가져와서 화면에 표시
   */
  useEffect(() => {
    /**
     * 영화 데이터를 가져오는 비동기 함수
     * Supabase에서 특정 ID의 영화 정보를 조회
     */
    const fetchMovie = async () => {
      // Supabase SELECT 쿼리
      // .from('movies'): movies 테이블에서
      // .select('*'): 모든 컬럼 선택
      // .eq('id', movieId): id가 movieId와 같은 행 조회
      // .single(): 단일 결과만 반환 (배열이 아닌 객체로)
      const { data } = await supabase
        .from('movies')
        .select('*')
        .eq('id', movieId)
        .single();

      // 가져온 데이터를 state에 저장
      setMovie(data);
    };

    // movieId가 존재할 때만 데이터 조회 실행
    if (movieId) {
      fetchMovie();
    }
  }, [movieId]); // movieId가 변경될 때마다 재실행

  // 로딩 상태: 영화 데이터가 아직 없으면 로딩 메시지 표시
  if (!movie) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-2"></div>
        </div>
      </div>
    );
  }

  // 영화 데이터가 있으면 상세 정보 렌더링
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* 영화 정보 카드 */}
      <div className="mb-6">
        {/* 영화 제목 */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4 border-b-2 border-blue-500 pb-2">
          {movie.title}
        </h1>

        {/* 영화 정보 그리드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* 감독 정보 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <span className="text-sm font-medium text-gray-500">감독</span>
            <p className="text-lg font-semibold text-gray-800">{movie.director}</p>
          </div>

          {/* 평점 정보 */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <span className="text-sm font-medium text-gray-500">평점</span>
            <div className="flex items-center">
              <p className="text-lg font-semibold text-yellow-600 mr-2">{movie.rating}/5</p>
              {/* 별점 표시 */}
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-lg ${
                      i < movie.rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 리뷰 내용 */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <span className="text-sm font-medium text-gray-500 block mb-2">리뷰</span>
          <p className="text-gray-700 leading-relaxed">{movie.content}</p>
        </div>
      </div>

      {/* 수정/삭제 버튼 */}
      <div className="flex gap-4 justify-end">
        <button
          onClick={onClickEdit}
          className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          수정하기
        </button>
        <button
          onClick={onClickDelete}
          className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          삭제하기
        </button>
      </div>
    </div>
  );
}
