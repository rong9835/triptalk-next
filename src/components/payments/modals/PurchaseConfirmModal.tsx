'use client';

import { createPortal } from 'react-dom';
import styles from '../../stay-detail/styles.module.css';

interface PurchaseConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function PurchaseConfirmModal({
  isOpen,
  onClose,
  onConfirm,
}: PurchaseConfirmModalProps) {
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
          <h3 className={styles.modalTitle}>
            해당 숙박권을 구매 하시겠어요?
          </h3>

          {/* 디스크립션 */}
          <p className={styles.modalDescription}>
            해당 숙박권은 포인트로만 구매 가능합니다.
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
            onClick={onConfirm}
          >
            구매
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
