# 고스트프롬프트 기술 설계서

## 1. 아키텍처 개요

```
┌─────────────────────────────────────────────┐
│                Ghost Prompt                  │
├─────────────────────────────────────────────┤
│  ┌─────────┐  ┌─────────┐  ┌─────────────┐ │
│  │   UI    │  │  Core   │  │  Windows    │ │
│  │ (tkinter│←→│ Engine  │←→│  API        │ │
│  │   GUI)  │  │         │  │ (ctypes)    │ │
│  └─────────┘  └─────────┘  └─────────────┘ │
└─────────────────────────────────────────────┘
```

## 2. 핵심 기술: 캡처 방지

### 2.1 Windows API

```python
import ctypes

# 상수 정의
WDA_EXCLUDEFROMCAPTURE = 0x00000011

# user32.dll 로드
user32 = ctypes.windll.user32

# 창 핸들 가져오기
hwnd = window.winfo_id()

# 캡처 방지 적용
user32.SetWindowDisplayAffinity(hwnd, WDA_EXCLUDEFROMCAPTURE)
```

### 2.2 지원 조건
- **OS**: Windows 10 버전 2004 (빌드 19041) 이상
- **API**: `SetWindowDisplayAffinity` with `WDA_EXCLUDEFROMCAPTURE` flag

### 2.3 동작 원리
1. 윈도우 생성 시 HWND(창 핸들) 획득
2. `SetWindowDisplayAffinity` 호출
3. DWM(Desktop Window Manager)이 해당 창을 캡처 대상에서 제외
4. 모니터에는 정상 출력, 캡처 버퍼에서만 제외

---

## 3. 모듈 구조

```
ghost-prompt/
├── ghost_prompt.py      # 메인 실행 파일
├── core/
│   ├── __init__.py
│   ├── capture_guard.py # 캡처 방지 모듈
│   ├── scroller.py      # 자동 스크롤 엔진
│   └── settings.py      # 설정 관리
├── ui/
│   ├── __init__.py
│   ├── main_window.py   # 메인 윈도우
│   ├── settings_dialog.py
│   └── widgets.py       # 커스텀 위젯
└── assets/
    └── icon.ico
```

---

## 4. 주요 클래스 설계

### 4.1 CaptureGuard (캡처 방지)

```python
class CaptureGuard:
    """Windows 캡처 방지 기능"""

    WDA_NONE = 0x00000000
    WDA_EXCLUDEFROMCAPTURE = 0x00000011

    def __init__(self, hwnd: int):
        self.hwnd = hwnd
        self.user32 = ctypes.windll.user32

    def enable(self) -> bool:
        """캡처 방지 활성화"""
        return self.user32.SetWindowDisplayAffinity(
            self.hwnd,
            self.WDA_EXCLUDEFROMCAPTURE
        )

    def disable(self) -> bool:
        """캡처 방지 비활성화"""
        return self.user32.SetWindowDisplayAffinity(
            self.hwnd,
            self.WDA_NONE
        )

    @staticmethod
    def is_supported() -> bool:
        """OS 지원 여부 확인"""
        version = sys.getwindowsversion()
        # Windows 10 빌드 19041 이상
        return version.build >= 19041
```

### 4.2 AutoScroller (자동 스크롤)

```python
class AutoScroller:
    """자동 스크롤 엔진"""

    SPEEDS = {
        'slow': 50,      # 50ms 간격
        'normal': 30,    # 30ms 간격
        'fast': 15       # 15ms 간격
    }

    def __init__(self, text_widget):
        self.widget = text_widget
        self.speed = 'normal'
        self.running = False
        self._job = None

    def start(self):
        """스크롤 시작"""
        self.running = True
        self._scroll()

    def stop(self):
        """스크롤 정지"""
        self.running = False
        if self._job:
            self.widget.after_cancel(self._job)

    def _scroll(self):
        """1픽셀 스크롤"""
        if self.running:
            self.widget.yview_scroll(1, 'pixels')
            interval = self.SPEEDS[self.speed]
            self._job = self.widget.after(interval, self._scroll)
```

### 4.3 GhostPromptApp (메인 앱)

