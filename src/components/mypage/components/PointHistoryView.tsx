'use client';
import { useState } from 'react';
import styles from '../styles.module.css';

type PointTab = 'all' | 'charge' | 'purchase' | 'sale';

// 전체 탭 데이터 타입
interface AllHistory {
  id: number;
  date: string;
  type: '충전' | '구매' | '판매';
  amount: number;
  balance: number;
}

// 충전내역 탭 데이터 타입
interface ChargeHistory {
  id: number;
  date: string;
  paymentId: string;
  amount: number;
  balance: number;
}

// 구매내역 탭 데이터 타입
interface PurchaseHistory {
  id: number;
  date: string;
  productName: string;
  amount: number;
  balance: number;
  seller: string;
}

// 판매내역 탭 데이터 타입 (구매와 비슷하게 구성)
interface SaleHistory {
  id: number;
  date: string;
  productName: string;
  amount: number;
  balance: number;
  buyer?: string;
}

// 더미 데이터 - 전체 탭
const allHistoryData: AllHistory[] = [
  { id: 1, date: '2024.12.16', type: '충전', amount: 1000000, balance: 1222000 },
  { id: 2, date: '2024.12.16', type: '구매', amount: -50000, balance: 1222000 },
  { id: 3, date: '2024.12.16', type: '판매', amount: 1000000, balance: 1222000 },
  { id: 4, date: '2024.12.16', type: '충전', amount: 1000000, balance: 1222000 },
  { id: 5, date: '2024.12.16', type: '충전', amount: 1000000, balance: 1222000 },
  { id: 6, date: '2024.12.16', type: '구매', amount: -50000, balance: 1222000 },
  { id: 7, date: '2024.12.16', type: '구매', amount: -50000, balance: 1222000 },
  { id: 8, date: '2024.12.16', type: '판매', amount: 1000000, balance: 1222000 },
  { id: 9, date: '2024.12.16', type: '판매', amount: 1000000, balance: 1222000 },
  { id: 10, date: '2024.12.16', type: '구매', amount: -50000, balance: 1222000 },
];

// 더미 데이터 - 충전내역 탭
const chargeHistoryData: ChargeHistory[] = [
  { id: 1, date: '2024.12.16', paymentId: 'abcd1243', amount: 1000000, balance: 1222000 },
  { id: 2, date: '2024.12.16', paymentId: 'abcd1243', amount: 1000000, balance: 1222000 },
  { id: 3, date: '2024.12.16', paymentId: 'abcd1243', amount: 1000000, balance: 1222000 },
  { id: 4, date: '2024.12.16', paymentId: 'abcd1243', amount: 1000000, balance: 1222000 },
  { id: 5, date: '2024.12.16', paymentId: 'abcd1243', amount: 1000000, balance: 1222000 },
  { id: 6, date: '2024.12.16', paymentId: 'abcd1243', amount: 1000000, balance: 1222000 },
  { id: 7, date: '2024.12.16', paymentId: 'abcd1243', amount: 1000000, balance: 1222000 },
  { id: 8, date: '2024.12.16', paymentId: 'abcd1243', amount: 1000000, balance: 1222000 },
  { id: 9, date: '2024.12.16', paymentId: 'abcd1243', amount: 1000000, balance: 1222000 },
  { id: 10, date: '2024.12.16', paymentId: 'abcd1243', amount: 1000000, balance: 1222000 },
];

