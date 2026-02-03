# 🔧 시니어 타자 연습 - 기술 설계 (Tech Design)

> **버전:** 1.0
> **작성일:** 2026-02-02

---

## 1. 기술 스택

| 구분 | 기술 | 버전 | 선택 이유 |
|------|------|------|----------|
| **마크업** | HTML5 | - | 표준, 호환성 |
| **스타일** | CSS3 | - | 반응형, 애니메이션 |
| **스크립트** | JavaScript | ES6+ | 프레임워크 불필요 |
| **배포** | GitHub Pages | - | 무료, 간편 |

### 왜 프레임워크 없이?
- ✅ 빠른 로딩 (프레임워크 무거움)
- ✅ 호환성 좋음 (구형 브라우저도 OK)
- ✅ 배우기 쉬움 (강의 목적)
- ✅ 배포 간단 (파일만 올리면 끝)

---

## 2. 폴더 구조

```
시니어_타자연습/
├── index.html          # 메인 페이지 (진입점)
├── style.css           # 스타일 (분리 시)
├── script.js           # 스크립트 (분리 시)
├── assets/             # 리소스
│   ├── images/         # 이미지
│   └── sounds/         # 효과음 (v1.1)
├── docs/               # 문서
│   ├── PRD.md          # 요구사항
│   ├── TECH_DESIGN.md  # 기술 설계 (이 문서)
│   ├── ROADMAP.md      # 로드맵
│   └── CHECKLIST.md    # 체크리스트
└── README.md           # 프로젝트 소개
```

---

## 3. 데이터 구조

### 3.1 문장 데이터

```javascript
const sentences = {
    easy: [
        "안녕하세요",
        "감사합니다",
        // ...
    ],
    medium: [
        "오늘 날씨가 좋습니다",
        // ...
    ],
    hard: [
        "산토끼 토끼야 어디를 가느냐",
        // ...
    ],
    proverb: [
        "낮말은 새가 듣고 밤말은 쥐가 듣는다",
        // ...
    ]
};
```

### 3.2 상태 관리 변수

```javascript
// 게임 상태
let isPlaying = false;          // 진행 중인지
let currentLevel = 'easy';      // 현재 난이도
let currentSentence = '';       // 현재 문장
let currentIndex = 0;           // 문장 배열 인덱스

// 통계
let sentenceCount = 0;          // 완료한 문장 수
let totalSentences = 10;        // 목표 문장 수
let totalChars = 0;             // 입력한 총 글자 수
let correctChars = 0;           // 맞은 글자 수
let startTime = null;           // 시작 시간
```

### 3.3 계산 공식

```javascript
// 정확도 (%)
accuracy = (correctChars / totalChars) * 100;

// 타수 (분당 글자 수)
elapsedMinutes = (현재시간 - startTime) / 1000 / 60;
speed = totalChars / elapsedMinutes;

// 진행률 (%)
progress = (sentenceCount / totalSentences) * 100;
```

---

## 4. 함수 설계

### 4.1 핵심 함수

| 함수명 | 기능 | 파라미터 | 반환값 |
|--------|------|----------|--------|
| `startGame()` | 게임 시작 | - | - |
| `loadSentence()` | 다음 문장 로드 | - | - |
| `displaySentence()` | 화면에 문장 표시 | - | - |
| `checkInput()` | 입력 확인 | - | - |
| `nextSentence()` | 다음 문장으로 | - | - |
| `endGame()` | 게임 종료 | - | - |
| `updateStats()` | 통계 업데이트 | - | - |
| `updateTimer()` | 타이머 업데이트 | - | - |
| `shuffleArray()` | 배열 섞기 | array | newArray |
| `changeLevel()` | 난이도 변경 | - | - |

### 4.2 함수 흐름도

