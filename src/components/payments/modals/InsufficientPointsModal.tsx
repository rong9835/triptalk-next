'use client';

import { createPortal } from 'react-dom';
import styles from '../../stay-detail/styles.module.css';

interface InsufficientPointsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChargeClick: () => void;
}

export default function InsufficientPointsModal({
  isOpen,
  onClose,
  onChargeClick,
}: InsufficientPointsModalProps) {
  if (!isOpen || typeof window === 'undefined') return null;

  return createPortal(
    <div
      className={styles.modalOverlay}
      onClick={onClose}
    >
      <div
        className={styles.modalContent}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Frame 69 - 타이틀과 설명 영역 */}
        <div className={styles.modalFrame69}>
          {/* 타이틀 */}
          <h3 className={styles.modalTitle}>포인트 부족</h3>

          {/* 디스크립션 */}
          <p className={styles.modalDescription}>
            포인트가 부족합니다.
            <br />
            포인트 충전 후 구매하세요.
          </p>
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
            onClick={onChargeClick}
          >
            충전
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
