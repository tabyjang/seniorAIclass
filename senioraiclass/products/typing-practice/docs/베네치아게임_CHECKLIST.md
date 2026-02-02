# ✅ 베네치아 게임 체크리스트 (Checklist)

> **프로젝트:** 시니어 타자 연습 - 베네치아 게임
> **버전:** 1.0
> **작성일:** 2026-02-02
> **예상 기간:** 2일 (8~10시간)
> **사용법:** 완료하면 [ ]를 [x]로 바꾸세요!

---

## 📋 Phase 1: 준비 (1시간)

### 1-1. 게임 기획
- [ ] 게임 화면 와이어프레임 스케치 (손그림 또는 텍스트)
- [ ] 화면 크기 결정 (PC/태블릿 대응)
- [ ] 색상 팔레트 최종 확인

### 1-2. 파일 생성
- [ ] venezia.html 파일 생성
- [ ] 기본 HTML 구조 작성 (DOCTYPE, head, body)
- [ ] UTF-8 charset 설정
- [ ] viewport 메타태그 설정

### 1-3. 단어 데이터 준비
- [ ] 쉬움 난이도 단어 10개 배열 생성
  ```javascript
  easy: ['안녕', '감사', '사랑', '행복', '좋은', '반가', '건강', '수고', '잘자', '맛있']
  ```
- [ ] 보통 난이도 단어 10개 배열 생성
  ```javascript
  medium: ['좋은하루', '건강하세요', '맛있게드세요', '반갑습니다', '수고하셨어요']
  ```
- [ ] 어려움 난이도 단어 10개 배열 생성
  ```javascript
  hard: ['산토끼토끼야', '동해물과백두산', '천리길도한걸음', '가는말이고와야']
  ```

---

## 🎨 Phase 2: UI 구현 (1시간)

### 2-1. HTML 구조
- [ ] 상단바 영역 (제목, 점수, 생명)
- [ ] 게임 영역 (단어들이 떨어지는 공간)
- [ ] 바닥선 표시
- [ ] 입력창 영역
- [ ] 버튼 영역 (시작, 다시)

### 2-2. CSS 스타일링
- [ ] 전체 레이아웃 (flex/grid)
- [ ] 상단바 스타일 (배경색, 글자 크기)
- [ ] 게임 영역 스타일 (높이, 배경색, overflow)
- [ ] 단어 스타일 (글자 크기 32px, 색상, 위치 absolute)
- [ ] 입력창 스타일 (크기, 테두리, 포커스 효과)
- [ ] 버튼 스타일 (시작-주황, 다시-하늘색)
- [ ] 반응형 미디어 쿼리 (태블릿 대응)

---

## ⚙️ Phase 3: 게임 엔진 구현 (3시간)

### 3-1. 변수 및 클래스 선언
- [ ] 게임 상태 변수
  ```javascript
  let isPlaying = false;
  let score = 0;
  let lives = 3;
  let gameLoopId = null;
  ```
- [ ] 단어 클래스 생성
  ```javascript
  class Word {
    constructor(text, x, speed) {
      this.text = text;
      this.x = x;
      this.y = 0;
      this.speed = speed;
      this.element = null;
    }
  }
  ```
- [ ] fallingWords 배열 선언
  ```javascript
  let fallingWords = [];
  ```

### 3-2. 단어 생성 시스템
- [ ] 랜덤 단어 선택 함수
  ```javascript
  function getRandomWord() { }
  ```
- [ ] 랜덤 X 위치 생성 함수
  ```javascript
  function getRandomX() { }
  ```
- [ ] 단어 생성 함수
  ```javascript
  function spawnWord() { }
  ```
- [ ] DOM 요소 생성 및 게임 영역에 추가
- [ ] fallingWords 배열에 push

### 3-3. 게임 루프 구현
- [ ] requestAnimationFrame 설정
  ```javascript
  function gameLoop() { }
  ```
- [ ] 모든 단어 update() 호출
- [ ] Y좌표 증가 및 화면 업데이트
- [ ] gameLoop 재귀 호출

### 3-4. 바닥 충돌 체크
- [ ] 바닥 Y좌표 설정
  ```javascript
  const GAME_HEIGHT = 500; // 픽셀
  ```
- [ ] 충돌 감지 함수
  ```javascript
  function checkBottomCollision() { }
  ```
- [ ] 바닥 닿은 단어 제거
- [ ] 생명 감소 (lives--)
- [ ] 생명 UI 업데이트 (♥ 표시)
- [ ] 생명 0 체크 → 게임오버

---

## ⌨️ Phase 4: 입력 및 파괴 (2시간)

### 4-1. 입력 시스템
- [ ] 입력창 이벤트 리스너
  ```javascript
  input.addEventListener('keydown', handleInput);
  ```
