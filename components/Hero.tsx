import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ArrowRight, Users, Star, TrendingUp } from 'lucide-react';

const Hero: React.FC = () => {
  const stats = [
    { icon: <Users size={24} />, value: "3,000+", label: "누적 수강생" },
    { icon: <Star size={24} />, value: "98%", label: "수강 만족도" },
    { icon: <TrendingUp size={24} />, value: "55세", label: "평균 수강 연령" },
  ];

  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-b from-warm-50 to-warm-100 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* 텍스트 영역 */}
          <div className="text-center lg:text-left">
            {/* 태그 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-5 py-2 bg-accent-50 text-accent-600 rounded-full text-lg font-medium mb-6"
            >
              <span>👋</span>
              <span>인생 2막을 준비하는 당신을 위한 AI 클래스</span>
            </motion.div>

            {/* 헤드라인 */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-h1-mobile md:text-h1 text-text-primary mb-6"
            >
              "AI, <span className="text-accent-400">어렵지 않아요</span>"
            </motion.h1>

            {/* 서브라인 */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-body-lg text-text-secondary mb-8 max-w-xl mx-auto lg:mx-0"
            >
              나이는 숫자일 뿐,<br />
              <strong className="text-text-primary">AI 시대의 주인공은 바로 당신입니다</strong>
            </motion.p>

            {/* CTA 버튼 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10"
            >
              <a href="#level-test" className="btn-primary flex items-center justify-center gap-2 text-xl">
                🎯 나에게 맞는 레벨 찾기
                <ArrowRight size={24} />
              </a>
              <a href="#contact" className="btn-secondary flex items-center justify-center gap-2 text-xl">
                <MessageCircle size={24} />
                문의하기
              </a>
            </motion.div>

            {/* 신뢰 요소 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap justify-center lg:justify-start gap-6"
            >
              {stats.map((stat, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-white rounded-xl px-5 py-3 shadow-sm">
                  <div className="w-12 h-12 bg-accent-50 rounded-full flex items-center justify-center text-accent-400">
                    {stat.icon}
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-text-primary">{stat.value}</div>
                    <div className="text-sm text-text-secondary">{stat.label}</div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* 이미지 영역 */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-card overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&h=600&fit=crop"
                alt="자신감 있게 노트북을 사용하는 중년 여성"
                className="w-full aspect-[4/3] object-cover"
              />
              {/* 오버레이 텍스트 */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <p className="text-white text-xl font-medium">
                  "AI 덕분에 제2의 커리어가 시작됐어요!"
                </p>
                <p className="text-white/80 mt-1">- 김미영 님 (54세)</p>
              </div>
            </div>

            {/* 플로팅 뱃지 1 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-4"
            >
              <div className="text-sm text-text-secondary">수료 후 창업률</div>
              <div className="text-2xl font-bold text-accent-400">42%</div>
            </motion.div>

            {/* 플로팅 뱃지 2 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="absolute -bottom-4 -left-4 bg-primary-500 text-warm-50 rounded-xl shadow-lg p-4"
            >
              <div className="text-sm opacity-90">수강생 평균 수익</div>
              <div className="text-xl font-bold">월 87만원 증가</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
