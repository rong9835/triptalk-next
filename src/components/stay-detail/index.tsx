'use client';

import { useState } from 'react';
import Image from 'next/image';
import { gql, useMutation, useQuery } from '@apollo/client';
import {
  usePointCharge,
  ChargeModal,
  InsufficientPointsModal,
  PurchaseConfirmModal,
} from '../payments';
import { CREATE_POINT_TRANSACTION_OF_BUYING } from '../payments/graphql/mutations';
import useStayDetail from './stay-detail.hooks';
import styles from './styles.module.css';

const FETCH_USER_LOGGED_IN = gql`
  query fetchUserLoggedIn {
    fetchUserLoggedIn {
      _id
      email
      name
      userPoint {
        amount
      }
    }
  }
`;

export default function StayDetail() {
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isInsufficientPointsModalOpen, setIsInsufficientPointsModalOpen] =
    useState(false);

  // 숙소 상세 데이터 및 기능들
  const {
    data: stayData,
    loading,
    currentImageIndex,
    imageCount,
    handlePrevImage,
    handleNextImage,
    handleImageClick,
    handleTogglePick,
    mapLoaded,
  } = useStayDetail();

  // 실제 사용자 포인트 조회
  const { data: userData, refetch } = useQuery(FETCH_USER_LOGGED_IN);
  const userPoints = userData?.fetchUserLoggedIn?.userPoint?.amount ?? 0;

  // 구매 mutation
  const [createPurchase] = useMutation(CREATE_POINT_TRANSACTION_OF_BUYING);

  // 포인트 충전 완료 후 콜백
  const handleChargeComplete = async () => {
    await refetch();
  };

  // 결제 관련 로직 (커스텀 훅)
  const {
    isChargeModalOpen,
    selectedAmount,
    isDropdownOpen,
    chargeAmounts,
    handleChargeConfirm,
    handleChargeModalClose,
    handleAmountSelect,
    setIsDropdownOpen,
    openChargeModal,
  } = usePointCharge(handleChargeComplete);

  const handlePurchaseClick = () => {
    const productPrice = stayData?.fetchTravelproduct?.price || 0;

    // 로그인 확인
    const token = localStorage.getItem('accessToken');
    if (!token) {
      alert('로그인이 필요합니다.');
      return;
    }

    // 이미 판매된 상품인지 확인
    if (stayData?.fetchTravelproduct?.soldAt) {
      alert('이미 판매 완료된 상품입니다.');
      return;
    }

    // 포인트 충분 여부 확인
    if (userPoints < productPrice) {
      setIsInsufficientPointsModalOpen(true);
    } else {
      setIsPurchaseModalOpen(true);
    }
  };

  const handlePurchaseConfirm = async () => {
    try {
      const productId = stayData?.fetchTravelproduct?._id;

      const result = await createPurchase({
        variables: {
          useritemId: productId,
        },
      });

      console.log('Purchase confirmed:', result);

      await refetch();

      alert('구매가 완료되었습니다!');
      setIsPurchaseModalOpen(false);
    } catch (error) {
      console.error('Purchase error:', error);
      alert('구매 처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
    }
  };

  const handleChargePoints = () => {
    setIsInsufficientPointsModalOpen(false);
    openChargeModal();
  };

  // 로딩 상태
  if (loading) {
    return (
      <div className={styles.container} data-testid="stay-detail-loading">
        로딩 중...
      </div>
    );
  }

  const product = stayData?.fetchTravelproduct;
  const images = product?.images || [];
  const currentImage = images[currentImageIndex];

  return (
    <>
      <div className={styles.container} data-testid="stay-detail-container">
        {/* Gap 1280 * 40 */}
        <div className={styles.gap40}></div>

        {/* Header 1280 * 96 */}
        <header className={styles.header} data-testid="stay-header">
          <div className={styles.headerTop}>
            <h1 className={styles.title} data-testid="stay-title">
              {product?.name || '숙박권 명'}
            </h1>
            <div className={styles.iconGroup}>
              <button className={styles.iconButton} aria-label="삭제">
                <Image
                  src="/icons/close.svg"
                  alt="삭제"
                  width={24}
                  height={24}
                />
              </button>
              <button className={styles.iconButton} aria-label="링크">
                <Image
                  src="/icons/link.svg"
                  alt="링크"
                  width={24}
                  height={24}
                />
              </button>
              <button className={styles.iconButton} aria-label="위치">
                <Image
                  src="/icons/location.svg"
                  alt="위치"
                  width={24}
                  height={24}
                />
              </button>
              <button
                className={styles.bookmarkButton}
                aria-label="북마크"
                onClick={handleTogglePick}
                data-testid="pick-button"
              >
                <Image
                  src="/icons/bookmark.svg"
                  alt="북마크"
                  width={24}
                  height={24}
                />
                <span className={styles.bookmarkCount} data-testid="pick-count">
                  {product?.pickedCount || 0}
                </span>
              </button>
            </div>
          </div>
          <p className={styles.subtitle} data-testid="stay-remarks">
            {product?.remarks || '숙소 설명'}
          </p>
          <p className={styles.tags} data-testid="stay-tags">
            {product?.tags?.map((tag: string) => `#${tag}`).join(' ') || ''}
          </p>
        </header>

        {/* Gap 1280 * 24 */}
        <div className={styles.gap24}></div>

        {/* Banner 1280 * 480 */}
        <section className={styles.banner} data-testid="image-slider">
          {/* Main Image 640 * 480 */}
          <div className={styles.bannerMainImage}>
            {currentImage ? (
              <Image
                src={`https://storage.googleapis.com/${currentImage}`}
                alt={`숙소 이미지 ${currentImageIndex + 1}`}
                fill
                style={{ objectFit: 'cover' }}
                priority
                data-testid="main-image"
              />
            ) : (
              <Image
                src="/images/banner1.png"
                alt="기본 이미지"
                fill
                style={{ objectFit: 'cover' }}
                priority
                data-testid="main-image"
              />
            )}
            {/* 이미지 네비게이션 버튼 */}
            {imageCount > 1 && (
              <>
                <button
                  className={styles.prevButton}
                  onClick={handlePrevImage}
                  data-testid="prev-image-button"
                  aria-label="이전 이미지"
                >
                  ‹
                </button>
                <button
                  className={styles.nextButton}
                  onClick={handleNextImage}
                  data-testid="next-image-button"
                  aria-label="다음 이미지"
                >
                  ›
                </button>
                <div
                  className={styles.imageCounter}
                  data-testid="image-counter"
                >
                  {currentImageIndex + 1}/{imageCount}
                </div>
              </>
            )}
          </div>

          {/* Thumbnail Container 180 * 480 */}
          <div className={styles.bannerThumbnailContainer}>
            {images.slice(0, 4).map((image: string, index: number) => (
              <div
                key={index}
                className={`${styles.bannerThumbnail} ${
                  index === currentImageIndex ? styles.activeThumbnail : ''
                }`}
                onClick={() => handleImageClick(index)}
                data-testid={`thumbnail-${index}`}
              >
                <Image
                  src={`https://storage.googleapis.com/${image}`}
                  alt={`숙소 썸네일 ${index + 1}`}
                  fill
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ))}
            {images.length === 0 && (
              <>
                <div className={styles.bannerThumbnail}>
                  <Image
                    src="/images/banner2.png"
                    alt="기본 썸네일 1"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className={styles.bannerThumbnail}>
                  <Image
                    src="/images/banner3.png"
                    alt="기본 썸네일 2"
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </>
            )}
            <div className={styles.bannerGradient}></div>
          </div>

          {/* Purchase Info Section 412 * 356 */}
          <div className={styles.purchaseSection}>
            {/* Price Card */}
            <div className={styles.priceCard}>
              <div className={styles.priceInfo}>
                <div className={styles.priceAmount}>
                  <span className={styles.priceNumber} data-testid="stay-price">
                    {product?.price?.toLocaleString() || '0'}
                  </span>
                  <span className={styles.priceUnit}>원</span>
                </div>
                <div className={styles.priceDescription}>
                  <p className={styles.descriptionText}>
                    숙박권은 트립트립에서 포인트 충전 후 구매하실 수 있습니다.
                  </p>
                  <p className={styles.descriptionTextLight}>
                    상세 설명에 숙박권 사용기한을 꼭 확인해 주세요.
                  </p>
                </div>
              </div>
              <button
                className={styles.purchaseButton}
                onClick={handlePurchaseClick}
                disabled={!!product?.soldAt}
                data-testid="purchase-button"
              >
                {product?.soldAt ? '판매완료' : '구매하기'}
              </button>
            </div>

            {/* Seller Card */}
            <div className={styles.sellerCard}>
              <h3 className={styles.sellerTitle}>판매자</h3>
              <div className={styles.sellerProfile}>
                <div className={styles.profileImage}>
                  {product?.seller?.picture ? (
                    <Image
                      src={`https://storage.googleapis.com/${product.seller.picture}`}
                      alt="판매자 프로필"
                      fill
                      style={{ objectFit: 'cover' }}
                      data-testid="seller-picture"
                    />
                  ) : (
                    <Image
                      src="/images/banner1.png"
                      alt="기본 프로필"
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                  )}
                </div>
                <span className={styles.sellerName} data-testid="seller-name">
                  {product?.seller?.name || '판매자'}
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Gap 1280 * 40 */}
        <div className={styles.gap40}></div>

        {/* Divider */}
        <hr className={styles.divider} />

        {/* Gap 1280 * 40 */}
        <div className={styles.gap40}></div>

        {/* Main 844 * 596 */}
        <main className={styles.main}>
          <h2 className={styles.mainTitle}>상세 설명</h2>
          <p className={styles.mainContent} data-testid="stay-contents">
            {product?.contents || '상세 설명이 없습니다.'}
          </p>
        </main>

        {/* Gap 1280 * 40 */}
        <div className={styles.gap40}></div>

        {/* Divider */}
        <hr className={styles.divider} />

        {/* Gap 1280 * 40 */}
        <div className={styles.gap40}></div>

        {/* Map 844 * 324 */}
        <section className={styles.mapSection}>
          <h2 className={styles.mapTitle}>상세 위치</h2>
          <div className={styles.mapContainer} data-testid="map-container">
            <div
              className={`${styles.mapPlaceholder} ${
                mapLoaded ? styles.loaded : ''
              }`}
              id="stay-detail-map"
              data-testid="map"
            >
              {!mapLoaded && (
                <span className={styles.mapPlaceholderText}>
                  지도를 불러오는 중...
                </span>
              )}
            </div>
            {product?.travelproductAddress && (
              <div className={styles.addressInfo} data-testid="address-info">
                <p>
                  우편번호:{' '}
                  {product.travelproductAddress.zipcode || '정보 없음'}
                </p>
                <p>
                  주소: {product.travelproductAddress.address || '정보 없음'}
                </p>
                <p>
                  상세주소:{' '}
                  {product.travelproductAddress.addressDetail || '정보 없음'}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Gap 1280 * 40 */}
        <div className={styles.gap40}></div>

        {/* Comment 1280 * 316 */}
        <section className={styles.comment}>
          {/* Header with icon and title */}
          <div className={styles.commentHeader}>
            <Image
              src="/icons/chat.svg"
              alt="문의하기"
              width={24}
              height={24}
              className={styles.commentIcon}
            />
            <h2 className={styles.commentTitle}>문의하기</h2>
          </div>

          {/* Comment Input Area */}
          <div className={styles.commentInputSection}>
            <div className={styles.commentInputWrapper}>
              <textarea
                className={styles.commentInput}
                placeholder="문의사항을 입력해 주세요."
                maxLength={100}
              />
              <div className={styles.commentCount}>0/100</div>
            </div>
            <button className={styles.commentSubmitButton}>문의 하기</button>
          </div>

          {/* Empty State */}
          <p className={styles.commentEmptyState}>
            등록된 문의사항이 없습니다.
          </p>
        </section>

        {/* Gap 1280 * 40 */}
        <div className={styles.gap40}></div>
      </div>

      {/* Modals */}
      <PurchaseConfirmModal
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
        onConfirm={handlePurchaseConfirm}
      />

      <InsufficientPointsModal
        isOpen={isInsufficientPointsModalOpen}
        onClose={() => setIsInsufficientPointsModalOpen(false)}
        onChargeClick={handleChargePoints}
      />

      <ChargeModal
        isOpen={isChargeModalOpen}
        selectedAmount={selectedAmount}
        isDropdownOpen={isDropdownOpen}
        chargeAmounts={chargeAmounts}
        onClose={handleChargeModalClose}
        onConfirm={handleChargeConfirm}
        onAmountSelect={handleAmountSelect}
        onToggleDropdown={() => setIsDropdownOpen(!isDropdownOpen)}
      />
    </>
  );
}
