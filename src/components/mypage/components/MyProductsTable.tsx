import styles from '../styles.module.css';

// 임시 데이터 타입
interface Product {
  id: number;
  number: string;
  name: string;
  price: string;
  date: string;
  isActive: boolean;
  status: string;
}

// 임시 더미 데이터
const dummyProducts: Product[] = [
  { id: 1, number: '243', name: '파르나스 호텔 제주', price: '326,000원', date: '2024.12.16', isActive: false, status: '판매 완료' },
  { id: 2, number: '242', name: '파르나스 호텔 제주', price: '326,000원', date: '2024.12.15', isActive: true, status: '판매 완료' },
  { id: 3, number: '241', name: '파르나스 호텔 제주', price: '326,000원', date: '2024.12.14', isActive: false, status: '판매 완료' },
  { id: 4, number: '240', name: '파르나스 호텔 제주', price: '326,000원', date: '2024.12.13', isActive: false, status: '판매 완료' },
  { id: 5, number: '239', name: '파르나스 호텔 제주', price: '326,000원', date: '2024.12.12', isActive: true, status: '판매 완료' },
  { id: 6, number: '238', name: '파르나스 호텔 제주', price: '326,000원', date: '2024.12.11', isActive: true, status: '판매 완료' },
  { id: 7, number: '237', name: '파르나스 호텔 제주', price: '326,000원', date: '2024.12.10', isActive: true, status: '판매 완료' },
  { id: 8, number: '236', name: '파르나스 호텔 제주', price: '326,000원', date: '2024.12.09', isActive: true, status: '판매 완료' },
  { id: 9, number: '235', name: '파르나스 호텔 제주', price: '326,000원', date: '2024.12.08', isActive: true, status: '판매 완료' },
  { id: 10, number: '234', name: '파르나스 호텔 제주', price: '326,000원', date: '2024.12.07', isActive: true, status: '판매 완료' },
];

export default function MyProductsTable() {
  return (
    <main className={styles.main}>
      <div className={styles.tableContainer}>
        {/* 헤더 행 */}
        <div className={styles.tableHeader}>
          <div className={styles.headerNumber}>번호</div>
          <div className={styles.headerProductName}>상품 명</div>
          <div className={styles.headerPrice}>판매가격</div>
          <div className={styles.headerDate}>날짜</div>
        </div>

        {/* 데이터 행들 */}
        <div className={styles.tableBody}>
          {dummyProducts.map((product) => (
            <div
              key={product.id}
              className={`${styles.tableRow} ${!product.isActive ? styles.tableRowInactive : ''}`}
            >
              <div className={styles.cellNumber}>{product.number}</div>
              <div className={styles.cellProductName}>
                <span
                  className={
                    product.isActive ? styles.productNameActive : styles.productNameInactive
                  }
                >
                  {product.name}
                </span>
                <span className={styles.statusBadge}>{product.status}</span>
              </div>
              <div className={styles.cellPrice}>{product.price}</div>
              <div className={styles.cellDate}>{product.date}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
