import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, CheckCircle, ArrowRight, RotateCcw, Heart } from 'lucide-react';

// 후광 애니메이션 스타일
const glowStyles = `
  @keyframes glow-pulse {
    0%, 100% {
      box-shadow: 0 0 20px rgba(212, 168, 83, 0.4), 0 0 40px rgba(212, 168, 83, 0.2), 0 4px 20px rgba(0, 0, 0, 0.1);
      transform: scale(1);
    }
    50% {
      box-shadow: 0 0 30px rgba(212, 168, 83, 0.7), 0 0 60px rgba(212, 168, 83, 0.4), 0 4px 20px rgba(0, 0, 0, 0.15);
      transform: scale(1.02);
    }
  }
  
  @keyframes glow-strong {
    0%, 100% {
      box-shadow: 0 0 25px rgba(212, 168, 83, 0.5), 0 0 50px rgba(212, 168, 83, 0.3);
    }
    50% {
      box-shadow: 0 0 40px rgba(212, 168, 83, 0.8), 0 0 80px rgba(212, 168, 83, 0.5);
    }
  }
`;

interface Question {
  id: number;
  question: string;
  reassurance: string;
  options: {
    label: string;
    score: number;
  }[];
}

const LevelTest: React.FC = () => {
  const [isTestStarted, setIsTestStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  // 정중하고 겸손한 5개 질문
  const questions: Question[] = [
    {
      id: 1,
      question: "스마트폰이나 컴퓨터로\n인터넷 검색을 해보신 적이\n있으신가요?",
      reassurance: "혹시 아직 안 해보셨어도,\n저희가 함께 도와드릴 거예요.",
      options: [
        { label: "네, 해봤어요", score: 1 },
        { label: "아직은 어려워요", score: 0 }
      ]
    },
    {
      id: 2,
      question: "요즘 많이들 쓰는 ChatGPT나 Claude 같은\nAI를 혹시 만나보신 적이 있으신가요?",
      reassurance: "처음이라면 저희가 차근차근\n친구처럼 소개해드릴게요.",
      options: [
        { label: "네, 알고 있어요", score: 1 },
        { label: "아직 못 만나봤어요", score: 0 }
      ]
    },
    {
      id: 3,
      question: "AI 도우미와 함께\n편지를 쓰거나, 그림을 그리거나,\n여행 계획을 세워보신 적이 있으신가요?",
      reassurance: "아직이시면, 저희가 함께\n첫 작품을 만들어볼 수 있어요.",
      options: [
        { label: "네, 해봤어요", score: 1 },
        { label: "아직이에요", score: 0 }
      ]
    },
    {
      id: 4,
      question: "가족이나 주변 분들께\nAI를 알려주거나 함께 사용해보신 적이 있으신가요?\n\n혹시 앞으로 주변 분들께\nAI를 소개해드리고 싶으신가요?",
      reassurance: "혼자 배우시거나, 함께 나누시거나\n모두 소중한 경험이에요.",
      options: [
        { label: "네, 해봤어요/하고 싶어요", score: 1 },
        { label: "아직은요", score: 0 }
      ]
    },
    {
      id: 5,
      question: "AI를 활용해서\n블로그나 유튜브를 운영하시거나,\n강사 활동을 해보시고 싶으신 생각이 있으신가요?\n\n아니면 지금처럼 가족들과\n즐겁게 AI를 사용하시는 것만으로도 충분하신가요?",
      reassurance: "어떤 선택이시든\nAI는 여러분의 삶을 더 풍요롭게 해드릴 거예요.",
      options: [
        { label: "네, 도전해보고 싶어요", score: 1 },
        { label: "지금처럼 즐겁게 쓰고 싶어요", score: 0 }
      ]
    }
  ];

  const handleAnswer = (score: number) => {
    const newScores = [...scores, score];
    setScores(newScores);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  // 총점에 따른 레벨 계산 (0-5점)
  const calculateLevel = (): { level: number; name: string; slogan: string; message: string; recommend: string; color: string; bgColor: string } => {
    const totalScore = scores.reduce((a, b) => a + b, 0);

    // 미드나잇 럭셔리 팔레트 적용
    if (totalScore <= 1) {
      return {
        level: 1,
        name: "초보자",
        slogan: "AI에 도전하는 용기",
        message: "아직 디지털이 낯설으시군요.\n그런데 걱정 마세요.\n\n김영희(62세) 어머님도 3주 만에\nAI 전문가가 되셨어요.\n\n저희가 천천히, 차근차근\n함께 도와드릴게요.",
        recommend: "Lv.1 초보자 과정 (15강/3주)",
        color: "#0F172A",
        bgColor: "#EEF2FF"
      };
    } else if (totalScore === 2) {
      return {
        level: 2,
        name: "중급자",
        slogan: "AI와 즐겁게 놀기",
        message: "AI를 만나보셨군요!\n\n이제 AI와 함께\n가족들을 위한 멋진 것들을\n만들어보실 차례예요.\n\n편지, 동화책, 여행계획...\n즐거운 시간이 기다리고 있어요.",
        recommend: "Lv.2 중급자 과정 (12강/3주)",
        color: "#334155",
        bgColor: "#F0FDF4"
      };
    } else if (totalScore === 3) {
      return {
        level: 3,
        name: "고급자",
        slogan: "AI로 능력자 되기",
        message: "이미 AI로 많은 것을 만들어보셨군요!\n\n이제 더 전문적인 결과물을 만들고\n가족의 추억을 특별하게\n기록해보실 시간이에요.\n\n홈페이지, 영화관, 회고록...\n여러분의 능력을 발휘해보세요.",
        recommend: "Lv.3 고급자 과정 (12강/3주)",
        color: "#D4A853",
        bgColor: "#FFFBEB"
      };
    } else {
      return {
        level: 4,
        name: "전문가",
        slogan: "AI로 수익 만들기",
        message: "벌써 주변 분들께 AI를 알려주시거나,\n더 큰 도전을 꿈꾸시는군요!\n\nAI 강사, 블로거, 유튜버...\n여러분의 새로운 시작을\n저희가 함께 응원할게요.\n\n이제 AI로 세상과 연결되어보세요.",
        recommend: "Lv.4 전문가 과정 (11강/3주)",
        color: "#1E293B",
        bgColor: "#F5F3FF"
      };
    }
  };

  const resetTest = () => {
    setIsTestStarted(false);
    setCurrentQuestion(0);
    setScores([]);
    setShowResult(false);
  };

  return (
    <section id="level-test" className="py-16 md:py-24" style={{ backgroundColor: '#FAF9F6' }}>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto"
        >
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10">
            <AnimatePresence mode="wait">
              {!isTestStarted && !showResult && (
                <motion.div
                  key="intro"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center"
                >
                  {/* 아이콘 배지 */}
                  <div className="relative inline-block mb-6">
                    <div 
                      className="w-24 h-24 rounded-full flex items-center justify-center mx-auto"
                      style={{ 
                        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                        boxShadow: '0 8px 30px rgba(15, 23, 42, 0.3)'
                      }}
                    >
                      <span className="text-4xl">🎯</span>
                    </div>
                    <div 
                      className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                      style={{ backgroundColor: '#D4A853' }}
                    >
                      5
                    </div>
                  </div>

                  {/* 메인 헤드라인 */}
                  <div className="mb-6">
                    <p className="text-sm font-semibold tracking-widest uppercase mb-2" style={{ color: '#D4A853' }}>
                      ✨ 1분이면 끝!
                    </p>
                    <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ color: '#0F172A' }}>
                      나의 AI 레벨은
                    </h2>
                    <h2 className="text-3xl md:text-4xl font-bold" style={{ color: '#0F172A' }}>
                      어디쯤일까요?
                    </h2>
                  </div>

                  {/* 궁금증 자극 카드들 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
                    <div 
                      className="p-4 rounded-xl text-left"
                      style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}
                    >
                      <p className="text-xs mb-1" style={{ color: '#94A3B8' }}>궁금증</p>
                      <p className="text-sm font-medium" style={{ color: '#334155' }}>
                        🤔 "내가 AI를 얼마나 잘 쓸 수 있을까?"
                      </p>
                    </div>
                    <div 
                      className="p-4 rounded-xl text-left"
                      style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}
                    >
                      <p className="text-xs mb-1" style={{ color: '#86EFAC' }}>기대감</p>
                      <p className="text-sm font-medium" style={{ color: '#166534' }}>
                        💡 "어떤 수업이 나에게 딱 맞을까?"
                      </p>
                    </div>
                    <div 
                      className="p-4 rounded-xl text-left"
                      style={{ backgroundColor: '#FFFBEB', border: '1px solid #FDE68A' }}
                    >
                      <p className="text-xs mb-1" style={{ color: '#FCD34D' }}>설렘</p>
                      <p className="text-sm font-medium" style={{ color: '#92400E' }}>
                        🚀 "3개월 후의 나는 어떨까?"
                      </p>
                    </div>
                  </div>

                  {/* 설명 */}
                  <p className="text-base mb-8 px-4" style={{ color: '#64748B', lineHeight: '1.8' }}>
                    5가지 질문으로 <strong style={{ color: '#0F172A' }}>현재 나의 AI 실력</strong>을 파악하고<br />
                    <strong style={{ color: '#D4A853' }}>딱 맞는 맞춤 커리큘럼</strong>을 추천해드려요
                  </p>

                  {/* CTA 버튼 */}
                  <div className="flex justify-center">
                    <button
                      onClick={() => setIsTestStarted(true)}
                      className="flex items-center justify-center gap-3 px-12 py-5 rounded-xl text-xl font-bold text-white transition-all hover:scale-105"
                      style={{ 
                        background: 'linear-gradient(135deg, #D4A853 0%, #C49A47 100%)',
                        minHeight: '68px'
                      }}
                    >
                      <span className="text-2xl">🎯</span>
                      레벨테스트 시작하기
                      <ArrowRight size={28} />
                    </button>
                  </div>

                  {/* 부가 정보 */}
                  <div className="mt-6 flex items-center justify-center gap-6 text-sm" style={{ color: '#94A3B8' }}>
                    <span className="flex items-center gap-1">
                      <span>⏱️</span> 1분 소요
                    </span>
                    <span className="flex items-center gap-1">
                      <span>📊</span> 4단계 진단
                    </span>
                    <span className="flex items-center gap-1">
                      <span>🎁</span> 맞춤 추천
                    </span>
                  </div>
                </motion.div>
              )}

              {isTestStarted && !showResult && (
                <motion.div
                  key={`question-${currentQuestion}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  {/* 진행률 */}
                  <div className="mb-8">
                    <div className="flex justify-between text-sm mb-2" style={{ color: '#95A5A6' }}>
                      <span>질문 {currentQuestion + 1} / {questions.length}</span>
                      <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: '#E8E8E6' }}>
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: '#D4A853' }}
                        initial={{ width: `${(currentQuestion / questions.length) * 100}%` }}
                        animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  </div>

                  {/* 질문 */}
                  <div className="text-center mb-8">
                    <h3 className="text-xl md:text-2xl font-bold mb-6" style={{ color: '#0F172A', lineHeight: '1.6' }}>
                      {questions[currentQuestion].question}
                    </h3>
                    
                    {/* 안심 메시지 */}
                    <div className="inline-block px-4 py-2 rounded-full text-sm" style={{ backgroundColor: '#F0FDF4', color: '#059669' }}>
                      💚 {questions[currentQuestion].reassurance}
                    </div>
                  </div>

                  {/* 선택지 - 큰 버튼 */}
                  <div className="space-y-4">
                    {questions[currentQuestion].options.map((option, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleAnswer(option.score)}
                        className="w-full p-5 text-left rounded-xl text-lg font-semibold transition-all border-2"
                        style={{
                          minHeight: '72px',
                          backgroundColor: '#FFFFFF',
                          borderColor: '#E8E8E6',
                          color: '#2D3436'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#D4A853';
                          e.currentTarget.style.backgroundColor = '#FFFBEB';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#E8E8E6';
                          e.currentTarget.style.backgroundColor = '#FFFFFF';
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>

                  {/* 이전 질문으로 (2번째부터) */}
                  {currentQuestion > 0 && (
                    <button
                      onClick={() => {
                        setCurrentQuestion(currentQuestion - 1);
                        setScores(scores.slice(0, -1));
                      }}
                      className="mt-6 text-sm underline"
                      style={{ color: '#95A5A6' }}
                    >
                      ← 이전 질문으로 돌아가기
                    </button>
                  )}
                </motion.div>
              )}

              {showResult && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center"
                >
                  {(() => {
                    const result = calculateLevel();
                    return (
                      <>
                        <div
                          className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
                          style={{ backgroundColor: result.color }}
                        >
                          <CheckCircle size={48} className="text-white" />
                        </div>
                        
                        <p className="text-base mb-2" style={{ color: '#95A5A6' }}>추천 레벨</p>
                        <h3
                          className="text-3xl md:text-4xl font-bold mb-2"
                          style={{ color: result.color }}
                        >
                          Lv.{result.level} {result.name}
                        </h3>
                        <p className="text-lg mb-6 italic" style={{ color: '#636E72' }}>
                          "{result.slogan}"
                        </p>
                        
                        {/* 맞춤 메시지 카드 */}
                        <div 
                          className="rounded-xl p-6 mb-6 text-left"
                          style={{ backgroundColor: result.bgColor }}
                        >
                          <p className="text-base whitespace-pre-line" style={{ color: '#2D3436', lineHeight: '1.8' }}>
                            {result.message}
                          </p>
                        </div>

                        <div className="mb-8 p-4 rounded-lg" style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                          <p className="text-sm mb-1" style={{ color: '#64748B' }}>추천 과정</p>
                          <p className="text-lg font-bold" style={{ color: '#0F172A' }}>{result.recommend}</p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                          <a
                            href="#contact"
                            className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-lg font-bold text-white transition-all hover:opacity-90"
                            style={{ backgroundColor: '#D4A853', minHeight: '56px' }}
                          >
                            💬 맞춤 상담 받기
                            <ArrowRight size={24} />
                          </a>
                          <button
                            onClick={resetTest}
                            className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-lg font-semibold transition-all border-2"
                            style={{ 
                              borderColor: '#E8E8E6', 
                              color: '#636E72',
                              backgroundColor: '#FFFFFF',
                              minHeight: '56px'
                            }}
                          >
                            <RotateCcw size={20} />
                            다시 테스트하기
                          </button>
                        </div>
                      </>
                    );
                  })()}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LevelTest;
