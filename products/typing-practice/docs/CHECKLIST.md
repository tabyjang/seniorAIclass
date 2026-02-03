# ✅ 시니어 타자 연습 - 체크리스트 (Checklist)

> **버전:** 1.0
> **작성일:** 2026-02-02
> **사용법:** 완료하면 [ ]를 [x]로 바꾸세요!

---

## 📋 Phase 1: 기획

### 문서 작성
- [x] PRD.md 작성
- [x] TECH_DESIGN.md 작성
- [x] ROADMAP.md 작성
- [x] CHECKLIST.md 작성

---

## 🎨 Phase 2: UI 구현

### HTML 구조
- [x] DOCTYPE 및 기본 설정
- [x] head (charset, viewport, title)
- [x] 제목 (h1)
- [x] 부제목 (.subtitle)
- [x] 컨테이너 (.container)

### 난이도 & 진행률
- [x] 난이도 선택 드롭다운 (#level)
- [x] 진행률 바 (.progress-bar)
- [x] 진행률 채우기 (#progressFill)

### 통계 영역
- [x] 통계 컨테이너 (.stats)
- [x] 시간 박스 (#timer)
- [x] 진행 박스 (#progress)
- [x] 정확도 박스 (#accuracy)
- [x] 타수 박스 (#speed)

### 연습 영역
- [x] 문장 표시 영역 (#sentenceDisplay)
- [x] 입력창 (#typingInput)

### 버튼
- [x] 시작 버튼 (#startBtn)
- [x] 다음 문장 버튼

### 메시지 & 푸터
- [x] 메시지 영역 (#message)
- [x] 푸터 (footer)

### CSS 스타일
- [x] 전역 리셋 (* { margin: 0 })
- [x] body 배경 그라데이션
- [x] 제목 스타일
- [x] 컨테이너 스타일 (흰색, 둥근 모서리)
- [x] 통계 박스 스타일
- [x] 문장 표시 스타일
- [x] 입력창 스타일
- [x] 버튼 스타일 (primary, secondary)
- [x] 글자 상태 (.correct, .incorrect, .current)
- [x] 메시지 스타일 (.success, .info)
- [x] 진행률 바 스타일
- [x] 반응형 미디어 쿼리

---

## ⚙️ Phase 3: 기능 구현

### 데이터 준비
- [x] sentences 객체 생성
- [x] easy 문장 10개
- [x] medium 문장 10개
- [x] hard 문장 10개
- [x] proverb 문장 10개

### 변수 선언
- [x] currentLevel
- [x] currentSentences
- [x] currentSentence
- [x] currentIndex
- [x] sentenceCount
- [x] totalSentences
- [x] startTime
- [x] timerInterval
- [x] totalChars
- [x] correctChars
- [x] isPlaying

### 함수 구현
- [x] shuffleArray() - 배열 섞기
- [x] changeLevel() - 난이도 변경
- [x] startGame() - 게임 시작
- [x] loadSentence() - 문장 로드
- [x] displaySentence() - 화면 표시
- [x] checkInput() - 입력 확인
- [x] nextSentence() - 다음 문장
- [x] updateTimer() - 타이머 업데이트
- [x] updateStats() - 통계 업데이트
- [x] showMessage() - 메시지 표시
- [x] endGame() - 게임 종료

### 이벤트 연결
- [x] input 이벤트 → checkInput
- [x] keydown (Enter) → nextSentence
- [x] 시작 버튼 클릭 → startGame
- [x] 다음 버튼 클릭 → nextSentence
- [x] 난이도 변경 → changeLevel

---

## 🧪 Phase 4: 테스트

### 기능 테스트
- [ ] 시작 버튼 동작 확인
- [ ] 문장 표시 확인
- [ ] 입력 시 색상 변경 확인
- [ ] 정답 시 다음 문장 이동 확인
- [ ] 난이도 변경 확인
- [ ] 타이머 동작 확인
- [ ] 정확도 계산 확인
- [ ] 타수 계산 확인
- [ ] 10문장 완료 시 결과 확인
- [ ] 다시 시작 버튼 확인

### 브라우저 테스트
- [ ] Chrome (PC)
- [ ] Edge (PC)
- [ ] Safari (Mac)
- [ ] Chrome (Android)
- [ ] Safari (iOS)

### UI/UX 테스트
- [ ] 글씨 크기 적절한지
- [ ] 버튼 누르기 쉬운지
- [ ] 색상 구분 잘 되는지
- [ ] 모바일에서 레이아웃 깨지지 않는지

### 버그 수정
- [ ] 발견된 버그 수정
- [ ] 최종 확인

---

## 🚀 Phase 5: 배포

### GitHub 설정
- [ ] GitHub 계정 로그인
- [ ] 새 저장소 생성 (senior-typing-practice)
- [ ] 저장소 설명 작성
- [ ] Public 설정

### 파일 업로드
- [ ] index.html 업로드
- [ ] (style.css 업로드)
- [ ] (script.js 업로드)
- [ ] docs 폴더 업로드
- [ ] README.md 업로드

### GitHub Pages 활성화
- [ ] Settings > Pages 이동
- [ ] Source: main branch 선택
- [ ] Save 클릭
- [ ] URL 확인 (1-2분 대기)

### 최종 확인
- [ ] 배포 URL 접속 테스트
- [ ] 모든 기능 동작 확인
- [ ] URL 공유 준비

---

## 📝 README.md 작성

- [ ] 프로젝트 제목
- [ ] 한 줄 소개
- [ ] 스크린샷
- [ ] 기능 목록
- [ ] 사용 방법
- [ ] 기술 스택
- [ ] 라이선스
- [ ] 만든 사람

---

## 🎉 완료!

모든 체크박스가 [x]로 바뀌면 **v1.0 완성!** 🎊

---

*이 문서는 바이브코딩 가이드에 따라 작성되었습니다.*
*시니어 AI 클래스 | 범식님 & 골디 🥂*
