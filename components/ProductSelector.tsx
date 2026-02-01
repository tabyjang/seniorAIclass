import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  icon: string;
  samples: {
    title: string;
    price: string;
    image: string;
  }[];
}

interface LevelProducts {
  level: number;
  name: string;
  color: string;
  bgColor: string;
  products: Product[];
}

const ProductSelector: React.FC = () => {
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  // 미드나잇 럭셔리 팔레트 적용
  const levelData: LevelProducts[] = [
    {
      level: 1,
      name: "초보자",
      color: "#0F172A", // 딥 네이비
      bgColor: "bg-slate-50",
      products: [
        {
          id: "1-1",
          name: "나의 첫 AI 이메일",
          description: "가족에게 보내는 디지털 안부",
          icon: "📧",
          samples: [
            { title: "Gmail 계정 + 첫 이메일 3통", price: "기본 포함", image: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=300&h=200&fit=crop" },
          ]
        },
        {
          id: "1-2",
          name: "디지털 앨범",
          description: "스마트폰 사진 정리",
          icon: "🖼️",
          samples: [
            { title: "구글 포토 앨범 3개 세트", price: "기본 포함", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=200&fit=crop" },
          ]
        },
        {
          id: "1-3",
          name: "AI 비서 설정",
          description: "스마트폰 AI 활용",
          icon: "📱",
          samples: [
            { title: "음성 비서 + 알림 설정", price: "기본 포함", image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=200&fit=crop" },
          ]
        },
        {
          id: "1-4",
          name: "첫 AI 그림",
          description: "가족 캐릭터 만들기",
          icon: "🎨",
          samples: [
            { title: "가족 캐릭터 이미지 5장", price: "기본 포함", image: "https://images.unsplash.com/photo-1633186710895-309db2eca9e4?w=300&h=200&fit=crop" },
          ]
        },
      ]
    },
    {
      level: 2,
      name: "중급자",
      color: "#334155", // 슬레이트
      bgColor: "bg-slate-100",
      products: [
        {
          id: "2-1",
          name: "손주 사랑 편지함",
          description: "AI 감동 편지 12통",
          icon: "💌",
          samples: [
            { title: "연간 손주 편지 12통 세트", price: "29,000원", image: "https://images.unsplash.com/photo-1579965342575-16428a7c8881?w=300&h=200&fit=crop" },
          ]
        },
        {
          id: "2-2",
          name: "우리 가족 동화책",
          description: "AI로 만든 동화책",
          icon: "📚",
          samples: [
            { title: "맞춤 동화책 (PDF + 인쇄)", price: "89,000원", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=200&fit=crop" },
          ]
        },
        {
          id: "2-3",
          name: "가족 여행 바이블",
          description: "AI 여행계획서",
          icon: "✈️",
          samples: [
            { title: "3박4일 여행 가이드북", price: "39,000원", image: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=300&h=200&fit=crop" },
          ]
        },
        {
          id: "2-4",
          name: "가족 이력서",
          description: "30년 역사 한눈에",
          icon: "🎭",
          samples: [
            { title: "가계도 + 연대기", price: "59,000원", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&h=200&fit=crop" },
          ]
        },
      ]
    },
    {
      level: 3,
      name: "고급자",
      color: "#D4A853", // 앤티크 골드
      bgColor: "bg-amber-50",
      products: [
        {
          id: "3-1",
          name: "디지털 가족사진관",
          description: "AI 프로필 & 앨범",
          icon: "📸",
          samples: [
            { title: "AI 프로필 15장 + 앨범", price: "129,000원", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=200&fit=crop" },
          ]
        },
        {
          id: "3-2",
          name: "가족 카드세트",
          description: "특별한 날 특별한 카드",
          icon: "🎴",
          samples: [
            { title: "연간 가족 카드 24장", price: "79,000원", image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=300&h=200&fit=crop" },
          ]
        },
        {
          id: "3-3",
          name: "가족 영상 제작",
          description: "AI 영상 편집",
          icon: "🎬",
          samples: [
            { title: "가족 영상 5편 (30분)", price: "199,000원", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=200&fit=crop" },
          ]
        },
        {
          id: "3-4",
          name: "가족 건강 식단",
          description: "AI 맞춤 레시피북",
          icon: "🍽️",
          samples: [
            { title: "맞춤 레시피 30개", price: "59,000원", image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300&h=200&fit=crop" },
          ]
        },
      ]
    },
    {
      level: 4,
      name: "전문가",
      color: "#1E293B", // 딥 네이비 (마스터)
      bgColor: "bg-slate-900/5",
      products: [
        {
          id: "4-1",
          name: "우리 가족 홈페이지",
          description: "나만의 가족 공간",
          icon: "🌐",
          samples: [
            { title: "가족 홈페이지 (5페이지)", price: "249,000원", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop" },
          ]
        },
        {
          id: "4-2",
          name: "가족 회고록",
          description: "AI 전자책 제작",
          icon: "📖",
          samples: [
            { title: "회고록 전자책 (50페이지)", price: "179,000원", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=200&fit=crop" },
          ]
        },
        {
          id: "4-3",
          name: "나만의 AI 교재",
          description: "강의용 콘텐츠",
          icon: "📚",
          samples: [
            { title: "AI 강의 교재 + 워크북", price: "349,000원", image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300&h=200&fit=crop" },
          ]
        },
        {
          id: "4-4",
          name: "AI 컨설턴트",
          description: "사업화 프로젝트",
          icon: "💼",
          samples: [
            { title: "컨설팅 프로젝트 3개", price: "599,000원", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop" },
          ]
        },
      ]
    },
  ];

  const toggleProduct = (productId: string) => {
    setExpandedProduct(prev => prev === productId ? null : productId);
  };

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* 섹션 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent-50 text-accent-500 rounded-full text-base font-medium mb-4">
            <Sparkles size={16} />
            <span>내가 만들고 싶은 것</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
            수업이 끝나면 <span className="text-accent-400">이걸</span> 만들어요
          </h2>
          <p className="text-base text-text-secondary">
            관심 있는 항목을 클릭해서 자세히 알아보세요
          </p>
        </motion.div>

        {/* 레벨별 2x2 그리드 */}
        <div className="grid md:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {levelData.map((level, levelIdx) => (
            <motion.div
              key={level.level}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: levelIdx * 0.1 }}
              className="rounded-xl border overflow-hidden"
              style={{ borderColor: level.color }}
            >
              {/* 레벨 헤더 */}
              <div
                className="px-4 py-2.5 flex items-center gap-3"
                style={{ backgroundColor: level.color }}
              >
                <span className="text-white text-sm font-bold bg-white/20 px-2 py-0.5 rounded">
                  Lv.{level.level}
                </span>
                <span className="text-white font-medium text-sm">{level.name}</span>
              </div>

              {/* 프로덕트 2x2 그리드 */}
              <div className={`${level.bgColor} grid grid-cols-2`}>
                {level.products.map((product, idx) => (
                  <div
                    key={product.id}
                    className={`${
                      idx < 2 ? 'border-b' : ''
                    } ${idx % 2 === 0 ? 'border-r' : ''}`}
                    style={{ borderColor: `${level.color}30` }}
                  >
                    {/* 프로덕트 셀 */}
                    <button
                      onClick={() => toggleProduct(product.id)}
                      className="w-full p-3 text-left hover:bg-white/50 transition-all"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-xl">{product.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-text-primary text-sm truncate">
                            {product.name}
                          </p>
                          <p className="text-text-secondary text-xs truncate">
                            {product.description}
                          </p>
                        </div>
                        <motion.div
                          animate={{ rotate: expandedProduct === product.id ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-text-secondary flex-shrink-0"
                        >
                          <ChevronDown size={16} />
                        </motion.div>
                      </div>
                    </button>

                    {/* 아코디언 내용 */}
                    <AnimatePresence>
                      {expandedProduct === product.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-3 pb-3 bg-white/80">
                            {product.samples.map((sample, sIdx) => (
                              <div
                                key={sIdx}
                                className="rounded-lg overflow-hidden border border-warm-100"
                              >
                                <img
                                  src={sample.image}
                                  alt={sample.title}
                                  className="w-full h-20 object-cover"
                                />
                                <div className="p-2">
                                  <p className="font-medium text-text-primary text-xs">
                                    {sample.title}
                                  </p>
                                  <p
                                    className="font-bold text-xs"
                                    style={{ color: level.color }}
                                  >
                                    {sample.price}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* 하단 CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-text-secondary mb-4">
            총 <strong className="text-accent-400">16가지 프로덕트</strong>를 만들 수 있어요
          </p>
          <a href="#level-test" className="btn-primary inline-flex items-center gap-2 text-lg">
            🎯 나에게 맞는 레벨 찾기
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductSelector;
