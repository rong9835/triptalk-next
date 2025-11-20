'use client';

import { createPortal } from 'react-dom';
import Image from 'next/image';
import styles from '../../stay-detail/styles.module.css';

interface ChargeModalProps {
  isOpen: boolean;
  selectedAmount: string;
  isDropdownOpen: boolean;
  chargeAmounts: string[];
  onClose: () => void;
  onConfirm: () => void;
  onAmountSelect: (amount: string) => void;
  onToggleDropdown: () => void;
}

export default function ChargeModal({
  isOpen,
  selectedAmount,
  isDropdownOpen,
  chargeAmounts,
  onClose,
  onConfirm,
  onAmountSelect,
  onToggleDropdown,
}: ChargeModalProps) {
  if (!isOpen || typeof window === 'undefined') return null;

  return createPortal(
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.chargeModalContent}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Frame 69 - 타이틀과 설명 영역 */}
        <div className={styles.chargeModalFrame}>
          {/* Frame 11998 - 포인트 충전 타이틀 헤더 */}
          <div className={styles.chargeModalHeader}>
            <div className={styles.chargeModalHeaderTitle}>
              포인트 충전
            </div>
          </div>

          {/* 타이틀 */}
          <h3 className={styles.chargeModalTitle}>
            충전하실 금액을 선택해 주세요
          </h3>

          {/* 드롭다운 */}
          <div className={styles.chargeDropdownContainer}>
            <button
              className={styles.chargeDropdownButton}
              onClick={onToggleDropdown}
            >
              <span
                className={
                  selectedAmount
                    ? styles.chargeDropdownSelected
                    : styles.chargeDropdownPlaceholder
                }
              >
                {selectedAmount || '내용입력'}
              </span>
              <Image
                src="/icons/down-arrow.svg"
                alt="드롭다운"
                width={24}
                height={24}
                className={styles.chargeDropdownIcon}
              />
            </button>
            {isDropdownOpen && (
              <div className={styles.chargeDropdownMenu}>
                {chargeAmounts.map((amount) => (
                  <button
                    key={amount}
                    className={styles.chargeDropdownItem}
                    onClick={() => onAmountSelect(amount)}
                  >
                    {amount}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 버튼 영역 */}
        <div className={styles.modalButtonArea}>
          <button
            className={styles.modalCancelButton}
            onClick={onClose}
          >
            취소
          </button>
          <button
            className={styles.modalConfirmButton}
            onClick={onConfirm}
          >
            충전하기
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
