import z from 'zod';

// 타입 O => 에디터 검사(빨간줄) :컴파일시점
export interface ISchema {
  title: string;
  writer?: string;
  password?: string;
  contents: string;
  youtubeUrl?: string;
  images?: string[];
  boardAddress?: {
    zipcode?: string;
    address?: string;
    addressDetail?: string;
  };
}

// 등록용 schema (모든 필드 필수)
export const createSchema = z.object({
  title: z.string().min(2, { message: '제목은 2자 이상 입력해 주세요' }),
  writer: z.string().min(1, { message: '작성자를 입력해 주세요' }),
  password: z
    .string()
    .min(8, { message: '비밀번호는 최소 8자리 이상 입력해 주세요' })
    .max(16, { message: '비밀번호는 최대 16자리로 입력해 주세요' }),
  contents: z.string().min(1, { message: '내용을 입력해 주세요' }),
  youtubeUrl: z.string().optional(),
  images: z.array(z.string()).optional(),
  boardAddress: z
    .object({
      zipcode: z.string().optional(),
      address: z.string().optional(),
      addressDetail: z.string().optional(),
    })
    .optional(),
});

// 수정용 schema (writer, password는 optional)
export const updateSchema = z.object({
  title: z.string().min(2, { message: '제목은 2자 이상 입력해 주세요' }),
  writer: z.string().optional().or(z.literal('')),
  password: z.string().optional().or(z.literal('')),
  contents: z.string().min(1, { message: '내용을 입력해 주세요' }),
  youtubeUrl: z.string().optional(),
  images: z.array(z.string()).optional(),
  boardAddress: z
    .object({
      zipcode: z.string().optional(),
      address: z.string().optional(),
      addressDetail: z.string().optional(),
    })
    .optional(),
});
