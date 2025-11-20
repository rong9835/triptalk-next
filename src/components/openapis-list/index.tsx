'use client';

import Image from 'next/image';
import styles from './openapis.module.css';
import useOpenApisList from './hook';

export default function OpenApisList() {
  const { champions, onClickChampion } = useOpenApisList();
  return (
    <div className="container">
      <div className={styles.title}>리그오브레전드 챔피언</div>
      <div className={styles.champion}>
        {Object.values(champions).map((champion) => (
          <div
            onClick={() => {
              onClickChampion(champion);
            }}
            className={styles.championCard}
            key={champion.id}
          >
            <Image
              src={`https://ddragon.leagueoflegends.com/cdn/13.18.1/img/champion/${champion.id}.png`}
              alt={champion.name}
              width={120}
              height={120}
            />
            <div>{champion.name}</div> {/* 한국어 이름! */}
          </div>
        ))}
      </div>
    </div>
  );
}
