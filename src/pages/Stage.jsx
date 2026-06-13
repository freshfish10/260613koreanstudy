import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameStore, STAGES_INFO } from '../store/gameStore';
import { quizData } from '../data/quizData';
import styles from './Stage.module.css';
import { ArrowLeft, Check, X, ShieldAlert } from 'lucide-react';

const Stage = () => {
  const { stageId } = useParams();
  const navigate = useNavigate();
  const { hp, loseHp, gainExp, addCoin, unlockNextStage, unlockedStages } = useGameStore();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [feedback, setFeedback] = useState(null); // 'correct' or 'wrong'
  const [isGameOver, setIsGameOver] = useState(false);
  const [isStageClear, setIsStageClear] = useState(false);

  const stageInfo = STAGES_INFO[stageId];
  const questions = quizData[stageId] || [];
  const currentQuestion = questions[currentQuestionIndex];

  // 스테이지 접근 권한 체크
  useEffect(() => {
    if (!unlockedStages.includes(stageId)) {
      alert('접근할 수 없는 스테이지입니다.');
      navigate('/');
    }
    if (hp <= 0) {
      setIsGameOver(true);
    }
  }, [stageId, unlockedStages, navigate, hp]);

  if (!currentQuestion || isGameOver) {
    return (
      <div className={styles.stageOverlay}>
        <div className={styles.resultModal}>
          <ShieldAlert size={64} className={styles.gameOverIcon} />
          <h2>앗! 체력이 모두 소진되었습니다.</h2>
          <p>틀린 문제를 다시 복습하고 재도전 해보세요!</p>
          <button className="btn" onClick={() => navigate('/')}>메인으로 돌아가기</button>
        </div>
      </div>
    );
  }

  if (isStageClear) {
    return (
      <div className={styles.stageOverlay}>
        <div className={`${styles.resultModal} ${styles.clearModal}`}>
          <div className={styles.particles}></div>
          <h2>스테이지 클리어! 🎉</h2>
          <p>대단해요! {stageInfo.title} 단원을 완벽하게 마스터했습니다.</p>
          <div className={styles.rewards}>
            <div className={styles.rewardItem}>+50 EXP</div>
            <div className={styles.rewardItem}>+100 Coins</div>
          </div>
          <button className="btn" onClick={() => navigate('/')}>다음 스테이지로</button>
        </div>
      </div>
    );
  }

  const handleOptionSelect = (index) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQuestion.answer;
    
    if (isCorrect) {
      setFeedback('correct');
      gainExp(20);
      addCoin(10);
    } else {
      setFeedback('wrong');
      loseHp();
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setFeedback(null);
    } else {
      // 스테이지 클리어
      gainExp(50); // 보너스 경험치
      addCoin(100); // 보너스 코인
      unlockNextStage(stageId);
      setIsStageClear(true);
    }
  };

  const progressPercentage = ((currentQuestionIndex) / questions.length) * 100;

  return (
    <div className={styles.stageContainer}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate('/')}>
          <ArrowLeft size={24} /> 나가기
        </button>
        <div className={styles.progressBarContainer}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progressPercentage}%` }}></div>
          </div>
          <span>{currentQuestionIndex + 1} / {questions.length}</span>
        </div>
      </div>

      <div className={styles.questionArea}>
        <span className={styles.stageTitleBadge}>{stageInfo.title}</span>
        <h2 className={styles.questionText}>
          {currentQuestion.question.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              <br/>
            </React.Fragment>
          ))}
        </h2>
      </div>

      <div className={styles.optionsContainer}>
        {currentQuestion.options.map((option, index) => {
          let btnClass = styles.optionBtn;
          if (isAnswered) {
            if (index === currentQuestion.answer) {
              btnClass += ` ${styles.correctOption}`;
            } else if (index === selectedOption) {
              btnClass += ` ${styles.wrongOption}`;
            }
          } else if (selectedOption === index) {
            btnClass += ` ${styles.selectedOption}`;
          }

          return (
            <button
              key={index}
              className={btnClass}
              onClick={() => handleOptionSelect(index)}
              disabled={isAnswered}
            >
              <span className={styles.optionIndex}>{index + 1}</span>
              <span className={styles.optionText}>{option}</span>
              {isAnswered && index === currentQuestion.answer && <Check className={styles.resultIcon} />}
              {isAnswered && index === selectedOption && index !== currentQuestion.answer && <X className={styles.resultIcon} />}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className={`${styles.feedbackPanel} ${feedback === 'correct' ? styles.feedbackCorrect : styles.feedbackWrong}`}>
          <h3>{feedback === 'correct' ? '정답입니다! 🎉' : '아쉽네요! 😢'}</h3>
          <p>{currentQuestion.feedback}</p>
          <button className="btn" onClick={handleNext}>
            {currentQuestionIndex + 1 < questions.length ? '다음 문제' : '결과 보기'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Stage;
