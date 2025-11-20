'use client';

import React from 'react';
import styles from './MyInput.module.css';

interface IProps {
  type: string;
  placeholder?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  value?: string;
  defaultValue?: string;
  readOnly?: boolean;
  className?: string;
}

/**
 * 재사용 가능한 입력창 공통 컴포넌트
 *
 * 사용 예시:
 * <MyInput type="email" placeholder="이메일을 입력해 주세요." onChange={handleEmailChange} />
 * <MyInput type="text" placeholder="제목을 입력해 주세요." className="custom-class" />
 */
export function MyInput(props: IProps) {
  const className = `${styles.input} ${props.className || ''}`.trim();

  return (
    <input
      className={className}
      type={props.type}
      placeholder={props.placeholder}
      onChange={props.onChange}
      disabled={props.disabled}
      value={props.value}
      defaultValue={props.defaultValue}
      readOnly={props.readOnly}
    />
  );
}
