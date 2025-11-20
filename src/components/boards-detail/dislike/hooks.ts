'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { DISLIKE_BOARD } from './queries';
import { DislikeProps } from './types';

export default function useDislike({
  boardId,
  initialDislikeCount = 0,
  initialIsDisliked = false,
  onDislikeChange,
}: DislikeProps) {
  const [isDisliked, setIsDisliked] = useState(initialIsDisliked);
  const [dislikeCount, setDislikeCount] = useState(initialDislikeCount);

  const [dislikeBoard] = useMutation(DISLIKE_BOARD);

  const onClickDislike = async () => {
    const prevIsDisliked = isDisliked;
    const prevDislikeCount = dislikeCount;

    try {
      // 낙관적 업데이트: UI 먼저 업데이트
      if (isDisliked) {
        // 싫어요 취소
        setIsDisliked(false);
        setDislikeCount((prev) => prev - 1);
        onDislikeChange?.(false);
      } else {
        // 싫어요 추가
        setIsDisliked(true);
        setDislikeCount((prev) => prev + 1);
        onDislikeChange?.(true); // 좋아요를 해제하도록 알림
      }

      // dislikeBoard 뮤테이션 실행
      await dislikeBoard({ variables: { boardId } });
    } catch (error) {
      // 에러 발생 시 롤백
      setIsDisliked(prevIsDisliked);
      setDislikeCount(prevDislikeCount);
      console.error('Dislike action failed:', error);
    }
  };

  // 외부에서 상태 변경 (좋아요 클릭 시)
  const resetDislike = () => {
    if (isDisliked) {
      setIsDisliked(false);
      setDislikeCount((prev) => prev - 1);
    }
  };

  return {
    isDisliked,
    dislikeCount,
    onClickDislike,
    resetDislike,
  };
}
