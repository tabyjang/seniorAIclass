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

  // 미드나잇 럭셔리 팔레트 적용 - 40개 프로덕트 (레벨당 10개)
  const levelData: LevelProducts[] = [
    {
      level: 1,
      name: "초보자",
      color: "#0F172A", // 딥 네이비
      bgColor: "bg-slate-50",
      products: [
        { id: "1-1", name: "나의 첫 Gmail", description: "디지털 신분증 만들기", icon: "📧", samples: [{ title: "Gmail 계정 + 프로필 설정", price: "기본 포함", image: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=300&h=200&fit=crop" }] },
        { id: "1-2", name: "스마트폰 세팅", description: "나만의 폰 꾸미기", icon: "📱", samples: [{ title: "개인화 설정 10가지", price: "기본 포함", image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&h=200&fit=crop" }] },
        { id: "1-3", name: "클릭 마스터", description: "10가지 클릭 동작", icon: "🖱️", samples: [{ title: "클릭 동작 체크리스트", price: "기본 포함", image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=300&h=200&fit=crop" }] },
        { id: "1-4", name: "ChatGPT 첫 대화록", description: "AI와의 첫 만남", icon: "💬", samples: [{ title: "첫 5개 대화 저장 PDF", price: "기본 포함", image: "https://images.unsplash.com/photo-1677442135136-760c813028c0?w=300&h=200&fit=crop" }] },
        { id: "1-5", name: "첫 AI 그림 5종", description: "AI 예술가의 시작", icon: "🎨", samples: [{ title: "AI 그림 5장 모음", price: "기본 포함", image: "https://images.unsplash.com/photo-1633186710895-309db2eca9e4?w=300&h=200&fit=crop" }] },
        { id: "1-6", name: "첫 이메일 3통", description: "디지털 우편발송", icon: "✉️", samples: [{ title: "가족에게 보낸 이메일", price: "기본 포함", image: "https://images.unsplash.com/photo-1579965342575-16428a7c8881?w=300&h=200&fit=crop" }] },
        { id: "1-7", name: "디지털 앨범 시즌1", description: "사진 정리의 시작", icon: "📷", samples: [{ title: "구글 포토 앨범 3개", price: "기본 포함", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&h=200&fit=crop" }] },
        { id: "1-8", name: "AI 감사 편지 3통", description: "따뜻한 디지털 마음", icon: "💝", samples: [{ title: "감사 편지 + 손글씨 사인", price: "기본 포함", image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=300&h=200&fit=crop" }] },
        { id: "1-9", name: "나의 AI 일기장", description: "첫 주간 기록 7일", icon: "📝", samples: [{ title: "7일 일기 PDF", price: "기본 포함", image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=300&h=200&fit=crop" }] },
        { id: "1-10", name: "초보자 수료 포트폴리오", description: "15강 성취 증명", icon: "🏆", samples: [{ title: "수료증 + 작품 모음집", price: "기본 포함", image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=300&h=200&fit=crop" }] },
      ]
    },
    {
      level: 2,
      name: "중급자",
      color: "#334155", // 슬레이트
      bgColor: "bg-slate-100",
      products: [
        { id: "2-1", name: "손주 사랑 편지함", description: "12개월 편지 세트", icon: "💌", samples: [{ title: "연간 손주 편지 12통", price: "29,000원", image: "https://images.unsplash.com/photo-1579965342575-16428a7c8881?w=300&h=200&fit=crop" }] },
        { id: "2-2", name: "가족 동화책", description: "맞춤 AI 동화 1권", icon: "📚", samples: [{ title: "손주 이름 넣은 동화책", price: "89,000원", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=200&fit=crop" }] },
        { id: "2-3", name: "가족 여행 바이블", description: "3박4일 계획서", icon: "✈️", samples: [{ title: "여행 PPT + 실행", price: "39,000원", image: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=300&h=200&fit=crop" }] },
        { id: "2-4", name: "가족 SNS 계정", description: "블로그 10개 포스팅", icon: "📱", samples: [{ title: "활성화된 가족 채널", price: "29,000원", image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=300&h=200&fit=crop" }] },
        { id: "2-5", name: "가족 이력서", description: "30년 역사 한눈에", icon: "🏛️", samples: [{ title: "타임라인 인포그래픽", price: "59,000원", image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=300&h=200&fit=crop" }] },
        { id: "2-6", name: "가족 AI 요리책", description: "맞춤 레시피 20개", icon: "🍳", samples: [{ title: "건강 맞춤 요리책", price: "49,000원", image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=300&h=200&fit=crop" }] },
        { id: "2-7", name: "가족 카드세트", description: "특별한 날 카드 24장", icon: "🎴", samples: [{ title: "연간 가족 카드 세트", price: "79,000원", image: "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=300&h=200&fit=crop" }] },
        { id: "2-8", name: "가족 디자인 키트", description: "명함/로고/프로필", icon: "🎨", samples: [{ title: "가족 브랜드 디자인 3종", price: "69,000원", image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=200&fit=crop" }] },
        { id: "2-9", name: "가족 갤러리", description: "일러스트/포스터 6장", icon: "🖼️", samples: [{ title: "계절별 가족 포스터", price: "59,000원", image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=300&h=200&fit=crop" }] },
        { id: "2-10", name: "가족 음성 아카이브", description: "동화/편지 낭독 5편", icon: "🎙️", samples: [{ title: "음성 녹음 + QR코드", price: "49,000원", image: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=300&h=200&fit=crop" }] },
      ]
    },
    {
      level: 3,
      name: "고급자",
      color: "#D4A853", // 앤티크 골드
      bgColor: "bg-amber-50",
      products: [
        { id: "3-1", name: "가족 영화관", description: "가족 영상 5편 제작", icon: "🎬", samples: [{ title: "유튜브/카톡 공유용 영상", price: "199,000원", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=200&fit=crop" }] },
        { id: "3-2", name: "우리 가족 홈페이지", description: "5페이지 웹사이트", icon: "🌐", samples: [{ title: "도메인 연결 실제 홈페이지", price: "249,000원", image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=300&h=200&fit=crop" }] },
        { id: "3-3", name: "가족 회고록", description: "50페이지 전자책", icon: "📖", samples: [{ title: "EPUB/PDF 전자책", price: "179,000원", image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=200&fit=crop" }] },
        { id: "3-4", name: "가족 데이터센터", description: "가계 관리 시스템", icon: "📊", samples: [{ title: "엑셀/구글시트 대시보드", price: "99,000원", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop" }] },
        { id: "3-5", name: "가족 발표회", description: "발표자료 3세트", icon: "🎤", samples: [{ title: "PPT + 발표 대본", price: "129,000원", image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=300&h=200&fit=crop" }] },
        { id: "3-6", name: "가족 유튜브 채널", description: "구독자 100명 달성", icon: "📺", samples: [{ title: "활성화된 유튜브 채널", price: "149,000원", image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=300&h=200&fit=crop" }] },
        { id: "3-7", name: "가족 브랜드 아이덴티티", description: "BI 완성", icon: "🎨", samples: [{ title: "로고/컬러/명함 브랜드 키트", price: "159,000원", image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=300&h=200&fit=crop" }] },
        { id: "3-8", name: "가족 전자책 출판", description: "3권 출간", icon: "📚", samples: [{ title: "Amazon/교보문고 등록", price: "299,000원", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=200&fit=crop" }] },
        { id: "3-9", name: "가족 비즈니스 제안서", description: "사업계획 1건", icon: "💼", samples: [{ title: "사업계획서 30페이지", price: "199,000원", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop" }] },
        { id: "3-10", name: "가족 감사제", description: "50인 이상 행사 기획", icon: "🎉", samples: [{ title: "행사 기획 및 실행", price: "249,000원", image: "https://images.unsplash.com/photo-1529543544277-059306282862?w=300&h=200&fit=crop" }] },
      ]
    },
    {
      level: 4,
      name: "전문가",
      color: "#1E293B", // 딥 네이비 (마스터)
      bgColor: "bg-slate-900/5",
      products: [
        { id: "4-1", name: "나만의 AI 교재", description: "PDF 교재 3종 출판", icon: "📚", samples: [{ title: "교재 + 워크북 3종", price: "349,000원", image: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=300&h=200&fit=crop" }] },
        { id: "4-2", name: "우리 가족 AI 학교", description: "10회 강의 완료", icon: "🎓", samples: [{ title: "가족 대상 AI 교육", price: "299,000원", image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=300&h=200&fit=crop" }] },
        { id: "4-3", name: "AI 봉사단", description: "지역사회 강의 5회", icon: "🌟", samples: [{ title: "봉사활동 확인증", price: "199,000원", image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=300&h=200&fit=crop" }] },
        { id: "4-4", name: "AI 컨설턴트 포트폴리오", description: "프로젝트 3건 수행", icon: "💼", samples: [{ title: "컨설팅 수익 300만원+", price: "599,000원", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop" }] },
        { id: "4-5", name: "AI 전문가 인증", description: "공식 강사 등록", icon: "🏆", samples: [{ title: "수료증 + 강사등록증", price: "399,000원", image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=300&h=200&fit=crop" }] },
        { id: "4-6", name: "AI 강사 브랜드", description: "개인 브랜딩 완성", icon: "🎤", samples: [{ title: "강사 브랜드 전체 패키지", price: "449,000원", image: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=300&h=200&fit=crop" }] },
        { id: "4-7", name: "AI 교육 채널", description: "구독자 500명 달성", icon: "📺", samples: [{ title: "AI 교육 전문 유튜브", price: "499,000원", image: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=300&h=200&fit=crop" }] },
        { id: "4-8", name: "AI 비즈니스 모델", description: "3가지 수익원 운영", icon: "💰", samples: [{ title: "월 100만원 수익 달성", price: "599,000원", image: "https://images.unsplash.com/photo-1553729459-efe14ef6055d?w=300&h=200&fit=crop" }] },
        { id: "4-9", name: "AI 멘토링 프로그램", description: "후배 양성 3명", icon: "👨‍🏫", samples: [{ title: "멘토링 완료 증명", price: "399,000원", image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=300&h=200&fit=crop" }] },
        { id: "4-10", name: "AI 사회공헌 프로젝트", description: "1건 완수", icon: "🌍", samples: [{ title: "감사장/표창장 수여", price: "499,000원", image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=300&h=200&fit=crop" }] },
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

              {/* 프로덕트 2x5 그리드 (10개 프로덕트) */}
              <div className={`${level.bgColor} grid grid-cols-2`}>
                {level.products.map((product, idx) => (
                  <div
                    key={product.id}
                    className={`${
                      idx < 8 ? 'border-b' : ''
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
            총 <strong className="text-accent-400">40가지 프로덕트</strong>를 만들 수 있어요
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
