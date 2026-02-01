import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Video, Youtube, Calendar, Clock, Users, ArrowRight, Play } from 'lucide-react';

const FreeTrial: React.FC = () => {
  return (
    <section id="trial" className="py-16 md:py-24 bg-primary-500">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto bg-white rounded-card shadow-2xl overflow-hidden"
        >
          <div className="grid md:grid-cols-2">
            {/* 왼쪽: 안내 텍스트 */}
            <div className="p-8 md:p-12 bg-gradient-to-br from-primary-500 to-secondary-600 text-warm-50">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                  <Gift size={28} />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold">
                  먼저 체험해보세요!
                </h2>
              </div>

              <p className="text-xl text-warm-100 mb-8 leading-relaxed">
                결정하기 전에 직접 경험해보세요.<br />
                <strong>온라인 무료 체험</strong>을 제공합니다.
              </p>

              {/* 체험 내용 */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Video size={18} />
                  </div>
                  <span className="text-lg">100% 온라인 진행</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Users size={18} />
                  </div>
                  <span className="text-lg">소수 정원 Zoom 라이브</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Clock size={18} />
                  </div>
                  <span className="text-lg">1시간 체험 수업</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Gift size={18} />
                  </div>
                  <span className="text-lg">무료 레벨 테스트 포함</span>
                </div>
              </div>

              {/* 긴급성 배너 */}
              <div className="bg-accent-400 text-primary-500 rounded-xl p-4 font-bold text-center">
                ⚠️ 이번 달 체험 신청 100명 선착순!
              </div>
            </div>

            {/* 오른쪽: 예약 옵션 */}
            <div className="p-8 md:p-12">
              {/* 유튜브 맛보기 */}
              <div className="mb-8">
                <h3 className="flex items-center gap-2 text-xl font-bold text-text-primary mb-4">
                  <Youtube size={24} className="text-red-500" />
                  유튜브 무료 강의 (지금 바로!)
                </h3>
                <div className="p-4 bg-red-50 rounded-xl border-2 border-red-100 hover:border-red-300 transition-colors">
                  <a
                    href="https://youtube.com/@example"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4"
                  >
                    <div className="w-16 h-16 bg-red-500 rounded-xl flex items-center justify-center text-white">
                      <Play size={32} />
                    </div>
                    <div>
                      <p className="font-bold text-text-primary text-lg">AI 기초 맛보기 강의</p>
                      <p className="text-sm text-text-secondary">ChatGPT 시작하기 (30분)</p>
                      <p className="text-red-500 font-medium text-sm mt-1">▶ 지금 무료로 시청하기</p>
                    </div>
                  </a>
                </div>
              </div>

              {/* Zoom 라이브 체험 */}
              <div className="mb-8">
                <h3 className="flex items-center gap-2 text-xl font-bold text-text-primary mb-4">
                  <Video size={24} className="text-secondary-500" />
                  Zoom 라이브 체험 (예약 필요)
                </h3>
                <div className="space-y-3">
                  <div className="p-4 bg-secondary-50 rounded-xl border-2 border-secondary-200">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-bold text-text-primary">평일 저녁 체험</p>
                      <span className="text-sm text-secondary-500 font-medium">
                        화·목 저녁 8시
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary">
                      퇴근 후 편하게 참여하세요
                    </p>
                  </div>
                  <div className="p-4 bg-secondary-50 rounded-xl border-2 border-secondary-200">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-bold text-text-primary">주말 체험</p>
                      <span className="text-sm text-secondary-500 font-medium">
                        토요일 오전 10시
                      </span>
                    </div>
                    <p className="text-sm text-text-secondary">
                      여유롭게 주말에 참여하세요
                    </p>
                  </div>
                </div>
                <p className="text-sm text-text-secondary mt-3">
                  💡 Zoom 사용법도 친절하게 알려드려요
                </p>
              </div>

              {/* 예약 버튼 */}
              <a
                href="#contact"
                className="flex items-center justify-center gap-3 w-full py-5 bg-accent-400 hover:bg-accent-500 text-primary-500 rounded-button font-bold text-xl transition-colors shadow-lg"
              >
                <Calendar size={24} />
                🗓️ Zoom 체험 예약하기
                <ArrowRight size={24} />
              </a>

              <p className="text-center text-text-secondary mt-4 text-sm">
                ✅ 예약 후 취소도 자유롭습니다
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FreeTrial;
