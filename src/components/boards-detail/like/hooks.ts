'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LIKE_BOARD } from './queries';
import { LikeProps } from './types';

export default function useLike({
  boardId,
  initialLikeCount = 0,
  initialIsLiked = false,
  onLikeChange,
}: LikeProps) {
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likeCount, setLikeCount] = useState(initialLikeCount);

  const [likeBoard] = useMutation(LIKE_BOARD);

  const onClickLike = async () => {
    const prevIsLiked = isLiked;
    const prevLikeCount = likeCount;

    try {
      // 낙관적 업데이트: UI 먼저 업데이트
      if (isLiked) {
        // 좋아요 취소
        setIsLiked(false);
        setLikeCount((prev) => prev - 1);
        onLikeChange?.(false);
      } else {
        // 좋아요 추가
        setIsLiked(true);
        setLikeCount((prev) => prev + 1);
        onLikeChange?.(true); // 싫어요를 해제하도록 알림
      }

      // likeBoard 뮤테이션 실행
      await likeBoard({ variables: { boardId } });
    } catch (error) {
      // 에러 발생 시 롤백
      setIsLiked(prevIsLiked);
      setLikeCount(prevLikeCount);
      console.error('Like action failed:', error);
    }
  };

  // 외부에서 상태 변경 (싫어요 클릭 시)
  const resetLike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikeCount((prev) => prev - 1);
    }
  };

  return {
    isLiked,
    likeCount,
    onClickLike,
    resetLike,
  };
}
