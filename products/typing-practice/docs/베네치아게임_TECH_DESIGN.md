# 🔧 베네치아 게임 기술 설계 (Tech Design)

> **프로젝트:** 시니어 타자 연습 - 베네치아 게임
> **버전:** 1.0
> **작성일:** 2026-02-02
> **목적:** 개발자를 위한 기술 상세 설계

---

## 1. 기술 스택

### 1.1 핵심 기술

| 구분 | 기술 | 버전 | 선택 이유 |
|------|------|------|----------|
| **마크업** | HTML5 | - | 표준, Canvas 없이 DOM으로 간단 구현 |
| **스타일** | CSS3 | - | 애니메이션, absolute positioning |
| **로직** | JavaScript | ES6+ | 실시간 게임 루프, 클래스 문법 |
| **렌더링** | DOM + CSS | - | Canvas보다 간단, 큰 글씨 용이 |

### 1.2 왜 Canvas가 아닌 DOM?

| 항목 | Canvas | DOM |
|------|--------|-----|
| 글자 크기 | 고정 (ctx.font) | CSS로 자유롭게 조절 |
| 접근성 | 낮음 | 높음 (screen reader 지원) |
| 구현 난이도 | 중간 | 쉬움 |
| 애니메이션 | 수동 계산 | CSS transition/animation |
| 시니어 적합성 | 보통 | **우수** |

→ **DOM 선택:** 큰 글씨, 단순 구현, 시니어 친화적

---

## 2. 폴더 구조

```
senioraiclass/products/typing-practice/
├── index.html              # 기존 문장 연습
├── venezia.html            # ⭐ 베네치아 게임 (신규)
├── docs/
│   ├── PRD.md
│   ├── ROADMAP.md
│   ├── CHECKLIST.md
│   ├── TECH_DESIGN.md      # 기존 문장 연습 기술 설계
│   ├── 한글입력_오류분석_및_해결가이드.md
│   ├── 베네치아게임_조사_및_구현가능성분석.md
│   ├── 베네치아게임_구현_로드맵.md
│   ├── 베네치아게임_PRD.md
│   └── 베네치아게임_TECH_DESIGN.md  # ⭐ 이 문서
└── README.md
```

---

## 3. 데이터 구조

### 3.1 단어 데이터

```javascript
// 난이도별 단어 목록
const wordData = {
    easy: [
        "안녕", "감사", "사랑", "행복", "좋은",
        "반가", "건강", "수고", "잘자", "맛있"
    ],
    medium: [
        "좋은하루", "건강하세요", "맛있게드세요",
        "반갑습니다", "수고하셨어요", "행복하세요"
    ],
    hard: [
        "산토끼토끼야", "동해물과백두산",
        "천리길도한걸음", "가는말이고와야"
    ]
};
```

### 3.2 게임 설정 상수

```javascript
const GAME_CONFIG = {
    // 화면 설정
    GAME_AREA_HEIGHT: 500,      // 게임 영역 높이 (px)
    GAME_AREA_WIDTH: 800,       // 게임 영역 너비 (px)
    
    // 단어 설정
    WORD_SPAWN_INTERVAL: 2000,  // 단어 생성 간격 (ms)
    WORD_SPEED_EASY: 30,        // 쉬움 속도 (px/s)
    WORD_SPEED_MEDIUM: 50,      // 보통 속도 (px/s)
    WORD_SPEED_HARD: 80,        // 어려움 속도 (px/s)
    
    // 게임 설정
    INITIAL_LIVES: 3,           // 초기 생명
    SCORE_PER_CHAR: 100,        // 글자당 점수
    BOTTOM_MARGIN: 50           // 바닥 여유 공간
};
```

### 3.3 Word 클래스

```javascript
class Word {
    constructor(text, x, speed) {
        this.text = text;           // 단어 텍스트
        this.x = x;                 // X 좌표 (px)
        this.y = 0;                 // Y 좌표 (px) - 시작은 0
        this.speed = speed;         // 하강 속도 (px/frame)
        this.element = null;        // DOM 요소 참조
        this.width = 0;             // 단어 너비 (충돌 감지용)
    }
    
    // Y 좌표 업데이트
    update() {
        this.y += this.speed;
    }
    
    // DOM 요소 생성
    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'falling-word';
        this.element.textContent = this.text;
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        return this.element;
    }
    
    // 화면 위치 업데이트
    render() {
        if (this.element) {
            this.element.style.top = `${this.y}px`;
        }
    }
    
    // 파괴 (DOM 제거)
    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
}
```

### 3.4 게임 상태 변수

```javascript
// 게임 상태
let gameState = {
    isPlaying: false,           // 게임 진행 중 여부
    score: 0,                   // 현재 점수
    lives: 3,                   // 남은 생명
    level: 1,                   // 현재 레벨
    words: [],                  // 화면에 있는 단어 배열
    lastSpawnTime: 0,           // 마지막 단어 생성 시간
    animationId: null,          // requestAnimationFrame ID
    spawnIntervalId: null       // setInterval ID
};

// DOM 요소 참조
const elements = {
    gameArea: null,             // 게임 영역
    scoreDisplay: null,         // 점수 표시
    livesDisplay: null,         // 생명 표시
    inputField: null,           // 입력창
    startButton: null,          // 시작 버튼
    restartButton: null         // 다시 시작 버튼
};
```

