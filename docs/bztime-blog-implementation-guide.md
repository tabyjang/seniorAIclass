# bztime 블로그 구현 가이드 - 정적 블로그 (Idea 1)

> **Next.js + MDX 기반 정적 블로그 상세 구현 가이드**
> 
> 개발기간: 7일
> 난이도: ⭐⭐ 중
> 비용: 월 20,000원 (도메인만)

---

## 🚀 빠른 시작 (30분 완성)

### Step 1: 프로젝트 생성 (10분)

```bash
# 1. Next.js 프로젝트 생성
npx create-next-app@latest bztime-blog --typescript --tailwind --eslint --app --no-src-dir

# 2. 프로젝트로 이동
cd bztime-blog

# 3. 필수 패키지 설치
npm install contentlayer next-contentlayer date-fns
npm install -D @tailwindcss/typography
npm install @giscus/react
```

### Step 2: 기본 설정 파일 (10분)

**contentlayer.config.ts** 생성:

```typescript
import { defineDocumentType, makeSource } from 'contentlayer/source-files'

export const Post = defineDocumentType(() => ({
  name: 'Post',
  filePathPattern: `blog/**/*.mdx`,
  fields: {
    title: { type: 'string', required: true },
    date: { type: 'date', required: true },
    description: { type: 'string', required: true },
    category: { type: 'string', required: true },
    tags: { type: 'list', of: { type: 'string' }, default: [] },
    published: { type: 'boolean', default: true },
  },
  computedFields: {
    url: { type: 'string', resolve: (post) => `/blog/${post._raw.flattenedPath.replace('blog/', '')}` },
    slug: { type: 'string', resolve: (post) => post._raw.flattenedPath.replace('blog/', '') },
  },
}))

export default makeSource({
  contentDirPath: 'content',
  documentTypes: [Post],
})
```

### Step 3: Next.js 설정 수정 (5분)

**next.config.js** 수정:

```javascript
const { withContentlayer } = require('next-contentlayer')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true,
  },
}

module.exports = withContentlayer(nextConfig)
```

**tsconfig.json** - 이미 설정되어 있음 (contentlayer/types 자동 추가됨)

### Step 4: Tailwind 설정 (5분)

**tailwind.config.ts** 수정:

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            'code::before': { content: '""' },
            'code::after': { content: '""' },
          },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}

export default config
```

---

## 📁 폴더 구조 생성

```bash
# 폴더 생성
mkdir -p content/blog
mkdir -p components/blog
mkdir -p app/blog/\[slug\]
mkdir -p public/images/blog
mkdir -p lib
```

최종 폴더 구조:

```
bztime-blog/
├── app/
│   ├── blog/
│   │   ├── [slug]/
│   │   │   └── page.tsx       # 글 상세 페이지
│   │   ├── page.tsx           # 블로그 목록
│   │   └── layout.tsx         # 블로그 레이아웃
│   ├── layout.tsx             # 루트 레이아웃
│   └── page.tsx               # 홈페이지
├── components/
│   ├── blog/
│   │   ├── PostCard.tsx       # 글 카드 컴포넌트
│   │   ├── PostList.tsx       # 글 목록
│   │   ├── PostContent.tsx    # 글 내용 렌더링
│   │   └── Comments.tsx       # 댓글 컴포넌트
│   └── Header.tsx             # 헤더
├── content/
│   └── blog/                  # Markdown 글 저장소
│       └── (여기에 .mdx 파일 저장)
├── lib/
│   └── utils.ts               # 유틸리티 함수
├── public/
│   └── images/blog/           # 블로그 이미지
├── contentlayer.config.ts
├── next.config.js
└── tailwind.config.ts
```

---

## 💻 컴포넌트 개발

### 1. 루트 레이아웃 (app/layout.tsx)

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'bztime AI 블로그',
  description: 'AI 도구와 디지털 트렌드를 쉽게 알아보세요',
  keywords: ['AI', 'ChatGPT', '디지털', '생산성', 'bztime'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}
```

### 2. 헤더 컴포넌트 (components/Header.tsx)

```typescript
import Link from 'next/link'

export default function Header() {
  return (
    <header className="border-b bg-white">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-blue-600">
            bztime
          </Link>
          <nav className="flex gap-6">
            <Link href="/" className="text-gray-600 hover:text-blue-600">
              홈
            </Link>
            <Link href="/blog" className="text-gray-600 hover:text-blue-600">
              블로그
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-blue-600">
              소개
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
```

### 3. 푸터 컴포넌트 (components/Footer.tsx)

```typescript
export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t mt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <p className="text-center text-gray-500 text-sm">
          © 2026 bztime. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
```

### 4. 홈페이지 (app/page.tsx)

