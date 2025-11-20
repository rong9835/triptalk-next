/**
 * 📚 게시글 목록 페이지용 커스텀 훅 (초보자용 가이드)
 *
 * 🎯 이 훅이 하는 일:
 * → 게시글 목록에서 제목 클릭, 삭제 버튼 등의 기능을 담당
 *
 * 💡 쉬운 비유:
 * - 유튜브 홈화면에서 영상 목록을 보는 것과 같음
 * - 제목 클릭하면 해당 영상(게시글) 상세보기로 이동
 * - 삭제 버튼 클릭하면 해당 영상(게시글) 삭제
 *
 * 🔧 주요 기능:
 * 1️⃣ 게시글 제목 클릭 → 상세보기 페이지로 이동
 * 2️⃣ 삭제 버튼 클릭 → 게시글 삭제 + 목록 새로고침
 * 3️⃣ 성공/실패 메시지를 모달로 표시
 *
 * ⚡ 핵심 개념:
 * - useMutation = 서버의 데이터를 변경하는 훅 (CREATE, UPDATE, DELETE)
 * - event.stopPropagation = 이벤트 전파 막기 (중요!)
 * - refetchQueries = 삭제 후 목록을 다시 불러오기
 */
import { useMutation } from '@apollo/client'; // GraphQL 훅들
import { useRouter } from 'next/navigation'; // Next.js 라우팅 훅
import { MouseEvent, useState } from 'react'; // React 훅들과 타입
import { FETCH_BOARDS, DELETE_BOARD } from './queries'; // GraphQL 쿼리들

/**
 * 게시글 목록을 위한 커스텀 훅
 * @returns {Object} 클릭 이벤트 함수들과 모달 상태
 */
export default function useBoardsList() {
  // === 모달 창 상태 관리 ===
  const [modalOpen, setModalOpen] = useState(false); // 모달 표시 여부
  const [modalMessage, setModalMessage] = useState(''); // 모달에 표시할 메시지

  // === GraphQL 삭제 뮤테이션 ===
  /**
   * 🎯 useMutation의 특징:
   * - useQuery와 달리 즉시 실행되지 않음
   * - 필요할 때만 호출해서 서버의 데이터를 변경
   * - 삭제, 수정, 생성 등에 사용
   */
  const [deleteBoard] = useMutation(DELETE_BOARD);

  // === 페이지 이동을 위한 라우터 ===
  const router = useRouter();

  // === 게시글 제목 클릭 이벤트 ===
  /**
   * 🎯 제목 클릭 시 상세보기로 이동하는 함수
   *
   * 💡 동작 과정:
   * 1. 사용자가 게시글 제목을 클릭
   * 2. 이 함수가 실행되면서 boardId를 받음
   * 3. 해당 게시글의 상세보기 페이지로 이동
   *
   * @param boardId - 클릭한 게시글의 고유 ID
   */
  const onClickTitle = (boardId: string) => {
    console.log('🔍 클릭한 게시글 ID:', boardId);
    router.push(`/boards/detail/${boardId}`);
    // 예: /boards/detail/123 으로 이동
  };

  // === 게시글 삭제 이벤트 ===
  /**
   * 🎯 삭제 버튼 클릭 시 실행되는 함수
   *
   * 💡 복잡한 이유:
   * - 이벤트 버블링 방지해야 함 (삭제 버튼 클릭 시 제목 클릭도 같이 실행되는 것 방지)
   * - 버튼의 ID에서 게시글 ID를 추출해야 함
   * - 삭제 후 목록을 다시 불러와야 함
   *
   * @param event - 마우스 클릭 이벤트
   */
  const onClickDelete = async (event: MouseEvent<HTMLButtonElement>) => {
    console.log('🗑️ 삭제 버튼 클릭됨');

    // 🎯 1단계: 이벤트 전파 막기 (매우 중요!)
    event.stopPropagation();
    // 이걸 안 하면 삭제 버튼을 눌렀을 때 제목 클릭도 같이 실행됨

    // 🎯 2단계: 버튼에서 게시글 ID 추출하기
    // event.currentTarget = 실제 클릭된 button 요소
    // event.target = button 안의 이미지나 텍스트일 수 있음
    const button = event.currentTarget as HTMLButtonElement;
    const boardId = button.id; // <button id="게시글ID"> 에서 ID 가져오기

    console.log('🔍 삭제할 게시글 ID:', boardId);

    // 🎯 3단계: ID가 없으면 에러 처리
    if (!boardId) {
      setModalMessage('게시글 ID를 찾을 수 없습니다.');
      setModalOpen(true);
      return; // 함수 종료
    }

    try {
      // 🎯 4단계: 서버에 삭제 요청 보내기
      await deleteBoard({
        variables: {
          boardId: boardId, // 삭제할 게시글 ID 전달
        },
        refetchQueries: [{ query: FETCH_BOARDS }], // ⭐ 삭제 후 목록 새로고침 (중요!)
      });

      // 🎯 5단계: 성공 메시지 표시
      setModalMessage('게시글이 삭제되었습니다.');
      setModalOpen(true);
      console.log('✅ 삭제 성공!');
    } catch (error) {
      // 🎯 6단계: 실패 시 에러 처리
      console.error('❌ 삭제 실패:', error);
      setModalMessage('삭제에 실패했습니다.');
      setModalOpen(true);
    }
  };

  /**
   * 🎯 모달 창 닫기 함수
   * 사용자가 모달의 확인 버튼을 누르면 실행됨
   */
  const closeModal = () => {
    console.log('📄 모달 창 닫기');
    setModalOpen(false);
  };

  // === 컴포넌트에서 사용할 함수들과 상태 반환 ===
  return {
    onClickTitle, // 제목 클릭 함수
    onClickDelete, // 삭제 버튼 클릭 함수
    modalOpen, // 모달 표시 여부
    modalMessage, // 모달 메시지 내용
    closeModal, // 모달 닫기 함수
  };
}

/**
 * 🎓 시험 대비 핵심 포인트:
 *
 * 📝 자주 나오는 패턴:
 * - 이벤트 전파 막기: event.stopPropagation()
 * - 버튼 요소 가져오기: event.currentTarget
 * - 삭제 후 새로고침: refetchQueries
 * - 비동기 처리: async/await with try/catch
 *
 * ⚠️ 실수하기 쉬운 부분:
 * - event.target vs event.currentTarget 차이점
 * - stopPropagation() 빼먹으면 이벤트 중복 실행
 * - refetchQueries 없으면 삭제 후 화면에 그대로 남아있음
 * - await 없으면 삭제가 완료되기 전에 다음 코드 실행
 *
 * 🎯 면접 단골 질문:
 * Q: event.stopPropagation()이 왜 필요한가요?
 * A: 이벤트 버블링을 막아서 상위 요소의 이벤트가 중복 실행되는 것을 방지
 *
 * Q: refetchQueries는 왜 사용하나요?
 * A: 삭제 후 목록을 다시 불러와서 화면을 최신 상태로 유지하기 위해
 */
