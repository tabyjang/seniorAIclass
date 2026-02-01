import React from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight, BookOpen } from 'lucide-react';

interface CourseItem {
  level: number;
  levelColor: string;
  number: number;
  title: string;
  description: string;
  thumbnail: string;
}

const CoursePreview: React.FC = () => {
  // PRD 기반 4레벨 구조 (총 50강)
  const courses: CourseItem[] = [
    {
      level: 1,
      levelColor: "#E85D04", // 초보자
      number: 1,
      title: "Gmail/스마트폰 기초",
      description: "디지털 첫걸음, 계정 만들기",
      thumbnail: "https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=400&h=300&fit=crop"
    },
    {
      level: 1,
      levelColor: "#E85D04", // 초보자
      number: 8,
      title: "ChatGPT 첫 대화",
      description: "AI와 처음 만나는 순간",
      thumbnail: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=300&fit=crop"
    },
    {
      level: 2,
      levelColor: "#FFD93D", // 중급자
      number: 18,
      title: "손주 동화책 만들기",
      description: "AI로 세상에 하나뿐인 선물",
      thumbnail: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop"
    },
    {
      level: 2,
      levelColor: "#FFD93D", // 중급자
      number: 24,
      title: "가족 여행 계획서",
      description: "AI가 짜주는 맞춤 여행",
      thumbnail: "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=400&h=300&fit=crop"
    },
    {
      level: 3,
      levelColor: "#4D96FF", // 고급자
      number: 32,
      title: "유튜브 채널 운영",
      description: "나만의 채널 시작하기",
      thumbnail: "https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400&h=300&fit=crop"
    },
    {
      level: 4,
      levelColor: "#9B59B6", // 전문가
      number: 45,
      title: "AI 강의/컨설팅 사업",
      description: "경험을 수익으로 만드는 법",
      thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop"
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-warm-100">
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
            어떤 걸 <span className="text-primary-500">배우게</span> 될까요?
          </h2>
          <p className="text-body-lg text-text-secondary max-w-2xl mx-auto">
            총 50강, 기초부터 전문가까지 차근차근 배워요
          </p>
        </motion.div>

        {/* 강의 카드 그리드 */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {courses.map((course, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="bg-white rounded-card overflow-hidden shadow-lg hover:shadow-xl transition-shadow group cursor-pointer"
            >
              {/* 썸네일 */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* 오버레이 */}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center">
                    <Play size={32} className="text-primary-500 ml-1" />
                  </div>
                </div>
                {/* 레벨 뱃지 */}
                <span
                  className="absolute top-4 left-4 px-3 py-1 rounded-full text-white text-sm font-bold"
                  style={{ backgroundColor: course.levelColor }}
                >
                  Lv.{course.level}
                </span>
              </div>

              {/* 정보 */}
              <div className="p-5">
                <div className="text-sm text-text-secondary mb-2">
                  {course.number}강
                </div>
                <h3 className="text-xl font-bold text-text-primary mb-2">
                  {course.title}
                </h3>
                <p className="text-text-secondary">
                  {course.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 전체 보기 버튼 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <a
            href="#curriculum"
            className="inline-flex items-center gap-3 px-8 py-5 bg-primary-500 text-white rounded-button font-bold text-xl hover:bg-primary-600 transition-colors shadow-lg"
          >
            <BookOpen size={24} />
            📚 전체 50강 보러가기
            <ArrowRight size={24} />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default CoursePreview;
