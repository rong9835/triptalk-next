'use client';

import { useState, MouseEvent } from 'react';

interface PaginationProps {
  refetch: (options: { page: number }) => void;
  lastPage: number;
}

export const usePagination = (props: PaginationProps) => {
  const [startPage, setStartPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const onClickPage = (event: MouseEvent<HTMLButtonElement>) => {
    const page = Number(event.currentTarget.id);
    setCurrentPage(page);
    props.refetch({ page });
  };

  const onClickPrevPage = () => {
    if (startPage === 1) return;

    setStartPage(startPage - 5);
    setCurrentPage(startPage - 5);
    props.refetch({ page: startPage - 5 });
  };

  const onClickNextPage = () => {
    if (startPage + 5 <= props.lastPage) {
      setStartPage(startPage + 5);
      setCurrentPage(startPage + 5);
      props.refetch({ page: startPage + 5 });
    }
  };

  return {
    startPage,
    currentPage,
    onClickPage,
    onClickPrevPage,
    onClickNextPage,
  };
};
