'use client';
import { IBoardsWriteProps } from './types'; // TypeScript 타입 정의
import { useMutation, useQuery } from '@apollo/client'; // GraphQL 훅들
import { useParams, useRouter } from 'next/navigation'; // Next.js 라우팅 훅들
import { useState, useEffect } from 'react'; // React 훅들
import { ChangeEvent } from 'react'; // TypeScript 이벤트 타입
import { zodResolver } from '@hookform/resolvers/zod';

import {
  CreateBoardDocument,
  CreateBoardMutation,
  CreateBoardMutationVariables,
  FetchBoardForEditDocument,
  UpdateBoardDocument,
  UpdateBoardMutation,
  UpdateBoardMutationVariables,
} from '@/commons/graphql/graphql';
import { UPLOAD_FILE } from './queries';
import { useForm } from 'react-hook-form';
import { createSchema, updateSchema, ISchema } from '@/schemas/auth.schema';

export default function useBoardsWrite(props?: IBoardsWriteProps) {
  const router = useRouter(); // 페이지 이동을 위한 Next.js 라우터
  const params = useParams(); // URL에서 boardId 파라미터 추출 (수정 모드에서 사용)
  const { register, handleSubmit, formState, watch, reset } = useForm({
    resolver: zodResolver(props?.isEdit ? updateSchema : createSchema),
    mode: 'onChange',
  });

  // 디버깅
  console.log('📝 폼 값:', watch());
  console.log('✅ 유효성:', formState.isValid);
  console.log('❌ 에러:', formState.errors);

  // === 상태 관리 ===
  const [zipcode, setZipcode] = useState(''); // 우편번호
  const [address, setAddress] = useState(''); // 기본 주소
  const [addressDetail, setAddressDetail] = useState(''); // 상세 주소
  const [youtubeUrl, setyoutubeUrl] = useState(''); // 유튜브 URL
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]); // 업로드된 이미지 URL 배열

  // === 모달 상태 관리 ===
  // 성공/실패/경고 메시지를 사용자에게 알리기 위한 모달 창 상태
  const [modalOpen, setModalOpen] = useState(false); // 모달 창 표시 여부
  const [modalMessage, setModalMessage] = useState(''); // 모달 창에 표시할 메시지 내용

  // === GraphQL API 훅들 ===
  // 게시글 생성을 위한 뮤테이션 훅 (등록 모드에서 사용)
  const [createBoard] = useMutation<
    CreateBoardMutation,
    CreateBoardMutationVariables
  >(CreateBoardDocument);

  // 게시글 수정을 위한 뮤테이션 훅 (수정 모드에서 사용)
  const [updateBoard] = useMutation<
    UpdateBoardMutation,
    UpdateBoardMutationVariables
  >(UpdateBoardDocument);

  // 파일 업로드를 위한 뮤테이션 훅 (이미지를 Google Cloud Storage에 업로드)
  const [uploadFile] = useMutation(UPLOAD_FILE);

  // 수정 모드일 때 기존 게시글 데이터를 가져오는 쿼리 훅
  const boardId = Array.isArray(params.boardId)
    ? params.boardId[0]
    : params.boardId;
  const { data } = useQuery(FetchBoardForEditDocument, {
    variables: { boardId }, // URL에서 가져온 boardId로 게시글 조회
  });

  // === useEffect: 수정 모드 데이터 초기화 ===
  useEffect(() => {
    if (data?.fetchBoard && props?.isEdit) {
      // 이미지 설정
      if (data.fetchBoard.images) {
        setUploadedFiles(data.fetchBoard.images);
      }

      // 폼 값 초기화
      reset({
        writer: data.fetchBoard.writer || '',
        password: '', // 비밀번호는 빈 값
        title: data.fetchBoard.title || '',
        contents: data.fetchBoard.contents || '',
      });
    }
  }, [data, props?.isEdit, reset]);

  // === 게시글 등록 함수 ===
  /**
   * 새 게시글을 서버에 등록하는 함수 (등록 모드에서 사용)
   * GraphQL createBoard 뮤테이션을 호출하여 게시글 데이터를 서버에 저장
   * 성공 시 생성된 게시글의 상세 페이지로 자동 이동
   */

  const onClickSubmit = async (data: ISchema) => {
    try {
      // GraphQL 뮤테이션으로 게시글 생성 요청
      const result = await createBoard({
        variables: {
          createBoardInput: {
            writer: data.writer, // 작성자명
            title: data.title, // 제목
            contents: data.contents, // 내용
            password: data.password, // 비밀번호 (수정/삭제 시 필요)
            boardAddress: {
              zipcode: zipcode, // 우편번호
              address: address, // 기본주소
              addressDetail: addressDetail, // 상세주소
            },
            youtubeUrl: youtubeUrl, // 유튜브 동영상 URL
            images: uploadedFiles, // 업로드된 이미지 URL 배열
          },
        },
      });
      // 생성된 게시글의 상세 페이지로 이동
      router.push(`/boards/detail/${result.data?.createBoard._id}`);
      console.log(result); // 개발용 로그
    } catch {
      // 에러 발생 시 사용자에게 알림
      setModalMessage('에러가 발생하였습니다. 다시 시도해 주세요.');
      setModalOpen(true);
    }
  };

  // === 게시글 수정 함수 ===
  /**
   * 기존 게시글을 수정하는 함수 (수정 모드에서 사용)
   * 1. 사용자에게 비밀번호 입력 요청 (보안 확인)
   * 2. GraphQL updateBoard 뮤테이션으로 게시글 수정
   * 3. 성공 시 수정된 게시글 상세 페이지로 이동
   */
  const onClickUpdate = async (formData: ISchema) => {
    // 비밀번호 확인을 위해 prompt 창으로 입력 받기
    const inputPassword = prompt(
      '글을 입력할때 입력하셨던 비밀번호를 입력해주세요'
    );

    // 비밀번호가 입력되지 않으면 함수 종료
    if (!inputPassword) {
      setModalMessage('글을 입력할때 입력하셨던 비밀번호를 입력해주세요');
      setModalOpen(true);
      return;
    }

    try {
      // 수정할 내용 준비 (react-hook-form 데이터 사용)
      const updateBoardInput: {
        title?: string;
        contents?: string;
        youtubeUrl?: string;
        boardAddress?: {
          zipcode?: string;
          address?: string;
          addressDetail?: string;
        };
        images?: string[];
      } = {
        title: formData.title,
        contents: formData.contents,
        youtubeUrl: youtubeUrl || data?.fetchBoard.youtubeUrl || undefined,
        images: uploadedFiles.filter(
          (file) => file !== undefined && file !== ''
        ),
      };

      // 주소 정보 (기존 데이터 유지)
      if (data?.fetchBoard.boardAddress) {
        updateBoardInput.boardAddress = {
          zipcode: zipcode || data.fetchBoard.boardAddress.zipcode || undefined,
          address: address || data.fetchBoard.boardAddress.address || undefined,
          addressDetail:
            addressDetail ||
            data.fetchBoard.boardAddress.addressDetail ||
            undefined,
        };
      }

      // 수정 요청 데이터 준비
      const updateData = {
        boardId: data?.fetchBoard._id || '',
        password: inputPassword,
        updateBoardInput,
      };

      // GraphQL 뮤테이션으로 게시글 수정 요청
      await updateBoard({
        variables: updateData,
      });

      // 수정된 게시글 상세 페이지로 이동
      const boardId = data?.fetchBoard?._id;
      if (boardId) {
        router.push(`/boards/detail/${boardId}`);
        setModalMessage('수정되었습니다!');
        setModalOpen(true);
      }
    } catch {
      // 비밀번호 불일치 또는 기타 에러 처리
      setModalMessage('비밀번호가 틀렸거나 수정 중 에러가 발생했습니다.');
      setModalOpen(true);
    }
  };

  // 유튜브 URL 입력 시 실행되는 함수
  const onChangeYoutubeUrl = (event: ChangeEvent<HTMLInputElement>) => {
    setyoutubeUrl(event.target.value);
  };

  // 등록하기 버튼 클릭 시 실행되는 함수
  // react-hook-form이 이미 검증했으므로 바로 submit
  const onClickCreate = async (data: ISchema) => {
    await onClickSubmit(data); // 게시글 등록 API 요청
    setModalMessage('게시물이 등록되었습니다!');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  // === 📸 이미지 업로드 함수들 (쉬운 설명) ===
  /**
   * 🎯 첫 번째 이미지 업로드 함수
   *
   * 💡 언제 실행되나?
   * → 사용자가 첫 번째 업로드 버튼을 클릭해서 이미지 파일을 선택했을 때
   *
   * 🔄 함수가 하는 일 (순서대로):
   * 1️⃣ 사용자가 선택한 파일을 가져오기
   * 2️⃣ 파일을 서버(구글 클라우드)에 업로드하기
   * 3️⃣ 업로드 완료 후 받은 URL을 첫 번째 자리(배열[0])에 저장하기
   */
  const onFileUpload0 = async (event: ChangeEvent<HTMLInputElement>) => {
    console.log('📸 첫 번째 이미지 업로드 시작!');

    // 🎯 1단계: 사용자가 선택한 파일 가져오기
    const file = event.target.files?.[0]; // files[0] = 선택한 첫 번째 파일
    if (!file) {
      console.log('❌ 파일이 선택되지 않았습니다');
      return; // 파일이 없으면 함수 끝내기
    }

    console.log('✅ 선택된 파일:', file.name);

    // 🎯 2단계: 파일을 서버에 업로드하기
    const result = await uploadFile({ variables: { file } });
    console.log('📤 업로드 완료! 받은 URL:', result.data?.uploadFile?.url);

    // 🎯 3단계: 업로드된 URL을 첫 번째 자리에 저장하기
    const newFiles = [...uploadedFiles]; // 기존 배열을 복사 (중요!)
    newFiles[0] = result.data?.uploadFile?.url; // 0번 자리에 새 URL 저장
    setUploadedFiles(newFiles); // 화면에 반영

    console.log('💾 저장 완료! 현재 파일 목록:', newFiles);
  };

  /**
   * 🎯 두 번째 이미지 업로드 함수
   * 💡 첫 번째 함수와 똑같은 방식이지만, 배열의 1번 자리에 저장
   */
  const onFileUpload1 = async (event: ChangeEvent<HTMLInputElement>) => {
    console.log('📸 두 번째 이미지 업로드 시작!');

    const file = event.target.files?.[0];
    if (!file) return;

    const result = await uploadFile({ variables: { file } });
    const newFiles = [...uploadedFiles];
    newFiles[1] = result.data?.uploadFile?.url; // ⭐ 1번 자리에 저장 (0번 아님!)
    setUploadedFiles(newFiles);

    console.log('💾 두 번째 이미지 저장 완료!');
  };

  /**
   * 🎯 세 번째 이미지 업로드 함수
   * 💡 첫 번째 함수와 똑같은 방식이지만, 배열의 2번 자리에 저장
   */
  const onFileUpload2 = async (event: ChangeEvent<HTMLInputElement>) => {
    console.log('📸 세 번째 이미지 업로드 시작!');

    const file = event.target.files?.[0];
    if (!file) return;

    const result = await uploadFile({ variables: { file } });
    const newFiles = [...uploadedFiles];
    newFiles[2] = result.data?.uploadFile?.url; // ⭐ 2번 자리에 저장
    setUploadedFiles(newFiles);

    console.log('💾 세 번째 이미지 저장 완료!');
  };

  // 🧠 왜 함수를 3개로 나눴을까?
  // → 각 버튼이 각자의 자리(0번, 1번, 2번)에 저장하기 위해서
  // → 예: [첫번째이미지URL, 두번째이미지URL, 세번째이미지URL]

  // === 컴포넌트에서 사용할 상태와 함수들 반환 ===
  return {
    // 상태 데이터
    data,
    zipcode,
    address,
    addressDetail,
    youtubeUrl,
    uploadedFiles,

    // 상태 설정 함수들
    setZipcode,
    setAddress,
    setAddressDetail,
    setyoutubeUrl,

    // 모달 상태
    modalOpen,
    modalMessage,
    closeModal,

    // react-hook-form
    formState,
    register,
    handleSubmit,

    // 이벤트 핸들러
    onChangeYoutubeUrl,
    onFileUpload0,
    onFileUpload1,
    onFileUpload2,

    // 주요 액션 함수들
    onClickCreate,
    onClickUpdate,
  };
}
