/**
 * 오늘 핫한 트립토크 컴포넌트
 *
 * 인기 게시글(Best 게시글)을 카드 형식으로 표시하는 컴포넌트
 * - 최대 6개의 인기 게시글을 가로 스크롤 형식으로 표시
 * - 각 카드는 썸네일 이미지, 제목, 작성자, 좋아요 수, 작성일을 포함
 * - 카드 클릭 시 해당 게시글 상세 페이지로 이동
 */

'use client';

import Image from 'next/image';
import styles from './styles.module.css';
import useHotTripTalk from './hot-trip-talk.hooks';

interface HotTripTalkProps {
  limit?: number; // 최대 표시 개수 (기본값: 6)
}

export default function HotTripTalk({ limit = 6 }: HotTripTalkProps) {
  const { boards, loading, error, onClickCard, formatDate, getThumbnailImage, getProfileImage } =
    useHotTripTalk({ limit });

  // 로딩 상태
  if (loading) {
    return (
      <div className={styles.container} data-testid="hot-trip-talk-container">
        <h2 className={styles.title}>오늘 핫한 트립토크</h2>
        <div className={styles.loading} data-testid="loading-state">
          로딩 중...
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className={styles.container} data-testid="hot-trip-talk-container">
        <h2 className={styles.title}>오늘 핫한 트립토크</h2>
        <div className={styles.error} data-testid="error-state">
          게시글을 불러오는 중 오류가 발생했습니다.
        </div>
      </div>
    );
  }

  // 데이터 없음
  if (!boards || boards.length === 0) {
    return (
      <div className={styles.container} data-testid="hot-trip-talk-container">
        <h2 className={styles.title}>오늘 핫한 트립토크</h2>
        <div className={styles.empty} data-testid="empty-state">
          인기 게시글이 없습니다.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container} data-testid="hot-trip-talk-container">
      <h2 className={styles.title}>오늘 핫한 트립토크</h2>
      <div className={styles.cardContainer} data-testid="card-container">
        {boards.map((board) => (
          <div
            key={board._id}
            className={styles.card}
            data-testid={`post-card-${board._id}`}
            onClick={() => onClickCard(board._id)}
          >
            {/* 카드 이미지 */}
            <div className={styles.cardImage}>
              <Image
                src={getThumbnailImage(board)}
                alt={board.title}
                width={112}
                height={152}
                style={{ objectFit: 'cover' }}
                unoptimized
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/images/default-thumbnail.jpg';
                }}
              />
            </div>

            {/* 카드 콘텐츠 */}
            <div className={styles.cardContent}>
              {/* 상단 영역: 제목 + 프로필 */}
              <div className={styles.cardTop}>
                {/* 제목 */}
                <h3
                  className={styles.cardTitle}
                  data-testid={`card-title-${board._id}`}
                >
                  {board.title}
                </h3>

                {/* 프로필 */}
                <div className={styles.profile}>
                  <div className={styles.profileImage}>
                    {getProfileImage(board) ? (
                      <Image
                        src={getProfileImage(board)}
                        alt={board.user?.name || board.writer}
                        width={24}
                        height={24}
                        style={{ objectFit: 'cover' }}
                        unoptimized
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '24px',
                          height: '24px',
                          background: '#e5e5e5',
                        }}
                      />
                    )}
                  </div>
                  <span
                    className={styles.profileName}
                    data-testid={`card-writer-${board._id}`}
                  >
                    {board.user?.name || board.writer}
                  </span>
                </div>
              </div>

              {/* 하단 영역: 좋아요 + 날짜 */}
              <div className={styles.cardBottom}>
                {/* 좋아요 */}
                <div className={styles.likeArea}>
                  <svg
                    className={styles.likeIcon}
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    data-testid={`like-icon-${board._id}`}
                  >
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                  <span
                    className={styles.likeCount}
                    data-testid={`like-count-${board._id}`}
                  >
                    {board.likeCount}
                  </span>
                </div>

                {/* 날짜 */}
                <span
                  className={styles.date}
                  data-testid={`card-date-${board._id}`}
                >
                  {formatDate(board.createdAt)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
