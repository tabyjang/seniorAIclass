"""
고스트프롬프트 (Ghost Prompt) v1.0
화면에는 보이지만, 녹화에는 안 잡히는 마법의 프롬프터

Windows API SetWindowDisplayAffinity(WDA_EXCLUDEFROMCAPTURE) 사용
Windows 10 버전 2004 (빌드 19041) 이상 필요
"""

import tkinter as tk
from tkinter import ttk, filedialog, messagebox
import ctypes
import sys
import os
import json

# ============================================
# 상수 정의
# ============================================

# Windows API 상수
WDA_NONE = 0x00000000
WDA_EXCLUDEFROMCAPTURE = 0x00000011

# 색상 팔레트
COLORS = {
    'bg_dark': '#1a1a2e',           # 앱 배경
    'bg_prompter': '#000000',        # 프롬프터 배경
    'border_gold': '#D4A52C',        # 테두리/강조
    'btn_default': '#374151',        # 버튼 기본
    'btn_hover': '#6366F1',          # 버튼 호버
    'btn_play': '#4ADE80',           # 재생 버튼
    'text_primary': '#FFFFFF',       # 기본 텍스트
    'text_secondary': '#9CA3AF',     # 보조 텍스트
    'slider': '#818CF8',             # 슬라이더
}

# 기본 설정
DEFAULT_SETTINGS = {
    'font_size': 24,
    'scroll_speed': 1.0,
    'opacity': 0.85,
    'text_color': '#FFFFFF',
    'bg_color': '#000000',
    'window_width': 700,
    'window_height': 500,
    'sidebar_expanded': False,
}

# ============================================
# 캡처 방지 모듈
# ============================================

class CaptureGuard:
    """Windows 캡처 방지 기능"""

    def __init__(self):
        self.user32 = ctypes.windll.user32
        self.enabled = False

    @staticmethod
    def is_supported() -> bool:
        """OS 지원 여부 확인 (Windows 10 빌드 19041 이상)"""
        try:
            version = sys.getwindowsversion()
            return version.build >= 19041
        except:
            return False

    def enable(self, hwnd: int) -> bool:
        """캡처 방지 활성화"""
        try:
            result = self.user32.SetWindowDisplayAffinity(hwnd, WDA_EXCLUDEFROMCAPTURE)
            self.enabled = (result != 0)
            return self.enabled
        except Exception as e:
            print(f"캡처 방지 활성화 실패: {e}")
            return False

    def disable(self, hwnd: int) -> bool:
        """캡처 방지 비활성화"""
        try:
            result = self.user32.SetWindowDisplayAffinity(hwnd, WDA_NONE)
            self.enabled = False
            return result != 0
        except Exception as e:
            print(f"캡처 방지 비활성화 실패: {e}")
            return False


# ============================================
# 자동 스크롤 엔진
# ============================================

class AutoScroller:
    """자동 스크롤 엔진"""

    def __init__(self, text_widget, speed_var):
        self.widget = text_widget
        self.speed_var = speed_var
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
            self._job = None

    def toggle(self):
        """스크롤 토글"""
        if self.running:
            self.stop()
        else:
            self.start()
        return self.running

    def _scroll(self):
        """1픽셀 스크롤 실행"""
        if self.running:
            self.widget.yview_scroll(1, 'units')
            # 속도에 따른 간격 계산 (1.0x = 50ms)
            speed = self.speed_var.get()
            interval = max(10, int(50 / speed))
            self._job = self.widget.after(interval, self._scroll)

    def reset(self):
        """처음으로"""
        self.widget.yview_moveto(0)


# ============================================
# 메인 앱
# ============================================

