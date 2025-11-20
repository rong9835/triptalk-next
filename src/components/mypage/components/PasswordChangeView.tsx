import styles from '../styles.module.css';

export default function PasswordChangeView() {
  return (
    <main className={styles.main}>
      <div className={styles.passwordChangeContainer}>
        <h2 className={styles.passwordChangeTitle}>비밀번호 변경</h2>

        <form className={styles.passwordChangeForm}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>현재 비밀번호</label>
            <input
              type="password"
              className={styles.formInput}
              placeholder="현재 비밀번호를 입력해 주세요"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>새 비밀번호</label>
            <input
              type="password"
              className={styles.formInput}
              placeholder="새 비밀번호를 입력해 주세요"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>새 비밀번호 확인</label>
            <input
              type="password"
              className={styles.formInput}
              placeholder="새 비밀번호를 다시 입력해 주세요"
            />
          </div>

          <button type="submit" className={styles.passwordSubmitButton}>
            비밀번호 변경
          </button>
        </form>
      </div>
    </main>
  );
}
