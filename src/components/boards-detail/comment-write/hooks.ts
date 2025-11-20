/**
 * 📚 댓글 작성/수정용 커스텀 훅 (초보자용 가이드)
 *
 * 🎯 이 훅이 하는 일:
 * → 게시글 하단에 있는 댓글을 작성하거나 기존 댓글을 수정하는 기능
 *
 * 💡 쉬운 비유:
 * - 유튜브 영상 하단의 댓글 작성/수정 기능과 같음
 * - 작성자명, 비밀번호, 내용, 별점을 입력받아서 서버에 저장
 * - 수정할 때는 기존 댓글의 내용과 별점만 변경 가능
 *
 * 🔧 주요 기능:
 * 1️⃣ 새 댓글 작성 (이름, 비밀번호, 내용, 별점)
 * 2️⃣ 기존 댓글 수정 (내용, 별점만 변경)
 * 3️⃣ 입력값 유효성 검증 (빈 칸 확인)
 * 4️⃣ 버튼 활성화/비활성화 관리
 *
 * ⚡ 핵심 개념:
 * - 하나의 훅으로 등록/수정 두 가지 모드 처리
 * - props로 모드 구분 (isEdit = true/false)
 * - 댓글 작성 후 목록 자동 새로고침
 */
import { useMutation } from '@apollo/client'; // GraphQL 뮤테이션 훅
import { useParams } from 'next/navigation'; // Next.js URL 파라미터 훅
import { useState } from 'react'; // React 상태 관리 훅
import {
  FETCH_CREATE_COMMENT, // 댓글 생성 쿼리
  UPDATE_BOARD_COMMENT, // 댓글 수정 쿼리
  FETCH_BOARD_COMMENTS, // 댓글 목록 조회 쿼리 (새로고침용)
} from './queries';

// 댓글 작성/수정을 위한 커스텀 훅
//
// 받는 값:
// - isEdit: true면 수정 모드, false면 등록 모드
// - comment: 수정할 댓글 정보 (수정할 때만 필요)
// - onEditComplete: 수정 끝나면 실행할 함수
//
// 돌려주는 값: 댓글 작성/수정에 필요한 상태와 함수들
interface Comment {
  _id: string;
  writer?: string;
  rating?: number;
  contents?: string;
}

interface UseCommentWriteParams {
  comment?: Comment;
  onEditComplete?: () => void;
}

