import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const STAGES_ORDER = ['품사', '문장성분', '문장구조', '단어의형성', '형태소와어근'];

export const STAGES_INFO = {
  '품사': { id: '품사', title: '1. 품사', desc: '단어의 갈래를 알아볼까요?' },
  '문장성분': { id: '문장성분', title: '2. 문장성분', desc: '문장을 구성하는 역할!' },
  '문장구조': { id: '문장구조', title: '3. 문장구조', desc: '문장의 짜임새 파악하기' },
  '단어의형성': { id: '단어의형성', title: '4. 단어의 형성', desc: '단어는 어떻게 만들어질까?' },
  '형태소와어근': { id: '형태소와어근', title: '5. 형태소와 어근', desc: '말의 가장 작은 뜻!' },
};

export const useGameStore = create(
  persist(
    (set, get) => ({
      level: 1,
      exp: 0,
      hp: 3,
      maxHp: 3,
      coins: 0,
      unlockedStages: ['품사'],
      
      gainExp: (amount) => set((state) => {
        let newExp = state.exp + amount;
        let newLevel = state.level;
        // 100 exp마다 레벨업
        while (newExp >= 100) {
          newLevel++;
          newExp -= 100;
        }
        return { exp: newExp, level: newLevel };
      }),

      loseHp: () => set((state) => ({
        hp: Math.max(0, state.hp - 1)
      })),

      resetHp: () => set((state) => ({
        hp: state.maxHp
      })),

      addCoin: (amount) => set((state) => ({
        coins: state.coins + amount
      })),

      unlockNextStage: (currentStageId) => set((state) => {
        const currentIndex = STAGES_ORDER.indexOf(currentStageId);
        if (currentIndex !== -1 && currentIndex + 1 < STAGES_ORDER.length) {
          const nextStage = STAGES_ORDER[currentIndex + 1];
          if (!state.unlockedStages.includes(nextStage)) {
            return { unlockedStages: [...state.unlockedStages, nextStage] };
          }
        }
        return state;
      }),
      
      resetGame: () => set({
        level: 1,
        exp: 0,
        hp: 3,
        coins: 0,
        unlockedStages: ['품사']
      })
    }),
    {
      name: 'korean-grammar-game-storage',
    }
  )
);
