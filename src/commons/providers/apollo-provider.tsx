'use client';

import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  from,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { createUploadLink } from 'apollo-upload-client';
import { useAccessTokenStore } from '../stores/access-token-store';
import { useEffect, ReactNode } from 'react';

interface ApiHeaderProviderProps {
  children: ReactNode;
}

export default function ApiHeaderProvider(props: ApiHeaderProviderProps) {
  const { setAccessToken } = useAccessTokenStore();
  useEffect(() => {
    const result = localStorage.getItem('accessToken');

    setAccessToken(result ?? '');
  }, [setAccessToken]);

  // 401 에러 처리 링크
  const errorLink = onError(({ graphQLErrors, networkError, operation, response }) => {
    // 요청 정보 로그
    console.log('🌐 GraphQL Operation:', operation.operationName);
    console.log('📤 Variables:', operation.variables);

    if (graphQLErrors) {
      console.log('❌ GraphQL Errors:', graphQLErrors);
      graphQLErrors.forEach(({ message, extensions, path }) => {
        console.error(
          `[GraphQL error]: Message: ${message}, Code: ${extensions?.code}, Path: ${path}`
        );

        // 401 Unauthorized 에러 처리
        if (extensions?.code === 'UNAUTHENTICATED' || message.includes('401')) {
          // 브라우저 환경에서만 실행
          if (typeof window !== 'undefined') {
            // 토큰 제거
            localStorage.removeItem('accessToken');
            setAccessToken('');
            // 로그인 페이지로 리다이렉트
            window.location.href = '/boards/login';
            alert('로그인이 필요합니다.');
          }
        }
      });
    }

    // 네트워크 에러 중 401 처리
    if (networkError) {
      console.error('❌ Network Error:', networkError);
      const statusCode = (networkError as { statusCode?: number }).statusCode;
      console.error('📍 Status Code:', statusCode);

      if (statusCode === 401) {
        // 브라우저 환경에서만 실행
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          setAccessToken('');
          window.location.href = '/boards/login';
          alert('로그인이 필요합니다.');
        }
      }

      // 404 에러 처리 - 인증 문제가 아님
      if (statusCode === 404) {
        console.error('❌ 404 에러 - 리소스를 찾을 수 없음 (인증 문제 아님!)');
      }
    }

    if (response) {
      console.log('📥 Response:', response);
    }
  });

  const uploadLink = createUploadLink({
    uri: 'http://main-practice.codebootcamp.co.kr/graphql',
  });

  // 매 요청마다 최신 토큰을 헤더에 추가
  const authLink = setContext((_, { headers }) => {
    // zustand store에서 최신 토큰 가져오기
    const token = useAccessTokenStore.getState().accessToken;

    // 디버깅용 로그
    if (token) {
      console.log('🔐 Apollo Request - Token:', token.substring(0, 20) + '...');
    } else {
      console.log('⚠️ Apollo Request - No Token');
    }

    return {
      headers: {
        ...headers,
        ...(token ? { Authorization: `bearer ${token}` } : {}),
      },
    };
  });

  const client = new ApolloClient({
    link: from([authLink, errorLink, uploadLink]),
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={client}>{props.children}</ApolloProvider>;
}