```typescript
import Link from 'next/link'
import { allPosts } from 'contentlayer/generated'
import PostCard from '@/components/blog/PostCard'

export default function Home() {
  const recentPosts = allPosts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6)

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      {/* 히어로 섹션 */}
      <section className="text-center py-16">
        <h1 className="text-4xl font-bold mb-4">
          AI와 디지털 도구로<br />
          <span className="text-blue-600">생활을 더 쉽게</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          50대부터 시작하는 AI 실전 가이드
        </p>
        <Link
          href="/blog"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          블로그 보기
        </Link>
      </section>

      {/* 최신 글 */}
      <section className="py-12">
        <h2 className="text-2xl font-bold mb-8">최신 글</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recentPosts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            href="/blog"
            className="text-blue-600 font-semibold hover:underline"
          >
            모든 글 보기 →
          </Link>
        </div>
      </section>
    </main>
  )
}
```

### 5. 글 카드 컴포넌트 (components/blog/PostCard.tsx)

```typescript
import Link from 'next/link'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Post } from 'contentlayer/generated'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
      <Link href={post.url}>
        <div className="p-6">
          <span className="text-sm text-blue-600 font-medium">
            {post.category}
          </span>
          <h3 className="text-xl font-bold mt-2 mb-3 line-clamp-2">
            {post.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {post.description}
          </p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <time dateTime={post.date}>
              {format(new Date(post.date), 'yyyy년 M월 d일', { locale: ko })}
            </time>
            {post.tags.length > 0 && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                {post.tags[0]}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  )
}
```

### 6. 블로그 목록 페이지 (app/blog/page.tsx)

```typescript
import { allPosts } from 'contentlayer/generated'
import PostCard from '@/components/blog/PostCard'

export default function BlogPage() {
  const posts = allPosts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <main className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">AI 블로그</h1>
      <p className="text-gray-600 mb-8">
        AI 도구와 디지털 트렌드를 쉽게 설명합니다
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </main>
  )
}
```

### 7. 블로그 레이아웃 (app/blog/layout.tsx)

```typescript
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
}
```

### 8. 글 상세 페이지 (app/blog/[slug]/page.tsx)

```typescript
import { allPosts } from 'contentlayer/generated'
import { notFound } from 'next/navigation'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import PostContent from '@/components/blog/PostContent'
import Comments from '@/components/blog/Comments'

export async function generateStaticParams() {
  return allPosts.map((post) => ({
    slug: post.slug,
  }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = allPosts.find((p) => p.slug === params.slug)
  if (!post) return {}
  
  return {
    title: `${post.title} | bztime 블로그`,
    description: post.description,
  }
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = allPosts.find((p) => p.slug === params.slug)
  
  if (!post) {
    notFound()
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      {/* 글 헤더 */}
      <header className="mb-8">
        <span className="text-blue-600 font-medium">{post.category}</span>
        <h1 className="text-3xl font-bold mt-2 mb-4">{post.title}</h1>
        <p className="text-gray-600 text-lg mb-4">{post.description}</p>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <time dateTime={post.date}>
            {format(new Date(post.date), 'yyyy년 M월 d일', { locale: ko })}
          </time>
          {post.tags.length > 0 && (
            <div className="flex gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="bg-gray-100 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* 글 내용 */}
      <PostContent content={post.body.code} />

      {/* 댓글 */}
      <Comments slug={post.slug} />
    </main>
  )
}
```

### 9. 글 내용 컴포넌트 (components/blog/PostContent.tsx)

```typescript
'use client'

import { useMDXComponent } from 'next-contentlayer/hooks'

interface PostContentProps {
  content: string
}

export default function PostContent({ content }: PostContentProps) {
  const MDXComponent = useMDXComponent(content)

  return (
    <article className="prose prose-lg max-w-none">
      <MDXComponent />
    </article>
  )
}
```

### 10. 댓글 컴포넌트 (components/blog/Comments.tsx)

```typescript
'use client'

import Giscus from '@giscus/react'

interface CommentsProps {
  slug: string
}

export default function Comments({ slug }: CommentsProps) {
  return (
    <div className="mt-12 pt-8 border-t">
      <h3 className="text-xl font-bold mb-6">댓글</h3>
      <Giscus
        repo="your-username/bztime-comments"  // GitHub 저장소 변경 필요
        repoId="R_kgD..."  // GitHub에서 확인
        category="Announcements"
        categoryId="DIC_kwD..."  // GitHub에서 확인
        mapping="specific"
        term={slug}
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="bottom"
        theme="light"
        lang="ko"
        loading="lazy"
      />
    </div>
  )
}
```

---

## 📝 샘플 글 작성

**content/blog/first-post.mdx** 생성:

