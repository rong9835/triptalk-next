'use client'; // 이 컴포넌트를 클라이언트에서 실행하도록 설정
import { withAuth } from '@/commons/hocs/auth';
// 등록페이지 - 새로운 게시글을 작성하는 페이지 컴포넌트
import BoardsWrite from '@/components/boards-write'; // 게시글 작성/수정 공통 컴포넌트

// 게시글 신규 작성 페이지 컴포넌트
export default withAuth(function BoardsEdit() {
  return (
    <div>
      {/* BoardsWrite 컴포넌트를 등록 모드로 사용 */}
      {/* isEdit={false}: 새 글 작성 모드 활성화 */}
      <BoardsWrite isEdit={false} />
    </div>
  );
});
