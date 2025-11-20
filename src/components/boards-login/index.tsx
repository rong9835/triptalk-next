'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { useAccessTokenStore } from '@/commons/stores/access-token-store';
import styles from './styles.module.css';

const LOGIN_USER = gql`
  mutation loginUser($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      accessToken
    }
  }
`;

export default function BoardsLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginUser] = useMutation(LOGIN_USER);

  const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
    if (emailError) setEmailError('');
  };

  const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
    if (passwordError) setPasswordError('');
  };

  const { setAccessToken } = useAccessTokenStore();

  const onClickLogin = async () => {
    console.log('로그인 클릭');
    // 에러 메시지 초기화
    setEmailError('');
    setPasswordError('');

    // 1. 빈칸확인
    if (!email) {
      setEmailError('이메일을 입력해 주세요');
      return;
    }
    if (!password) {
      setPasswordError('아이디 또는 비밀번호를 확인해 주세요.');
      return;
    }

    // 2.로그인 실행
    try {
      const result = await loginUser({
        variables: { email, password },
      });
      const accessToken = result.data?.loginUser.accessToken;
      console.log(accessToken);

      setAccessToken(accessToken);
      localStorage.setItem('accessToken', accessToken); // 임시사용 나중에 refreshToken으로 대체예정

      router.push('/boards/');
    } catch (error) {
      console.log(error);
      setEmailError('이메일을 입력해 주세요');
      setPasswordError('아이디 또는 비밀번호를 확인해 주세요.');
    }
  };

  const onClickSignUP = () => {
    router.push('/signup');
  };

  return (
    <div className={styles.container}>
      {/* 왼쪽 로그인 영역 */}
      <div className={styles.loginSection}>
        <div className={styles.loginContent}>
          {/* 로고 및 환영 메시지 */}
          <div className={styles.welcomeSection}>
            <div className={styles.logoArea}>
              <Image src="/icons/logo.svg" width={120} height={74.53} alt="logo" />
            </div>
            <h1 className={styles.welcomeTitle}>트립트립에 오신걸 환영합니다.</h1>
          </div>

          {/* 로그인 폼 */}
          <div className={styles.formSection}>
            <p className={styles.formDescription}>트립트립에 로그인 하세요.</p>

            <div className={styles.inputGroup}>
              {/* 이메일 입력 */}
              <div className={styles.inputWrapper}>
                <input
                  type="email"
                  className={`${styles.input} ${emailError ? styles.inputError : ''}`}
                  placeholder="이메일을 입력해 주세요."
                  value={email}
                  onChange={onChangeEmail}
                />
                {emailError && (
                  <span className={styles.errorLabel}>{emailError}</span>
                )}
              </div>

              {/* 비밀번호 입력 */}
              <div className={styles.inputWrapper}>
                <input
                  type="password"
                  className={`${styles.input} ${passwordError ? styles.inputError : ''}`}
                  placeholder="비밀번호를 입력해 주세요."
                  value={password}
                  onChange={onChangePassword}
                />
                {passwordError && (
                  <span className={styles.errorLabel}>{passwordError}</span>
                )}
              </div>
            </div>
          </div>

          {/* 버튼 영역 */}
          <div className={styles.buttonSection}>
            <button
              className={styles.loginButton}
              onClick={onClickLogin}
            >
              로그인
            </button>
            <button
              className={styles.signupButton}
              onClick={onClickSignUP}
            >
              회원가입
            </button>
          </div>
        </div>
      </div>

      {/* 오른쪽 이미지 영역 */}
      <div className={styles.imageSection}>
        <Image
          src="/images/login.png"
          fill
          style={{ objectFit: 'cover' }}
          alt="login background"
          priority
        />
      </div>
    </div>
  );
}
