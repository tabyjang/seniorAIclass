"""
고스트프롬프트 (Ghost Prompt) v1.0
화면에는 보이지만, 녹화에는 안 잡히는 마법의 프롬프터
"""

import tkinter as tk
from tkinter import filedialog
import ctypes
import sys

# ============================================
# 상수
# ============================================

WDA_NONE = 0x00000000
WDA_EXCLUDEFROMCAPTURE = 0x00000011

COLORS = {
    "bg_dark": "#0f0f1a",
    "bg_title": "#1a1a2e",
    "bg_main": "#000000",
    "bg_panel": "#1e2130",
    "gold": "#d4a52c",
    "green": "#4ade80",
    "green_dark": "#1a3d2a",
    "red": "#F87171",
    "red_dark": "#3d2a2a",
    "yellow": "#FCD34D",
    "text_white": "#ffffff",
    "text_gray": "#6B7280",
    "btn_gray": "#374151",
    "btn_orange": "#F97316",
    "border": "#333333",
}


# ============================================
# 캡처 방지
# ============================================


class CaptureGuard:
    def __init__(self):
        self.user32 = ctypes.windll.user32
        self.enabled = False

    @staticmethod
    def is_supported():
        try:
            return sys.getwindowsversion().build >= 19041
        except:
            return False

    def enable(self, hwnd):
        try:
            result = self.user32.SetWindowDisplayAffinity(hwnd, WDA_EXCLUDEFROMCAPTURE)
            self.enabled = result != 0
            return self.enabled
        except:
            return False

    def disable(self, hwnd):
        try:
            result = self.user32.SetWindowDisplayAffinity(hwnd, WDA_NONE)
            self.enabled = False
            return result != 0
        except:
            return False


# ============================================
# 프롬프터 뷰어
# ============================================


