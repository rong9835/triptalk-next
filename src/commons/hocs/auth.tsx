import { useRouter } from 'next/navigation';
import { useEffect, ComponentType } from 'react';

export const withAuth = <T extends object>(Component: ComponentType<T>) => {
  const AuthenticatedComponent = (props: T) => {
    const router = useRouter(); // 로그인 안한사람 막는 코드
    useEffect(() => {
      if (!localStorage.getItem('accessToken')) {
        alert('로그인 후 이용 가능합니다!!!');
        router.push('/login');
      }
    }, [router]);
    return <Component {...props} />;
  };
  
  AuthenticatedComponent.displayName = `withAuth(${Component.displayName || Component.name || 'Component'})`;
  
  return AuthenticatedComponent;
};