- [ ] Enter 키 감지
- [ ] 입력값 가져오기
- [ ] 한글 정규화 (NFC)
  ```javascript
  input.normalize('NFC');
  ```

### 4-2. 단어 파괴 로직
- [ ] 화면 단어와 비교
  ```javascript
  const index = fallingWords.findIndex(w => w.text === input);
  ```
- [ ] 일치하는 단어 찾기
- [ ] 파괴 애니메이션 (선택사항)
- [ ] DOM 요소 제거
- [ ] fallingWords 배열에서 splice
- [ ] 입력창 초기화

### 4-3. 점수 시스템
- [ ] 점수 계산 함수
  ```javascript
  function addScore(wordLength) {
    score += wordLength * 100;
  }
  ```
- [ ] 점수 UI 업데이트
- [ ] 숫자 애니메이션 (선택사항)

---

## 🎮 Phase 5: 게임 상태 관리 (1시간)

### 5-1. 시작 기능
- [ ] 시작 버튼 이벤트
- [ ] 게임 상태 초기화
  - score = 0
  - lives = 3
  - fallingWords = []
- [ ] 입력창 활성화
- [ ] gameLoop 시작
- [ ] 단어 생성 시작

### 5-2. 게임오버 처리
- [ ] 게임오버 감지 (lives <= 0)
- [ ] gameLoop 정지
  ```javascript
  cancelAnimationFrame(gameLoopId);
  ```
- [ ] 입력창 비활성화
- [ ] 게임오버 화면 표시
  - "게임오버!" 메시지
  - 최종 점수 표시
- [ ] 다시 시작 버튼 표시

### 5-3. 재시작 기능
- [ ] 다시 시작 버튼 이벤트
- [ ] 게임 영역 초기화 (모든 단어 제거)
- [ ] 모든 변수 초기화
- [ ] 시작 기능 호출

---

## 🔗 Phase 6: 연동 및 완성 (1시간)

### 6-1. 메인 페이지 연결
- [ ] index.html에 게임 모드 선택 UI 추가
  ```html
  <div class="mode-selector">
    <a href="index.html">📚 문장 연습</a>
    <a href="venezia.html">🎮 베네치아 게임</a>
  </div>
  ```
- [ ] venezia.html에 메인으로 돌아가기 링크
  ```html
  <a href="index.html">← 메인으로</a>
  ```

### 6-2. CSS 통일
- [ ] 색상 변수 통일 (기존 index.html과 동일)
- [ ] 폰트 크기 통일
- [ ] 버튼 스타일 통일
- [ ] 헤더/푸터 스타일 통일

---

## 🧪 Phase 7: 테스트 (1시간)

### 7-1. 기능 테스트

| # | 테스트 항목 | 방법 | 결과 |
|---|------------|------|------|
| 1 | 단어 생성 확인 | 2~3초 기다려보기 | ☐ |
| 2 | 단어 하강 확인 | 떨어지는지 시각 확인 | ☐ |
| 3 | 입력 파괴 확인 | "안녕" 입력 후 사라지는지 | ☐ |
| 4 | 점수 계산 확인 | "안녕" 입력 시 200점 증가 | ☐ |
| 5 | 바닥 충돌 확인 | 일부러 놓쳐보기 | ☐ |
| 6 | 생명 감소 확인 | 하트 ♥♥♥ → ♥♥ | ☐ |
| 7 | 게임오버 확인 | 3번 놓쳐서 종료 | ☐ |
| 8 | 재시작 확인 | 다시 시작 버튼 클릭 | ☐ |

### 7-2. 브라우저 테스트

| 브라우저 | 상태 | 비고 |
|----------|------|------|
| Chrome (PC) | ☐ | 메인 브라우저 |
| Edge (PC) | ☐ | Windows 기본 |
| Chrome (태블릿) | ☐ | 키보드 연결 시 |

### 7-3. 버그 수정
- [ ] 발견된 버그 #1 수정
- [ ] 발견된 버그 #2 수정
- [ ] 최종 확인

---

## 📝 완료 확인

### 최종 체크리스트
- [ ] 모든 단계의 체크박스가 [x]로 바뀜
- [ ] Chrome에서 정상 동작
- [ ] 메인 페이지와 연결됨
- [ ] 큰 글씨 (32px 이상) 확인
- [ ] 한글 입력 정상 작동

### 산출물
- [x] venezia.html (완성된 게임)
- [x] index.html (연결된 메인 페이지)
- [ ] README 업데이트 (게임 설명 추가)

---

## 🚀 다음 단계 (v1.5)

완료 후 추가할 기능:
- [ ] 레벨 시스템 (속도 증가)
- [ ] 아이템 3개 구현
- [ ] 효과음 추가

---

*이 체크리스트는 바이브코딩 가이드에 따라 작성되었습니다.*
*시니어 AI 클래스 | 범식님 & 골디 🥂*