// 더미 데이터 - 구매내역 탭
const purchaseHistoryData: PurchaseHistory[] = [
  { id: 1, date: '2024.12.16', productName: '파르나스 호텔 제주', amount: -1000000, balance: 1222000, seller: '홍길동' },
  { id: 2, date: '2024.12.16', productName: '파르나스 호텔 제주', amount: -1000000, balance: 1222000, seller: '홍길동' },
  { id: 3, date: '2024.12.16', productName: '파르나스 호텔 제주', amount: -1000000, balance: 1222000, seller: '홍길동' },
  { id: 4, date: '2024.12.16', productName: '파르나스 호텔 제주', amount: -1000000, balance: 1222000, seller: '홍길동' },
  { id: 5, date: '2024.12.16', productName: '파르나스 호텔 제주', amount: -1000000, balance: 1222000, seller: '홍길동' },
  { id: 6, date: '2024.12.16', productName: '파르나스 호텔 제주', amount: -1000000, balance: 1222000, seller: '홍길동' },
  { id: 7, date: '2024.12.16', productName: '파르나스 호텔 제주', amount: -1000000, balance: 1222000, seller: '홍길동' },
  { id: 8, date: '2024.12.16', productName: '파르나스 호텔 제주', amount: -1000000, balance: 1222000, seller: '홍길동' },
  { id: 9, date: '2024.12.16', productName: '파르나스 호텔 제주', amount: -1000000, balance: 1222000, seller: '홍길동' },
  { id: 10, date: '2024.12.16', productName: '파르나스 호텔 제주', amount: -1000000, balance: 1222000, seller: '홍길동' },
];

// 더미 데이터 - 판매내역 탭
const saleHistoryData: SaleHistory[] = [
  { id: 1, date: '2024.12.16', productName: '파르나스 호텔 제주', amount: 1000000, balance: 1222000 },
  { id: 2, date: '2024.12.16', productName: '파르나스 호텔 제주', amount: 1000000, balance: 1222000 },
  { id: 3, date: '2024.12.16', productName: '파르나스 호텔 제주', amount: 1000000, balance: 1222000 },
  { id: 4, date: '2024.12.16', productName: '파르나스 호텔 제주', amount: 1000000, balance: 1222000 },
  { id: 5, date: '2024.12.16', productName: '파르나스 호텔 제주', amount: 1000000, balance: 1222000 },
  { id: 6, date: '2024.12.16', productName: '파르나스 호텔 제주', amount: 1000000, balance: 1222000 },
  { id: 7, date: '2024.12.16', productName: '파르나스 호텔 제주', amount: 1000000, balance: 1222000 },
  { id: 8, date: '2024.12.16', productName: '파르나스 호텔 제주', amount: 1000000, balance: 1222000 },
  { id: 9, date: '2024.12.16', productName: '파르나스 호텔 제주', amount: 1000000, balance: 1222000 },
  { id: 10, date: '2024.12.16', productName: '파르나스 호텔 제주', amount: 1000000, balance: 1222000 },
];

