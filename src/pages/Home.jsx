import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore, STAGES_ORDER, STAGES_INFO } from '../store/gameStore';
import { Lock, Play, CheckCircle2 } from 'lucide-react';
import styles from './Home.module.css';

const Home = () => {
  const navigate = useNavigate();
  const { unlockedStages, hp } = useGameStore();

  const handleStageClick = (stageId) => {
    if (unlockedStages.includes(stageId)) {
      if (hp <= 0) {
        alert("체력이 부족합니다! 체력을 회복해주세요.");
        // 체력 회복 로직(팝업) 추가 가능하지만 지금은 알림만 띄움
        return;
      }
      navigate(`/stage/${stageId}`);
    }
  };

  return (
    <div className={styles.homeContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>국어 문법 어드벤처</h1>
        <p className={styles.subtitle}>스테이지를 클리어하고 레벨업 하세요!</p>
      </header>

      <div className={styles.mapContainer}>
        {/* 구불구불한 길 배경 (임의의 SVG 곡선) */}
        <svg className={styles.pathSvg} viewBox="0 0 1000 800" preserveAspectRatio="none">
          <path 
            d="M 100 700 C 300 700, 300 500, 500 500 C 700 500, 700 300, 900 300 C 900 100, 700 100, 500 100 C 300 100, 100 200, 100 400" 
            fill="none" 
            stroke="rgba(255,255,255,0.1)" 
            strokeWidth="20"
            strokeDasharray="20 20"
          />
        </svg>

        {STAGES_ORDER.map((stageId, index) => {
          const info = STAGES_INFO[stageId];
          const isUnlocked = unlockedStages.includes(stageId);
          const isCompleted = unlockedStages.indexOf(stageId) < unlockedStages.length - 1 && isUnlocked;
          // 임의의 위치 지정 (맵 위에 지그재그 배치)
          const positions = [
            { bottom: '10%', left: '15%' },
            { bottom: '35%', left: '45%' },
            { bottom: '60%', left: '80%' },
            { bottom: '85%', left: '50%' },
            { bottom: '70%', left: '15%' },
          ];

          return (
            <div 
              key={stageId} 
              className={`${styles.stageNode} ${isUnlocked ? styles.unlocked : styles.locked}`}
              style={positions[index]}
              onClick={() => handleStageClick(stageId)}
            >
              <div className={styles.nodeIcon}>
                {isCompleted ? <CheckCircle2 size={32} /> : 
                 isUnlocked ? <Play size={32} /> : 
                 <Lock size={32} />}
              </div>
              <div className={`${styles.nodeTooltip} glass-panel`}>
                <h3>{info.title}</h3>
                <p>{info.desc}</p>
                {isUnlocked ? (
                  <button className="btn">도전하기</button>
                ) : (
                  <span className={styles.lockMsg}>이전 단계를 클리어하세요</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
