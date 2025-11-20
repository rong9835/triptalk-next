import React from 'react';
import { Modal } from 'antd';

interface AllModalProps {
  open: boolean;
  message: string;
  onClose: () => void;
  title?: string;
}

export default function AllModal({ open, message, onClose, title = '알림' }: AllModalProps) {
  return (
    <Modal
      title={title}
      open={open}
      onOk={onClose}
      onCancel={onClose}
      okText="확인"
      cancelButtonProps={{ style: { display: 'none' } }}
    >
      <p>{message}</p>
    </Modal>
  );
}
