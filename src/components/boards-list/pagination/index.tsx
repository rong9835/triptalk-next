'use client';

import styles from './pagination.module.css';
import Image from 'next/image';
import { usePagination } from './hook';

interface PaginationProps {
  refetch: (options: { page: number }) => void;
  lastPage: number;
}

export default function Pagination(props: PaginationProps) {
  const {
    onClickPrevPage,
    startPage,
    onClickPage,
    currentPage,
    onClickNextPage,
  } = usePagination(props);

  return (
    <div className={styles.paginationContainer}>
      <button className={styles.navButton} onClick={onClickPrevPage}>
        <Image
          src="/icons/chevron-left.svg"
          alt="화살표"
          width={24}
          height={24}
        ></Image>
      </button>
      {new Array(5).fill('철수').map(
        (_, index) =>
          index + startPage <= props.lastPage && (
            <button
              key={index + startPage}
              id={String(index + startPage)}
              onClick={onClickPage}
              className={
                currentPage === index + startPage
                  ? styles.pageButtonActive
                  : styles.pageButton
              }
            >
              {index + startPage}
            </button>
          )
      )}
      <button className={styles.navButton} onClick={onClickNextPage}>
        <Image
          src="/icons/chevron-right.svg"
          alt="화살표"
          width={24}
          height={24}
        ></Image>
      </button>
    </div>
  );
}
