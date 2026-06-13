import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore, STAGES_ORDER, STAGES_INFO } from '../store/gameStore';
import { ArrowRight, Lock } from 'lucide-react';
import styles from './Home.module.css';

const Home = () => {
  const navigate = useNavigate();
  const { unlockedStages, hp } = useGameStore();

  const handleStageClick = (stageId) => {
    if (unlockedStages.includes(stageId)) {
      if (hp <= 0) {
        alert("체력이 부족합니다! 체력을 회복해주세요.");
        return;
      }
      navigate(`/stage/${stageId}`);
    }
  };

  return (
    <div className={styles.homeContainer}>
      <section className={styles.hero}>
        <h1 className={styles.title}>국어 문법 어드벤처</h1>
        <p className={styles.subtitle}>한국어 문법을 공학적이고 체계적으로 학습하세요. 스테이지를 클리어하며 지식을 확장할 수 있습니다.</p>
      </section>

      <section className={styles.gridSection}>
        <h2 className={styles.gridSectionTitle}>학습 모듈</h2>
        <div className={styles.grid}>
          {STAGES_ORDER.map((stageId, index) => {
            const info = STAGES_INFO[stageId];
            const isUnlocked = unlockedStages.includes(stageId);
            const isCompleted = unlockedStages.indexOf(stageId) < unlockedStages.length - 1 && isUnlocked;

            return (
              <div 
                key={stageId} 
                className={`${styles.stageCard} ${!isUnlocked ? styles.locked : ''}`}
              >
                <div className="corner-square" style={{ top: 0, left: 0 }}></div>
                
                <div className={styles.cardHeader}>
                  <span className={styles.badge}>STAGE {index + 1}</span>
                  {!isUnlocked && <Lock size={18} color="var(--text-muted)" />}
                </div>

                <h3 className={styles.cardTitle}>{info.title}</h3>
                <p className={styles.cardDesc}>{info.desc}</p>
                
                {isUnlocked ? (
                  <button 
                    className={styles.ghostLink}
                    onClick={() => handleStageClick(stageId)}
                  >
                    {isCompleted ? '다시 학습하기' : '도전하기'} <ArrowRight size={18} />
                  </button>
                ) : (
                  <span className={styles.lockedMsg}>이전 모듈 클리어 필요</span>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Home;
