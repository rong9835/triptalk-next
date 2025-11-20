'use client';
import DaumPostcodeEmbed from 'react-daum-postcode';
import React, { useState } from 'react';
import { Modal } from 'antd';
import styles from './styles.module.css';

interface AddressModalProps {
  onAddressSelected?: (zipcode: string, address: string) => void;
}

export default function AddressModal({ onAddressSelected }: AddressModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const handleComplete = (data: { zonecode: string; address: string }) => {
    console.log(data);

    // 부모에게 주소 데이터 전달
    if (onAddressSelected) {
      onAddressSelected(data.zonecode, data.address);
    }

    setIsModalOpen(false);
  };

  return (
    <>
      <button
        type="button"
        className={styles.searchButton}
        onClick={showModal}
        data-testid="address-search-button"
      >
        우편번호 검색
      </button>
      <Modal
        title=""
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        destroyOnClose
        footer={null}
        data-testid="address-modal"
      >
        <DaumPostcodeEmbed onComplete={handleComplete} />
      </Modal>
    </>
  );
}
