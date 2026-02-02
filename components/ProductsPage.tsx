import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown, CheckCircle, ArrowRight, Sparkles,
  Mail, Smartphone, MousePointer, MessageSquare, Palette,
  Send, Camera, Heart, BookOpen, Award,
  PenTool, BookMarked, Plane, Share2, Users,
  UtensilsCrossed, CreditCard, Image, Mic, Folder,
  Video, Globe, FileText, BarChart3, Presentation,
  Youtube, Briefcase, BookCheck, Database, PartyPopper,
  GraduationCap, School, HeartHandshake, BadgeCheck, User,
  Home, Tv, DollarSign, UserPlus, Trophy
} from 'lucide-react';

interface Product {
  id: number;
  name: string;
  description: string;
  icon: React.ReactNode;
  completionCriteria: string;
  proofMethod: string;
  details?: string[];
}

interface LevelData {
  level: number;
  name: string;
  slogan: string;
  color: string;
  bgColor: string;
  lectures: number;
  duration: string;
  products: Product[];
}

const ProductsPage: React.FC = () => {
  const [activeLevel, setActiveLevel] = useState(1);
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null);

  // 미드나잇 럭셔리 팔레트
  const levels: LevelData[] = [
    {
      level: 1,
      name: "초보자",
      slogan: "AI에 도전하는 용기",
      color: "#0F172A", // 딥 네이비
      bgColor: "bg-slate-50",
      lectures: 15,
      duration: "3주",
      products: [
        {
          id: 1,
          name: "나의 첫 Gmail",
          description: "디지털 신분증 - 첫 이메일 계정",
          icon: <Mail size={24} />,
          completionCriteria: "@gmail.com 생성, 프로필 설정",
          proofMethod: "Gmail 홈 화면 스크린샷",
          details: ["본인 이름 또는 별명 주소 생성", "프로필 사진 업로드", "기본 설정 완료 (언어, 테마)"]
        },
        {
          id: 2,
          name: "나만의 스마트폰",
          description: "10가지 개인 설정 완료",
          icon: <Smartphone size={24} />,
          completionCriteria: "10가지 개인 설정 완료",
          proofMethod: "홈화면 캡처 3장",
          details: ["배경화면 설정", "글자 크기 조정", "주요 앱 배치", "알림 설정"]
        },
        {
          id: 3,
          name: "클릭 마스터",
          description: "10가지 클릭 동작 인증",
          icon: <MousePointer size={24} />,
          completionCriteria: "10가지 클릭 동작 완료",
          proofMethod: "체크리스트 서명",
          details: ["한 번 클릭", "두 번 클릭", "길게 누르기", "드래그", "스와이프", "우클릭", "스크롤", "확대/축소"]
        },
        {
          id: 4,
          name: "ChatGPT 첫 대화록",
          description: "AI와의 첫 5개 대화",
          icon: <MessageSquare size={24} />,
          completionCriteria: "5개 대화 저장",
          proofMethod: "대화 목록 스크린샷",
          details: ["인사 대화", "날씨 물어보기", "이야기 듣기", "식단 추천", "자유 대화"]
        },
        {
          id: 5,
          name: "첫 AI 그림 5종세트",
          description: "AI가 그려준 그림 모음",
          icon: <Palette size={24} />,
          completionCriteria: "5장 그림 생성",
          proofMethod: "그림 폴더 정리",
          details: ["자연 (봄 꽃)", "동물 (강아지)", "음식 (커피)", "인물 (캐릭터)", "상상 (우리 집)"]
        },
        {
          id: 6,
          name: "첫 이메일 3통",
          description: "가족에게 디지털 안부",
          icon: <Send size={24} />,
          completionCriteria: "가족 3명 발송 + 답장",
          proofMethod: "보낸메일함 스크린샷",
          details: ["자녀에게 이메일", "손주에게 이메일", "배우자에게 이메일", "답장 확인"]
        },
        {
          id: 7,
          name: "디지털 앨범 시즌1",
          description: "구글 포토 앨범 정리",
          icon: <Camera size={24} />,
          completionCriteria: "3개 앨범 30장",
          proofMethod: "앨범 목록 스크린샷",
          details: ["우리 가족 앨범", "손주 모음 앨범", "추억의 사진 앨범"]
        },
        {
          id: 8,
          name: "AI 감사 편지 3통",
          description: "따뜻한 마음을 담은 편지",
          icon: <Heart size={24} />,
          completionCriteria: "3통 작성 + 출력 + 전달",
          proofMethod: "출력본 사진",
          details: ["부모님께 편지", "자녀에게 편지", "배우자에게 편지"]
        },
        {
          id: 9,
          name: "나의 AI 일기장",
          description: "7일간의 AI 일기",
          icon: <BookOpen size={24} />,
          completionCriteria: "7일치 기록",
          proofMethod: "PDF 파일",
          details: ["오늘의 기분", "오늘의 할 일", "오늘의 감사", "오늘의 질문", "오늘의 요리", "주간 돌아보기"]
        },
        {
          id: 10,
          name: "초보자 수료 포트폴리오",
          description: "15강 성취 증명",
          icon: <Award size={24} />,
          completionCriteria: "9개 + 수료증",
          proofMethod: "포트폴리오 PDF",
          details: ["9개 프로덕트 정리", "학습 여정 기록", "수료증 발급"]
        }
      ]
    },
    {
      level: 2,
      name: "중급자",
      slogan: "AI와 즐겁게 놀기",
      color: "#334155", // 슬레이트
      bgColor: "bg-slate-100",
      lectures: 12,
      duration: "3주",
      products: [
        {
          id: 11,
          name: "손주 사랑 편지함",
          description: "12개월 편지 세트",
          icon: <PenTool size={24} />,
          completionCriteria: "12통 편지 작성",
          proofMethod: "PDF + 출력본",
          details: ["1월~12월 월별 편지", "생일/명절 특별 편지", "디지털 편지함 표지"]
        },
        {
          id: 12,
          name: "가족 동화책",
          description: "손주 맞춤 동화책 1권",
          icon: <BookMarked size={24} />,
          completionCriteria: "5페이지 1권",
          proofMethod: "A4 소책자 인쇄",
          details: ["표지 디자인", "5페이지 스토리", "AI 일러스트 5장"]
        },
        {
          id: 13,
          name: "가족 여행 바이블",
          description: "3박 4일 여행 계획서",
          icon: <Plane size={24} />,
          completionCriteria: "3박 4일 계획 PPT",
          proofMethod: "PPT + 여행 인증샷",
          details: ["10페이지 PPT", "일자별 상세 일정", "맛집 지도", "예산 계획표"]
        },
        {
          id: 14,
          name: "가족 SNS 계정",
          description: "블로그 + 10개 포스팅",
          icon: <Share2 size={24} />,
          completionCriteria: "블로그 + 10개 포스팅",
          proofMethod: "블로그 통계 스크린샷",
          details: ["네이버 블로그 개설", "게시물 10개 작성", "가족 공유"]
        },
        {
          id: 15,
          name: "가족 이력서",
          description: "30년 역사 타임라인",
          icon: <Users size={24} />,
          completionCriteria: "30년 타임라인",
          proofMethod: "A3 포스터 인쇄",
          details: ["가족 타임라인", "주요 가족사 10개", "사진 타임라인"]
        },
        {
          id: 16,
          name: "가족 AI 요리책",
          description: "20개 레시피 모음",
          icon: <UtensilsCrossed size={24} />,
          completionCriteria: "20개 레시피",
          proofMethod: "A5 요리책 인쇄",
          details: ["가족 맞춤 레시피", "사진 포함", "영양 정보"]
        },
        {
          id: 17,
          name: "가족 카드세트",
          description: "24장 특별한 카드",
          icon: <CreditCard size={24} />,
          completionCriteria: "24장 카드",
          proofMethod: "카드박스 세트",
          details: ["생일 카드", "명절 카드", "감사 카드", "축하 카드"]
        },
        {
          id: 18,
          name: "가족 디자인 키트",
          description: "명함/로고/프로필",
          icon: <Image size={24} />,
          completionCriteria: "명함/로고/프로필",
          proofMethod: "명함 인쇄 100장",
          details: ["가족 로고 디자인", "명함 디자인", "프로필 사진 3종"]
        },
        {
          id: 19,
          name: "가족 갤러리",
          description: "6장 포스터 세트",
          icon: <Folder size={24} />,
          completionCriteria: "6장 포스터",
          proofMethod: "A4 출력 6장",
          details: ["가족 사진 보정", "AI 스타일 적용", "액자용 출력"]
        },
        {
          id: 20,
          name: "가족 음성 아카이브",
          description: "5편 음성 녹음",
          icon: <Mic size={24} />,
          completionCriteria: "5편 녹음",
          proofMethod: "MP3 + QR코드",
          details: ["가족 인터뷰", "추억 이야기", "메시지 녹음"]
        }
      ]
    },
    {
      level: 3,
      name: "고급자",
      slogan: "AI로 능력자 되기",
      color: "#D4A853", // 앤티크 골드
      bgColor: "bg-amber-50",
      lectures: 12,
      duration: "3주",
      products: [
        {
          id: 21,
          name: "가족 영화관",
          description: "5편 영상 (총 20분)",
          icon: <Video size={24} />,
          completionCriteria: "5편 영상 (총 20분)",
          proofMethod: "유튜브 채널",
          details: ["가족 2026 연말 영상", "젊은 시절 영상", "손주 성장 다큐", "가족 여행 브이로그"]
        },
        {
          id: 22,
          name: "우리 가족 홈페이지",
          description: "5페이지 웹사이트",
          icon: <Globe size={24} />,
          completionCriteria: "5페이지 웹사이트",
          proofMethod: "도메인 연결",
          details: ["메인 페이지", "가족 소개", "갤러리", "블로그", "연락처"]
        },
        {
          id: 23,
          name: "가족 회고록",
          description: "50페이지 전자책",
          icon: <FileText size={24} />,
          completionCriteria: "50페이지 전자책",
          proofMethod: "EPUB/PDF 파일",
          details: ["5장 구성", "AI 일러스트 20장", "QR코드 영상 링크"]
        },
        {
          id: 24,
          name: "가족 데이터센터",
          description: "가계 관리 시스템",
          icon: <BarChart3 size={24} />,
          completionCriteria: "가계 관리 시스템",
          proofMethod: "구글시트 공유",
          details: ["가계부 분석", "건강 데이터", "자산 현황표"]
        },
        {
          id: 25,
          name: "가족 발표회",
          description: "3개 발표자료 세트",
          icon: <Presentation size={24} />,
          completionCriteria: "3개 발표자료",
          proofMethod: "PPT + 발표 영상",
          details: ["결혼기념 발표", "이사 감사 발표", "손주 돌잔치 축하"]
        },
        {
          id: 26,
          name: "가족 유튜브 채널",
          description: "구독자 100명 달성",
          icon: <Youtube size={24} />,
          completionCriteria: "구독자 100명",
          proofMethod: "스튜디오 스크린샷",
          details: ["채널 개설", "영상 10개 업로드", "구독자 확보"]
        },
        {
          id: 27,
          name: "가족 브랜드 아이덴티티",
          description: "BI 완성",
          icon: <Briefcase size={24} />,
          completionCriteria: "BI 완성",
          proofMethod: "브랜드 키트",
          details: ["로고 시스템", "컬러 팔레트", "폰트 가이드", "활용 예시"]
        },
        {
          id: 28,
          name: "가족 전자책 출판",
          description: "3권 출간",
          icon: <BookCheck size={24} />,
          completionCriteria: "3권 출간",
          proofMethod: "Amazon 등록",
          details: ["회고록", "요리책", "여행기"]
        },
        {
          id: 29,
          name: "가족 비즈니스 제안서",
          description: "사업계획 1건",
          icon: <Database size={24} />,
          completionCriteria: "사업계획 1건",
          proofMethod: "제안서 PDF",
          details: ["사업 아이디어", "시장 분석", "수익 모델"]
        },
        {
          id: 30,
          name: "가족 감사제",
          description: "50인 행사",
          icon: <PartyPopper size={24} />,
          completionCriteria: "50인 행사",
          proofMethod: "행사 사진 200장",
          details: ["초대장 디자인", "프로그램 기획", "사진 촬영"]
        }
      ]
    },
    {
      level: 4,
      name: "전문가",
      slogan: "AI로 수익 만들기",
      color: "#1E293B", // 딥 네이비 (마스터)
      bgColor: "bg-slate-900/5",
      lectures: 11,
      duration: "3주",
      products: [
        {
          id: 31,
          name: "나만의 AI 교재",
          description: "3종 출판",
          icon: <GraduationCap size={24} />,
          completionCriteria: "PDF 교재 3종",
          proofMethod: "PDF 교재 3종",
          details: ["시니어 AI 입문 교재", "실습 워크북", "강사용 가이드"]
        },
        {
          id: 32,
          name: "우리 가족 AI 학교",
          description: "10회 강의 완료",
          icon: <School size={24} />,
          completionCriteria: "10회 강의 완료",
          proofMethod: "가족 수료증 6장",
          details: ["가족 대상 교육", "10회 강의", "수료증 발급"]
        },
        {
          id: 33,
          name: "AI봉사단",
          description: "지역사회 5회 강의",
          icon: <HeartHandshake size={24} />,
          completionCriteria: "지역사회 5회",
          proofMethod: "봉사활동 확인증",
          details: ["경로당 강의", "도서관 강의", "수강생 50명"]
        },
        {
          id: 34,
          name: "AI 컨설턴트 포트폴리오",
          description: "3건 수행",
          icon: <BadgeCheck size={24} />,
          completionCriteria: "프로젝트 3건 완료",
          proofMethod: "수익 인증",
          details: ["포트폴리오 문서", "수익 300만원+"]
        },
        {
          id: 35,
          name: "AI 전문가 인증",
          description: "공식 강사 등록",
          icon: <Trophy size={24} />,
          completionCriteria: "공식 강사 등록",
          proofMethod: "명함 + 등록번호",
          details: ["AI 전문가 수료증", "강사 네트워크 가입"]
        },
        {
          id: 36,
          name: "AI 강사 브랜드",
          description: "개인 브랜딩",
          icon: <User size={24} />,
          completionCriteria: "개인 브랜딩",
          proofMethod: "강사 홈페이지",
          details: ["개인 홈페이지", "포트폴리오", "연락처"]
        },
        {
          id: 37,
          name: "AI 교육 채널",
          description: "구독자 500명",
          icon: <Tv size={24} />,
          completionCriteria: "구독자 500명",
          proofMethod: "월 수익 50만원+",
          details: ["유튜브 채널", "정기 업로드", "수익화"]
        },
        {
          id: 38,
          name: "AI 비즈니스 모델",
          description: "3가지 수익원",
          icon: <DollarSign size={24} />,
          completionCriteria: "3가지 수익원",
          proofMethod: "월 100만원 수익",
          details: ["강의 수익", "컨설팅 수익", "콘텐츠 수익"]
        },
        {
          id: 39,
          name: "AI 멘토링",
          description: "후배 3명 양성",
          icon: <UserPlus size={24} />,
          completionCriteria: "후배 3명 양성",
          proofMethod: "멘토링 수료증",
          details: ["멘티 선발", "교육 진행", "수료 인증"]
        },
        {
          id: 40,
          name: "AI 사회공헌",
          description: "프로젝트 1건",
          icon: <Home size={24} />,
          completionCriteria: "프로젝트 1건",
          proofMethod: "감사장/표창장",
          details: ["사회공헌 기획", "실행", "인정"]
        }
      ]
    }
  ];

  const currentLevel = levels.find(l => l.level === activeLevel)!;

  const toggleProduct = (productId: number) => {
    setExpandedProduct(prev => prev === productId ? null : productId);
  };

  return (
    <section id="products-page" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent-50 text-accent-500 rounded-full text-base font-medium mb-4">
            <Sparkles size={18} />
            <span>총 40개 프로덕트</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            레벨별 <span className="text-accent-400">완성 프로덕트</span>
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            매 수업마다 하나씩 완성하는 실제 결과물<br />
            총 50강, 40개 프로덕트를 12주 만에 완성해요
          </p>
        </motion.div>

        {/* 레벨 탭 */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {levels.map((level) => (
            <button
              key={level.level}
              onClick={() => {
                setActiveLevel(level.level);
                setExpandedProduct(null);
              }}
              className={`flex items-center gap-2 px-5 py-3 rounded-full font-medium text-base transition-all ${
                activeLevel === level.level
                  ? 'text-white shadow-lg scale-105'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              style={{
                backgroundColor: activeLevel === level.level ? level.color : undefined
              }}
            >
              <span className="font-bold">Lv.{level.level}</span>
              <span>{level.name}</span>
              <span className="text-sm opacity-80">({level.products.length}개)</span>
            </button>
          ))}
        </div>

        {/* 레벨 정보 카드 */}
        <motion.div
          key={activeLevel}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`${currentLevel.bgColor} rounded-2xl p-6 mb-8`}
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="text-white text-sm font-bold px-3 py-1 rounded-full"
                  style={{ backgroundColor: currentLevel.color }}
                >
                  Lv.{currentLevel.level}
                </span>
                <h3 className="text-2xl font-bold text-text-primary">
                  {currentLevel.name}
                </h3>
              </div>
              <p className="text-lg text-text-secondary italic">
                "{currentLevel.slogan}"
              </p>
            </div>
            <div className="flex gap-4">
              <div className="text-center px-4 py-2 bg-white rounded-xl">
                <div className="text-2xl font-bold" style={{ color: currentLevel.color }}>
                  {currentLevel.lectures}강
                </div>
                <div className="text-sm text-text-secondary">강의</div>
              </div>
              <div className="text-center px-4 py-2 bg-white rounded-xl">
                <div className="text-2xl font-bold" style={{ color: currentLevel.color }}>
                  {currentLevel.products.length}개
                </div>
                <div className="text-sm text-text-secondary">프로덕트</div>
              </div>
              <div className="text-center px-4 py-2 bg-white rounded-xl">
                <div className="text-2xl font-bold" style={{ color: currentLevel.color }}>
                  {currentLevel.duration}
                </div>
                <div className="text-sm text-text-secondary">소요</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 프로덕트 그리드 */}
        <div className="grid md:grid-cols-2 gap-4">
          {currentLevel.products.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              className="bg-white border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-gray-200 transition-colors"
            >
              {/* 프로덕트 헤더 */}
              <button
                onClick={() => toggleProduct(product.id)}
                className="w-full p-5 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-14 h-14 rounded-xl flex items-center justify-center text-white flex-shrink-0"
                    style={{ backgroundColor: currentLevel.color }}
                  >
                    {product.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-400">
                        #{product.id}
                      </span>
                      <h4 className="font-bold text-text-primary text-lg">
                        {product.name}
                      </h4>
                    </div>
                    <p className="text-text-secondary text-sm">
                      {product.description}
                    </p>
                  </div>
                  <motion.div
                    animate={{ rotate: expandedProduct === product.id ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="text-gray-400 flex-shrink-0"
                  >
                    <ChevronDown size={24} />
                  </motion.div>
                </div>
              </button>

              {/* 확장 내용 */}
              <AnimatePresence>
                {expandedProduct === product.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-2 border-t border-gray-100">
                      {/* 완성 기준 */}
                      <div className="mb-4">
                        <h5 className="text-sm font-bold text-gray-500 mb-2">완성 기준</h5>
                        <p className="text-text-primary font-medium">
                          {product.completionCriteria}
                        </p>
                      </div>

                      {/* 증명 방식 */}
                      <div className="mb-4">
                        <h5 className="text-sm font-bold text-gray-500 mb-2">증명 방식</h5>
                        <p className="text-text-secondary">
                          {product.proofMethod}
                        </p>
                      </div>

                      {/* 세부 내용 */}
                      {product.details && (
                        <div className="mb-4">
                          <h5 className="text-sm font-bold text-gray-500 mb-2">포함 내용</h5>
                          <ul className="space-y-1">
                            {product.details.map((detail, i) => (
                              <li key={i} className="flex items-center gap-2 text-sm text-text-secondary">
                                <CheckCircle size={14} style={{ color: currentLevel.color }} />
                                {detail}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* CTA */}
                      <a
                        href="#contact"
                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-medium transition-opacity hover:opacity-90"
                        style={{ backgroundColor: currentLevel.color }}
                      >
                        이 프로덕트 만들기
                        <ArrowRight size={18} />
                      </a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* 하단 CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <p className="text-lg text-text-secondary mb-6">
            <strong className="text-accent-400">40개 프로덕트</strong>를 12주 만에 완성하세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#level-test"
              className="btn-primary inline-flex items-center justify-center gap-2 text-xl"
            >
              나에게 맞는 레벨 찾기
              <ArrowRight size={24} />
            </a>
            <a
              href="#contact"
              className="btn-secondary inline-flex items-center justify-center gap-2 text-xl"
            >
              무료 상담 받기
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductsPage;