class GhostPromptApp:
    """고스트프롬프트 메인 애플리케이션"""

    def __init__(self):
        self.root = tk.Tk()
        self.settings = DEFAULT_SETTINGS.copy()
        self.capture_guard = CaptureGuard()
        self.sidebar_expanded = False

        # 변수 초기화
        self.font_size_var = tk.IntVar(value=self.settings['font_size'])
        self.scroll_speed_var = tk.DoubleVar(value=self.settings['scroll_speed'])
        self.opacity_var = tk.IntVar(value=int(self.settings['opacity'] * 100))

        self.setup_window()
        self.setup_styles()
        self.create_ui()
        self.apply_capture_guard()

        # 자동 스크롤러 초기화
        self.scroller = AutoScroller(self.text_widget, self.scroll_speed_var)

    def setup_window(self):
        """윈도우 기본 설정"""
        self.root.title("🔮 고스트 프롬프터 v1.0")
        self.root.geometry(f"{self.settings['window_width']}x{self.settings['window_height']}")
        self.root.configure(bg=COLORS['bg_dark'])
        self.root.attributes('-topmost', True)  # 항상 위
        self.root.attributes('-alpha', self.settings['opacity'])

        # 최소 크기
        self.root.minsize(500, 400)

    def setup_styles(self):
        """ttk 스타일 설정"""
        style = ttk.Style()
        style.theme_use('clam')

        # 슬라이더 스타일
        style.configure('Gold.Horizontal.TScale',
                       background=COLORS['bg_dark'],
                       troughcolor=COLORS['btn_default'],
                       sliderthickness=16)

    def create_ui(self):
        """UI 생성"""
        # 메인 컨테이너
        self.main_frame = tk.Frame(self.root, bg=COLORS['bg_dark'])
        self.main_frame.pack(fill='both', expand=True)

        # 상단 타이틀바
        self.create_titlebar()

        # 컨텐츠 영역 (프롬프터 + 사이드바)
        self.content_frame = tk.Frame(self.main_frame, bg=COLORS['bg_dark'])
        self.content_frame.pack(fill='both', expand=True, padx=2, pady=2)

        # 프롬프터 영역
        self.create_prompter()

        # 접힌 사이드바 (기본)
        self.create_collapsed_sidebar()

        # 펼친 사이드바 (숨김)
        self.create_expanded_sidebar()

        # 하단 단축키 힌트
        self.create_bottom_hints()

    def create_titlebar(self):
        """상단 타이틀바"""
        titlebar = tk.Frame(self.main_frame, bg=COLORS['bg_dark'], height=40)
        titlebar.pack(fill='x', padx=2, pady=(2, 0))
        titlebar.pack_propagate(False)

        # 제목
        title_label = tk.Label(
            titlebar,
            text="🔮 고스트 프롬프터 v1.0",
            font=('Malgun Gothic', 11, 'bold'),
            fg=COLORS['border_gold'],
            bg=COLORS['bg_dark']
        )
        title_label.pack(side='left', padx=10, pady=8)

        # 캡처 방지 상태 표시
        self.capture_status = tk.Label(
            titlebar,
            text="🔒 캡처 방지 ON",
            font=('Malgun Gothic', 9),
            fg=COLORS['btn_play'],
            bg=COLORS['bg_dark']
        )
        self.capture_status.pack(side='left', padx=10)

    def create_prompter(self):
        """프롬프터 텍스트 영역"""
        self.prompter_frame = tk.Frame(
            self.content_frame,
            bg=COLORS['bg_prompter'],
            highlightbackground=COLORS['border_gold'],
            highlightthickness=1
        )
        self.prompter_frame.pack(side='left', fill='both', expand=True)

        # 텍스트 위젯
        self.text_widget = tk.Text(
            self.prompter_frame,
            font=('Malgun Gothic', self.settings['font_size']),
            fg=COLORS['text_primary'],
            bg=COLORS['bg_prompter'],
            wrap='word',
            padx=30,
            pady=30,
            relief='flat',
            cursor='arrow',
            insertbackground=COLORS['text_primary']
        )
        self.text_widget.pack(fill='both', expand=True)

        # 기본 안내 텍스트
        self.text_widget.insert('1.0',
            "고스트 프롬프터에 오신 것을 환영합니다!\n\n"
            "◀ 오른쪽 버튼을 클릭해서 설정을 펼치세요.\n\n"
            "스크립트를 입력하거나 파일을 불러오면\n"
            "여기에 대본이 표시됩니다.\n\n"
            "이 창은 화면 녹화에 캡처되지 않습니다! 🎉"
        )
        self.text_widget.config(state='disabled')  # 읽기 전용

    def create_collapsed_sidebar(self):
        """접힌 사이드바 (아이콘만)"""
        self.collapsed_sidebar = tk.Frame(
            self.content_frame,
            bg=COLORS['bg_dark'],
            width=56
        )
        self.collapsed_sidebar.pack(side='right', fill='y')
        self.collapsed_sidebar.pack_propagate(False)

        # 버튼들
        buttons = [
            ('▶', self.toggle_play, COLORS['btn_play'], '재생/정지'),
            ('↺', self.reset_scroll, COLORS['btn_default'], '처음으로'),
            ('─', None, None, None),  # 구분선
            ('🔤', self.increase_font, COLORS['btn_default'], '글자 크게'),
            ('⚡', self.increase_speed, COLORS['btn_default'], '속도 빠르게'),
            ('👁', self.toggle_visibility, COLORS['btn_default'], '표시/숨김'),
            ('─', None, None, None),  # 구분선
            ('📁', self.open_file, COLORS['btn_default'], '파일 열기'),
            ('⚙', self.toggle_sidebar, COLORS['btn_default'], '설정'),
        ]

        for text, command, color, tooltip in buttons:
            if text == '─':
                # 구분선
                sep = tk.Frame(self.collapsed_sidebar, bg='#333', height=1, width=40)
                sep.pack(pady=4)
            else:
                btn = tk.Button(
                    self.collapsed_sidebar,
                    text=text,
                    font=('Segoe UI Emoji', 14),
                    width=2,
                    height=1,
                    bg=color,
                    fg='white',
                    relief='flat',
                    cursor='hand2',
                    command=command
                )
                btn.pack(pady=3, padx=8)

                # 호버 효과
                btn.bind('<Enter>', lambda e, b=btn: b.configure(bg=COLORS['btn_hover']))
                btn.bind('<Leave>', lambda e, b=btn, c=color: b.configure(bg=c))

        # 펼치기 버튼 (맨 아래)
        expand_btn = tk.Button(
            self.collapsed_sidebar,
            text='◀',
            font=('Segoe UI', 14, 'bold'),
            width=2,
            height=1,
            bg=COLORS['border_gold'],
            fg='black',
            relief='flat',
            cursor='hand2',
            command=self.toggle_sidebar
        )
        expand_btn.pack(side='bottom', pady=10, padx=8)
        self.play_btn = None  # 나중에 참조용

    def create_expanded_sidebar(self):
        """펼친 사이드바 (전체 설정)"""
        self.expanded_sidebar = tk.Frame(
            self.content_frame,
            bg=COLORS['bg_dark'],
            width=280
        )
        # 처음엔 숨김

        # 헤더
        header = tk.Frame(self.expanded_sidebar, bg=COLORS['bg_dark'])
        header.pack(fill='x', padx=10, pady=10)

        tk.Label(
            header,
            text="설정",
            font=('Malgun Gothic', 12, 'bold'),
            fg=COLORS['border_gold'],
            bg=COLORS['bg_dark']
        ).pack(side='left')

        collapse_btn = tk.Button(
            header,
            text='▶',
            font=('Segoe UI', 10),
            bg=COLORS['btn_default'],
            fg='white',
            relief='flat',
            cursor='hand2',
            command=self.toggle_sidebar
        )
        collapse_btn.pack(side='right')

        # 스크립트 입력
        tk.Label(
            self.expanded_sidebar,
            text="📝 스크립트",
            font=('Malgun Gothic', 10),
            fg=COLORS['text_secondary'],
            bg=COLORS['bg_dark']
        ).pack(anchor='w', padx=10, pady=(10, 5))

        self.script_input = tk.Text(
            self.expanded_sidebar,
            font=('Malgun Gothic', 10),
            height=6,
            bg='#0f0f1a',
            fg='white',
            insertbackground='white',
            relief='flat',
            wrap='word'
        )
        self.script_input.pack(fill='x', padx=10, pady=(0, 5))
        self.script_input.bind('<KeyRelease>', self.on_script_change)

        # 버튼 행
        btn_row = tk.Frame(self.expanded_sidebar, bg=COLORS['bg_dark'])
        btn_row.pack(fill='x', padx=10, pady=5)

        for text, cmd in [('▶ 재생', self.toggle_play), ('↺', self.reset_scroll), ('📁', self.open_file), ('💾', self.save_file)]:
            btn = tk.Button(
                btn_row,
                text=text,
                font=('Segoe UI Emoji', 9),
                bg=COLORS['btn_play'] if '재생' in text else COLORS['btn_default'],
                fg='white',
                relief='flat',
                cursor='hand2',
                command=cmd
            )
            btn.pack(side='left', padx=2, expand=True, fill='x')

        # 글자 크기 슬라이더
        self.create_slider(
            self.expanded_sidebar,
            "🔤 글자 크기",
            self.font_size_var,
            12, 72,
            self.on_font_size_change,
            "px"
        )

        # 스크롤 속도 슬라이더
        self.create_slider(
            self.expanded_sidebar,
            "⚡ 스크롤 속도",
            self.scroll_speed_var,
            0.25, 4.0,
            None,
            "x",
            resolution=0.25
        )

        # 배경 투명도 슬라이더
        self.create_slider(
            self.expanded_sidebar,
            "👁 배경 투명도",
            self.opacity_var,
            0, 100,
            self.on_opacity_change,
            "%"
        )

        # 초기화 버튼
        reset_btn = tk.Button(
            self.expanded_sidebar,
            text="🔄 설정 초기화",
            font=('Malgun Gothic', 10),
            bg=COLORS['bg_dark'],
            fg=COLORS['text_secondary'],
            relief='flat',
            cursor='hand2',
            command=self.reset_settings
        )
        reset_btn.pack(side='bottom', fill='x', padx=10, pady=10)

    def create_slider(self, parent, label_text, variable, from_, to_, command, unit, resolution=1):
        """슬라이더 생성 헬퍼"""
        frame = tk.Frame(parent, bg=COLORS['bg_dark'])
        frame.pack(fill='x', padx=10, pady=8)

        # 라벨 + 값
        header = tk.Frame(frame, bg=COLORS['bg_dark'])
        header.pack(fill='x')

        tk.Label(
            header,
            text=label_text,
            font=('Malgun Gothic', 10),
            fg=COLORS['text_secondary'],
            bg=COLORS['bg_dark']
        ).pack(side='left')

        value_label = tk.Label(
            header,
            text=f"{variable.get()}{unit}",
            font=('Malgun Gothic', 10, 'bold'),
            fg=COLORS['border_gold'],
            bg=COLORS['bg_dark']
        )
        value_label.pack(side='right')

        # 슬라이더
        slider = ttk.Scale(
            frame,
            from_=from_,
            to=to_,
            variable=variable,
            orient='horizontal',
            style='Gold.Horizontal.TScale'
        )
        slider.pack(fill='x', pady=(5, 0))

        # 값 업데이트
        def update_label(*args):
            val = variable.get()
            if isinstance(val, float) and resolution < 1:
                value_label.config(text=f"{val:.2f}{unit}")
            else:
                value_label.config(text=f"{int(val)}{unit}")
            if command:
                command()

        variable.trace_add('write', update_label)

    def create_bottom_hints(self):
        """하단 단축키 힌트"""
        hints_frame = tk.Frame(self.main_frame, bg='#0f0f1a', height=30)
        hints_frame.pack(fill='x', side='bottom')
        hints_frame.pack_propagate(False)

        hints = [
            ("F8", "재생/정지"),
            ("F9", "표시/숨김"),
            ("Ctrl+↑↓", "속도"),
            ("PgUp/Dn", "스크롤"),
        ]

        for key, action in hints:
            hint = tk.Frame(hints_frame, bg='#0f0f1a')
            hint.pack(side='left', padx=15, pady=5)

            tk.Label(
                hint,
                text=key,
                font=('Consolas', 9),
                fg=COLORS['border_gold'],
                bg=COLORS['btn_default'],
                padx=4,
                pady=1
            ).pack(side='left')

            tk.Label(
                hint,
                text=f" {action}",
                font=('Malgun Gothic', 9),
                fg=COLORS['text_secondary'],
                bg='#0f0f1a'
            ).pack(side='left')

        # 단축키 바인딩
        self.root.bind('<F8>', lambda e: self.toggle_play())
        self.root.bind('<F9>', lambda e: self.toggle_visibility())
        self.root.bind('<Control-Up>', lambda e: self.increase_speed())
        self.root.bind('<Control-Down>', lambda e: self.decrease_speed())
        self.root.bind('<Prior>', lambda e: self.scroll_up())  # PgUp
        self.root.bind('<Next>', lambda e: self.scroll_down())  # PgDn
        self.root.bind('<Home>', lambda e: self.reset_scroll())

    def apply_capture_guard(self):
        """캡처 방지 적용"""
        self.root.update()
        hwnd = ctypes.windll.user32.GetParent(self.root.winfo_id())

        if not CaptureGuard.is_supported():
            messagebox.showwarning(
                "경고",
                "캡처 방지 기능은 Windows 10 버전 2004 이상에서만 지원됩니다.\n"
                "현재 OS에서는 일반 창으로 동작합니다."
            )
            self.capture_status.config(text="⚠️ 캡처 방지 미지원", fg='#FCD34D')
            return

        if self.capture_guard.enable(hwnd):
            self.capture_status.config(text="🔒 캡처 방지 ON", fg=COLORS['btn_play'])
        else:
            self.capture_status.config(text="❌ 캡처 방지 실패", fg='#F87171')

    # ============================================
    # 이벤트 핸들러
    # ============================================

    def toggle_sidebar(self):
        """사이드바 접기/펼치기"""
        if self.sidebar_expanded:
            # 접기
            self.expanded_sidebar.pack_forget()
            self.collapsed_sidebar.pack(side='right', fill='y')
            self.sidebar_expanded = False
        else:
            # 펼치기
            self.collapsed_sidebar.pack_forget()
            self.expanded_sidebar.pack(side='right', fill='y')
            self.sidebar_expanded = True

    def toggle_play(self):
        """재생/정지 토글"""
        is_playing = self.scroller.toggle()
        # 버튼 상태 업데이트는 나중에

    def reset_scroll(self):
        """처음으로"""
        self.scroller.stop()
        self.scroller.reset()

    def toggle_visibility(self):
        """창 표시/숨김"""
        if self.root.state() == 'withdrawn':
            self.root.deiconify()
        else:
            self.root.withdraw()

    def increase_font(self):
        """글자 크기 증가"""
        current = self.font_size_var.get()
        if current < 72:
            self.font_size_var.set(current + 4)

    def increase_speed(self):
        """속도 증가"""
        current = self.scroll_speed_var.get()
        if current < 4.0:
            self.scroll_speed_var.set(min(4.0, current + 0.25))

    def decrease_speed(self):
        """속도 감소"""
        current = self.scroll_speed_var.get()
        if current > 0.25:
            self.scroll_speed_var.set(max(0.25, current - 0.25))

    def scroll_up(self):
        """위로 스크롤"""
        self.text_widget.yview_scroll(-3, 'units')

    def scroll_down(self):
        """아래로 스크롤"""
        self.text_widget.yview_scroll(3, 'units')

    def on_font_size_change(self):
        """글자 크기 변경"""
        size = self.font_size_var.get()
        self.text_widget.config(font=('Malgun Gothic', int(size)))

    def on_opacity_change(self):
        """투명도 변경"""
        opacity = self.opacity_var.get() / 100
        self.root.attributes('-alpha', opacity)

    def on_script_change(self, event=None):
        """스크립트 입력 시 프롬프터에 반영"""
        script = self.script_input.get('1.0', 'end-1c')
        self.text_widget.config(state='normal')
        self.text_widget.delete('1.0', 'end')
        self.text_widget.insert('1.0', script)
        self.text_widget.config(state='disabled')

    def open_file(self):
        """파일 열기"""
        filepath = filedialog.askopenfilename(
            title="스크립트 파일 열기",
            filetypes=[
                ("텍스트 파일", "*.txt"),
                ("모든 파일", "*.*")
            ]
        )
        if filepath:
            try:
                # UTF-8 먼저 시도
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
            except UnicodeDecodeError:
                # EUC-KR 시도
                try:
                    with open(filepath, 'r', encoding='euc-kr') as f:
                        content = f.read()
                except:
                    messagebox.showerror("오류", "파일을 읽을 수 없습니다.")
                    return

            # 스크립트 입력창과 프롬프터에 반영
            self.script_input.delete('1.0', 'end')
            self.script_input.insert('1.0', content)
            self.on_script_change()

    def save_file(self):
        """파일 저장"""
        filepath = filedialog.asksaveasfilename(
            title="스크립트 저장",
            defaultextension=".txt",
            filetypes=[("텍스트 파일", "*.txt")]
        )
        if filepath:
            content = self.script_input.get('1.0', 'end-1c')
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            messagebox.showinfo("저장 완료", f"저장되었습니다:\n{filepath}")

    def reset_settings(self):
        """설정 초기화"""
        self.font_size_var.set(DEFAULT_SETTINGS['font_size'])
        self.scroll_speed_var.set(DEFAULT_SETTINGS['scroll_speed'])
        self.opacity_var.set(int(DEFAULT_SETTINGS['opacity'] * 100))

    def run(self):
        """앱 실행"""
        self.root.mainloop()


# ============================================
# 메인 실행
# ============================================

if __name__ == '__main__':
    app = GhostPromptApp()
    app.run()