```markdown
---
title: "ChatGPT로 하루 1시간 절약하는 5가지 방법"
date: "2026-01-31"
description: "ChatGPT를 활용해 일상 업무를 자동화하고 하루 1시간을 절약하는 실전 팁을 소개합니다"
category: "AI 도구"
tags: ["ChatGPT", "생산성", "자동화"]
published: true
---

# ChatGPT로 하루 1시간 절약하는 5가지 방법

ChatGPT는 단순한 대화 도구가 아닙니다. 제대로 활용하면 매일 반복되는 시간 낭비를 없앨 수 있습니다.

## 1. 이메일 자동 작성

같은 내용의 이메일을 반복해서 쓰시나요?

**예시 프롬프트:**
```
다음 내용을 정중한 비즈니스 이메일로 작성해줘:
- 회의 일정 변경 요청
- 새로운 시간: 2월 3일 오후 3시
- 사유: 갑작스러운 운영 이슈
```

## 2. 회의록 요약

긴 회의록을 빠르게 정리하세요.

**예시 프롬프트:**
```
다음 회의록을 3줄로 요약하고, 결정사항과 다음 할 일을 bullet point로 정리해줘:
[회의록 내용 붙여넣기]
```

## 3. 보고서 초안 작성

보고서 구조를 잡는데 시간을 쓰지 마세요.

**예시 프롬프트:**
```
월간 매출 보고서의 구조를 잡아줘. 포함할 내용:
- 전월 대비 증감률
- 주요 거래처별 실적
- 개선점 및 다음 달 목표
```

## 4. 데이터 정리

엑셀 작업 시간을 90% 줄이세요.

**예시 프롬프트:**
```
다음 데이터를 표 형식으로 정리하고, 합계와 평균을 계산해줘:
[데이터 붙여넣기]
```

## 5. 학습 계획 수립

새로운 기술을 배울 때 로드맵을 만들어주세요.

**예시 프롬프트:**
```
ChatGPT 활용법을 배우고 싶어. 2주 완성 학습 계획을 세워줘.
매일 30분 투자할 예정이야.
```

---

## 오늘 바로 시작하기

1. chat.openai.com 접속
2. 무료 계정 생성
3. 위 예시 프롬프트 중 하나 입력
4. 결과 확인 및 수정

**팁:** 결과가 마음에 안 들면 "더 간결하게" 또는 "더 친근한 톤으로" 라고 추가 요청하세요.

---

*더 많은 AI 활용법이 궁금하신가요? 댓글로 질문해주세요!*
```

---

## 🚀 배포

### 1. 정적 빌드

```bash
# 프로덕션 빌드
npm run build

# dist/ 폴더에 정적 파일 생성됨
```

### 2. Vercel 배포 (권장)

```bash
# Vercel CLI 설치
npm install -g vercel

# 배포
vercel

# 프로덕션 배포
vercel --prod
```

### 3. 자체 서버 배포

```bash
# 빌드
npm run build

# dist/ 폴더를 서버에 업로드
# bztime.com/blog/ 경로로 연결
```

---

## ✅ 댓글 설정 (Giscus)

### 1. GitHub 저장소 생성

1. github.com에서 새 저장소 생성: `bztime-comments`
2. Public으로 설정

### 2. Giscus 설치

1. giscus.app 접속
2. GitHub 계정으로 로그인
3. 저장소 선택: `your-username/bztime-comments`
4. 설정 완료 후 repoId, categoryId 복사
5. `components/blog/Comments.tsx`에 붙여넣기

### 3. GitHub Discussions 활성화

1. 저장소 Settings → Features → Discussions 체크
2. Discussions 탭 생성됨

---

## 📋 7일 개발 일정

### Day 1: 프로젝트 설정
- [ ] Next.js 프로젝트 생성
- [ ] Contentlayer 설정
- [ ] Tailwind 설정
- [ ] 기본 폴더 구조 생성

### Day 2: 레이아웃 & 홈페이지
- [ ] Header/Footer 컴포넌트
- [ ] 루트 레이아웃
- [ ] 홈페이지 히어로
- [ ] 샘플 글 1개 작성

### Day 3: 블로그 목록
- [ ] PostCard 컴포넌트
- [ ] 블로그 목록 페이지
- [ ] 카테고리/태그 표시
- [ ] 반응형 디자인

### Day 4: 글 상세 페이지
- [ ] 동적 라우팅 설정
- [ ] 글 상세 페이지
- [ ] PostContent 컴포넌트
- [ ] 메타데이터 설정

### Day 5: 댓글 기능
- [ ] GitHub 저장소 생성
- [ ] Giscus 설정
- [ ] Comments 컴포넌트
- [ ] 댓글 테스트

### Day 6: 스타일링 & 최적화
- [ ] 전체 디자인 조정
- [ ] SEO 메타태그
- [ ] OG 이미지 설정
- [ ] 페이지네이션 (필요시)

### Day 7: 배포
- [ ] 빌드 테스트
- [ ] Vercel 배포 또는
- [ ] 자체 서버 업로드
- [ ] 도메인 연결
- [ ] 첫 글 3개 작성

---

## 🎯 다음 단계

이제 바로 시작하세요! 필요하면 추가 기능을 구현할 수 있습니다:

1. **검색 기능**: Fuse.js 또는 Algolia
2. **뉴스레터**: ConvertKit API 연동
3. **소셜 공유**: next-share 라이브러리
4. **이미지 최적화**: next/image 설정
5. **다크모드**: next-themes

---

**🚀 지금 바로 `npx create-next-app`을 실행하세요!**
