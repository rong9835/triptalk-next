'use client';
import { useState } from 'react';
import styles from './styles.module.css';
import { gql, useQuery } from '@apollo/client';
import UserInfoSection, { type ViewType } from './components/UserInfoSection';
import TabNavigation, { type TabType } from './components/TabNavigation';
import SearchBar from './components/SearchBar';
import MyProductsTable from './components/MyProductsTable';
import BookmarksTable from './components/BookmarksTable';
import PointHistoryView from './components/PointHistoryView';
import PasswordChangeView from './components/PasswordChangeView';

const FETCH_USER_LOGGED_IN = gql`
  query fetchUserLoggedIn {
    fetchUserLoggedIn {
      _id
      email
      name
      picture
      userPoint {
        amount
      }
    }
  }
`;

export default function MyPage() {
  const { data } = useQuery(FETCH_USER_LOGGED_IN);
  const [activeView, setActiveView] = useState<ViewType>('transactions');
  const [activeTab, setActiveTab] = useState<TabType>('my-products');

  const userPoints = data?.fetchUserLoggedIn?.userPoint?.amount ?? 0;
  const userName = data?.fetchUserLoggedIn?.name ?? '사용자';

  // 뷰에 따라 렌더링할 컨텐츠 결정
  const renderContent = () => {
    if (activeView === 'point-history') {
      return <PointHistoryView />;
    }

    if (activeView === 'password-change') {
      return <PasswordChangeView />;
    }

    // 'transactions' 뷰일 때
    return (
      <>
        {/* 탭 네비게이션 */}
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />

        <div className={styles.gapSmall}></div>

        {/* 검색 바 */}
        <SearchBar />

        <div className={styles.gapSmall}></div>

        {/* 탭에 따라 다른 테이블 렌더링 */}
        {activeTab === 'my-products' ? <MyProductsTable /> : <BookmarksTable />}
      </>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.gap}></div>

      <header className={styles.header}>마이 페이지</header>

      <div className={styles.gap}></div>

      {/* 사용자 정보 섹션 */}
      <UserInfoSection
        userName={userName}
        userPoints={userPoints}
        activeView={activeView}
        onViewChange={setActiveView}
      />

      <div className={styles.gap}></div>

      {/* 뷰에 따라 다른 컨텐츠 렌더링 */}
      {renderContent()}

      <div className={styles.gap}></div>
    </div>
  );
}
