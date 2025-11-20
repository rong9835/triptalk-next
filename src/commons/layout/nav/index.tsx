'use client';
import Image from 'next/image';
import styles from './nav.module.css';
import { useAccessTokenStore } from '@/commons/stores/access-token-store';
import { useRouter } from 'next/navigation';
import { gql, useQuery } from '@apollo/client';

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

export default function Nav() {
  const router = useRouter();
  const { accessToken } = useAccessTokenStore();

  const { data: userData } = useQuery(FETCH_USER_LOGGED_IN, {
    skip: !accessToken,
  });

  const onClickLogin = () => {
    router.push('/login');
  };

  const onClickMyPage = () => {
    router.push('/mypage');
  };

  const onClickBoards = () => {
    router.push('/boards');
  };

  const onClickStayList = () => {
    router.push('/stay/list');
  };

  return (
    <div className="container">
      {/* 상단 네비게이션 바 */}
      <div className={styles.navcontainer}>
        <nav className={styles.nav}>
          <div>
            <Image
              src="/icons/logo.svg"
              alt="로고"
              width={50}
              height={50}
            />
          </div>
          <div className={styles.navItem}>
            <div onClick={onClickBoards} style={{ cursor: 'pointer' }}>
              트립토크
            </div>
            <div onClick={onClickStayList} style={{ cursor: 'pointer' }}>
              숙박권구매
            </div>
            <div onClick={onClickMyPage} style={{ cursor: 'pointer' }}>
              마이 페이지
            </div>
          </div>
        </nav>
        <div>
          {' '}
          {accessToken ? (
            <div className={styles.profileContainer}>
              <Image
                src="/icons/person.svg"
                alt="프로필"
                width={40}
                height={40}
              />
              <span>{userData?.fetchUserLoggedIn?.name || '사용자'}</span>
            </div>
          ) : (
            <button onClick={onClickLogin} className={styles.navlogin}>
              로그인
              <Image
                src="/icons/right-arrow.svg"
                width={24}
                height={24}
                alt=""
              ></Image>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