export default function useCommentWrite({
  comment, // 수정할 댓글 정보
  onEditComplete, // 수정 완료 콜백 함수
}: UseCommentWriteParams = {}) {
  const params = useParams(); // URL에서 boardId 파라미터 추출 (예: /boards/detail/123)

  // === 댓글 입력 필드 상태 관리 ===
  const [name, setName] = useState(''); // 작성자명
  const [password, setPassword] = useState(''); // 비밀번호 (댓글 수정/삭제 시 필요)
  const [contents, setContents] = useState(''); // 댓글 내용
  const [rating, setrating] = useState(1.0); // 별점 (1.0 ~ 5.0)

  // === 모달 창 상태 관리 ===
  const [modalOpen, setModalOpen] = useState(false); // 모달 표시 여부
  const [modalMessage, setModalMessage] = useState(''); // 모달 메시지 내용

  // === GraphQL 뮤테이션 훅들 ===
  const [createBoardComment] = useMutation(FETCH_CREATE_COMMENT); // 댓글 생성용
  const [updateBoardComment] = useMutation(UPDATE_BOARD_COMMENT); // 댓글 수정용
  // === 입력값 유효성 검증 함수 ===
  // 모든 필수 입력 필드가 채워졌는지 확인
  //
  // 검증 항목:
  // 1. 작성자명 (공백 제거 후 빈 문자열인지 확인)
  // 2. 비밀번호 (공백 제거 후 빈 문자열인지 확인)
  // 3. 댓글 내용 (공백 제거 후 빈 문자열인지 확인)
  //
  // 돌려주는 값: true면 입력 OK, false면 입력 문제있음
  const validateInputs = () => {
    console.log('🔍 입력값 검증 시작');

    // 작성자명 검증
    if (!name.trim()) {
      console.log('❌ 작성자명 누락');
      setModalMessage('작성자를 입력해주세요.');
      setModalOpen(true);
      return false;
    }

    // 비밀번호 검증
    if (!password.trim()) {
      console.log('❌ 비밀번호 누락');
      setModalMessage('비밀번호를 입력해주세요.');
      setModalOpen(true);
      return false;
    }

    // 댓글 내용 검증
    if (!contents.trim()) {
      console.log('❌ 댓글 내용 누락');
      setModalMessage('댓글 내용을 입력해주세요.');
      setModalOpen(true);
      return false;
    }

    console.log('✅ 모든 입력값이 유효함');
    return true;
  };

  // === 새 댓글 등록 함수 ===
  // 새로운 댓글을 생성하는 함수 (등록 모드 전용)
  //
  // 동작 과정:
  // 1. 입력값 유효성 검증
  // 2. 서버에 댓글 생성 요청
  // 3. 성공 시 입력 폼 초기화
  // 4. 댓글 목록 자동 새로고침
  const onClickCreate = async () => {
    console.log('📝 새 댓글 등록 시작');

    // 1단계: 입력값 검증
    if (!validateInputs()) {
      console.log('❌ 입력값 검증 실패');
      return; // 검증 실패 시 함수 종료
    }

    try {
      // 2단계: 서버에 댓글 생성 요청
      await createBoardComment({
        variables: {
          createBoardCommentInput: {
            writer: name, // 작성자명
            password: password, // 비밀번호
            contents: contents, // 댓글 내용
            rating: rating, // 별점
          },
          boardId: params.boardId, // 어떤 게시글의 댓글인지
        },
        refetchQueries: [
          {
            // 3단계: 댓글 목록 새로고침 (새 댓글이 바로 화면에 표시됨)
            query: FETCH_BOARD_COMMENTS,
            variables: { boardId: params.boardId, page: 1 },
          },
        ],
      });

      // 4단계: 등록 완료 후 입력 폼 초기화
      console.log('✅ 댓글 등록 성공 - 폼 초기화');
      setName('');
      setPassword('');
      setContents('');
      setrating(1.0);
    } catch (error) {
      // 에러 처리
      console.error('❌ 댓글 등록 실패:', error);
      alert('댓글등록실패');
    }
  };

  // ✏️ 댓글 수정 함수 (수정 전용)
  const onClickUpdate = async () => {
    if (!validateInputs() || !comment) return;

    try {
      console.log('수정 시도:', {
        commentId: comment._id,
        contents,
        rating,
        password: password ? '입력됨' : '없음',
      });

      await updateBoardComment({
        variables: {
          updateBoardCommentInput: {
            contents: contents,
            rating: rating,
          },
          password: password,
          boardCommentId: comment._id,
        },
        // refetchQueries 제거: mutation 응답이 _id를 포함하므로 Apollo가 자동으로 캐시 업데이트
      });

      // 수정 완료 후 수정 모드 종료
      if (onEditComplete) {
        onEditComplete();
      }
    } catch (error) {
      console.error('댓글 수정 에러:', error);
      alert('댓글수정실패');
    }
  };

  // 버튼 비활성화 조건: 이름, 비밀번호, 내용 중 하나라도 비어있으면 비활성화
  const isButtonDisabled = !name.trim() || !password.trim() || !contents.trim();

  //  취소 버튼 클릭 함수
  const onClickCancel = () => {
    if (onEditComplete) {
      onEditComplete(); // 수정 모드 종료
    }
  };

  // === 컴포넌트에서 사용할 상태와 함수들 반환 ===
  return {
    // 입력 필드 상태들
    name, // 작성자명
    password, // 비밀번호
    contents, // 댓글 내용
    rating, // 별점

    // 상태 설정 함수들
    setName, // 작성자명 설정
    setPassword, // 비밀번호 설정
    setContents, // 댓글 내용 설정
    setrating, // 별점 설정

    // 액션 함수들
    onClickCreate, // 🆕 새 댓글 등록 함수
    onClickUpdate, // ✏️ 기존 댓글 수정 함수
    onClickCancel, // ❌ 수정 취소 함수

    // 모달 관련
    modalOpen, // 모달 표시 여부
    setModalOpen, // 모달 설정 함수
    modalMessage, // 모달 메시지

    // UI 상태
    isButtonDisabled, // 버튼 비활성화 여부
  };
}

/**
 * 🎓 시험 대비 핵심 포인트:
 *
 * 📝 댓글 시스템의 핵심 패턴:
 * - 하나의 훅으로 등록/수정 모드 처리 (isEdit props 활용)
 * - 유효성 검증 함수 분리 (validateInputs)
 * - 작업 완료 후 목록 새로고침 (refetchQueries)
 * - 등록 완료 후 폼 초기화
 *
 * ⚠️ 실수하기 쉬운 부분:
 * - trim() 없이 빈 문자열 검증하면 공백만 있어도 통과됨
 * - refetchQueries 없으면 새 댓글이 바로 화면에 안 나타남
 * - 수정 시에는 작성자명 변경 불가 (비밀번호로만 인증)
 * - async/await와 try/catch 패턴 정확히 사용하기
 *
 * 🎯 면접 단골 질문:
 * Q: 댓글 등록 후 왜 폼을 초기화하나요?
 * A: 사용자 경험 향상을 위해 다음 댓글을 바로 작성할 수 있도록
 *
 * Q: refetchQueries는 언제 사용하나요?
 * A: 데이터 변경(생성/수정/삭제) 후 관련된 목록을 최신 상태로 유지할 때
 *
 * Q: validateInputs 함수를 따로 만든 이유는?
 * A: 등록과 수정에서 같은 검증 로직을 재사용하기 위해 (DRY 원칙)
 */
