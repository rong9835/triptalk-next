'use client';

import Image from 'next/image';
import useLike from './hooks';
import { LikeProps } from './types';
import styles from './Like.module.css';
import { forwardRef, useImperativeHandle } from 'react';

export interface LikeRef {
  resetLike: () => void;
}

const Like = forwardRef<LikeRef, LikeProps>(
  (
    { boardId, initialLikeCount = 0, initialIsLiked = false, onLikeChange },
    ref
  ) => {
    const { isLiked, likeCount, onClickLike, resetLike } = useLike({
      boardId,
      initialLikeCount,
      initialIsLiked,
      onLikeChange,
    });

    useImperativeHandle(ref, () => ({
      resetLike,
    }));

    return (
      <button
        onClick={onClickLike}
        className={`${styles.likeButton} ${isLiked ? styles.liked : ''}`}
        data-testid="like-button"
        aria-label={isLiked ? '좋아요 취소' : '좋아요'}
      >
        <Image
          src="/icons/good.svg"
          alt="thumbs up"
          width={24}
          height={24}
          className={styles.icon}
        />
        <span data-testid="like-count">{likeCount}</span>
      </button>
    );
  }
);

Like.displayName = 'Like';

export default Like;
