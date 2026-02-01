import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Lock, CheckCircle2 } from 'lucide-react';

interface ModuleProps {
  number: string;
  title: string;
  duration: string;
  topics: string[];
  isOpen: boolean;
  onClick: () => void;
}

const Module: React.FC<ModuleProps> = ({ number, title, duration, topics, isOpen, onClick }) => {
  return (
    <div className="border-b border-white/10 last:border-none">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-6 px-4 hover:bg-white/5 transition-colors text-left focus:outline-none"
      >
        <div className="flex items-center gap-6">
          <span className="text-2xl font-serif text-gold-500/50 font-bold">{number}</span>
          <div>
            <h4 className="text-xl font-medium text-white">{title}</h4>
            <span className="text-sm text-slate-500 block mt-1">{duration}</span>
          </div>
        </div>
        <ChevronDown className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-black/20"
          >
            <div className="p-6 pl-20 space-y-3">
              {topics.map((topic, i) => (
                <div key={i} className="flex items-center gap-3 text-slate-300">
                  <div className="min-w-[4px] h-[4px] rounded-full bg-gold-500"></div>
                  {topic}
                </div>
              ))}
              <div className="pt-4 flex items-center gap-2 text-gold-400/80 text-sm font-medium">
                 <CheckCircle2 size={16} />
                 <span>실전 프로젝트 포함</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Curriculum: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const modules = [
    {
      number: "01",
      title: "AI 기초 완벽 이해",
      duration: "1주차 • 4시간",
      topics: [
        "생성형 AI의 작동 원리 이해하기",
        "AI 활용의 윤리적 고려사항",
        "AI 작업 환경 설정 (ChatGPT, Claude, Gemini)"
      ]
    },
    {
      number: "02",
      title: "프롬프트 엔지니어링 마스터",
      duration: "2주차 • 6시간",
      topics: [
        "제로샷 vs 퓨샷 프롬프팅 기법",
        "Chain-of-thought 추론 활용법",
        "나만의 브랜드 시스템 지침 만들기",
        "할루시네이션 방지와 팩트체킹"
      ]
    },
    {
      number: "03",
      title: "AI 이미지/영상 제작",
      duration: "3주차 • 8시간",
      topics: [
        "Midjourney 파라미터와 스타일 가이드",
        "일관된 캐릭터 이미지 생성하기",
        "인페인팅/아웃페인팅 고급 기법",
        "상업적 사용권과 저작권 이해"
      ]
    },
    {
      number: "04",
      title: "AI 업무 자동화",
      duration: "4주차 • 5시간",
      topics: [
        "맞춤형 GPTs 만들기",
        "n8n / Make 연동 자동화",
        "SNS 콘텐츠 대량 생산 워크플로우"
      ]
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-midnight-950 to-midnight-900">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <span className="text-gold-400 font-medium tracking-widest text-sm uppercase">커리큘럼</span>
          <h2 className="text-4xl font-serif font-bold text-white mt-3">체계적인 교육 과정</h2>
        </div>

        <div className="glass-panel rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          {modules.map((mod, idx) => (
            <Module
              key={idx}
              {...mod}
              isOpen={openIndex === idx}
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            />
          ))}
          <div className="p-6 bg-white/5 flex items-center justify-center gap-3 border-t border-white/10">
            <Lock size={16} className="text-slate-500" />
            <span className="text-slate-400 font-medium">수강 완료 시 4개의 보너스 모듈 제공</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Curriculum;
