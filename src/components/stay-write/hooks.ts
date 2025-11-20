'use client';

import {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { gql, ApolloError, useMutation } from '@apollo/client';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

const staySchema = z.object({
  name: z.string().min(2, '상품명은 최소 2자 이상 입력해주세요'),
  remarks: z.string().min(1, '한줄 요약을 입력해주세요'),
  contents: z.string().min(1, '상품 설명을 입력해주세요'),
  price: z
    .string()
    .min(1, '가격을 입력해주세요')
    .refine(
      (val) => !Number.isNaN(Number(val)) && Number(val) > 0,
      '올바른 가격을 입력해주세요'
    ),
  tags: z.string().min(1, '태그를 입력해주세요'),
  zipcode: z.string().min(1, '우편번호를 입력해주세요'),
  address: z.string().min(1, '주소를 입력해주세요'),
  addressDetail: z.string().optional(),
  lat: z.string().min(1, '위도 정보가 필요합니다'),
  lng: z.string().min(1, '경도 정보가 필요합니다'),
  images: z.string().optional(),
});

type StayFormValues = z.infer<typeof staySchema>;

const CREATE_TRAVEL_PRODUCT = gql`
  mutation createTravelproduct(
    $createTravelproductInput: CreateTravelproductInput!
  ) {
    createTravelproduct(createTravelproductInput: $createTravelproductInput) {
      _id
      name
      remarks
      contents
      price
      tags
      images
      travelproductAddress {
        zipcode
        address
        addressDetail
        lat
        lng
      }
    }
  }
`;

const UPLOAD_FILE = gql`
  mutation uploadFile($file: Upload!) {
    uploadFile(file: $file) {
      url
    }
  }
`;

interface CreateTravelproductResult {
  createTravelproduct: {
    _id: string;
  };
}

interface CreateTravelproductVariables {
  createTravelproductInput: {
    name: string;
    remarks: string;
    contents: string;
    price: number;
    tags?: string[];
    images?: string[];
    travelproductAddress: {
      zipcode: string;
      address: string;
      addressDetail?: string | null;
      lat: number;
      lng: number;
    };
  };
}

interface UploadFileResult {
  uploadFile: {
    url: string;
  };
}

interface UploadFileVariables {
  file: File;
}

interface SelectedAddress {
  zipcode: string;
  address: string;
  lat: string;
  lng: string;
}

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    kakao: any;
  }
}

const DEFAULT_SELECTED_ADDRESS: SelectedAddress = {
  zipcode: '',
  address: '',
  lat: '',
  lng: '',
};

