import styles from '../styles.module.css';

// 임시 데이터 타입
interface Bookmark {
  id: number;
  number: string;
  name: string;
  price: string;
  seller: string;
  date: string;
  isActive: boolean;
}

// 임시 더미 데이터
const dummyBookmarks: Bookmark[] = [
  { id: 1, number: '243', name: '파르나스 호텔 제주', price: '326,000원', seller: '홍길동', date: '2024.12.16', isActive: true },
  { id: 2, number: '242', name: '파르나스 호텔 제주', price: '326,000원', seller: '홍길동', date: '2024.12.15', isActive: true },
  { id: 3, number: '241', name: '파르나스 호텔 제주', price: '326,000원', seller: '홍길동', date: '2024.12.14', isActive: true },
  { id: 4, number: '240', name: '파르나스 호텔 제주', price: '326,000원', seller: '홍길동', date: '2024.12.13', isActive: true },
  { id: 5, number: '239', name: '파르나스 호텔 제주', price: '326,000원', seller: '홍길동', date: '2024.12.12', isActive: true },
  { id: 6, number: '238', name: '파르나스 호텔 제주', price: '326,000원', seller: '홍길동', date: '2024.12.11', isActive: true },
  { id: 7, number: '237', name: '파르나스 호텔 제주', price: '326,000원', seller: '홍길동', date: '2024.12.10', isActive: true },
  { id: 8, number: '236', name: '파르나스 호텔 제주', price: '326,000원', seller: '홍길동', date: '2024.12.09', isActive: true },
  { id: 9, number: '235', name: '파르나스 호텔 제주', price: '326,000원', seller: '홍길동', date: '2024.12.08', isActive: true },
  { id: 10, number: '234', name: '파르나스 호텔 제주', price: '326,000원', seller: '홍길동', date: '2024.12.07', isActive: true },
];

export default function BookmarksTable() {
  return (
    <main className={styles.main}>
      <div className={styles.tableContainer}>
        {/* 헤더 행 - 북마크는 5개 컬럼 (판매자 추가) */}
        <div className={styles.tableHeader}>
          <div className={styles.headerNumber}>번호</div>
          <div className={styles.headerProductNameBookmark}>상품 명</div>
          <div className={styles.headerPrice}>판매가격</div>
          <div className={styles.headerSeller}>판매자</div>
          <div className={styles.headerDate}>날짜</div>
        </div>

        {/* 데이터 행들 */}
        <div className={styles.tableBody}>
          {dummyBookmarks.map((bookmark) => (
            <div key={bookmark.id} className={styles.tableRow}>
              <div className={styles.cellNumber}>{bookmark.number}</div>
              <div className={styles.cellProductNameBookmark}>
                <span className={styles.productNameActive}>{bookmark.name}</span>
              </div>
              <div className={styles.cellPrice}>{bookmark.price}</div>
              <div className={styles.cellSeller}>{bookmark.seller}</div>
              <div className={styles.cellDate}>{bookmark.date}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
