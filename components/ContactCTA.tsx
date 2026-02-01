import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, Clock, Gift, Users, CheckCircle, Send, Youtube, Video } from 'lucide-react';

const ContactCTA: React.FC = () => {
  const benefits = [
    { icon: <Users size={24} />, text: "1:1 맞춤 상담" },
    { icon: <CheckCircle size={24} />, text: "무료 레벨 테스트" },
    { icon: <Gift size={24} />, text: "Zoom 체험 수업 무료" },
  ];

  return (
    <section id="contact" className="py-16 md:py-24 bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* 메인 카드 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-card shadow-2xl overflow-hidden"
          >
            <div className="grid md:grid-cols-2">
              {/* 왼쪽: 상담 신청 */}
              <div className="p-8 md:p-12">
                <h2 className="text-h2-mobile md:text-h2 text-text-primary mb-4">
                  💬 편하게<br /><span className="text-accent-400">상담</span>하세요
                </h2>
                <p className="text-body-lg text-text-secondary mb-8">
                  카카오톡으로 언제든 문의해주세요.<br />
                  친절하게 안내해드립니다.
                </p>

                {/* 카카오톡 상담 */}
                <a
                  href="https://pf.kakao.com/_example"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-6 bg-yellow-50 rounded-card mb-6 hover:bg-yellow-100 transition-colors group"
                >
                  <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-text-primary group-hover:scale-110 transition-transform">
                    <MessageCircle size={32} />
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary">카카오톡 채널</p>
                    <p className="text-2xl font-bold text-text-primary">@AI마스터클래스</p>
                  </div>
                </a>

                {/* 응답 시간 안내 */}
                <div className="flex items-start gap-3 mb-8 text-text-secondary">
                  <Clock size={20} className="mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-text-primary">응답 시간</p>
                    <p>평일 오전 9시 ~ 오후 6시 (1시간 내 답변)</p>
                    <p className="text-sm">(주말/공휴일은 순차 답변)</p>
                  </div>
                </div>

                {/* 상담 버튼 */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="https://pf.kakao.com/_example"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-6 py-4 bg-yellow-400 text-text-primary rounded-button font-bold hover:bg-yellow-300 transition-colors flex-1"
                  >
                    <MessageCircle size={24} />
                    카톡 상담 시작하기
                  </a>
                </div>
              </div>

              {/* 오른쪽: 혜택 & 수업 방식 */}
              <div className="bg-warm-50 p-8 md:p-12">
                {/* 상담 혜택 */}
                <div className="mb-10">
                  <h3 className="text-xl font-bold text-text-primary mb-6">
                    🎁 상담만 받아도 이런 혜택이!
                  </h3>
                  <div className="space-y-4">
                    {benefits.map((benefit, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                        className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm"
                      >
                        <div className="w-12 h-12 bg-accent-50 rounded-full flex items-center justify-center text-accent-400">
                          {benefit.icon}
                        </div>
                        <span className="text-lg font-medium text-text-primary">
                          {benefit.text}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* 수업 방식 안내 */}
                <div>
                  <h3 className="text-xl font-bold text-text-primary mb-6 flex items-center gap-2">
                    <Video size={24} className="text-secondary-500" />
                    100% 온라인 수업
                  </h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-white rounded-xl">
                      <div className="flex items-center gap-3">
                        <Video size={20} className="text-secondary-500" />
                        <div>
                          <p className="font-bold text-text-primary">Zoom 라이브 수업</p>
                          <p className="text-text-secondary text-sm">실시간 질문 가능</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-white rounded-xl">
                      <div className="flex items-center gap-3">
                        <Youtube size={20} className="text-red-500" />
                        <div>
                          <p className="font-bold text-text-primary">녹화 영상 제공</p>
                          <p className="text-text-secondary text-sm">무제한 복습 가능</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-text-secondary">
                    💡 집에서 편하게, 언제든 반복 학습하세요
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 신뢰 요소 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 text-center"
          >
            <p className="text-white/90 text-lg">
              ✅ 부담 없이 상담만 받아보세요. <strong>강요하는 일 절대 없습니다.</strong>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