```
사용자 [시작] 클릭
       ↓
   startGame()
       ↓
   loadSentence() → displaySentence()
       ↓
사용자 입력 → checkInput() → displaySentence()
       ↓                         ↓
   정답이면 → updateStats() → nextSentence()
       ↓                         ↓
   10문장 완료? ─Yes→ endGame()
       ↓
      No → 계속 진행
```

---

## 5. UI 컴포넌트

### 5.1 컴포넌트 목록

| 컴포넌트 | ID/Class | 역할 |
|----------|----------|------|
| 제목 | h1 | 프로그램 이름 |
| 부제목 | .subtitle | 슬로건 |
| 난이도 선택 | #level | select 드롭다운 |
| 진행률 바 | #progressFill | 진행 상황 시각화 |
| 문장 표시 | #sentenceDisplay | 연습 문장 |
| 입력창 | #typingInput | 사용자 입력 |
| 시작 버튼 | #startBtn | 게임 시작 |
| 다음 버튼 | - | 다음 문장 |
| 통계 박스 | .stat-box | 시간/진행/정확도/타수 |
| 메시지 | #message | 격려/결과 메시지 |

### 5.2 CSS 클래스

```css
/* 글자 상태 */
.char { }              /* 기본 */
.char.correct { }      /* 정답 (초록) */
.char.incorrect { }    /* 오답 (빨강) */
.char.current { }      /* 현재 위치 (하이라이트) */

/* 메시지 상태 */
.message { }           /* 기본 (숨김) */
.message.success { }   /* 성공 (초록 배경) */
.message.info { }      /* 정보 (노랑 배경) */

/* 버튼 */
.btn-primary { }       /* 메인 버튼 (주황) */
.btn-secondary { }     /* 서브 버튼 (하늘색) */
```

---

## 6. 이벤트 처리

### 6.1 이벤트 리스너

```javascript
// 입력 이벤트 (실시간 체크)
document.getElementById('typingInput')
    .addEventListener('input', checkInput);

// 엔터 키 (다음 문장)
document.getElementById('typingInput')
    .addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            nextSentence();
        }
    });

// 난이도 변경
document.getElementById('level')
    .addEventListener('change', changeLevel);
```

---

## 7. 반응형 디자인

### 7.1 브레이크포인트

| 크기 | 디바이스 | 조정 사항 |
|------|----------|----------|
| > 800px | 데스크톱 | 기본 크기 |
| 600~800px | 태블릿 | 폰트 약간 축소 |
| < 600px | 모바일 | 폰트 더 축소, 버튼 크기 유지 |

### 7.2 CSS 미디어 쿼리

```css
@media (max-width: 600px) {
    h1 { font-size: 1.8rem; }
    .sentence-display { font-size: 1.4rem; }
    #typingInput { font-size: 1.4rem; }
    .stat-value { font-size: 1.4rem; }
}
```

---

## 8. 성능 고려사항

### 8.1 최적화 포인트

| 항목 | 방법 |
|------|------|
| 로딩 속도 | 외부 라이브러리 없음 |
| 렌더링 | DOM 조작 최소화 |
| 메모리 | 사용 안 하는 변수 정리 |

### 8.2 예상 파일 크기

| 파일 | 크기 |
|------|------|
| index.html | ~15KB |
| (style.css) | ~3KB |
| (script.js) | ~5KB |
| **총합** | **~20KB** |

→ 매우 가벼움! 3G에서도 1초 내 로딩

---

## 9. 확장 계획

### v1.1 추가 기능

```javascript
// 효과음
const sounds = {
    type: new Audio('assets/sounds/type.mp3'),
    correct: new Audio('assets/sounds/correct.mp3'),
    complete: new Audio('assets/sounds/complete.mp3')
};

// localStorage 저장
function saveRecord() {
    const records = JSON.parse(localStorage.getItem('typingRecords') || '[]');
    records.push({ date: new Date(), accuracy, speed });
    localStorage.setItem('typingRecords', JSON.stringify(records));
}
```

---

*이 문서는 바이브코딩 가이드에 따라 작성되었습니다.*