---

## 4. 함수 설계

### 4.1 핵심 함수 목록

| 함수명 | 기능 | 파라미터 | 반환값 |
|--------|------|----------|--------|
| `init()` | 게임 초기화 | - | - |
| `startGame()` | 게임 시작 | - | - |
| `gameLoop()` | 게임 루프 | timestamp | - |
| `spawnWord()` | 단어 생성 | - | Word |
| `updateWords()` | 모든 단어 업데이트 | - | - |
| `checkCollisions()` | 바닥 충돌 체크 | - | boolean |
| `handleInput()` | 입력 처리 | event | - |
| `destroyWord()` | 단어 파괴 | index | - |
| `addScore()` | 점수 추가 | points | - |
| `loseLife()` | 생명 감소 | - | - |
| `gameOver()` | 게임오버 | - | - |
| `resetGame()` | 게임 초기화 | - | - |

### 4.2 함수 흐름도

```
사용자 [시작] 클릭
        ↓
    startGame()
        ↓
    ┌─────────────────────────────┐
    │       gameLoop()            │
    │  ┌───────────────────────┐  │
    │  │ 1. updateWords()      │  │
    │  │    - 모든 단어 Y 증가 │  │
    │  │    - 화면 렌더링      │  │
    │  └───────────────────────┘  │
    │           ↓                 │
    │  ┌───────────────────────┐  │
    │  │ 2. checkCollisions()  │  │
    │  │    - 바닥 도달?       │  │
    │  │    - 생명 감소        │  │
    │  └───────────────────────┘  │
    │           ↓                 │
    │  ┌───────────────────────┐  │
    │  │ 3. spawnWord()        │  │
    │  │    - 시간 체크        │  │
    │  │    - 새 단어 생성     │  │
    │  └───────────────────────┘  │
    │           ↓                 │
    │    requestAnimationFrame    │
    └─────────────────────────────┘
        ↑
사용자 입력 → handleInput()
        ↓
    destroyWord() → addScore()
```

---

## 5. 알고리즘 상세

### 5.1 게임 루프 알고리즘

```javascript
function gameLoop(timestamp) {
    if (!gameState.isPlaying) return;
    
    // 1. 모든 단어 업데이트
    updateWords();
    
    // 2. 바닥 충돌 체크
    checkCollisions();
    
    // 3. 새 단어 생성 (일정 시간마다)
    if (timestamp - gameState.lastSpawnTime > GAME_CONFIG.WORD_SPAWN_INTERVAL) {
        spawnWord();
        gameState.lastSpawnTime = timestamp;
    }
    
    // 4. 다음 프레임 요청
    gameState.animationId = requestAnimationFrame(gameLoop);
}

function updateWords() {
    gameState.words.forEach(word => {
        word.update();      // Y 좌표 증가
        word.render();      // 화면 업데이트
    });
}

function checkCollisions() {
    const bottomY = GAME_CONFIG.GAME_AREA_HEIGHT - GAME_CONFIG.BOTTOM_MARGIN;
    
    // 바닥에 닿은 단어 찾기
    for (let i = gameState.words.length - 1; i >= 0; i--) {
        if (gameState.words[i].y >= bottomY) {
            // 단어 제거
            gameState.words[i].destroy();
            gameState.words.splice(i, 1);
            
            // 생명 감소
            loseLife();
        }
    }
}
```

### 5.2 단어 생성 알고리즘

```javascript
function spawnWord() {
    // 1. 랜덤 단어 선택
    const words = wordData.easy; // TODO: 레벨에 따라 변경
    const randomText = words[Math.floor(Math.random() * words.length)];
    
    // 2. 랜덤 X 위치 계산 (화면 너비 내)
    const maxX = GAME_CONFIG.GAME_AREA_WIDTH - 100; // 단어 너비 고려
    const randomX = Math.random() * maxX;
    
    // 3. 속도 계산
    const speed = GAME_CONFIG.WORD_SPEED_EASY / 60; // 60fps 기준
    
    // 4. Word 객체 생성
    const word = new Word(randomText, randomX, speed);
    
    // 5. DOM 요소 생성 및 추가
    const element = word.createElement();
    elements.gameArea.appendChild(element);
    
    // 6. 배열에 추가
    gameState.words.push(word);
}
```

### 5.3 입력 처리 알고리즘

```javascript
function handleInput(event) {
    // Enter 키만 처리
    if (event.key !== 'Enter') return;
    
    // 입력값 가져오기 및 정규화
    let input = elements.inputField.value.trim();
    input = input.normalize('NFC'); // 한글 정규화
    
    if (!input) return;
    
    // 화면에 있는 단어 중 일치하는 것 찾기
    const matchIndex = gameState.words.findIndex(
        word => word.text === input
    );
    
    if (matchIndex !== -1) {
        // 단어 파괴
        destroyWord(matchIndex);
        
        // 점수 추가
        const points = input.length * GAME_CONFIG.SCORE_PER_CHAR;
        addScore(points);
        
        // 입력창 초기화
        elements.inputField.value = '';
    }
}
```