```python
class GhostPromptApp:
    """고스트프롬프트 메인 애플리케이션"""

    def __init__(self):
        self.root = tk.Tk()
        self.setup_window()
        self.setup_ui()
        self.apply_capture_guard()

    def setup_window(self):
        """윈도우 기본 설정"""
        self.root.title("고스트프롬프트")
        self.root.geometry("400x600")
        self.root.attributes('-topmost', True)  # 항상 위
        self.root.attributes('-alpha', 0.9)     # 투명도

    def apply_capture_guard(self):
        """캡처 방지 적용"""
        self.root.update()  # HWND 생성 대기
        hwnd = self.root.winfo_id()
        self.guard = CaptureGuard(hwnd)

        if self.guard.is_supported():
            self.guard.enable()
        else:
            messagebox.showwarning(
                "경고",
                "Windows 10 2004 이상이 필요합니다"
            )

    def run(self):
        self.root.mainloop()
```

---

## 5. UI 레이아웃

### 5.1 메인 윈도우

```python
# tkinter 레이아웃 구조
root
├── toolbar_frame (상단 툴바)
│   ├── btn_open (파일 열기)
│   ├── btn_settings (설정)
│   └── btn_minimize (최소화)
├── text_frame (대본 영역)
│   └── text_widget (스크롤 가능한 텍스트)
└── control_frame (하단 컨트롤)
    ├── btn_play (재생/정지)
    ├── speed_slider (속도 조절)
    └── font_size_control (글자 크기)
```

### 5.2 스타일 상수

```python
STYLES = {
    'bg_color': '#1a1a1a',       # 배경색
    'text_color': '#ffffff',      # 글자색
    'accent_color': '#D4A52C',    # 강조색 (골드)
    'button_color': '#334155',    # 버튼색

    'font_family': 'Malgun Gothic',  # 맑은 고딕
    'font_size_default': 24,
    'font_size_min': 16,
    'font_size_max': 48,

    'window_alpha': 0.85,         # 기본 투명도
}
```

---

## 6. 단축키 바인딩

| 키 | 동작 |
|----|------|
| `Space` | 스크롤 시작/정지 |
| `↑` | 속도 증가 |
| `↓` | 속도 감소 |
| `Home` | 처음으로 |
| `End` | 끝으로 |
| `Ctrl+O` | 파일 열기 |
| `Ctrl++` | 글자 크게 |
| `Ctrl+-` | 글자 작게 |
| `Escape` | 종료 |

---

## 7. 설정 저장

### 7.1 설정 파일 위치
```
%APPDATA%/GhostPrompt/settings.json
```

### 7.2 설정 구조
```json
{
  "window": {
    "width": 400,
    "height": 600,
    "x": 100,
    "y": 100,
    "alpha": 0.85,
    "topmost": true
  },
  "text": {
    "font_size": 24,
    "font_family": "Malgun Gothic",
    "color": "#ffffff"
  },
  "scroll": {
    "speed": "normal",
    "auto_start": false
  },
  "recent_files": [
    "C:/scripts/script1.txt",
    "C:/scripts/script2.txt"
  ]
}
```

---

## 8. 에러 처리

### 8.1 OS 미지원
```python
if not CaptureGuard.is_supported():
    # 경고 표시 후 일반 모드로 실행
    show_warning("캡처 방지 기능은 Windows 10 2004 이상에서만 지원됩니다.")
```

### 8.2 API 호출 실패
```python
result = user32.SetWindowDisplayAffinity(hwnd, flag)
if result == 0:
    error_code = ctypes.get_last_error()
    logging.error(f"캡처 방지 설정 실패: {error_code}")
```

---

## 9. 테스트 계획

### 9.1 캡처 방지 테스트
- [ ] OBS Studio 화면 캡처
- [ ] OBS 윈도우 캡처
- [ ] Windows 캡처 도구
- [ ] Zoom 화면 공유
- [ ] Discord 화면 공유
- [ ] 캡컷 화면 녹화

### 9.2 기능 테스트
- [ ] 텍스트 파일 로드 (UTF-8, EUC-KR)
- [ ] 자동 스크롤 속도별 테스트
- [ ] 창 위치/크기 저장/복원
- [ ] 단축키 동작

---

## 10. 배포

### 10.1 PyInstaller 빌드
```bash
pyinstaller --onefile --windowed --icon=assets/icon.ico ghost_prompt.py
```

### 10.2 결과물
```
dist/
└── ghost_prompt.exe  # 단일 실행 파일 (~15MB)
```
