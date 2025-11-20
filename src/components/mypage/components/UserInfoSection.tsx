import Image from 'next/image';
import styles from '../styles.module.css';

export type ViewType = 'transactions' | 'point-history' | 'password-change';

interface UserInfoSectionProps {
  userName: string;
  userPoints: number;
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export default function UserInfoSection({ userName, userPoints, activeView, onViewChange }: UserInfoSectionProps) {
  return (
    <div className={styles.banner}>
      <div className={styles.bannerTitle}>내 정보</div>

      {/* 프로필 섹션 */}
      <div className={styles.profileSection}>
        <div className={styles.profileImage}></div>
        <span className={styles.profileName}>{userName}</span>
        <Image
          src="/icons/down-arrow.svg"
          alt="dropdown"
          width={24}
          height={24}
          className={styles.dropdownIcon}
        />
      </div>

      <div className={styles.divider}></div>

      {/* 포인트 섹션 */}
      <div className={styles.pointSection}>
        <div className={styles.pointIcon}>P</div>
        <div className={styles.pointValue}>
          <span className={styles.pointAmount}>
            {userPoints.toLocaleString()}
          </span>
          <span className={styles.pointUnit}>P</span>
        </div>
      </div>

      <div className={styles.divider}></div>

      {/* 메뉴 탭 섹션 */}
      <div className={styles.menuTabs}>
        <button
          className={`${styles.menuTab} ${activeView === 'transactions' ? styles.menuTabActive : ''}`}
          onClick={() => onViewChange('transactions')}
        >
          거래내역&북마크
          <Image
            src="/icons/right-arrow.svg"
            alt="arrow"
            width={20}
            height={20}
            className={styles.arrowIcon}
          />
        </button>
        <button
          className={`${styles.menuTab} ${activeView === 'point-history' ? styles.menuTabActive : ''}`}
          onClick={() => onViewChange('point-history')}
        >
          포인트 사용 내역
          <Image
            src="/icons/right-arrow.svg"
            alt="arrow"
            width={20}
            height={20}
            className={styles.arrowIcon}
          />
        </button>
        <button
          className={`${styles.menuTab} ${activeView === 'password-change' ? styles.menuTabActive : ''}`}
          onClick={() => onViewChange('password-change')}
        >
          비밀번호 변경
          <Image
            src="/icons/right-arrow.svg"
            alt="arrow"
            width={20}
            height={20}
            className={styles.arrowIcon}
          />
        </button>
      </div>
    </div>
  );
}
