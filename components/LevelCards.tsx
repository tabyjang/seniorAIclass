import React from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Palette, Briefcase, Award, ArrowRight } from 'lucide-react';

interface LevelData {
  level: number;
  name: string;
  slogan: string;
  color: string;
  bgColor: string;
  icon: React.ReactNode;
  lectures: number;
  products: number;
  duration: string;
  target: string;
  goal: string;
  contents: string[];
}

const LevelCards: React.FC = () => {
  // 미드나잇 럭셔리 팔레트
  const levels: LevelData[] = [
    {
      level: 1,
      name: "초보자",
      slogan: "AI에 도전하는 용기",
      color: "#0F172A", // 딥 네이비
      bgColor: "bg-slate-50",
      icon: <Smartphone size={28} />,
      lectures: 15,
      products: 10,
      duration: "3주",
      target: "디지털이 처음이신 분",
      goal: "나도 디지털 할 수 있다!",
      contents: ["Gmail/스마트폰 기초", "ChatGPT 첫 대화", "가족에게 첫 이메일"]
    },
    {
      level: 2,
      name: "중급자",
      slogan: "AI와 즐겁게 놀기",
      color: "#334155", // 슬레이트
      bgColor: "bg-slate-100",
      icon: <Palette size={28} />,
      lectures: 12,
      products: 10,
      duration: "3주",
      target: "AI로 뭔가 만들고 싶은 분",
      goal: "가족에게 선물할 콘텐츠 제작",
      contents: ["손주 동화책 만들기", "여행 계획서", "가족 SNS 운영"]
    },
    {
      level: 3,
      name: "고급자",
      slogan: "AI로 능력자 되기",
      color: "#D4A853", // 앤티크 골드
      bgColor: "bg-amber-50",
      icon: <Briefcase size={28} />,
      lectures: 12,
      products: 10,
      duration: "3주",
      target: "전문가 수준을 원하는 분",
      goal: "전문 결과물, 브랜드 구축",
      contents: ["유튜브 채널 운영", "가족 홈페이지", "회고록 전자책"]
    },
    {
      level: 4,
      name: "전문가",
      slogan: "AI로 수익 만들기",
      color: "#1E293B", // 딥 네이비 (마스터)
      bgColor: "bg-slate-900/5",
      icon: <Award size={28} />,
      lectures: 11,
      products: 10,
      duration: "3주",
      target: "강사/컨설턴트를 꿈꾸는 분",
      goal: "강사 등록, 수익화 실현",
      contents: ["나만의 AI 교재", "강의 제작", "컨설팅 사업"]
    }
  ];

  return (
    <section id="levels" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* 섹션 제목 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-h2-mobile md:text-h2 text-text-primary mb-4">
            4단계 <span className="text-accent-400">맞춤</span> 커리큘럼
          </h2>
          <p className="text-body-lg text-text-secondary max-w-2xl mx-auto">
            총 50강, 40개 프로덕트를 12주 만에 완성해요
          </p>
        </motion.div>

        {/* 레벨 카드 그리드 - 2x2 */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {levels.map((level, idx) => (
            <motion.div
              key={level.level}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`${level.bgColor} rounded-card p-6 border-2 border-transparent hover:border-current transition-all duration-300 group cursor-pointer`}
              style={{ borderColor: 'transparent' }}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = level.color}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'transparent'}
            >
              {/* 레벨 헤더 */}
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center text-white"
                  style={{ backgroundColor: level.color }}
                >
                  {level.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-sm font-bold px-2 py-0.5 rounded text-white"
                      style={{ backgroundColor: level.color }}
                    >
                      Lv.{level.level}
                    </span>
                    <span className="text-xl font-bold text-text-primary">{level.name}</span>
                  </div>
                  <p className="text-sm text-text-secondary italic">"{level.slogan}"</p>
                </div>
              </div>

              {/* 강의 정보 */}
              <div className="flex gap-2 mb-4">
                <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-text-secondary">
                  {level.lectures}강
                </span>
                <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-text-secondary">
                  {level.products}프로덕트
                </span>
                <span className="px-3 py-1 bg-white rounded-full text-sm font-medium text-text-secondary">
                  {level.duration}
                </span>
              </div>

              {/* 대상 */}
              <p className="text-text-secondary text-sm mb-2">
                📌 {level.target}
              </p>

              {/* 목표 */}
              <p className="font-bold text-text-primary mb-4">
                🎯 {level.goal}
              </p>

              {/* 주요 내용 */}
              <ul className="space-y-1.5 mb-5">
                {level.contents.map((content, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                    <span style={{ color: level.color }}>✓</span>
                    {content}
                  </li>
                ))}
              </ul>

              {/* CTA 링크 */}
              <a
                href="#level-test"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-button text-white font-medium transition-all group-hover:shadow-md text-sm"
                style={{ backgroundColor: level.color }}
              >
                이 레벨 시작하기
                <ArrowRight size={16} />
              </a>
            </motion.div>
          ))}
        </div>

        {/* 하단 안내 */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center text-text-secondary mt-10 text-lg"
        >
          💡 어떤 레벨인지 모르겠다면? 아래에서 <strong className="text-accent-400">무료 레벨 테스트</strong>를 해보세요!
        </motion.p>
      </div>
    </section>
  );
};

export default LevelCards;