export default function useStayForm() {
  const router = useRouter();
  const [uploadedFiles, setUploadedFiles] = useState<(string | null)[]>([
    null,
    null,
    null,
  ]);
  const [selectedFiles, setSelectedFiles] = useState<(File | null)[]>([
    null,
    null,
    null,
  ]);
  const [objectUrls, setObjectUrls] = useState<(string | null)[]>([
    null,
    null,
    null,
  ]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<SelectedAddress>(
    DEFAULT_SELECTED_ADDRESS
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mapInstanceRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const markerRef = useRef<any>(null);
  const scriptPromiseRef = useRef<Promise<void> | null>(null);

  const kakaoMapKey = useMemo(
    () => process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY,
    []
  );

  const [contentsValue, setContentsValueState] = useState('');

  const { register, handleSubmit, formState, setValue } =
    useForm<StayFormValues>({
      resolver: zodResolver(staySchema),
      mode: 'onChange',
      defaultValues: {
        name: '',
        remarks: '',
        contents: '',
        price: '',
        tags: '',
        zipcode: '',
        address: '',
        addressDetail: '',
        lat: '',
        lng: '',
        images: '',
      },
    });

  // React Quill의 onChange 핸들러
  const setContentsValue = useCallback(
    (value: string) => {
      setContentsValueState(value);
      // HTML 태그를 제거한 순수 텍스트로 validation
      const textContent = value.replace(/<[^>]*>/g, '').trim();
      setValue('contents', textContent, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [setValue]
  );

  const [createTravelproduct] = useMutation<
    CreateTravelproductResult,
    CreateTravelproductVariables
  >(CREATE_TRAVEL_PRODUCT);

  const [uploadFile] = useMutation<UploadFileResult, UploadFileVariables>(
    UPLOAD_FILE
  );

  const loadKakaoMaps = useCallback((): Promise<void> => {
    if (typeof window === 'undefined') {
      return Promise.resolve();
    }

    if (window.kakao && window.kakao.maps) {
      return new Promise((resolve) => {
        window.kakao.maps.load(() => resolve());
      });
    }

    if (scriptPromiseRef.current) {
      return scriptPromiseRef.current;
    }

    scriptPromiseRef.current = new Promise<void>((resolve, reject) => {
      if (!kakaoMapKey) {
        reject(new Error('Kakao map key is missing'));
        return;
      }

      const existingScript = document.getElementById('kakao-map-sdk');

      const handleLoad = () => {
        window.kakao.maps.load(() => resolve());
      };

      if (existingScript) {
        existingScript.addEventListener('load', handleLoad, { once: true });
        existingScript.addEventListener(
          'error',
          () => reject(new Error('Failed to load Kakao map script')),
          { once: true }
        );
        return;
      }

      const script = document.createElement('script');
      script.id = 'kakao-map-sdk';
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapKey}&autoload=false&libraries=services`;
      script.onload = handleLoad;
      script.onerror = () =>
        reject(new Error('Failed to load Kakao map script'));
      document.head.appendChild(script);
    });

    return scriptPromiseRef.current;
  }, [kakaoMapKey]);

  const renderMap = useCallback((latitude: number, longitude: number) => {
    if (typeof window === 'undefined' || !window.kakao?.maps) {
      return;
    }

    const container = document.getElementById('map');
    if (!container) return;

    const position = new window.kakao.maps.LatLng(latitude, longitude);

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new window.kakao.maps.Map(container, {
        center: position,
        level: 3,
      });
    } else {
      mapInstanceRef.current.setCenter(position);
    }

    if (!markerRef.current) {
      markerRef.current = new window.kakao.maps.Marker({
        position,
      });
      markerRef.current.setMap(mapInstanceRef.current);
    } else {
      markerRef.current.setPosition(position);
    }

    setMapLoaded(true);
  }, []);

  const handleAddressSelected = useCallback(
    async (zipcode: string, address: string) => {
      try {
        setMapLoaded(false);
        await loadKakaoMaps();

        const geocoder = new window.kakao.maps.services.Geocoder();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        geocoder.addressSearch(address, (result: any[], status: string) => {
          if (status !== window.kakao.maps.services.Status.OK || !result[0]) {
            alert('주소 좌표를 찾을 수 없습니다');
            return;
          }

          const { x, y } = result[0];
          const nextSelected: SelectedAddress = {
            zipcode,
            address,
            lat: y,
            lng: x,
          };

          setSelectedAddress(nextSelected);
          setValue('zipcode', zipcode, {
            shouldValidate: true,
            shouldDirty: true,
          });
          setValue('address', address, {
            shouldValidate: true,
            shouldDirty: true,
          });
          setValue('lat', y, { shouldValidate: true, shouldDirty: true });
          setValue('lng', x, { shouldValidate: true, shouldDirty: true });

          renderMap(Number(y), Number(x));
        });
      } catch (error) {
        console.error(error);
        alert('지도 로딩 중 오류가 발생했습니다');
      }
    },
    [loadKakaoMaps, renderMap, setValue]
  );

  const onFileUpload0 = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) {
        // 파일 선택 취소 시 기존 object URL 정리
        if (objectUrls[0]) {
          URL.revokeObjectURL(objectUrls[0]);
          const newObjectUrls = [...objectUrls];
          newObjectUrls[0] = null;
          setObjectUrls(newObjectUrls);
        }
        const newFiles = [...uploadedFiles];
        newFiles[0] = null;
        setUploadedFiles(newFiles);
        const newSelectedFiles = [...selectedFiles];
        newSelectedFiles[0] = null;
        setSelectedFiles(newSelectedFiles);
        return;
      }

      // 기존 object URL 정리
      if (objectUrls[0]) {
        URL.revokeObjectURL(objectUrls[0]);
      }

      const previewUrl = URL.createObjectURL(file);
      const newObjectUrls = [...objectUrls];
      newObjectUrls[0] = previewUrl;
      setObjectUrls(newObjectUrls);

      const newFiles = [...uploadedFiles];
      newFiles[0] = previewUrl;
      setUploadedFiles(newFiles);

      const newSelectedFiles = [...selectedFiles];
      newSelectedFiles[0] = file;
      setSelectedFiles(newSelectedFiles);
    },
    [uploadedFiles, selectedFiles, objectUrls]
  );

  const onFileUpload1 = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) {
        if (objectUrls[1]) {
          URL.revokeObjectURL(objectUrls[1]);
          const newObjectUrls = [...objectUrls];
          newObjectUrls[1] = null;
          setObjectUrls(newObjectUrls);
        }
        const newFiles = [...uploadedFiles];
        newFiles[1] = null;
        setUploadedFiles(newFiles);
        const newSelectedFiles = [...selectedFiles];
        newSelectedFiles[1] = null;
        setSelectedFiles(newSelectedFiles);
        return;
      }

      if (objectUrls[1]) {
        URL.revokeObjectURL(objectUrls[1]);
      }

      const previewUrl = URL.createObjectURL(file);
      const newObjectUrls = [...objectUrls];
      newObjectUrls[1] = previewUrl;
      setObjectUrls(newObjectUrls);

      const newFiles = [...uploadedFiles];
      newFiles[1] = previewUrl;
      setUploadedFiles(newFiles);

      const newSelectedFiles = [...selectedFiles];
      newSelectedFiles[1] = file;
      setSelectedFiles(newSelectedFiles);
    },
    [uploadedFiles, selectedFiles, objectUrls]
  );

  const onFileUpload2 = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) {
        if (objectUrls[2]) {
          URL.revokeObjectURL(objectUrls[2]);
          const newObjectUrls = [...objectUrls];
          newObjectUrls[2] = null;
          setObjectUrls(newObjectUrls);
        }
        const newFiles = [...uploadedFiles];
        newFiles[2] = null;
        setUploadedFiles(newFiles);
        const newSelectedFiles = [...selectedFiles];
        newSelectedFiles[2] = null;
        setSelectedFiles(newSelectedFiles);
        return;
      }

      if (objectUrls[2]) {
        URL.revokeObjectURL(objectUrls[2]);
      }

      const previewUrl = URL.createObjectURL(file);
      const newObjectUrls = [...objectUrls];
      newObjectUrls[2] = previewUrl;
      setObjectUrls(newObjectUrls);

      const newFiles = [...uploadedFiles];
      newFiles[2] = previewUrl;
      setUploadedFiles(newFiles);

      const newSelectedFiles = [...selectedFiles];
      newSelectedFiles[2] = file;
      setSelectedFiles(newSelectedFiles);
    },
    [uploadedFiles, selectedFiles, objectUrls]
  );

  const objectUrlsRef = useRef<(string | null)[]>([null, null, null]);
  
  useEffect(() => {
    objectUrlsRef.current = objectUrls;
  }, [objectUrls]);

  useEffect(() => {
    return () => {
      // 컴포넌트 언마운트 시 모든 object URL 정리
      objectUrlsRef.current.forEach((url) => {
        if (url) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, []);

  const onSubmit = useCallback(
    async (formData: StayFormValues) => {
      try {
        const uploadedUrls: string[] = [];

        // 선택된 파일들을 순서대로 업로드
        for (let i = 0; i < selectedFiles.length; i++) {
          const file = selectedFiles[i];
          if (file) {
            const result = await uploadFile({
              variables: { file },
            });
            const imageUrl = result.data?.uploadFile?.url;
            if (imageUrl) {
              uploadedUrls.push(imageUrl);
            }
          }
        }

        const tags = formData.tags
          ? formData.tags
              .split(',')
              .map((tag) => tag.trim())
              .filter((tag) => tag.length > 0)
          : undefined;

        await createTravelproduct({
          variables: {
            createTravelproductInput: {
              name: formData.name,
              remarks: formData.remarks,
              contents: contentsValue || formData.contents, // HTML 내용 저장
              price: Number(formData.price),
              tags,
              images: uploadedUrls.length > 0 ? uploadedUrls : undefined,
              travelproductAddress: {
                zipcode: formData.zipcode,
                address: formData.address,
                addressDetail: formData.addressDetail ?? '',
                lat: Number(formData.lat),
                lng: Number(formData.lng),
              },
            },
          },
        });

        alert('숙박권이 등록되었습니다');
        router.push('/stay/list');
      } catch (error) {
        if (error instanceof ApolloError) {
          const hasAuthError = error.graphQLErrors.some(
            (graphError) =>
              graphError.extensions?.code === 'UNAUTHENTICATED' ||
              graphError.message.toLowerCase().includes('unauthorized')
          );

          if (hasAuthError) {
            alert('로그인이 필요합니다');
            router.push('/login');
            return;
          }

          if (error.networkError) {
            alert('네트워크 오류가 발생했습니다');
            return;
          }

          alert(error.message);
          return;
        }

        alert('알 수 없는 오류가 발생했습니다');
      }
    },
    [createTravelproduct, router, selectedFiles, uploadFile, contentsValue]
  );

  return {
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
    contentsValue,
    setContentsValue,
  };
}
