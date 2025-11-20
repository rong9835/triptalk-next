// 영화 목록 컴포넌트 - 등록된 영화들의 목록을 보여주는 컴포넌트
'use client'; // 클라이언트 컴포넌트로 설정

// 필요한 라이브러리들 import
import { supabase } from '@/commons/libraries/supabase';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * 영화 목록 컴포넌트
 * 역할:
 * 1. "조회하기" 버튼을 통해 Supabase에서 모든 영화 데이터를 가져옴
 * 2. 가져온 영화들을 카드 형태로 화면에 표시
 * 3. 각 영화 카드를 클릭하면 해당 영화의 상세페이지로 이동
 */
export default function MyApisList() {
  // useRouter(): 페이지 이동을 위한 라우터 훅
  const router = useRouter();

  // useState(): 영화 목록을 저장할 상태 (초기값: 빈 배열)
  interface Movie {
    id: number;
    title: string;
    director: string;
    rating: number;
    content: string;
  }
  const [movies, setMovies] = useState<Movie[]>([]);

  /**
   * 영화 카드 클릭 시 상세페이지로 이동하는 함수
   * @param movieid - 클릭한 영화의 ID
   */
  const onClickMovie = (movieid: number) => {
    // 상세페이지 경로로 이동: /myapis/detail/[영화ID]
    router.push(`/myapis/detail/${movieid}`);
  };

  /**
   * 영화 데이터를 가져오는 함수
   * Supabase에서 모든 영화 데이터를 가져와서 상태에 저장
   */
  const fetchMovies = async () => {
    // Supabase SELECT 쿼리
    // .from('movies'): movies 테이블에서
    // .select('*'): 모든 컬럼을 선택하여 가져옴
    const { data } = await supabase.from('movies').select('*');

    // 가져온 데이터를 movies 상태에 저장
    // data는 영화 객체들의 배열 형태: [{ id: 1, title: "어벤져스", ... }, ...]
    setMovies(data || []); // data가 null일 경우 빈 배열로 설정
  };

  /**
   * useEffect: 컴포넌트가 마운트될 때 자동으로 영화 목록을 불러옴
   * 의존성 배열이 빈 배열이므로 컴포넌트 마운트 시 한 번만 실행
   */
  useEffect(() => {
    fetchMovies();
  }, []);

  /**
   * "새로고침" 버튼 클릭 시 실행되는 함수
   * 영화 목록을 다시 불러옴
   */
  const onClickRefresh = async () => {
    await fetchMovies();
  };

  // JSX 렌더링: 실제 화면에 보여지는 UI
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* 헤더 섹션 */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">영화 리뷰 목록</h1>

          {/* 버튼 그룹 */}
          <div className="flex gap-3">
            {/* 새 영화 등록 버튼 */}
            <button
              onClick={() => router.push('/myapis/new')}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              ➕ 새 영화 등록
            </button>

            {/* 새로고침 버튼 */}
            <button
              onClick={onClickRefresh}
              className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              🔄 새로고침
            </button>
          </div>
        </div>
      </div>

      {/* 영화 목록 렌더링 */}
      {movies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map((movie) => (
            // 각 영화를 카드 형태로 표시
            // key: React에서 리스트 렌더링 시 필수 속성 (고유값으로 movie.id 사용)
            // onClick: 카드 클릭 시 해당 영화의 상세페이지로 이동
            <div
              key={movie.id}
              onClick={() => onClickMovie(movie.id)}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-gray-200 hover:border-blue-300"
            >
              <div className="p-6">
                {/* 영화 제목 */}
                <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                  {movie.title}
                </h3>

                {/* 감독 정보 */}
                <p className="text-gray-600 mb-3">
                  <span className="font-medium">감독:</span> {movie.director}
                </p>

                {/* 평점 표시 */}
                <div className="flex items-center mb-3">
                  <span className="text-sm font-medium text-gray-500 mr-2">평점:</span>
                  <div className="flex items-center">
                    <span className="text-yellow-600 font-semibold mr-1">{movie.rating}/5</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={`text-sm ${
                            i < movie.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 리뷰 미리보기 */}
                <p className="text-gray-600 text-sm line-clamp-3">
                  {movie.content}
                </p>

                {/* 더보기 표시 */}
                <div className="mt-4 text-blue-500 text-sm font-medium">
                  자세히 보기 →
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // 영화 목록이 없을 때 표시할 메시지
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🎬</div>
          <p className="text-gray-500 text-lg">
            아직 등록된 영화가 없습니다.
          </p>
          <p className="text-gray-400 text-sm mt-2">
            새 영화를 등록해보세요!
          </p>
        </div>
      )}
    </div>
  );
}
