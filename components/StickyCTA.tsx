import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X } from 'lucide-react';

const StickyCTA: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 z-50 lg:hidden"
        >
          {/* 확장된 상태 */}
          {isExpanded ? (
            <div className="bg-white border-t-2 border-primary-500 shadow-2xl">
              {/* 접기 버튼 */}
              <button
                onClick={() => setIsExpanded(false)}
                className="absolute -top-10 right-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-text-secondary hover:text-primary-500 transition-colors"
                aria-label="닫기"
              >
                <X size={20} />
              </button>

              <div className="container mx-auto px-4 py-4">
                {/* 안내 텍스트 */}
                <div className="text-center mb-3">
                  <p className="text-lg font-medium text-text-primary">궁금한 점이 있으신가요?</p>
                </div>

                {/* 버튼 */}
                <a
                  href="#contact"
                  className="flex items-center justify-center gap-2 py-4 bg-primary-500 text-white rounded-button font-bold text-lg shadow-lg hover:bg-primary-600 transition-colors w-full"
                >
                  <Send size={24} />
                  문의하기
                </a>
              </div>
            </div>
          ) : (
            /* 축소된 상태 - 플로팅 버튼 */
            <div className="flex justify-center pb-6">
              <button
                onClick={() => setIsExpanded(true)}
                className="w-16 h-16 bg-primary-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform text-sm font-bold"
              >
                문의
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* 데스크톱용 플로팅 버튼 */}
      {isVisible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="hidden lg:flex fixed bottom-8 right-8 z-50"
        >
          <a
            href="#contact"
            className="group flex items-center gap-3 px-6 py-4 bg-primary-500 text-white rounded-full shadow-2xl hover:shadow-3xl hover:scale-105 transition-all"
          >
            <Send size={24} />
            <span className="font-bold text-lg">문의하기</span>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default StickyCTA;
