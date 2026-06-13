import React from 'react';
import { useGameStore } from '../store/gameStore';
import { Heart, Coins, Trophy } from 'lucide-react';
import styles from './CharacterStatus.module.css';

const CharacterStatus = () => {
  const { level, exp, hp, maxHp, coins } = useGameStore();

  const expPercentage = (exp / 100) * 100;

  return (
    <div className={styles.statusContainer}>
      <div className={styles.levelBadge}>
        <span className={styles.levelText}>LV.{level}</span>
      </div>
      
      <div className={styles.expBarContainer}>
        <div className={styles.expBar}>
          <div 
            className={styles.expFill} 
            style={{ width: `${expPercentage}%` }}
          />
        </div>
        <span className={styles.expText}>{exp}/100</span>
      </div>

      <div className={styles.statsGroup}>
        <div className={styles.statItem}>
          <div className={styles.hearts}>
            {Array.from({ length: maxHp }).map((_, i) => (
              <Heart 
                key={i} 
                className={`${styles.icon} ${i < hp ? styles.heartActive : styles.heartEmpty}`} 
                fill={i < hp ? "currentColor" : "none"}
              />
            ))}
          </div>
        </div>
        <div className={styles.statItem}>
          <Coins className={`${styles.icon} ${styles.coinIcon}`} />
          <span className={styles.statValue}>{coins}</span>
        </div>
      </div>
    </div>
  );
};

export default CharacterStatus;
