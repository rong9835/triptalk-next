'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import styles from './styles.module.css';

const SIGNUP_USER = gql`
  mutation createUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      _id
      email
      name
    }
  }
`;

export default function BoardsSignUp() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordConfirmError, setPasswordConfirmError] = useState('');
  const [createUser] = useMutation(SIGNUP_USER);

  const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };
  const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };
  const onChangePasswordConfirm = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordConfirm(event.target.value);
  };

  const onClickSignUp = async () => {
    console.log('회원가입 클릭');

    // 에러 메시지 초기화
    setEmailError('');
    setNameError('');
    setPasswordError('');
    setPasswordConfirmError('');

    // 1. 빈칸확인
    if (!email) {
      setEmailError('이메일을 입력해주세요');
      return;
    }
    if (!name) {
      setNameError('이름을 입력해주세요');
      return;
    }
    if (!password) {
      setPasswordError('비밀번호를 입력해주세요');
      return;
    }
    if (!passwordConfirm) {
      setPasswordConfirmError('비밀번호를 한번 더 입력해주세요');
      return;
    }

    // 2. 비밀번호 일치 확인
    if (password !== passwordConfirm) {
      setPasswordConfirmError('비밀번호가 일치하지 않습니다');
      return;
    }
    // 3. 회원가입 실행
    try {
      await createUser({
        variables: {
          createUserInput: { email, name, password },
        },
      });
      alert('회원가입성공');
      router.push('/boards/login');
    } catch {
      alert('회원가입실패');
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        <div className={styles.formContainer}>
          <h1 className={styles.title}>회원가입</h1>
          <div className={styles.formSection}>
            <p className={styles.subtitle}>
              회원가입을 위해 아래 빈칸을 모두 채워 주세요.
            </p>
            <div className={styles.inputsWrapper}>
              <div className={styles.inputField}>
                <div className={styles.labelWrapper}>
                  <label className={styles.label}>이메일</label>
                  <span className={styles.required}>*</span>
                </div>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="이메일을 입력해 주세요."
                  onChange={onChangeEmail}
                />
                {emailError && (
                  <div className={styles.errorMessage}>{emailError}</div>
                )}
              </div>
              <div className={styles.inputField}>
                <div className={styles.labelWrapper}>
                  <label className={styles.label}>이름</label>
                  <span className={styles.required}>*</span>
                </div>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="이름을 입력해 주세요."
                  onChange={onChangeName}
                />
                {nameError && (
                  <div className={styles.errorMessage}>{nameError}</div>
                )}
              </div>
              <div className={styles.inputField}>
                <div className={styles.labelWrapper}>
                  <label className={styles.label}>비밀번호</label>
                  <span className={styles.required}>*</span>
                </div>
                <input
                  className={styles.input}
                  type="password"
                  placeholder="비밀번호를 이볅해 주세요."
                  onChange={onChangePassword}
                />
                {passwordError && (
                  <div className={styles.errorMessage}>{passwordError}</div>
                )}
              </div>
              <div className={styles.inputField}>
                <div className={styles.labelWrapper}>
                  <label className={styles.label}>비밀번호 확인</label>
                  <span className={styles.required}>*</span>
                </div>
                <input
                  className={styles.input}
                  type="password"
                  placeholder="비밀번호를 한번 더 입력해 주세요."
                  onChange={onChangePasswordConfirm}
                />
                {passwordConfirmError && (
                  <div className={styles.errorMessage}>
                    {passwordConfirmError}
                  </div>
                )}
              </div>
            </div>
          </div>
          <button className={styles.signupButton} onClick={onClickSignUp}>
            회원가입
          </button>
        </div>
      </div>
      <div className={styles.rightSection}>
        <Image
          src="/images/login.png"
          fill
          style={{ objectFit: 'cover' }}
          alt=""
          priority
        />
      </div>
    </div>
  );
}
