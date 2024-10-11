'use client'

import WorldClock from './WorldClock';
import styles from './WorldClock.module.css';

const WorldClockGrid = () => {
  const clocks = [
    { city: "서울", timeZone: "Asia/Seoul" },
    { city: "뉴욕", timeZone: "America/New_York" },
    { city: "런던", timeZone: "Europe/London" },
    { city: "시드니", timeZone: "Australia/Sydney" },
    { city: "홍콩", timeZone: "Asia/Hong_Kong" },
    { city: "도쿄", timeZone: "Asia/Tokyo" },
    { city: "파리", timeZone: "Europe/Paris" },
    { city: "로마", timeZone: "Europe/Rome" },
    { city: "뉴델리", timeZone: "Asia/Kolkata" },
    { city: "상하이", timeZone: "Asia/Shanghai" },
  ];

  return (
    <div className={styles.grid}>
      {clocks.map((clock, index) => (
        <WorldClock key={index} city={clock.city} timeZone={clock.timeZone} />
      ))}
    </div>
  );
};

export default WorldClockGrid;