import { useState } from 'react';
import { useMutation } from '@apollo/client';
import * as PortOne from '@portone/browser-sdk/v2';
import { CREATE_POINT_TRANSACTION_OF_LOADING } from '../graphql/mutations';

export const usePointCharge = (onChargeComplete?: () => void) => {
  const [isChargeModalOpen, setIsChargeModalOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<string>('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [createPointTransaction] = useMutation(CREATE_POINT_TRANSACTION_OF_LOADING);

  const chargeAmounts = ['1,000', '2,000', '5,000', '10,000', '50,000'];

  const handleChargeConfirm = async () => {
    if (!selectedAmount) {
      alert('충전할 금액을 선택해 주세요.');
      return;
    }

    // 로그인 체크
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('accessToken');
      console.log('💳 결제 시작 - 토큰 확인:', accessToken ? '있음' : '없음');

      if (!accessToken) {
        alert('로그인이 필요한 서비스입니다.');
        window.location.href = '/login';
        return;
      }
    }

    try {
      // 포트원 결제 요청
      const paymentId = `payment-${crypto.randomUUID()}`;
      const storeId = process.env.NEXT_PUBLIC_PORTONE_STORE_ID!;
      const channelKey = process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY!;

      console.log('🏪 PortOne 설정:');
      console.log('  - storeId:', storeId);
      console.log('  - channelKey:', channelKey);
      console.log('  - paymentId:', paymentId);
      console.log('  - amount:', Number(selectedAmount.replace(/,/g, '')));

      const response = await PortOne.requestPayment({
        storeId,
        channelKey,
        paymentId,
        orderName: `포인트 충전 ${selectedAmount}원`,
        totalAmount: Number(selectedAmount.replace(/,/g, '')),
        currency: 'CURRENCY_KRW',
        payMethod: 'EASY_PAY',
      });

      // 결제 성공 처리
      if (response?.code != null) {
        // 결제 실패
        alert(`결제 실패: ${response.message}`);
        return;
      }

      // 결제 성공 - 포인트 충전 뮤테이션 호출
      console.log('✅ 포트원 결제 성공 - 전체 응답:', JSON.stringify(response, null, 2));
      console.log('📦 paymentId:', response?.paymentId);
      console.log('📦 txId:', response?.txId);
      console.log('📦 transactionType:', response?.transactionType);
      console.log('🔄 백엔드 포인트 충전 요청 시작...');

      // 재시도 로직 (최대 3회, 2초 간격)
      let pointTransaction = null;
      let lastError = null;
      const maxRetries = 3;
      const retryDelay = 2000; // 2초

      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`🔄 시도 ${attempt}/${maxRetries}...`);

          const result = await createPointTransaction({
            variables: {
              paymentId: response?.paymentId || paymentId,
            },
          });

          pointTransaction = result.data?.createPointTransactionOfLoading;
          console.log('✅ 포인트 충전 완료:', pointTransaction);
          break; // 성공하면 루프 종료
        } catch (err) {
          lastError = err;
          console.warn(`⚠️ 시도 ${attempt} 실패:`, err);

          if (attempt < maxRetries) {
            console.log(`⏳ ${retryDelay / 1000}초 후 재시도...`);
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
          }
        }
      }

      // 모든 재시도 실패 시 에러 던지기
      if (!pointTransaction && lastError) {
        throw lastError;
      }

      alert(
        `결제가 완료되었습니다!\n충전된 포인트: ${pointTransaction?.amount}P\n현재 잔액: ${pointTransaction?.balance}P`
      );

      // 모달 닫기
      handleChargeModalClose();

      // 충전 완료 콜백 호출
      if (onChargeComplete) {
        onChargeComplete();
      }

      return pointTransaction;
    } catch (error) {
      console.error('❌ 결제 에러:', error);

      // 에러 타입에 따라 다른 메시지 표시
      if (error instanceof Error) {
        console.error('❌ 에러 메시지:', error.message);
        const errorMessage = error.message.toLowerCase();

        if (errorMessage.includes('401') || errorMessage.includes('unauthorized')) {
          console.error('❌ 401 에러 - 인증 실패');
          alert('로그인 세션이 만료되었습니다. 다시 로그인해 주세요.');
          localStorage.removeItem('accessToken');
          window.location.href = '/login';
        } else if (errorMessage.includes('404') || errorMessage.includes('not found')) {
          console.error('❌ 404 에러 - 결제 정보를 찾을 수 없음');
          alert(
            '결제 정보를 백엔드에서 찾을 수 없습니다.\n' +
            '포트원 결제는 완료되었으나, 백엔드 처리에 실패했습니다.\n' +
            '고객센터에 문의해 주세요.'
          );
        } else {
          console.error('❌ 기타 에러:', errorMessage);
          alert(`결제 처리 중 오류가 발생했습니다.\n에러: ${error.message}`);
        }
      } else {
        console.error('❌ 알 수 없는 에러:', error);
        alert('결제 처리 중 오류가 발생했습니다. 다시 시도해 주세요.');
      }
    }
  };

  const handleChargeModalClose = () => {
    setIsChargeModalOpen(false);
    setSelectedAmount('');
    setIsDropdownOpen(false);
  };

  const handleAmountSelect = (amount: string) => {
    setSelectedAmount(amount);
    setIsDropdownOpen(false);
  };

  const openChargeModal = () => {
    setIsChargeModalOpen(true);
  };

  return {
    // States
    isChargeModalOpen,
    selectedAmount,
    isDropdownOpen,
    chargeAmounts,

    // Actions
    handleChargeConfirm,
    handleChargeModalClose,
    handleAmountSelect,
    setIsDropdownOpen,
    openChargeModal,
  };
};
