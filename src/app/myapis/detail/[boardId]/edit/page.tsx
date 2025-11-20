//수정페이지
'use client';
import MyApisWrite from '@/components/myapis-write';
import { useParams } from 'next/navigation';

export default function EditPage() {
  const params = useParams();

  return (
    <div>
      <MyApisWrite
        isEdit={true}
        movieId={params.boardId as string}
      />
    </div>
  );
}
