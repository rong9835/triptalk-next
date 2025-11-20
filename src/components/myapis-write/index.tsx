// 등록/수정 컴포넌트 - 영화 정보를 등록하거나 수정하는 폼
'use client'; // 클라이언트 컴포넌트로 설정

// Supabase 클라이언트와 React 훅들 import
import { supabase } from '@/commons/libraries/supabase';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * 영화 등록/수정 폼 컴포넌트
 * Props:
 * - isEdit: 수정 모드 여부 (true: 수정, false: 등록)
 * - movieId: 수정할 영화의 ID (수정 모드에서만 사용)
 *
 * 사용 예시:
 * - 등록: <MyApisWrite />
 * - 수정: <MyApisWrite isEdit={true} movieId="123" />
 */
export default function MyApisWrite({
  isEdit = false, // 기본값: false (등록 모드)
  movieId,
}: {
  isEdit?: boolean;
  movieId?: string;
}) {
  // useRouter: 페이지 이동을 위한 라우터 훅
  const router = useRouter();

  // useState: 폼 입력값들을 관리하는 상태들
  const [title, setTitle] = useState(''); // 영화 제목
  const [director, setDirector] = useState(''); // 감독
  const [rating, setRating] = useState(''); // 평점 (문자열로 관리하여 NaN 방지)
  const [content, setContent] = useState(''); // 리뷰 내용

  /**
   * useEffect: 수정 모드일 때 기존 데이터를 불러와서 폼에 채우는 로직
   * 의존성 배열: [isEdit, movieId] - 이 값들이 변경될 때마다 실행
   */
  useEffect(() => {
    // 수정 모드이고 movieId가 있을 때만 실행
    if (isEdit && movieId) {
      /**
       * 기존 영화 데이터를 가져오는 비동기 함수
       * Supabase에서 특정 ID의 영화 정보를 조회하여 폼에 채움
       */
      const fetchMovie = async () => {
        // Supabase SELECT 쿼리로 기존 데이터 조회
        const { data } = await supabase
          .from('movies')
          .select('*')
          .eq('id', movieId)
          .single(); // 단일 결과만 반환

        // 데이터가 있으면 각 상태에 설정
        if (data) {
          setTitle(data.title);
          setDirector(data.director);
          setRating(data?.rating.toString()); // 숫자를 문자열로 변환
          setContent(data.content);
        }
      };
      fetchMovie();
    }
  }, [isEdit, movieId]);

  /**
   * 등록/수정 버튼 클릭 시 실행되는 함수
   * isEdit 값에 따라 등록 또는 수정 로직을 분기 처리
   */
  const onClickSubmit = async () => {
    if (isEdit) {
      // 수정 로직: 기존 데이터를 업데이트
      const result = await supabase
        .from('movies') // movies 테이블에서
        .update({
          // 업데이트 작업
          title: title,
          director: director,
          rating: Number(rating), // 문자열을 숫자로 변환
          content: content,
        })
        .eq('id', movieId); // id가 movieId와 같은 행을 수정

      // 수정 완료 후 해당 영화의 상세페이지로 이동
      if (!result.error) {
        alert('수정이 완료되었습니다!');
        router.push(`/myapis/detail/${movieId}`);
      } else {
        alert('수정에 실패했습니다.');
      }
    } else {
      // 등록 로직: 새로운 데이터를 삽입
      const result = await supabase
        .from('movies') // movies 테이블에
        .insert({
          // 새 데이터 삽입
          title: title,
          director: director,
          rating: Number(rating), // 문자열을 숫자로 변환
          content: content,
        });

      // 등록 완료 후 목록 페이지로 이동
      if (!result.error) {
        alert('등록이 완료되었습니다!');
        router.push('/myapis');
      } else {
        alert('등록에 실패했습니다.');
      }
    }
  };

  // JSX 렌더링: 실제 화면에 보여지는 폼 UI
  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* 폼 제목 */}
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {isEdit ? '영화 정보 수정' : '새 영화 등록'}
      </h2>

      <form className="space-y-4">
        {/* 영화 제목 입력 필드 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            영화제목
          </label>
          <input
            type="text"
            value={title} // 현재 title 상태값을 표시
            onChange={(e) => setTitle(e.target.value)} // 입력값 변경 시 title 상태 업데이트
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="영화 제목을 입력하세요"
          />
        </div>

        {/* 감독 입력 필드 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            감독
          </label>
          <input
            type="text"
            value={director} // 현재 director 상태값을 표시
            onChange={(e) => setDirector(e.target.value)} // 입력값 변경 시 director 상태 업데이트
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="감독명을 입력하세요"
          />
        </div>

        {/* 평점 입력 필드 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            평점 (1-5)
          </label>
          <input
            type="number"
            min="1"
            max="5"
            value={rating} // 현재 rating 상태값을 표시
            onChange={(e) => setRating(e.target.value)} // 입력값 변경 시 rating 상태 업데이트
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="1-5 사이의 점수"
          />
        </div>

        {/* 리뷰 내용 입력 필드 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            리뷰내용
          </label>
          <textarea
            rows={4}
            value={content} // 현재 content 상태값을 표시
            onChange={(e) => setContent(e.target.value)} // 입력값 변경 시 content 상태 업데이트
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="영화에 대한 리뷰를 작성해주세요"
          />
        </div>

        {/* 등록/수정 버튼 - isEdit 값에 따라 버튼 텍스트 변경 */}
        <button
          type="button"
          onClick={onClickSubmit}
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isEdit ? '수정하기' : '등록하기'}
        </button>
      </form>
    </div>
  );
}
