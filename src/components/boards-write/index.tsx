/**
 * 게시글 작성/수정 페이지 컴포넌트
 *
 * 주요 기능:
 * 1. 게시글 등록 - 새로운 게시글을 작성하여 서버에 저장
 * 2. 게시글 수정 - 기존 게시글의 내용을 수정
 * 3. 이미지 업로드 - 최대 3개의 이미지 파일 업로드 (Google Cloud Storage)
 * 4. 주소 검색 - 다음 우편번호 API를 이용한 주소 입력
 * 5. 유튜브 URL 입력 - 동영상 링크 추가
 *
 * 사용 방법:
 * - 등록: <BoardsWrite isEdit={false} />
 * - 수정: <BoardsWrite isEdit={true} />
 */
'use client';

import styles from './BoardsNew.module.css';
import Image from 'next/image';

import useBoardsWrite from './hooks'; // 커스텀 훅 - 비즈니스 로직 분리
import { IBoardsWriteProps } from './types'; // TypeScript 타입 정의
import AddressModal from '../address-modal'; // 주소 검색 모달 컴포넌트
import AllModal from '@/components/all-modal'; // 공통 모달 컴포넌트

export default function BoardsWrite(props: IBoardsWriteProps) {
  // useBoardsWrite 커스텀 훅에서 상태와 함수들을 가져옴
  // 이 훅은 게시글 작성/수정에 필요한 모든 비즈니스 로직을 담당
  const {
    data, // 수정 모드일 때 기존 게시글 데이터 (GraphQL로 조회)
    zipcode, // 우편번호
    address, // 기본 주소 (예: 서울특별시 강남구 테헤란로)
    setZipcode, // 우편번호 설정 함수
    setAddress, // 기본 주소 설정 함수
    setAddressDetail, // 상세 주소 설정 함수
    onClickCreate, // 게시글 등록 버튼 클릭 함수 (유효성 검증 + API 호출)
    onClickUpdate, // 게시글 수정 버튼 클릭 함수 (비밀번호 확인 + API 호출)
    onChangeYoutubeUrl, // 유튜브 URL 입력 필드 변경 함수

    modalOpen, // 모달 창 표시 여부
    modalMessage, // 모달 창에 표시할 메시지
    closeModal, // 모달 창 닫기 함수

    onFileUpload0, // 첫 번째 이미지 업로드 함수 (uploadedFiles[0]에 저장)
    onFileUpload1, // 두 번째 이미지 업로드 함수 (uploadedFiles[1]에 저장)
    onFileUpload2, // 세 번째 이미지 업로드 함수 (uploadedFiles[2]에 저장)
    uploadedFiles, // 업로드된 이미지 파일들의 Google Storage URL 배열
    register,
    handleSubmit,
    formState,
  } = useBoardsWrite(props);

  // JSX 렌더링 부분 - 실제로 화면에 보여지는 UI
  return (
    <div className="container">
      {/* 페이지 제목 */}
      <form
        onSubmit={handleSubmit(props.isEdit ? onClickUpdate : onClickCreate)}
      >
        <h2 className={styles.h2}>
          게시물 {props.isEdit ? '수정' : '등록'}하기
        </h2>
        {/* 작성자와 비밀번호 입력 섹션 */}
        <div className={styles.작성자비밀번호컨테이너}>
          {/* 작성자 입력 필드 */}

          <div className={styles.작성자컨테이너}>
            <div>작성자</div>
            <input
              type="text"
              placeholder="작성자 명을 입력해주세요."
              {...register('writer')}
              disabled={props.isEdit} // 수정 모드에서는 작성자 변경 불가
            ></input>

            {/* 작성자 에러메시지 */}
            <div style={{ color: 'red' }}>
              {formState.errors.writer?.message}
            </div>
          </div>

          {/* 비밀번호 입력 필드 */}
          <div className={styles.비밀번호컨테이너}>
            <div>비밀번호</div>
            <input
              {...register('password')}
              type="password"
              placeholder="비밀번호를 입력해 주세요."
              disabled={props.isEdit} // 수정 모드에서는 비밀번호 입력 불가
            ></input>
            <div style={{ color: 'red' }}>
              {formState.errors.password?.message}
            </div>
            {/* 비밀번호 에러메시지 */}
          </div>
        </div>
        <hr className={styles.hr} /> {/* 구분선 */}
        {/* 제목 입력 섹션 */}
        <div className={styles.제목컨테이너}>
          <div>제목</div>
          <input
            {...register('title')}
            type="text"
            placeholder="제목을 입력해 주세요."
          ></input>
          <div style={{ color: 'red' }}>{formState.errors.title?.message}</div>

          {/* 제목 에러메시지 */}
        </div>
        <hr className={styles.hr} /> {/* 구분선 */}
        {/* 내용 입력 섹션 */}
        <div className={styles.내용컨테이너}>
          <div>내용</div>
          <textarea
            {...register('contents')}
            placeholder="내용을 입력해 주세요."
          ></textarea>
          <div style={{ color: 'red' }}>
            {formState.errors.contents?.message}
          </div>
        </div>
        <div>
          <div className={styles.주소컨테이너}>
            <div>주소</div>

            {/* 우편번호 검색 */}
            <div className={styles.우편번호}>
              <input
                type="text"
                placeholder="01234"
                value={zipcode || data?.fetchBoard.boardAddress?.zipcode || ''}
                readOnly
              ></input>
              <AddressModal
                onAddressSelected={(zipcodeValue, addressValue) => {
                  setZipcode(zipcodeValue);
                  setAddress(addressValue);
                }}
              />
            </div>

            {/* 주소 입력 필드들 */}
            <div className={styles.상세주소컨테이너}>
              <input
                type="text"
                placeholder="주소를 입력해 주세요."
                value={address || data?.fetchBoard.boardAddress?.address || ''}
                readOnly
              ></input>{' '}
              {/* 기본 주소 */}
              <input
                type="text"
                placeholder="상세주소"
                defaultValue={
                  data?.fetchBoard.boardAddress?.addressDetail || ''
                }
                onChange={(e) => setAddressDetail(e.target.value)}
              ></input>{' '}
              {/* 상세 주소 */}
            </div>
          </div>
        </div>
        <hr className={styles.hr} /> {/* 구분선 */}
        {/* 유튜브 링크 입력 섹션 */}
        <div>
          <div className={styles.유튜브컨테이너}>
            <div>유튜브 링크</div>
            <input
              type="text"
              placeholder="링크를 입력해 주세요"
              onChange={onChangeYoutubeUrl} // 유튜브 URL 입력값
              defaultValue={data?.fetchBoard.youtubeUrl ?? ''} // 수정 모드일 때 기존 내용 표시
            ></input>
            {/* 유튜브 URL 입력 */}
          </div>
        </div>
        <hr className={styles.hr} /> {/* 구분선 */}
        <div className={styles.사진첨부컨테이너}>
          <div>사진첨부</div>
          <div className={styles.사진첨부}>
            {/*
            이미지 업로드 섹션 - 총 3개의 이미지를 업로드할 수 있음
            각 버튼은 독립적으로 작동하며, 이미지가 업로드되면 미리보기로 표시
            클릭 시 숨겨진 file input을 트리거하여 파일 선택 창을 열음
          */}
            {/* 첫 번째 이미지 업로드 버튼 */}
            <button
              type="button"
              onClick={() => document.getElementById('file-input-0')?.click()} // 숨겨진 파일 input 클릭
              style={{ position: 'relative', overflow: 'hidden' }} // 이미지가 버튼 영역을 벗어나지 않도록
            >
              {uploadedFiles[0] ? (
                // 이미지가 업로드된 경우: 미리보기 표시
                <img
                  src={`http://storage.googleapis.com/${uploadedFiles[0]}`} // Google Cloud Storage URL
                  alt="업로드된 이미지"
                  style={{
                    position: 'absolute', // 버튼 위에 절대 위치로 배치
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover', // 이미지 비율 유지하면서 영역 채우기
                  }}
                />
              ) : (
                // 이미지가 없는 경우: 업로드 아이콘과 텍스트 표시
                <>
                  <Image
                    src="/icons/add.svg"
                    alt="업로드"
                    width={40}
                    height={40}
                  />
                  <br />
                  클릭해서 사진 업로드
                </>
              )}
              {/* 실제 파일 선택을 담당하는 숨겨진 input */}
              <input
                id="file-input-0"
                type="file"
                accept="image/*" // 이미지 파일만 선택 가능
                onChange={onFileUpload0} // 파일 선택 시 업로드 함수 실행
                style={{ display: 'none' }} // 화면에 보이지 않도록 숨김
              />
            </button>
            {/* 두 번째 이미지 업로드 버튼 (첫 번째와 동일한 구조) */}
            <button
              type="button"
              onClick={() => document.getElementById('file-input-1')?.click()}
              style={{ position: 'relative', overflow: 'hidden' }}
            >
              {uploadedFiles[1] ? (
                <img
                  src={`http://storage.googleapis.com/${uploadedFiles[1]}`}
                  alt="업로드된 이미지"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <>
                  <Image
                    src="/icons/add.svg"
                    alt="업로드"
                    width={40}
                    height={40}
                  />
                  <br />
                  클릭해서 사진 업로드
                </>
              )}
              <input
                id="file-input-1"
                type="file"
                accept="image/*"
                onChange={onFileUpload1}
                style={{ display: 'none' }}
              />
            </button>
            {/* 세 번째 이미지 업로드 버튼 (첫 번째와 동일한 구조) */}
            <button
              type="button"
              onClick={() => document.getElementById('file-input-2')?.click()}
              style={{ position: 'relative', overflow: 'hidden' }}
            >
              {uploadedFiles[2] ? (
                <img
                  src={`http://storage.googleapis.com/${uploadedFiles[2]}`}
                  alt="업로드된 이미지"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <>
                  <Image
                    src="/icons/add.svg"
                    alt="업로드"
                    width={40}
                    height={40}
                  />
                  <br />
                  클릭해서 사진 업로드
                </>
              )}
              <input
                id="file-input-2"
                type="file"
                accept="image/*"
                onChange={onFileUpload2}
                style={{ display: 'none' }}
              />
            </button>
          </div>
        </div>
        {/* 하단 버튼 섹션 */}
        <div className={styles.취소등록버튼}>
          {/* 취소 버튼 */}
          <button type="button" className={styles.취소버튼}>
            취소
          </button>
          {/* 등록/수정 버튼 */}
          {/* 버튼 활성화 상태에 따라 배경색 변경 (활성화: 파란색, 비활성화: 회색) */}
          {/* 수정 모드인지에 따라 다른 함수 실행 */}
          <button
            type="submit"
            disabled={!formState.isValid}
            className={styles.등록하기버튼}
            style={{
              backgroundColor: formState.isValid ? '#2974E5' : '#C7C7C7',
            }}
          >
            {/* 수정 모드인지에 따라 버튼 텍스트 변경 */}
            {props.isEdit ? '수정' : '등록'}하기
          </button>
        </div>
      </form>

      {/*
        공통 모달 컴포넌트 - 성공/실패/경고 메시지 표시
        - open: 모달 표시 여부
        - message: 모달에 표시할 메시지 내용
        - onClose: 모달 닫기 버튼 클릭 시 실행할 함수
      */}
      <AllModal open={modalOpen} message={modalMessage} onClose={closeModal} />
    </div>
  );
}
