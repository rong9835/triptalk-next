import { useEffect, useState } from 'react';
import { Champion, ChampionsData, ApiResponse } from './types';

export default function useOpenApisList() {
  const [champions, setChampions] = useState<ChampionsData>({});

  useEffect(() => {
    const getChampions = async () => {
      const result = await fetch(
        'https://ddragon.leagueoflegends.com/cdn/13.18.1/data/ko_KR/champion.json'
      );
      const data: ApiResponse = await result.json();
      setChampions(data.data);
      console.log('API 응답:', data);
    };
    getChampions();
  }, []);

  const onClickChampion = (champion: Champion) => {
    alert(`챔피언: ${champion.name}\n\n타이틀: ${champion.title}`);
  };

  return {
    champions,
    onClickChampion,
  };
}