### 5.4 단어 파괴 알고리즘

```javascript
function destroyWord(index) {
    const word = gameState.words[index];
    
    // 1. 파괴 효과 (선택사항)
    showDestroyEffect(word.x, word.y);
    
    // 2. DOM 요소 제거
    word.destroy();
    
    // 3. 배열에서 제거
    gameState.words.splice(index, 1);
}

function addScore(points) {
    gameState.score += points;
    elements.scoreDisplay.textContent = gameState.score.toLocaleString();
}
```

---

## 6. 이벤트 처리

### 6.1 이벤트 리스너 목록

```javascript
function setupEventListeners() {
    // 입력 이벤트
    elements.inputField.addEventListener('keydown', handleInput);
    
    // 버튼 이벤트
    elements.startButton.addEventListener('click', startGame);
    elements.restartButton.addEventListener('click', resetGame);
    
    // 게임 영역 클릭 시 입력창 포커스
    elements.gameArea.addEventListener('click', () => {
        elements.inputField.focus();
    });
}
```

### 6.2 키보드 이벤트 흐름

```
사용자 키 입력
    ↓
keydown 이벤트 발생
    ↓
handleInput() 호출
    ↓
입력값 정규화 (NFC)
    ↓
화면 단어와 비교
    ↓
┌─────────────┐
│   일치?     │
└─────────────┘
     ↓
   Yes        No
     ↓         ↓
destroyWord()  무시
     ↓
addScore()
     ↓
input 초기화
```

---

## 7. 성능 고려사항

### 7.1 최적화 포인트

| 항목 | 문제 | 해결책 |
|------|------|--------|
| **메모리 누수** | DOM 요소 계속 생성 | 명시적 removeChild() |
| **배열 순회** | splice()로 인한 재배열 | 뒤에서부터 순회 |
| **프레임 드롭** | 너무 많은 단어 | 최대 개수 제한 (예: 10개) |
| **한글 입력** | 정규화 비용 | 입력 시 한 번만 |

### 7.2 성능 예상

| 항목 | 목표 | 측정 방법 |
|------|------|----------|
| **FPS** | 60fps | 개발자도구 Performance |
| **응답 시간** | < 16ms | console.time() |
| **메모리** | < 50MB | 개발자도구 Memory |

### 7.3 CSS 최적화

```css
/* GPU 가속 */
.falling-word {
    position: absolute;
    will-change: top;  /* 변경될 속성 미리 알림 */
    transform: translateZ(0);  /* GPU 레이어 생성 */
}

/* 리플로우 최소화 */
.game-area {
    contain: layout style;  /* 내부 변경이 외부에 영향 안 줌 */
}
```

---

## 8. 에러 처리

### 8.1 주요 에러 시나리오

| 에러 | 원인 | 처리 방법 |
|------|------|----------|
| **단어 생성 실패** | DOM 없음 | null 체크 후 재시도 |
| **게임 루프 중복** | 빠른 재시작 | cancelAnimationFrame() |
| **입력창 null** | DOM 로딩 전 접근 | window.onload 대기 |
| **한글 깨짐** | 인코딩 문제 | meta charset="UTF-8" |

### 8.2 안전 장치

```javascript
// 게임 루프 중복 방지
function startGame() {
    if (gameState.isPlaying) return;
    if (gameState.animationId) {
        cancelAnimationFrame(gameState.animationId);
    }
    // ... 게임 시작
}

// DOM 요소 안전 제거
function safeRemoveElement(element) {
    if (element && element.parentNode) {
        element.parentNode.removeChild(element);
    }
}
```

---

## 9. 확장 계획

### 9.1 v1.5 추가 기능

```javascript
// 레벨 시스템
function checkLevelUp() {
    if (gameState.score >= 1000 && gameState.level === 1) {
        gameState.level = 2;
        GAME_CONFIG.WORD_SPAWN_INTERVAL = 1500; // 더 빠르게
    }
}

// 아이템 클래스
class Item {
    constructor(type, x, y) {
        this.type = type;  // 'clear', 'slow', 'life'
        this.x = x;
        this.y = y;
    }
    
    activate() {
        switch(this.type) {
            case 'clear':
                clearAllWords();
                break;
            case 'slow':
                slowDownWords();
                break;
            case 'life':
                addLife();
                break;
        }
    }
}
```

### 9.2 v2.0 고급 기능

- 랭킹 저장 (localStorage)
- 2인 대전 모드 (WebSocket)
- 효과음 (Web Audio API)
- 파티클 효과 (파괴 시)

---

*이 문서는 시니어 타자 연습 앱의 베네치아 게임 개발을 위한 기술 설계입니다.*
*시니어 AI 클래스 | 범식님 & 골디 🥂*
