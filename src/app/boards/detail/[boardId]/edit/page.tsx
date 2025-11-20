'use client'; // 이 컴포넌트를 클라이언트에서 실행하도록 설정
import { withAuth } from '@/commons/hocs/auth';
// 수정페이지 - 게시글을 수정하는 페이지 컴포넌트
import BoardsWrite from '@/components/boards-write'; // 게시글 작성/수정 공통 컴포넌트

// 게시글 수정 페이지 컴포넌트
export default withAuth(function BoardsEditPage() {
  return (
    <div>
      {/* BoardsWrite 컴포넌트를 수정 모드로 사용 */}
      {/* isEdit={true}: 수정 모드 활성화 */}
      <BoardsWrite isEdit={true} />
    </div>
  );
});
