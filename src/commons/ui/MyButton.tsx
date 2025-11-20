'use client';

import React from 'react';
import styles from './MyButton.module.css';

type ReactNode = React.ReactNode;

interface IProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'cancel';
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

/**
 * 재사용 가능한 버튼 공통 컴포넌트
 *
 * 사용 예시:
 * <MyButton variant="primary" onClick={handleLogin}>로그인</MyButton>
 * <MyButton variant="secondary" onClick={handleSignup}>회원가입</MyButton>
 * <MyButton variant="primary" type="submit">등록하기</MyButton>
 */
export function MyButton(props: IProps) {
  const variant = props.variant || 'primary';
  const variantClass = styles[variant] || styles.primary;
  const className = `${styles.button} ${variantClass} ${props.className || ''}`.trim();

  return (
    <button
      className={className}
      onClick={props.onClick}
      disabled={props.disabled}
      type={props.type}
    >
      {props.children}
    </button>
  );
}