export default function PointHistoryView() {
  const [activeTab, setActiveTab] = useState<PointTab>('all');

  // 전체 탭 렌더링
  const renderAllTab = () => (
    <main className={styles.main}>
      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <div className={styles.pointHeaderDate}>날짜</div>
          <div className={styles.pointHeaderContent}>내용</div>
          <div className={styles.pointHeaderAmountAll}>거래 및 충전 내역</div>
          <div className={styles.pointHeaderBalance}>잔액</div>
        </div>
        <div className={styles.tableBody}>
          {allHistoryData.map((item) => (
            <div key={item.id} className={styles.tableRow}>
              <div className={styles.pointCellDate}>{item.date}</div>
              <div
                className={`${styles.pointCellType} ${
                  item.type === '충전' || item.type === '판매'
                    ? styles.pointTypePositive
                    : styles.pointTypeNegative
                }`}
              >
                {item.type}
              </div>
              <div
                className={`${styles.pointCellAmountAll} ${
                  item.amount > 0 ? styles.pointAmountPositive : styles.pointAmountNegative
                }`}
              >
                {item.amount > 0 ? '+' : ''}
                {item.amount.toLocaleString()}
              </div>
              <div className={styles.pointCellBalance}>
                {item.balance.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );

  // 충전내역 탭 렌더링
  const renderChargeTab = () => (
    <main className={styles.main}>
      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <div className={styles.pointHeaderDate}>충전일</div>
          <div className={styles.pointHeaderPaymentId}>결제 ID</div>
          <div className={styles.pointHeaderAmountCharge}>충전내역</div>
          <div className={styles.pointHeaderBalance}>거래 후 잔액</div>
        </div>
        <div className={styles.tableBody}>
          {chargeHistoryData.map((item) => (
            <div key={item.id} className={styles.tableRow}>
              <div className={styles.pointCellDate}>{item.date}</div>
              <div className={styles.pointCellPaymentId}>{item.paymentId}</div>
              <div className={`${styles.pointCellAmountCharge} ${styles.pointAmountPositive}`}>
                +{item.amount.toLocaleString()}
              </div>
              <div className={styles.pointCellBalance}>
                {item.balance.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );

  // 구매내역 탭 렌더링
  const renderPurchaseTab = () => (
    <main className={styles.main}>
      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <div className={styles.pointHeaderDate}>거래일</div>
          <div className={styles.pointHeaderProductName}>상품 명</div>
          <div className={styles.pointHeaderAmountPurchase}>거래내역</div>
          <div className={styles.pointHeaderBalance}>거래 후 잔액</div>
          <div className={styles.pointHeaderSeller}>판매자</div>
        </div>
        <div className={styles.tableBody}>
          {purchaseHistoryData.map((item) => (
            <div key={item.id} className={styles.tableRow}>
              <div className={styles.pointCellDate}>{item.date}</div>
              <div className={styles.pointCellProductName}>{item.productName}</div>
              <div className={`${styles.pointCellAmountPurchase} ${styles.pointAmountNegative}`}>
                {item.amount.toLocaleString()}
              </div>
              <div className={styles.pointCellBalance}>
                {item.balance.toLocaleString()}
              </div>
              <div className={styles.pointCellSeller}>{item.seller}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );

  // 판매내역 탭 렌더링
  const renderSaleTab = () => (
    <main className={styles.main}>
      <div className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <div className={styles.pointHeaderDate}>거래일</div>
          <div className={styles.pointHeaderProductNameSale}>상품 명</div>
          <div className={styles.pointHeaderAmountSale}>거래내역</div>
          <div className={styles.pointHeaderBalance}>거래 후 잔액</div>
        </div>
        <div className={styles.tableBody}>
          {saleHistoryData.map((item) => (
            <div key={item.id} className={styles.tableRow}>
              <div className={styles.pointCellDate}>{item.date}</div>
              <div className={styles.pointCellProductNameSale}>{item.productName}</div>
              <div className={`${styles.pointCellAmountSale} ${styles.pointAmountPositive}`}>
                +{item.amount.toLocaleString()}
              </div>
              <div className={styles.pointCellBalance}>
                {item.balance.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );

  return (
    <>
      {/* 탭 네비게이션 */}
      <nav className={styles.nav}>
        <button
          className={`${styles.navTab} ${activeTab === 'all' ? styles.navTabActive : ''}`}
          onClick={() => setActiveTab('all')}
        >
          전체
        </button>
        <button
          className={`${styles.navTab} ${activeTab === 'charge' ? styles.navTabActive : ''}`}
          onClick={() => setActiveTab('charge')}
        >
          충전내역
        </button>
        <button
          className={`${styles.navTab} ${activeTab === 'purchase' ? styles.navTabActive : ''}`}
          onClick={() => setActiveTab('purchase')}
        >
          구매내역
        </button>
        <button
          className={`${styles.navTab} ${activeTab === 'sale' ? styles.navTabActive : ''}`}
          onClick={() => setActiveTab('sale')}
        >
          판매내역
        </button>
      </nav>

      <div className={styles.gapSmall}></div>

      {/* 탭에 따라 다른 테이블 렌더링 */}
      {activeTab === 'all' && renderAllTab()}
      {activeTab === 'charge' && renderChargeTab()}
      {activeTab === 'purchase' && renderPurchaseTab()}
      {activeTab === 'sale' && renderSaleTab()}
    </>
  );
}
