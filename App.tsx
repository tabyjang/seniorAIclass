import React, { useState } from 'react';
import Hero from './components/Hero';
import ProductSelector from './components/ProductSelector';
import LevelCards from './components/LevelCards';
import LevelTest from './components/LevelTest';
import TargetAudience from './components/TargetAudience';
import CoursePreview from './components/CoursePreview';
import FreeTrial from './components/FreeTrial';
import FAQ from './components/FAQ';
import ContactCTA from './components/ContactCTA';
import StickyCTA from './components/StickyCTA';
import { Menu, X, MessageCircle, Youtube, Instagram, Clock } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-warm-100 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* 로고 */}
          <a href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary-500 rounded-full flex items-center justify-center">
              <span className="text-accent-400 font-bold text-lg">AI</span>
            </div>
            <span className="text-xl font-bold text-text-primary">
              AI <span className="text-accent-400">마스터</span> 클래스
            </span>
          </a>

          {/* 데스크톱 메뉴 */}
          <div className="hidden lg:flex items-center gap-8">
            <a
              href="/checklist.html"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-50 text-accent-500 rounded-full text-sm font-medium hover:bg-accent-100 transition-colors"
            >
              <span className="w-2 h-2 bg-accent-400 rounded-full animate-pulse"></span>
              진행중
            </a>
            <a href="/products.html" className="text-text-primary font-medium hover:text-accent-400 transition-colors text-lg">
              40개 프로덕트
            </a>
            <a href="#levels" className="text-text-primary font-medium hover:text-accent-400 transition-colors text-lg">
              AI 배우기
            </a>
            <a href="#trial" className="text-text-primary font-medium hover:text-accent-400 transition-colors text-lg">
              무료 체험
            </a>
            <a href="#reviews" className="text-text-primary font-medium hover:text-accent-400 transition-colors text-lg">
              수강 후기
            </a>
            <a href="#contact" className="text-text-primary font-medium hover:text-accent-400 transition-colors text-lg">
              상담 신청
            </a>
          </div>

          {/* CTA 버튼 */}
          <div className="hidden lg:flex items-center gap-4">
            <a
              href="https://pf.kakao.com/_example"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-text-primary rounded-full font-bold hover:bg-yellow-300 transition-colors"
            >
              <MessageCircle size={20} />
              카톡 상담
            </a>
            <a href="#contact" className="btn-primary flex items-center gap-2 text-lg">
              무료 상담 받기
            </a>
          </div>

          {/* 모바일: 카톡 + 햄버거 */}
          <div className="flex lg:hidden items-center gap-3">
            <a
              href="https://pf.kakao.com/_example"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-text-primary"
            >
              <MessageCircle size={24} />
            </a>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-warm-100">
            <div className="flex flex-col gap-4">
              <a
                href="/checklist.html"
                className="flex items-center gap-2 text-amber-700 font-medium text-lg py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                진행중 체크리스트
              </a>
              <a href="/products.html" className="text-text-primary font-medium text-lg py-2" onClick={() => setIsMenuOpen(false)}>
                40개 프로덕트
              </a>
              <a href="#levels" className="text-text-primary font-medium text-lg py-2" onClick={() => setIsMenuOpen(false)}>
                AI 배우기
              </a>
              <a href="#trial" className="text-text-primary font-medium text-lg py-2" onClick={() => setIsMenuOpen(false)}>
                무료 체험
              </a>
              <a href="#reviews" className="text-text-primary font-medium text-lg py-2" onClick={() => setIsMenuOpen(false)}>
                수강 후기
              </a>
              <a href="#contact" className="text-text-primary font-medium text-lg py-2" onClick={() => setIsMenuOpen(false)}>
                상담 신청
              </a>
              <a
                href="https://pf.kakao.com/_example"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-4 bg-yellow-400 text-text-primary rounded-button font-bold text-lg mt-2"
              >
                <MessageCircle size={20} />
                카카오톡 상담하기
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

const Footer: React.FC = () => (
  <footer className="bg-primary-500 text-warm-50 py-16">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-3 gap-12 mb-12">
        {/* 브랜드 */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-accent-400 rounded-full flex items-center justify-center">
              <span className="text-primary-500 font-bold text-lg">AI</span>
            </div>
            <span className="text-xl font-bold">
              AI <span className="text-accent-400">마스터</span> 클래스
            </span>
          </div>
          <p className="text-warm-100 text-lg leading-relaxed mb-6">
            인생 2막을 준비하는 당신을 위한<br />
            맞춤형 AI 교육 플랫폼
          </p>
          <p className="text-accent-400 text-lg font-medium">
            "AI, 어렵지 않아요"
          </p>
        </div>

        {/* 연락처 */}
        <div>
          <h4 className="text-xl font-bold mb-6 text-accent-400">문의하기</h4>
          <div className="space-y-4">
            <a
              href="https://pf.kakao.com/_example"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-lg text-warm-100 hover:text-accent-400 transition-colors"
            >
              <MessageCircle size={24} className="text-accent-400" />
              <span className="font-bold text-xl">카카오톡 @AI마스터클래스</span>
            </a>
            <a
              href="https://youtube.com/@example"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-lg text-warm-100 hover:text-accent-300 transition-colors"
            >
              <Youtube size={24} className="text-accent-300" />
              유튜브: AI마스터클래스
            </a>
            <a
              href="https://instagram.com/example"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-lg text-warm-100 hover:text-accent-300 transition-colors"
            >
              <Instagram size={24} className="text-accent-300" />
              인스타그램: @ai_master_class
            </a>
          </div>
        </div>

        {/* 운영시간 */}
        <div>
          <h4 className="text-xl font-bold mb-6 text-accent-400">상담 응답 시간</h4>
          <div className="space-y-3 text-lg text-warm-100">
            <div className="flex items-center gap-3">
              <Clock size={20} className="text-accent-400" />
              <span>평일: 오전 9시 ~ 오후 6시</span>
            </div>
            <p className="pl-8">점심: 오후 12시 ~ 1시</p>
            <p className="pl-8">주말/공휴일: 순차 답변</p>
            <p className="pl-8 mt-4 text-accent-400 font-medium">
              * 카카오톡은 24시간 접수 가능
            </p>
          </div>
        </div>
      </div>

      {/* 하단 */}
      <div className="pt-8 border-t border-warm-100/20 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-warm-100 text-base">
          © 2026 AI 마스터 클래스. All rights reserved.
        </p>
        <div className="flex gap-6 text-warm-100 text-base">
          <a href="#" className="hover:text-accent-400 transition-colors">개인정보처리방침</a>
          <a href="#" className="hover:text-accent-400 transition-colors">이용약관</a>
          <a href="#" className="hover:text-accent-400 transition-colors">사업자정보</a>
        </div>
      </div>
    </div>
  </footer>
);

function App() {
  return (
    <div className="min-h-screen bg-warm-50 text-text-primary">
      <Navbar />

      <main>
        <Hero />
        <ProductSelector />
        <LevelCards />
        <LevelTest />
        <TargetAudience />
        <CoursePreview />
        <FreeTrial />
        <FAQ />
        <ContactCTA />
      </main>

      <Footer />
      <StickyCTA />
    </div>
  );
}

export default App;
