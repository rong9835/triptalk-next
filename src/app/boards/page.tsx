// 게시글 목록 메인 페이지
'use client';
import HotTripTalk from '@/components/hot-trip-talk'; // 오늘 핫한 트립토크 컴포넌트
import BoardsList from '@/components/boards-list/list'; // 게시글 목록 컴포넌트
import Pagination from '@/components/boards-list/pagination'; // 페이지네이션 컴포넌트
import { useQuery } from '@apollo/client'; // GraphQL 쿼리 훅
import { FETCH_BOARDS } from '@/components/boards-list/list/queries'; // GraphQL 쿼리 문
import { FETCH_BOARDS_COUNT } from './queries'; // 게시글 개수 쿼리
import Search from '@/components/boards-list/search'; // 검색 컴포넌트
import { useState } from 'react'; // React 상태 관리 훅
import { withAuth } from '@/commons/hocs/auth';

//  메인 페이지 컴포넌트 구조
export default withAuth(function BoardsPage() {
  //  useState 훅 사용법 (중요!)
  // 검색어를 저장하는 상태 - 초기값은 빈 문자열
  const [keyword, setKeyword] = useState('');
  // 날짜 필터를 저장하는 상태
  const [dateFilter, setDateFilter] = useState<{
    startDate?: string;
    endDate?: string;
  }>({});

  // useQuery 훅 사용법 (중요!)
  // GraphQL로 게시글 데이터 가져오기
  const { data, refetch } = useQuery(FETCH_BOARDS);
  // data: 서버에서 받아온 게시글 데이터
  // refetch: 쿼리를 다시 실행하는 함수 (검색, 페이지네이션에서 사용)

  //  구조분해 할당 (destructuring assignment)
  // 게시글 총 개수를 가져오는 다른 쿼리
  const { data: dataBoardsCount } = useQuery(FETCH_BOARDS_COUNT, {
    variables: {
      search: keyword,
      startDate: dateFilter.startDate,
      endDate: dateFilter.endDate,
    },
  });
  // data를 dataBoardsCount로 이름 변경 (위의 data와 충돌 방지)

  // 수학 연산 및 조건부 연산자
  // 마지막 페이지 번호 계산: 전체 게시글 수 ÷ 10 (한 페이지당 10개)
  const lastPage = Math.ceil((dataBoardsCount?.fetchBoardsCount ?? 0) / 10);
  // Math.ceil(): 올림 함수
  // ??: null 병합 연산자 (dataBoardsCount?.fetchBoardsCount가 null/undefined면 0 사용)

  //  콜백 함수 (callback function) 정의
  // Search 컴포넌트에서 검색어가 변경될 때 호출되는 함수
  const handleKeywordChange = (newKeyword: string) => {
    // setState 함수 호출
    setKeyword(newKeyword); // 상태 업데이트 -> 리렌더링 발생
  };

  // Search 컴포넌트에서 날짜가 변경될 때 호출되는 함수
  const handleDateChange = (startDate?: string, endDate?: string) => {
    setDateFilter({ startDate, endDate });
  };

  //  JSX 및 Props Drilling
  return (
    <>
      {/* 오늘 핫한 트립토크 영역 */}
      <HotTripTalk />

      {/* 🎯 검색 컴포넌트에 함수 3개 props로 전달 */}
      <Search
        refetch={refetch} // 쿼리 다시 실행 함수 전달
        onKeywordChange={handleKeywordChange} // 검색어 변경 콜백 함수 전달
        onDateChange={handleDateChange} // 날짜 변경 콜백 함수 전달
      />

      {/* 🎯 게시글 목록 컴포넌트에 데이터와 검색어 props로 전달 */}
      <BoardsList
        data={data?.fetchBoards} // GraphQL에서 받아온 게시글 배열 데이터
        keyword={keyword} // 하이라이트용 검색어 데이터
      />

      {/* 🎯 페이지네이션 컴포넌트에 함수와 데이터 props로 전달 */}
      <Pagination
        refetch={refetch} // 페이지 변경 시 쿼리 다시 실행 함수
        lastPage={lastPage} // 마지막 페이지 번호
      />
    </>
  );
});
