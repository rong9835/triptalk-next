'use client';

import Image from 'next/image';
import { useMemo, useEffect } from 'react';
import dynamic from 'next/dynamic';
import styles from './styles.module.css';
import AddressModal from '../address-modal';
import useStayForm from './hooks';

// React Quill을 동적으로 import (SSR 방지)
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css';

export default function StayWrite() {
  const {
    register,
    handleSubmit,
    formState,
    onSubmit,
    onFileUpload0,
    onFileUpload1,
    onFileUpload2,
    handleAddressSelected,
    uploadedFiles,
    mapLoaded,
    selectedAddress,
    setContentsValue,
    contentsValue,
  } = useStayForm();

  // React Quill 모듈 설정 - 이미지와 유사한 툴바 구성
  const quillModules = useMemo(
    () => ({
      toolbar: {
        container: [
          ['bold', 'italic', 'underline', 'strike'], // B, I, U, S
          [{ align: [] }], // 정렬 (≡)
          [{ list: 'bullet' }, { list: 'ordered' }], // •, 1.
          ['blockquote'], // 인용구 ("")
          ['link', 'image', 'video'], // 🖼, 🎬, 🔗
          ['clean'], // 정리
        ],
      },
    }),
    []
  );

  const quillFormats = [
    'bold',
    'italic',
    'underline',
    'strike',
    'align',
    'list',
    'bullet',
    'blockquote',
    'link',
    'image',
    'video',
  ];

  const handleCancel = () => {
    window.history.back();
  };

  // Quill 테두리 완전 제거를 위한 동적 스타일
  useEffect(() => {
    const styleId = 'quill-border-remove';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      .${styles.editor} .ql-container.ql-snow,
      .${styles.editor} .ql-toolbar.ql-snow {
        border: none !important;
      }
      .${styles.editor} .ql-container.ql-snow {
        border-top: none !important;
        border-left: none !important;
        border-right: none !important;
        border-bottom: none !important;
      }
      .${styles.editor} .ql-toolbar.ql-snow {
        border-top: none !important;
        border-left: none !important;
        border-right: none !important;
        border-bottom: 1px solid #f2f2f2 !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      const existingStyle = document.getElementById(styleId);
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, [styles.editor]);

  return (
    <>
      <div className={styles.container} data-testid="stay-write-container">
        {/* 헤더 */}
        <h1 className={styles.title}>숙박권 판매하기</h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.formContainer}
        >
          {/* 상품명 입력 */}
          <div className={styles.inputSection}>
            <div className={styles.labelArea}>
              <label className={styles.label}>상품명</label>
              <span className={styles.required}>*</span>
            </div>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                className={styles.input}
                placeholder="상품명을 입력해 주세요."
                {...register('name')}
                data-testid="name-input"
              />
              {formState.errors.name && (
                <div className={styles.errorMessage} data-testid="name-error">
                  {formState.errors.name.message}
                </div>
              )}
            </div>
          </div>

          <hr className={styles.divider} />

          {/* 한줄 요약 입력 */}
          <div className={styles.inputSection}>
            <div className={styles.labelArea}>
              <label className={styles.label}>한줄 요약</label>
              <span className={styles.required}>*</span>
            </div>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                className={styles.input}
                placeholder="상품을 한줄로 요약해 주세요."
                {...register('remarks')}
                data-testid="remarks-input"
              />
              {formState.errors.remarks && (
                <div
                  className={styles.errorMessage}
                  data-testid="remarks-error"
                >
                  {formState.errors.remarks.message}
                </div>
              )}
            </div>
          </div>

          <hr className={styles.divider} />

          {/* 상품 설명 에디터 */}
          <div className={styles.editorSection}>
            <div className={styles.labelArea}>
              <label className={styles.label}>상품 설명</label>
              <span className={styles.required}>*</span>
            </div>
            <div className={styles.editor}>
              <div className={styles.quillWrapper}>
                <ReactQuill
                  theme="snow"
                  value={contentsValue}
                  onChange={setContentsValue}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="내용을 입력해 주세요."
                  className={styles.quillEditor}
                />
              </div>
              {formState.errors.contents && (
                <div
                  className={styles.errorMessage}
                  data-testid="contents-error"
                >
                  {formState.errors.contents.message}
                </div>
              )}
            </div>
          </div>

          <hr className={styles.divider} />

          {/* 판매 가격 입력 */}
          <div className={styles.inputSection}>
            <div className={styles.labelArea}>
              <label className={styles.label}>판매 가격</label>
              <span className={styles.required}>*</span>
            </div>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                className={styles.input}
                placeholder="판매 가격을 입력해 주세요. (원 단위)"
                {...register('price')}
                data-testid="price-input"
              />
              {formState.errors.price && (
                <div className={styles.errorMessage} data-testid="price-error">
                  {formState.errors.price.message}
                </div>
              )}
            </div>
          </div>

          <hr className={styles.divider} />

          {/* 태그 입력 */}
          <div className={styles.inputSection}>
            <div className={styles.labelArea}>
              <label className={styles.label}>태그 입력</label>
            </div>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                className={styles.input}
                placeholder="태그를 입력해 주세요. (쉼표로 구분)"
                {...register('tags')}
                data-testid="tags-input"
              />
              {formState.errors.tags && (
                <div className={styles.errorMessage} data-testid="tags-error">
                  {formState.errors.tags.message}
                </div>
              )}
            </div>
          </div>

          <hr className={styles.divider} />

          {/* 주소 입력 영역 */}
          <div className={styles.addressSection}>
            <div className={styles.addressLeft}>
              {/* Frame 427323310 - 주소 + 상세주소 */}
              <div className={styles.addressTopFrame}>
                {/* 주소 검색 (220 x 80) */}
                <div className={styles.addressInputBlock}>
                  <div className={styles.labelArea}>
                    <label className={styles.label}>주소</label>
                    <span className={styles.required}>*</span>
                  </div>
                  <div className={styles.zipcodeWrapper}>
                    <input
                      type="text"
                      className={styles.zipcodeInput}
                      placeholder="01234"
                      value={selectedAddress.zipcode}
                      readOnly
                      data-testid="zipcode-input"
                    />
                    <AddressModal onAddressSelected={handleAddressSelected} />
                  </div>
                  {formState.errors.zipcode && (
                    <div
                      className={styles.errorMessage}
                      data-testid="zipcode-error"
                    >
                      {formState.errors.zipcode.message}
                    </div>
                  )}
                </div>

                {/* 주소 표시 (396 x 48) */}
                <input
                  type="text"
                  className={styles.addressDetailInput}
                  placeholder="주소를 입력해 주세요."
                  value={selectedAddress.address}
                  readOnly
                  data-testid="address-input"
                />
                {formState.errors.address && (
                  <div
                    className={styles.errorMessage}
                    data-testid="address-error"
                  >
                    {formState.errors.address.message}
                  </div>
                )}

                {/* 상세주소 입력 */}
                <input
                  type="text"
                  className={styles.addressDetailInput}
                  placeholder="상세주소를 입력해 주세요."
                  {...register('addressDetail')}
                  data-testid="address-detail-input"
                />
              </div>

              {/* Frame 427323309 - 위도/경도 */}
              <div className={styles.latLngFrame}>
                {/* 위도 (396 x 80) */}
                <div className={styles.inputSection}>
                  <div className={styles.labelArea}>
                    <label className={styles.label}>위도(LAT)</label>
                  </div>
                  <input
                    type="text"
                    className={styles.latLngInput}
                    placeholder="주소를 먼저 입력해 주세요."
                    value={selectedAddress.lat}
                    disabled
                    data-testid="lat-input"
                  />
                  {formState.errors.lat && (
                    <div
                      className={styles.errorMessage}
                      data-testid="lat-error"
                    >
                      {formState.errors.lat.message}
                    </div>
                  )}
                </div>

                {/* 경도 (396 x 80) */}
                <div className={styles.inputSection}>
                  <div className={styles.labelArea}>
                    <label className={styles.label}>경도(LNG)</label>
                  </div>
                  <input
                    type="text"
                    className={styles.latLngInput}
                    placeholder="주소를 먼저 입력해 주세요."
                    value={selectedAddress.lng}
                    disabled
                    data-testid="lng-input"
                  />
                  {formState.errors.lng && (
                    <div
                      className={styles.errorMessage}
                      data-testid="lng-error"
                    >
                      {formState.errors.lng.message}
                    </div>
                  )}
                </div>
              </div>

              {/* 숨겨진 필드 */}
              <input type="hidden" {...register('zipcode')} />
              <input type="hidden" {...register('address')} />
              <input type="hidden" {...register('lat')} />
              <input type="hidden" {...register('lng')} />
            </div>

            {/* 지도 영역 (844 x 352) */}
            <div className={styles.mapSection}>
              <label className={styles.label}>상세 위치</label>
              <div
                className={`${styles.mapContainer} ${
                  mapLoaded ? styles.loaded : ''
                }`}
                id="map"
                data-testid="map-container"
              >
                {!mapLoaded && (
                  <span className={styles.mapPlaceholder}>
                    주소를 먼저 입력해 주세요.
                  </span>
                )}
              </div>
            </div>
          </div>

          <hr className={styles.divider} />

          {/* 사진 첨부 */}
          <div className={styles.imageSection}>
            <div className={styles.labelArea}>
              <label className={styles.label}>사진 첨부</label>
            </div>
            <div className={styles.imageUploadContainer}>
              {/* 첫 번째 이미지 업로드 버튼 */}
              <button
                type="button"
                className={styles.imageUpload}
                onClick={() => document.getElementById('file-input-0')?.click()}
              >
                {uploadedFiles[0] ? (
                  <Image
                    src={uploadedFiles[0]}
                    alt="업로드된 이미지"
                    className={styles.uploadedImage}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <>
                    <Image
                      src="/icons/add.svg"
                      alt="업로드"
                      width={40}
                      height={40}
                    />
                    <span className={styles.uploadText}>
                      클릭해서 사진 업로드
                    </span>
                  </>
                )}
                <input
                  id="file-input-0"
                  type="file"
                  accept="image/*"
                  onChange={onFileUpload0}
                  style={{ display: 'none' }}
                />
              </button>
              {/* 두 번째 이미지 업로드 버튼 */}
              <button
                type="button"
                className={styles.imageUpload}
                onClick={() => document.getElementById('file-input-1')?.click()}
              >
                {uploadedFiles[1] ? (
                  <Image
                    src={uploadedFiles[1]}
                    alt="업로드된 이미지"
                    className={styles.uploadedImage}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <>
                    <Image
                      src="/icons/add.svg"
                      alt="업로드"
                      width={40}
                      height={40}
                    />
                    <span className={styles.uploadText}>
                      클릭해서 사진 업로드
                    </span>
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
              {/* 세 번째 이미지 업로드 버튼 */}
              <button
                type="button"
                className={styles.imageUpload}
                onClick={() => document.getElementById('file-input-2')?.click()}
              >
                {uploadedFiles[2] ? (
                  <Image
                    src={uploadedFiles[2]}
                    alt="업로드된 이미지"
                    className={styles.uploadedImage}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <>
                    <Image
                      src="/icons/add.svg"
                      alt="업로드"
                      width={40}
                      height={40}
                    />
                    <span className={styles.uploadText}>
                      클릭해서 사진 업로드
                    </span>
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

          {/* 하단 버튼 */}
          <div className={styles.buttonSection}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleCancel}
            >
              취소
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={!formState.isValid}
              style={{
                backgroundColor: formState.isValid ? '#000000' : '#c7c7c7',
                color: formState.isValid ? '#ffffff' : '#e4e4e4',
              }}
              data-testid="submit-button"
            >
              등록하기
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