class PrompterViewer:
    def __init__(self, root):
        self.root = root
        self.capture_guard = CaptureGuard()
        self.capture_enabled = tk.BooleanVar(value=True)
        self.font_size = 32

        self.setup_window()
        self.create_ui()

    def setup_window(self):
        self.root.title("고스트 프롬프터 v1.0")
        self.root.geometry("750x500+50+100")
        self.root.configure(bg=COLORS["gold"])
        self.root.attributes("-topmost", True)
        self.root.attributes("-alpha", 0.98)
        self.root.minsize(400, 300)

    def create_ui(self):
        # 메인 프레임
        self.main = tk.Frame(self.root, bg=COLORS["bg_main"])
        self.main.pack(fill="both", expand=True, padx=2, pady=2)

        # 타이틀바
        title = tk.Frame(self.main, bg=COLORS["bg_title"], height=40)
        title.pack(fill="x")
        title.pack_propagate(False)

        left = tk.Frame(title, bg=COLORS["bg_title"])
        left.pack(side="left", padx=10, pady=6)
        tk.Label(left, text="🔮", font=("Segoe UI Emoji", 12), bg=COLORS["bg_title"]).pack(side="left")
        tk.Label(left, text="고스트 프롬프터", font=("Malgun Gothic", 11, "bold"),
                 bg=COLORS["bg_title"], fg=COLORS["gold"]).pack(side="left", padx=5)

        right = tk.Frame(title, bg=COLORS["bg_title"])
        right.pack(side="right", padx=10)
        for c in [COLORS["yellow"], COLORS["green"], COLORS["red"]]:
            tk.Frame(right, bg=c, width=10, height=10).pack(side="left", padx=2)

        # 상태 뱃지
        badge = tk.Frame(self.main, bg=COLORS["bg_main"])
        badge.pack(fill="x", padx=12, pady=(8, 0))
        self.status_label = tk.Label(badge, text="🔒 캡처 방지 ON", font=("Malgun Gothic", 9),
                                     bg=COLORS["green_dark"], fg=COLORS["green"], padx=8, pady=2)
        self.status_label.pack(side="left")

        # 텍스트 영역 - Text 위젯 사용
        text_frame = tk.Frame(self.main, bg=COLORS["bg_main"])
        text_frame.pack(fill="both", expand=True, padx=12, pady=8)

        self.text = tk.Text(
            text_frame,
            font=("Malgun Gothic", self.font_size),
            fg=COLORS["text_white"],
            bg=COLORS["bg_main"],
            wrap="word",
            padx=25,
            pady=20,
            relief="flat",
            cursor="arrow",
            spacing1=5,
            spacing3=5,
            highlightthickness=0,
            borderwidth=0,
        )
        self.text.pack(fill="both", expand=True)

        # 기본 텍스트 (스크롤 테스트용으로 길게)
        self.set_default_text()

        # 하단바
        bottom = tk.Frame(self.main, bg=COLORS["bg_dark"], height=30)
        bottom.pack(fill="x", side="bottom")
        bottom.pack_propagate(False)

        hints = tk.Frame(bottom, bg=COLORS["bg_dark"])
        hints.pack(expand=True, pady=5)
        for key, txt in [("F8", "재생"), ("F9", "숨김"), ("Ctrl+↑↓", "속도")]:
            tk.Label(hints, text=key, font=("Consolas", 8, "bold"),
                     bg=COLORS["btn_gray"], fg=COLORS["gold"], padx=3).pack(side="left", padx=1)
            tk.Label(hints, text=txt, font=("Malgun Gothic", 8),
                     bg=COLORS["bg_dark"], fg=COLORS["text_gray"]).pack(side="left", padx=(0, 8))

    def set_default_text(self):
        sample = """안녕하세요, 구독자 여러분.

오늘은 AI 이미지 생성에 대해
알아보겠습니다.

먼저, ChatGPT에 접속해서
이미지 생성 기능을 사용해볼게요.

프롬프트를 입력하면
AI가 이미지를 만들어줍니다.

정말 신기하죠?

여러분도 한번 해보세요!

다양한 스타일로
이미지를 만들 수 있습니다.

오늘 영상은 여기까지입니다.
구독과 좋아요 부탁드려요!"""
        self.text.delete("1.0", "end")
        self.text.insert("1.0", sample)

    def set_text(self, content):
        self.text.config(state="normal")
        self.text.delete("1.0", "end")
        self.text.insert("1.0", content)
        self.text.yview_moveto(0)

    def set_font_size(self, size):
        self.font_size = size
        self.text.config(font=("Malgun Gothic", size))

    def scroll_up(self, amount=1):
        """텍스트 위로 스크롤 (내용이 위로 올라감)"""
        self.text.yview_scroll(amount, "units")

    def scroll_down(self, amount=1):
        """텍스트 아래로 스크롤"""
        self.text.yview_scroll(-amount, "units")

    def scroll_to_top(self):
        self.text.yview_moveto(0)

    def apply_capture_guard(self):
        self.root.update()
        hwnd = ctypes.windll.user32.GetParent(self.root.winfo_id())
        if CaptureGuard.is_supported() and self.capture_guard.enable(hwnd):
            self.capture_enabled.set(True)
            self.status_label.config(text="🔒 캡처 방지 ON", fg=COLORS["green"], bg=COLORS["green_dark"])

    def toggle_capture(self):
        hwnd = ctypes.windll.user32.GetParent(self.root.winfo_id())
        if self.capture_enabled.get():
            self.capture_guard.disable(hwnd)
            self.capture_enabled.set(False)
            self.status_label.config(text="🔓 캡처 방지 OFF", fg=COLORS["red"], bg=COLORS["red_dark"])
        else:
            self.capture_guard.enable(hwnd)
            self.capture_enabled.set(True)
            self.status_label.config(text="🔒 캡처 방지 ON", fg=COLORS["green"], bg=COLORS["green_dark"])


# ============================================
# 컨트롤 패널
# ============================================


