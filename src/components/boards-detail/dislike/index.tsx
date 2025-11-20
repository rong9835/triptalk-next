'use client';

import Image from 'next/image';
import useDislike from './hooks';
import { DislikeProps } from './types';
import styles from './Dislike.module.css';
import { forwardRef, useImperativeHandle } from 'react';

export interface DislikeRef {
  resetDislike: () => void;
}

const Dislike = forwardRef<DislikeRef, DislikeProps>(
  (
    {
      boardId,
      initialDislikeCount = 0,
      initialIsDisliked = false,
      onDislikeChange,
    },
    ref
  ) => {
    const { isDisliked, dislikeCount, onClickDislike, resetDislike } =
      useDislike({
        boardId,
        initialDislikeCount,
        initialIsDisliked,
        onDislikeChange,
      });

    useImperativeHandle(ref, () => ({
      resetDislike,
    }));

    return (
      <button
        onClick={onClickDislike}
        className={`${styles.dislikeButton} ${isDisliked ? styles.disliked : ''}`}
        data-testid="dislike-button"
        aria-label={isDisliked ? '싫어요 취소' : '싫어요'}
      >
        <Image
          src="/icons/bad.svg"
          alt="thumbs down"
          width={24}
          height={24}
          className={styles.icon}
        />
        <span data-testid="dislike-count">{dislikeCount}</span>
      </button>
    );
  }
);

Dislike.displayName = 'Dislike';

export default Dislike;
