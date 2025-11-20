'use client';

import Image from 'next/image';
import styles from './styles.module.css';
import useStayList from './stay-list.hooks';

export default function StayList() {
  const {
    travelproducts,
    featuredProducts,
    cardProducts,
    loading,
    error,
    handleCardClick,
    onClickSellButton,
    getThumbnail,
    formatPrice,
    formatTags,
    ensureAbsoluteImageUrl,
    handleNextSlide,
  } = useStayList();

  return (
    <>
      <div className={styles.container} data-testid="stay-list-container">
        <div className={styles.gap40}></div>

        {/* Header Section */}
        <div className={styles.header}>
          <h2 className={styles.headerTitle}>
            2024 끝여름 낭만있게 마무리 하고 싶다면?
          </h2>

          <div className={styles.accommodationContainer}>
            <div className={styles.accommodationGrid}>
              {featuredProducts.map((accommodation, index) => {
                const thumbnail = getThumbnail(accommodation.images, index);
                return (
                  <div
                    key={accommodation._id}
                    className={styles.accommodationCard}
                    onClick={handleCardClick(accommodation._id)}
                    data-testid="stay-card"
                  >
                    <div className={styles.imageWrapper}>
                      <Image
                        src={thumbnail}
                        alt={accommodation.name}
                        fill
                        className={styles.accommodationImage}
                      />
                      <div className={styles.imageOverlay}></div>

                      {/* Bookmark Button */}
                      <div className={styles.bookmarkButton}>
                        <Image
                          src="/icons/bookmark.svg"
                          alt="bookmark"
                          width={24}
                          height={24}
                        />
                        <span className={styles.bookmarkCount}>
                          {accommodation.pickedCount ?? 0}
                        </span>
                      </div>

                      {/* Content Area */}
                      <div className={styles.contentArea}>
                        <div className={styles.textArea}>
                          <h3 className={styles.accommodationTitle}>
                            {accommodation.name}
                          </h3>
                          <p className={styles.accommodationDescription}>
                            {accommodation.remarks || accommodation.contents}
                          </p>
                        </div>
                        <div className={styles.priceArea}>
                          <span className={styles.price}>
                            {formatPrice(accommodation.price)}
                          </span>
                          {accommodation.price != null && (
                            <span className={styles.currency}>원</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {!loading && !error && featuredProducts.length === 0 && (
                <p className={styles.emptyMessage}>
                  표시할 숙소가 아직 없습니다.
                </p>
              )}
              {loading && (
                <p className={styles.statusMessage}>
                  숙소 정보를 불러오는 중입니다...
                </p>
              )}
              {error && (
                <p className={styles.statusMessage}>
                  숙소 정보를 불러오는 중 오류가 발생했습니다.
                </p>
              )}
            </div>

            {/* Right Page Navigation Button */}
            <button className={styles.navButton} onClick={handleNextSlide}>
              <Image
                src="/icons/chevron-right.svg"
                alt="next"
                width={24}
                height={24}
              />
            </button>
          </div>
        </div>

        <div className={styles.gap64}></div>

        {/* Banner Section */}
        <div className={styles.banner}>
          <div className={styles.bannerImageWrapper}>
            <Image
              src="/images/banner3.png"
              alt="promotional banner"
              fill
              className={styles.bannerImage}
            />
            <div className={styles.bannerGradient}></div>
          </div>
          <div className={styles.bannerContent}>
            <div className={styles.badgeGroup}>
              <div className={styles.badge}>
                <span className={styles.badgeText}>
                  &apos;솔로트립&apos; 독점 숙소
                </span>
              </div>
              <div className={styles.badge}>
                <span className={styles.badgeText}>
                  9.24 얼리버드 오픈 예약
                </span>
              </div>
            </div>
            <h3 className={styles.bannerTitle}>
              천만 관객이 사랑한
              <br />빌 페소 르꼬 전시회 근처 숙소 특가 예약
            </h3>
          </div>
        </div>

        <div className={styles.gap64}></div>

        {/* Header2 Section - 여기에서만 예약할 수 있는 숙소 */}
        <div className={styles.header2}>
          <h2 className={styles.header2Title}>
            여기에서만 예약할 수 있는 숙소
          </h2>
        </div>

        <div className={styles.gap24}></div>

        {/* Nav Section */}
        <div className={styles.nav}>
          <button className={`${styles.tab} ${styles.tabActive}`}>
            예약 가능 숙소
          </button>
          <button className={`${styles.tab} ${styles.tabInactive}`}>
            예약 마감 숙소
          </button>
        </div>

        <div className={styles.gap24}></div>

        {/* Search Bar Section */}
        <div className={styles.searchBar}>
          <div className={styles.searchBarLeft}>
            {/* DatePicker */}
            <div className={styles.datepicker}>
              <Image
                src="/icons/calendar.svg"
                alt="calendar"
                width={24}
                height={24}
                className={styles.datepickerIcon}
              />
              <div className={styles.datepickerText}>
                <div className={styles.dateGroup}>
                  <span>YYYY</span>
                  <span>.</span>
                  <span>MM</span>
                  <span>.</span>
                  <span>DD</span>
                </div>
                <span className={styles.dateSeparator}>-</span>
                <div className={styles.dateGroup}>
                  <span>YYYY</span>
                  <span>.</span>
                  <span>MM</span>
                  <span>.</span>
                  <span>DD</span>
                </div>
              </div>
            </div>

            {/* Search Input */}
            <div className={styles.searchInput}>
              <Image
                src="/icons/search.svg"
                alt="search"
                width={24}
                height={24}
                className={styles.searchIcon}
              />
              <input
                type="text"
                placeholder="제목을 검색해 주세요."
                className={styles.searchInputField}
              />
            </div>

            {/* Search Button */}
            <button className={styles.searchButton}>
              <span className={styles.searchButtonText}>검색</span>
            </button>
          </div>

          {/* Sell Button */}
          <button className={styles.sellButton} onClick={onClickSellButton}>
            <span className={styles.sellButtonText}>숙박권 판매하기</span>
          </button>
        </div>

        <div className={styles.gap24}></div>

        {/* Main Section */}
        <div className={styles.main}>
          {/* Category Filter Section */}
          <div className={styles.categoryFilter}>
            <div className={styles.categoryItem}>
              <Image
                src="/icons/single-person-accommodation.svg"
                alt="1인 전용"
                width={40}
                height={40}
              />
              <span className={styles.categoryText}>1인 전용</span>
            </div>
            <div className={styles.categoryItem}>
              <Image
                src="/icons/apartment.svg"
                alt="아파트"
                width={40}
                height={40}
              />
              <span className={styles.categoryText}>아파트</span>
            </div>
            <div className={styles.categoryItem}>
              <Image src="/icons/hotel.svg" alt="호텔" width={40} height={40} />
              <span className={styles.categoryText}>호텔</span>
            </div>
            <div className={styles.categoryItem}>
              <Image src="/icons/camp.svg" alt="캠핑" width={40} height={40} />
              <span className={styles.categoryText}>캠핑</span>
            </div>
            <div className={styles.categoryItem}>
              <Image
                src="/icons/room-service.svg"
                alt="룸 서비스 가능"
                width={40}
                height={40}
              />
              <span className={styles.categoryText}>룸 서비스 가능</span>
            </div>
            <div className={styles.categoryItem}>
              <Image src="/icons/fire.svg" alt="불멍" width={40} height={40} />
              <span className={styles.categoryText}>불멍</span>
            </div>
            <div className={styles.categoryItem}>
              <Image
                src="/icons/spa.svg"
                alt="반신욕&스파"
                width={40}
                height={40}
              />
              <span className={styles.categoryText}>반신욕&스파</span>
            </div>
            <div className={styles.categoryItem}>
              <Image
                src="/icons/house-on-the-sea.svg"
                alt="바다 위 숙소"
                width={40}
                height={40}
              />
              <span className={styles.categoryText}>바다 위 숙소</span>
            </div>
            <div className={styles.categoryItem}>
              <Image
                src="/icons/planterior.svg"
                alt="플랜테리어"
                width={40}
                height={40}
              />
              <span className={styles.categoryText}>플랜테리어</span>
            </div>
          </div>

          {/* Card Grid Area */}
          <div className={styles.cardArea}>
            {cardProducts.map((product, index) => {
              const thumbnail = getThumbnail(product.images, index);
              const sellerImage =
                ensureAbsoluteImageUrl(product.seller?.picture) ??
                '/icons/person.svg';
              return (
                <div
                  key={product._id}
                  className={styles.accommodationCardMain}
                  onClick={handleCardClick(product._id)}
                  data-testid="stay-card"
                >
                  {/* Image Area */}
                  <div className={styles.cardImageWrapper}>
                    <Image
                      src={thumbnail}
                      alt={product.name}
                      fill
                      className={styles.cardImage}
                    />
                    {/* Bookmark */}
                    <div className={styles.cardBookmark}>
                      <Image
                        src="/icons/bookmark.svg"
                        alt="bookmark"
                        width={24}
                        height={24}
                      />
                      <span className={styles.cardBookmarkCount}>
                        {product.pickedCount ?? 0}
                      </span>
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className={styles.cardContent}>
                    <div className={styles.cardInfo}>
                      <h3 className={styles.cardTitle}>{product.name}</h3>
                      <p className={styles.cardDescription}>
                        {product.contents || product.remarks}
                      </p>
                    </div>

                    {/* Tags and Profile Area */}
                    <div className={styles.cardFooter}>
                      <div className={styles.cardTags}>
                        <span className={styles.cardTag}>
                          {formatTags(product.tags)}
                        </span>
                      </div>

                      <div className={styles.cardBottomRow}>
                        {/* Profile */}
                        <div className={styles.cardProfile}>
                          <div className={styles.cardProfileImage}>
                            <Image
                              src={sellerImage}
                              alt={product.seller?.name ?? '판매자'}
                              fill
                              className={styles.profileImg}
                            />
                          </div>
                          <span className={styles.cardProfileName}>
                            {product.seller?.name ?? '판매자 정보 없음'}
                          </span>
                        </div>

                        {/* Price */}
                        <div className={styles.cardPriceArea}>
                          <span className={styles.cardPrice}>
                            {formatPrice(product.price)}
                          </span>
                          {product.price != null && (
                            <span className={styles.cardCurrency}>원</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {!loading &&
              !error &&
              cardProducts.length === 0 &&
              travelproducts.length > 0 && (
                <p className={styles.emptyMessage}>
                  더 이상 표시할 숙소가 없습니다.
                </p>
              )}
          </div>
        </div>

        <div className={styles.gap40}></div>
      </div>
    </>
  );
}
