'use client';
//댓글 등록

import styles from './CommentWrite.module.css';
import Image from 'next/image';
import useCommentWrite from './hooks';
import Star from './star';
import AllModal from '../../all-modal';

interface Comment {
  _id: string;
  writer?: string;
  rating?: number;
  contents?: string;
}

interface CommentWriteProps {
  comment?: Comment;
  onEditComplete?: () => void;
}

export default function CommentWrite({
  comment,
  onEditComplete,
}: CommentWriteProps = {}) {
  const isEdit = !!comment;
  const {
    name,
    password,
    contents,
    rating,
    setName,
    setPassword,
    setContents,
    setrating,
    onClickCreate, // 댓글 등록 함수
    onClickUpdate, // 댓글 수정 함수
    onClickCancel, // 취소 함수
    modalOpen,
    setModalOpen,
    modalMessage,
    isButtonDisabled,
  } = useCommentWrite({ comment, onEditComplete });
  return (
    <div className="container">
      <hr />
      <div className={styles.comment}>
        <Image src="/icons/chat.svg" alt="아이콘" width={24} height={24} />
        <div>댓글</div>
      </div>
      <div className={styles.star}>
        <Star rating={rating} onChange={setrating} />
      </div>
      <div className={styles.commentContainer}>
        <div className={styles.commentInput}>
          <div>작성자</div>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="작성자 명을 입력해 주세요"
          />
        </div>
        <div className={styles.commentInput}>
          <div>비밀번호</div>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="비밀번호를 입력해 주세요."
          />
        </div>
      </div>
      <textarea
        value={contents}
        onChange={(e) => setContents(e.target.value)}
        placeholder="댓글을 입력해 주세요."
        className={styles.textInput}
      />
      <div
        style={{
          display: 'flex',
          gap: '8px',
          justifyContent: 'flex-end',
          marginBottom: '20px',
        }}
      >
        {isEdit && (
          <div
            className={`${styles.commentbutton} ${styles.commentbuttonActive}`}
          >
            <button onClick={onClickCancel}>취소</button>
          </div>
        )}
        <div
          className={`${styles.commentbutton} ${
            !isButtonDisabled ? styles.commentbuttonActive : ''
          }`}
        >
          {/* 🎯 삼항연산자로 수정/등록 함수 분기 (이전 방식과 동일!) */}
          <button
            onClick={isEdit ? onClickUpdate : onClickCreate}
            disabled={isButtonDisabled}
          >
            {isEdit ? '댓글 수정' : '댓글 등록'}
          </button>
        </div>
      </div>

      <AllModal
        open={modalOpen}
        message={modalMessage}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
}
