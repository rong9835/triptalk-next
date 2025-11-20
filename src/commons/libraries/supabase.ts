/**
 * Supabase 클라이언트 설정 파일
 *
 * Supabase란?
 * - Firebase의 오픈소스 대안
 * - PostgreSQL 데이터베이스를 기반으로 한 백엔드 서비스
 * - 실시간 데이터베이스, 인증, 파일 저장소 등을 제공
 *
 * 이 파일의 역할:
 * - Supabase와 연결하기 위한 클라이언트 생성
 * - 환경변수에서 URL과 API 키를 가져와서 설정
 * - 전체 앱에서 사용할 수 있도록 export
 */

// Supabase JavaScript 클라이언트 라이브러리에서 createClient 함수 import
import { createClient } from '@supabase/supabase-js';

/**
 * 환경변수에서 Supabase 연결 정보 가져오기
 *
 * process.env: Node.js에서 환경변수에 접근하는 객체
 * NEXT_PUBLIC_: Next.js에서 클라이언트에서도 접근 가능한 환경변수 접두사
 * ??: Nullish Coalescing 연산자 - 값이 null/undefined일 때 기본값 제공
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''; // Supabase 프로젝트 URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY ?? ''; // Supabase anon public 키

/**
 * Supabase 클라이언트 생성 및 export
 *
 * createClient(url, key): Supabase 클라이언트 인스턴스 생성
 * - url: Supabase 프로젝트의 고유 URL
 * - key: API 접근을 위한 익명 공개 키
 *
 * 이 클라이언트를 통해 다음 작업들을 수행할 수 있음:
 * - 데이터 조회: supabase.from('table').select()
 * - 데이터 삽입: supabase.from('table').insert()
 * - 데이터 수정: supabase.from('table').update()
 * - 데이터 삭제: supabase.from('table').delete()
 */
export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * 영화 데이터 타입 정의 (TypeScript)
 *
 * Supabase의 movies 테이블 구조와 일치하는 인터페이스
 * 이를 통해 TypeScript에서 타입 안전성을 보장할 수 있음
 */
export interface Movie {
  id: number;           // 영화 고유 ID (자동 증가)
  title: string;        // 영화 제목
  director: string;     // 감독명
  rating: number;       // 평점 (1-5)
  content: string;      // 리뷰 내용
  created_at: string;   // 생성 일시 (자동 생성)
}
