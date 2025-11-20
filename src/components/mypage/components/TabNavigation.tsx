import styles from '../styles.module.css';

export type TabType = 'my-products' | 'bookmarks';

interface TabNavigationProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <nav className={styles.nav}>
      <button
        className={`${styles.navTab} ${activeTab === 'my-products' ? styles.navTabActive : ''}`}
        onClick={() => onTabChange('my-products')}
      >
        나의 상품
      </button>
      <button
        className={`${styles.navTab} ${activeTab === 'bookmarks' ? styles.navTabActive : ''}`}
        onClick={() => onTabChange('bookmarks')}
      >
        북마크
      </button>
    </nav>
  );
}
