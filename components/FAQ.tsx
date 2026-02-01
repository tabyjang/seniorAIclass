import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Send } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    {
      question: "AI 관련 기술적 배경이 전혀 없는데 괜찮을까요?",
      answer: "전혀 문제없습니다! 저희 커리큘럼은 IT 비전공자를 위해 설계됐어요. 수강생의 70%가 문과 출신이거나 기술 배경이 없으신 분들입니다. 실무 활용에 초점을 맞춰서, 복잡한 이론 없이 바로 써먹을 수 있는 스킬을 알려드립니다."
    },
    {
      question: "직장을 다니면서도 수강할 수 있나요?",
      answer: "물론이죠! 평일 저녁반(19시-21시), 주말반(토요일 10시-13시)을 운영하고 있어요. 바쁘신 분들을 위해 녹화 영상도 제공되며, 온라인으로 어디서든 수강 가능합니다. 실제로 수강생 60%가 현직 직장인이세요."
    },
    {
      question: "수료 후 실제로 수익을 낼 수 있나요?",
      answer: "Lv.4 이상 수료생 기준 평균 월 87만원의 추가 수익을 올리고 계세요. 블로그, 유튜브, 프리랜서, 컨설팅 등 다양한 방식으로 수익화에 성공하셨습니다. 단, 개인 노력에 따라 차이가 있으며, 저희는 방법과 노하우를 알려드립니다."
    },
    {
      question: "수강료는 얼마인가요? 결제 방식은?",
      answer: "레벨별로 다르지만, 1개 레벨당 39만원~59만원입니다. 전체 4레벨 패키지는 30% 할인된 금액으로 제공됩니다. 신용카드, 계좌이체, 최대 6개월 무이자 할부가 가능합니다. 자세한 금액은 무료 상담 시 안내해드려요."
    },
    {
      question: "ChatGPT 외에 어떤 AI 도구를 배우나요?",
      answer: "ChatGPT는 물론, Claude, Gemini 등 텍스트 AI와 Midjourney, DALL-E 등 이미지 AI, 영상 편집 AI, 업무 자동화 AI까지 실무에서 가장 많이 쓰이는 15가지 이상의 AI 도구를 배웁니다. 도구는 계속 업데이트돼요!"
    },
    {
      question: "1:1 멘토링이나 사후 관리가 있나요?",
      answer: "네! 수료 후 3개월간 무료 사후 멘토링을 제공합니다. 카카오톡 그룹에서 질문하시면 24시간 내 답변 드리고, 월 1회 오프라인 네트워킹 모임도 있어요. 수료생 커뮤니티에서 서로 정보 공유도 활발합니다."
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
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
            <span className="text-accent-400">궁금한 점</span>이 있으신가요?
          </h2>
          <p className="text-body-lg text-text-secondary max-w-2xl mx-auto">
            많은 분들이 물어보시는 질문들을 모았어요
          </p>
        </motion.div>

        {/* FAQ 아코디언 */}
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className={`w-full text-left p-6 rounded-card transition-all ${
                  openIndex === idx
                    ? 'bg-accent-50 shadow-md'
                    : 'bg-warm-50 hover:bg-warm-100'
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className={`text-lg md:text-xl font-bold ${
                    openIndex === idx ? 'text-accent-400' : 'text-text-primary'
                  }`}>
                    Q. {faq.question}
                  </h3>
                  <motion.div
                    animate={{ rotate: openIndex === idx ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className={`flex-shrink-0 ${
                      openIndex === idx ? 'text-accent-400' : 'text-text-secondary'
                    }`}
                  >
                    <ChevronDown size={24} />
                  </motion.div>
                </div>

                <AnimatePresence>
                  {openIndex === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="mt-4 text-body-lg text-text-secondary leading-relaxed">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </motion.div>
          ))}
        </div>

        {/* 하단 안내 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <div className="inline-flex flex-col sm:flex-row items-center gap-4 p-6 bg-warm-100 rounded-card">
            <p className="text-lg text-text-primary font-medium">
              💬 더 궁금한 점이 있으시면?
            </p>
            <a
              href="#contact"
              className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-button font-bold hover:bg-primary-600 transition-colors"
            >
              <Send size={20} />
              문의하기
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;
