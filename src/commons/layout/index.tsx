'use client';

import React from 'react';
import Banner from './banner';
import Nav from './nav';
import { usePathname } from 'next/navigation';

export default function Layout({ children }: { children?: React.ReactNode }) {
  const pathname = usePathname();

  // 헤더와 배너를 완전히 숨길 페이지
  const hideLayout =
    pathname === '/boards/login' || pathname === '/boards/signup';

  // 헤더는 보이지만 배너만 숨길 페이지
  const hideBanner =
    pathname === '/mypage' ||
    pathname === '/boards/new' ||
    pathname === '/stay/write' ||
    pathname === '/stay/list' ||
    pathname?.startsWith('/stay/') ||
    pathname?.includes('/edit');

  const showBanner = !hideBanner && !hideLayout;

  if (hideLayout) {
    return <>{children}</>;
  }

  return (
    <>
      <Nav />
      {showBanner && <Banner />}
      {children}
    </>
  );
}