class ControlPanel:
    def __init__(self, viewer):
        self.viewer = viewer
        self.window = tk.Toplevel(viewer.root)
        self.is_playing = False
        self.scroll_job = None
        self.speed = 1.0
        self.font_size = 32

        self.setup_window()
        self.create_ui()
        self.bind_shortcuts()

    def setup_window(self):
        self.window.title("컨트롤")
        self.window.geometry("180x380+820+100")
        self.window.configure(bg=COLORS["bg_panel"])
        self.window.attributes("-topmost", True)
        self.window.resizable(False, False)
        self.window.protocol("WM_DELETE_WINDOW", lambda: self.viewer.root.quit())

        # 창 드래그 이동 기능
        self.drag_x = 0
        self.drag_y = 0
        self.window.bind("<Button-1>", self.start_drag)
        self.window.bind("<B1-Motion>", self.do_drag)

    def start_drag(self, event):
        """드래그 시작 위치 저장"""
        self.drag_x = event.x
        self.drag_y = event.y

    def do_drag(self, event):
        """창 이동"""
        x = self.window.winfo_x() + event.x - self.drag_x
        y = self.window.winfo_y() + event.y - self.drag_y
        self.window.geometry(f"+{x}+{y}")

    def create_ui(self):
        p = self.window

        # 재생
        self.play_btn = tk.Button(p, text="▶ 재생", font=("Malgun Gothic", 11, "bold"),
                                  bg=COLORS["green"], fg="white", width=14, height=2,
                                  relief="flat", command=self.toggle_play)
        self.play_btn.pack(pady=(12, 4))

        tk.Button(p, text="↻ 처음으로", font=("Malgun Gothic", 9),
                  bg=COLORS["btn_gray"], fg="white", width=14,
                  relief="flat", command=self.reset).pack(pady=4)

        # 구분선
        tk.Frame(p, bg=COLORS["border"], height=1).pack(fill="x", pady=8, padx=12)

        # 캡처방지
        self.cap_btn = tk.Button(p, text="🔒 캡처방지 ON", font=("Malgun Gothic", 9),
                                 bg=COLORS["green_dark"], fg=COLORS["green"], width=14,
                                 relief="flat", command=self.toggle_capture)
        self.cap_btn.pack(pady=4)

        # 구분선
        tk.Frame(p, bg=COLORS["border"], height=1).pack(fill="x", pady=8, padx=12)

        # 글자 크기
        tk.Label(p, text="글자 크기", font=("Malgun Gothic", 9),
                 bg=COLORS["bg_panel"], fg=COLORS["text_gray"]).pack()
        f1 = tk.Frame(p, bg=COLORS["bg_panel"])
        f1.pack(pady=2)
        tk.Button(f1, text="-", font=("Arial", 10, "bold"), bg=COLORS["btn_gray"], fg="white",
                  width=3, relief="flat", command=self.font_down).pack(side="left", padx=2)
        self.font_lbl = tk.Label(f1, text="32", font=("Malgun Gothic", 10, "bold"),
                                 bg=COLORS["bg_panel"], fg=COLORS["gold"], width=4)
        self.font_lbl.pack(side="left")
        tk.Button(f1, text="+", font=("Arial", 10, "bold"), bg=COLORS["btn_gray"], fg="white",
                  width=3, relief="flat", command=self.font_up).pack(side="left", padx=2)

        # 속도
        tk.Label(p, text="스크롤 속도", font=("Malgun Gothic", 9),
                 bg=COLORS["bg_panel"], fg=COLORS["text_gray"]).pack(pady=(8, 0))
        f2 = tk.Frame(p, bg=COLORS["bg_panel"])
        f2.pack(pady=2)
        tk.Button(f2, text="-", font=("Arial", 10, "bold"), bg=COLORS["btn_gray"], fg="white",
                  width=3, relief="flat", command=self.speed_down).pack(side="left", padx=2)
        self.speed_lbl = tk.Label(f2, text="1.0x", font=("Malgun Gothic", 10, "bold"),
                                  bg=COLORS["bg_panel"], fg=COLORS["gold"], width=4)
        self.speed_lbl.pack(side="left")
        tk.Button(f2, text="+", font=("Arial", 10, "bold"), bg=COLORS["btn_gray"], fg="white",
                  width=3, relief="flat", command=self.speed_up).pack(side="left", padx=2)

        # 구분선
        tk.Frame(p, bg=COLORS["border"], height=1).pack(fill="x", pady=8, padx=12)

        # 파일
        tk.Button(p, text="📂 파일 열기", font=("Malgun Gothic", 9),
                  bg=COLORS["btn_orange"], fg="white", width=14,
                  relief="flat", command=self.open_file).pack(pady=4)

        # 단축키
        tk.Label(p, text="F8:재생 F9:숨김", font=("Malgun Gothic", 8),
                 bg=COLORS["bg_panel"], fg=COLORS["text_gray"]).pack(pady=(8, 0))
        tk.Label(p, text="Ctrl+↑↓:속도", font=("Malgun Gothic", 8),
                 bg=COLORS["bg_panel"], fg=COLORS["text_gray"]).pack()

    def bind_shortcuts(self):
        for w in [self.viewer.root, self.window]:
            w.bind("<F8>", lambda e: self.toggle_play())
            w.bind("<F9>", lambda e: self.toggle_visibility())
            w.bind("<Control-Up>", lambda e: self.speed_up())
            w.bind("<Control-Down>", lambda e: self.speed_down())
            w.bind("<Prior>", lambda e: self.viewer.scroll_down(3))
            w.bind("<Next>", lambda e: self.viewer.scroll_up(3))
            w.bind("<Home>", lambda e: self.reset())

    def toggle_play(self):
        if self.is_playing:
            self.stop()
        else:
            self.start()

    def start(self):
        self.is_playing = True
        self.play_btn.config(text="⏸ 정지", bg="#3bc472")
        self.do_scroll()

    def stop(self):
        self.is_playing = False
        self.play_btn.config(text="▶ 재생", bg=COLORS["green"])
        if self.scroll_job:
            self.viewer.root.after_cancel(self.scroll_job)
            self.scroll_job = None

    def do_scroll(self):
        if self.is_playing:
            # 아주 천천히 스크롤 (1/5로 더 줄임)
            self.viewer.text.yview_moveto(self.viewer.text.yview()[0] + 0.0002 * self.speed)
            interval = 50  # 50ms마다
            self.scroll_job = self.viewer.root.after(interval, self.do_scroll)

    def reset(self):
        self.stop()
        self.viewer.scroll_to_top()

    def toggle_capture(self):
        self.viewer.toggle_capture()
        if self.viewer.capture_enabled.get():
            self.cap_btn.config(text="🔒 캡처방지 ON", fg=COLORS["green"], bg=COLORS["green_dark"])
        else:
            self.cap_btn.config(text="🔓 캡처방지 OFF", fg=COLORS["red"], bg=COLORS["red_dark"])

    def toggle_visibility(self):
        if self.viewer.root.state() == "withdrawn":
            self.viewer.root.deiconify()
        else:
            self.viewer.root.withdraw()

    def font_up(self):
        if self.font_size < 72:
            self.font_size += 4
            self.font_lbl.config(text=str(self.font_size))
            self.viewer.set_font_size(self.font_size)

    def font_down(self):
        if self.font_size > 16:
            self.font_size -= 4
            self.font_lbl.config(text=str(self.font_size))
            self.viewer.set_font_size(self.font_size)

    def speed_up(self):
        if self.speed < 4.0:
            self.speed = min(4.0, self.speed + 0.25)
            self.speed_lbl.config(text=f"{self.speed:.1f}x")

    def speed_down(self):
        if self.speed > 0.25:
            self.speed = max(0.25, self.speed - 0.25)
            self.speed_lbl.config(text=f"{self.speed:.1f}x")

    def open_file(self):
        path = filedialog.askopenfilename(filetypes=[("텍스트", "*.txt"), ("모든 파일", "*.*")])
        if path:
            try:
                with open(path, "r", encoding="utf-8") as f:
                    content = f.read()
            except:
                with open(path, "r", encoding="euc-kr") as f:
                    content = f.read()
            self.viewer.set_text(content)
            self.reset()


# ============================================
# 메인
# ============================================


class GhostPromptApp:
    def __init__(self):
        self.root = tk.Tk()
        self.viewer = PrompterViewer(self.root)
        self.control = ControlPanel(self.viewer)
        self.viewer.apply_capture_guard()

    def run(self):
        self.root.mainloop()


if __name__ == "__main__":
    app = GhostPromptApp()
    app.run()
