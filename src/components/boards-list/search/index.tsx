/**
 *  검색 컴포넌트 (Search Component)
 *
 * 📝 주요 개념:
 * 1. Props 전달: 부모에서 자식으로 함수와 데이터 전달
 * 2. Debounce: 연속 입력 방지 기법
 * 3. 상태 끌어올리기: 자식의 상태를 부모로 전달
 * 4. GraphQL refetch: 조건 변경 후 데이터 다시 가져오기
 */
'use client';

//  import 구문 (어떤 라이브러리에서 어떤 기능을 가져오는지)
import { useRouter } from 'next/navigation'; // Next.js 페이지 이동
import { ChangeEvent } from 'react'; // React 이벤트 타입
import _ from 'lodash'; // 유틸리티 라이브러리 (debounce 사용)
import { DatePicker } from 'antd';
import styles from './styles.module.css';

//  interface 정의 (TypeScript 타입 정의)
interface RefetchOptions {
  search?: string;
  page?: number;
  startDate?: string;
  endDate?: string;
}

interface SearchProps {
  refetch: (options: RefetchOptions) => void; // GraphQL 쿼리 다시 실행 함수
  onKeywordChange: (keyword: string) => void; // 검색어를 부모로 전달하는 함수
  onDateChange: (startDate?: string, endDate?: string) => void; // 날짜를 부모로 전달하는 함수
}

//  함수형 컴포넌트 구조
export default function Search({
  refetch,
  onKeywordChange,
  onDateChange,
}: SearchProps) {
  //  useRouter 훅 사용법
  const router = useRouter();

  //  lodash debounce 사용법 (중요!)
  // debounce = 연속된 입력을 방지하는 기법
  // 500ms 동안 추가 입력이 없으면 함수 실행
  const getDebounce = _.debounce((value) => {
    //  GraphQL refetch 사용법
    refetch({
      search: value, // 검색어로 필터링
      page: 1, // 검색 시 첫 페이지로 이동
    });
    //  상태 끌어올리기 (중요!)
    // 자식 컴포넌트의 데이터를 부모로 전달
    onKeywordChange(value);
  }, 500);

  // 이벤트 핸들러 함수
  const onChangeKeyword = (event: ChangeEvent<HTMLInputElement>) => {
    //  debounce 함수 호출
    getDebounce(event.target.value);
  };

  //  페이지 이동 함수
  const onClickEdit = () => {
    router.push('/boards/new'); // 새 게시글 작성 페이지로 이동
  };

  // RangePicker 구조분해 (destructuring)
  const { RangePicker } = DatePicker;

  // RangePicker 이벤트 핸들러
  // 기간 선택 시 실행되는 함수 (시작날짜, 끝날짜 배열로 받음)
  const onDateRangeChange = (_dates: unknown, dateStrings: [string, string]) => {
    console.log('Date strings:', dateStrings); // ["시작날짜", "끝날짜"]

    // 기간 검색을 위한 refetch 호출
    if (dateStrings && dateStrings[0] && dateStrings[1]) {
      refetch({
        startDate: dateStrings[0], // 시작날짜
        endDate: dateStrings[1], // 끝날짜
        page: 1,
      });
      // 상태 끌어올리기 - 날짜를 부모로 전달
      onDateChange(dateStrings[0], dateStrings[1]);
    } else {
      // 날짜를 지웠을 때
      onDateChange(undefined, undefined);
    }
  };

  //  JSX 리턴 및 이벤트 바인딩
  return (
    <div className={styles.wrapper}>
      {/* 페이지 제목 */}
      <h1 className={styles.pageTitle}>트립토크 게시판</h1>

      <div className={styles.searchContainer}>
        <div className={styles.searchArea}>
        {/* RangePicker 컴포넌트 사용법 */}
        <div className={styles.datePickerWrapper}>
          <RangePicker
            onChange={onDateRangeChange} // 기간 선택 시 실행될 함수
            placeholder={['YYYY.MM.DD', 'YYYY.MM.DD']} // 2개 입력칸의 placeholder
            format="YYYY.MM.DD" // 날짜 형식 지정
            showTime={false} // 시간 선택 비활성화
          />
        </div>

        {/*  검색어 입력 input - debounce 적용 */}
        <div className={styles.searchInputWrapper}>
          <input
            type="text" // HTML input 타입 지정
            className={styles.searchInput}
            onChange={onChangeKeyword} // 입력값 변경 시 실행될 함수 (중요!)
            placeholder="제목을 검색해 주세요." // 기본 텍스트
          />
        </div>

        {/* 검색 버튼 */}
        <button className={styles.searchButton}>검색</button>
      </div>

        {/* 버튼 클릭 이벤트 - 페이지 이동 */}
        <button className={styles.registerButton} onClick={onClickEdit}>
          {' '}
          {/* 클릭 시 실행될 함수 */}
          트립토크 등록
        </button>
      </div>
    </div>
  );
}
