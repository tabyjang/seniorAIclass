import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Quote } from 'lucide-react';

interface StudentProfile {
  name: string;
  age: number;
  role: string;
  image: string;
  quote: string;
  before: string[];
  after: string[];
  level: string;
  levelColor: string;
}

const TargetAudience: React.FC = () => {
  // PRD 기반 4레벨 구조 적용
  const students: StudentProfile[] = [
    {
      name: "김미영",
      age: 52,
      role: "프리랜서 전환",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
      quote: "AI로 콘텐츠 제작 사업을 시작했어요",
      before: [
        "20년간 회사에서 마케팅 일만 했어요",
        "디지털 트렌드에 뒤처진 것 같았어요",
        "새로운 기술 배우기가 두려웠어요"
      ],
      after: [
        "AI로 마케팅 콘텐츠를 직접 만들어요",
        "월 150만원 프리랜서 수익 달성",
        "이제 회사 다니는 것보다 더 벌어요"
      ],
      level: "Lv.2 중급자 → Lv.4 전문가 수료",
      levelColor: "#9B59B6" // 전문가 색상
    },
    {
      name: "박준호",
      age: 56,
      role: "창업 준비",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop",
      quote: "AI 컨설팅 회사를 차렸습니다",
      before: [
        "대기업 임원 출신이지만 AI는 몰랐어요",
        "젊은 직원들에게 뒤처지는 느낌이었어요",
        "퇴직 후 뭘 해야 할지 막막했어요"
      ],
      after: [
        "중소기업 AI 도입 컨설팅을 해요",
        "월 300만원 이상 컨설팅 수익",
        "경력과 AI가 만나니 시너지가 폭발!"
      ],
      level: "Lv.3 고급자 → Lv.4 전문가 수료",
      levelColor: "#9B59B6" // 전문가 색상
    },
    {
      name: "이서연",
      age: 48,
      role: "직장인",
      image: "https://images.unsplash.com/photo-1594744803329-e58b31239f45?w=400&h=400&fit=crop",
      quote: "회사에서 AI 담당자가 됐어요",
      before: [
        "엑셀, 파워포인트가 업무의 전부였어요",
        "후배들이 쓰는 AI 도구가 낯설었어요",
        "도태될까봐 불안했어요"
      ],
      after: [
        "부서 AI 업무 자동화를 주도해요",
        "연봉 협상에서 20% 인상 성공",
        "이제 후배들이 저한테 물어봐요"
      ],
      level: "Lv.1 초보자 → Lv.3 고급자 수료",
      levelColor: "#4D96FF" // 고급자 색상
    }
  ];

  return (
    <section id="reviews" className="py-16 md:py-24 bg-warm-50">
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
            이런 분들이 <span className="text-primary-500">함께</span>하고 있어요
          </h2>
          <p className="text-body-lg text-text-secondary max-w-2xl mx-auto">
            경력과 경험에 AI를 더해 새로운 기회를 만든 분들
          </p>
        </motion.div>

        {/* 프로필 카드 */}
        <div className="grid md:grid-cols-3 gap-8">
          {students.map((student, idx) => (
            <motion.div
              key={student.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="bg-white rounded-card shadow-lg overflow-hidden group hover:shadow-xl transition-shadow"
            >
              {/* 프로필 헤더 */}
              <div className="relative">
                <img
                  src={student.image}
                  alt={student.name}
                  className="w-full aspect-square object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                  <div className="flex items-end justify-between">
                    <div>
                      <h3 className="text-white text-2xl font-bold">
                        {student.name} <span className="font-normal text-lg">({student.age}세)</span>
                      </h3>
                      <p className="text-white/80">{student.role}</p>
                    </div>
                    <span
                      className="px-3 py-1 rounded-full text-white text-sm font-medium"
                      style={{ backgroundColor: student.levelColor }}
                    >
                      {student.level}
                    </span>
                  </div>
                </div>
              </div>

              {/* 인용문 */}
              <div className="p-6 border-b border-warm-100">
                <div className="flex gap-3">
                  <Quote size={24} className="text-primary-400 flex-shrink-0 mt-1" />
                  <p className="text-xl font-medium text-text-primary italic">
                    "{student.quote}"
                  </p>
                </div>
              </div>

              {/* Before/After */}
              <div className="p-6">
                {/* Before */}
                <div className="mb-6">
                  <h4 className="text-lg font-bold text-text-secondary mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 bg-warm-100 rounded-full flex items-center justify-center text-sm">
                      전
                    </span>
                    수강 전
                  </h4>
                  <ul className="space-y-2">
                    {student.before.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-text-secondary">
                        <span className="text-warm-200">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* After */}
                <div>
                  <h4 className="text-lg font-bold text-primary-500 mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-sm text-primary-500">
                      후
                    </span>
                    수강 후
                  </h4>
                  <ul className="space-y-2">
                    {student.after.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-text-primary font-medium">
                        <span className="text-primary-500">✓</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 하단 CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <p className="text-body-lg text-text-secondary mb-6">
            다음 주인공은 <strong className="text-primary-500">바로 당신</strong>입니다
          </p>
          <a href="#contact" className="btn-primary inline-flex items-center gap-2 text-xl">
            💬 나도 시작하기
            <ArrowRight size={24} />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default TargetAudience;
