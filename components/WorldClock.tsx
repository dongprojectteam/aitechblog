'use client'

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import styles from './WorldClock.module.css';

interface WorldClockProps {
  city: string;
  timeZone: string;
}

const WorldClock = ({ city, timeZone }: WorldClockProps) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const zonedTime = toZonedTime(time, timeZone);
  const hours = zonedTime.getHours();
  const minutes = zonedTime.getMinutes();
  const seconds = zonedTime.getSeconds();

  const hourDegrees = (hours % 12 + minutes / 60) * 30;
  const minuteDegrees = (minutes + seconds / 60) * 6;
  const secondDegrees = seconds * 6;

  return (
    <div className={styles.clockContainer}>
      <h2 className={styles.city}>{city}</h2>
      <div className={styles.clock}>
        <div className={styles.clockFace}>
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className={styles.number}
              style={{
                transform: `rotate(${i * 30}deg) translateY(-40px)`,
              }}
            >
              {i === 0 ? 12 : i}
            </div>
          ))}
        </div>
        <div
          className={`${styles.hand} ${styles.hourHand}`}
          style={{ transform: `rotate(${hourDegrees}deg)` }}
        />
        <div
          className={`${styles.hand} ${styles.minuteHand}`}
          style={{ transform: `rotate(${minuteDegrees}deg)` }}
        />
        <div
          className={`${styles.hand} ${styles.secondHand}`}
          style={{ transform: `rotate(${secondDegrees}deg)` }}
        />
        <div className={styles.centerDot} />
      </div>
      <p className={styles.digitalTime}>{format(zonedTime, 'HH:mm:ss')}</p>
    </div>
  );
};

export default WorldClock;