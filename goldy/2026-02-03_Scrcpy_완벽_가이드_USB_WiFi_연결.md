# Scrcpy 완벽 가이드 - USB & WiFi 연결

**작성일**: 2026-02-03  
**작성자**: 골디  
**대상**: 시니어 AI 클래스 제작 (OBS용 화면 미러링)

---

## 📋 개요

**Scrcpy**는 안드로이드 기기의 화면을 PC로 실시간 전송하는 물 도구입니다. USB 케이블이나 WiFi를 통해 연결할 수 있으며, OBS 스트리밍/녹화에 최적화되어 있습니다.

### 주요 특징
- ✅ **저지연**: 거의 실시간 화면 전송
- ✅ **고화질**: 해상도/비트레이트 조절 가능
- ✅ **쌍방향 제어**: PC에서 핸드폰 터치/타이핑 가능
- ✅ **묣선 연결**: WiFi로 케이블 없이 사용 가능
- ✅ **묣료**: 오픈소스, 완전 묣비

---

## 🔧 설치 방법

### 1단계: 다운로드

```powershell
# PowerShell에서 실행
Invoke-WebRequest -Uri "https://github.com/Genymobile/scrcpy/releases/download/v2.7/scrcpy-win64-v2.7.zip" -OutFile "$env:USERPROFILE\Downloads\scrcpy-win64-v2.7.zip"
```

### 2단계: 압축 해제

```powershell
# 폴터 생성 및 압축 해제
New-Item -ItemType Directory -Path "$env:USERPROFILE\scrcpy" -Force
Expand-Archive -Path "$env:USERPROFILE\Downloads\scrcpy-win64-v2.7.zip" -DestinationPath "$env:USERPROFILE\scrcpy" -Force

# 하위 폴터 정리 (scrcpy-win64-v2.7 폴터 내용을 상위로 이동)
Move-Item "$env:USERPROFILE\scrcpy\scrcpy-win64-v2.7\*" "$env:USERPROFILE\scrcpy\" -Force
Remove-Item "$env:USERPROFILE\scrcpy\scrcpy-win64-v2.7" -Force
```

### 3단계: 환경변수 설정 (선택)

```powershell
# PATH에 추가 (어디서든 scrcpy 명령 사용 가능)
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";$env:USERPROFILE\scrcpy", "User")
```

---

## 📱 핸드폰 설정 (필수)

### 개발자 옵션 활성화

1. **설정** → **휴제전화 정보** (또는 **소프트웨어 정보**)
2. **빌드번호**를 **7번 연속** 빠르게 터치
3. "개발자 모드가 활성화되었습니다" 메시지 확인

### USB 디버깅 활성화

1. **설정** → **개발자 옵션** (하단에 새로 생김)
2. **USB 디버깅** → **ON** (켜기)
3. "디버깅 모드를 활성화하시겠습니까?" → **확인**

---

## 🔌 방법 1: USB 연결 (기본)

### 연결 절차

```
┌─────────────────────────────────────────┐
│  1. USB 케이블로 핸드폰-PC 연결          │
│  2. 핸드폰에서 "파일 전송" 선택          │
│  3. "USB 디버깅 허용" 팝업 → "허용"      │
│  4. PC에서 scrcpy 실행                  │
│  5. 핸드폰 화면이 PC에 표시!            │
└─────────────────────────────────────────┘
```

### 실행 명령어

```powershell
# 기본 실행
C:\Users\USER\scrcpy\scrcpy.exe

# 화면 크기 제한 (성능 개선)
C:\Users\USER\scrcpy\scrcpy.exe --max-size 1280

# 화질/비트레이트 조절
C:\Users\USER\scrcpy\scrcpy.exe --max-size 1920 --bit-rate 8M

# 전체화면 모드
C:\Users\USER\scrcpy\scrcpy.exe --fullscreen

# 녹화하면서 미러링
C:\Users\USER\scrcpy\scrcpy.exe --record lecture.mp4
```

### 자주 발생하는 문제

| 문제 | 원인 | 해결책 |
|------|------|--------|
| "Device is unauthorized" | USB 디버깅 미허용 | 핸드폰에서 "허용" 누르기 |
| "adb push returned with value 1" | 권한 거부 | USB 재연결 후 다시 시도 |
| 화면이 안 뜸 | 케이블/포트 문제 | 케이블 교체, 포트 변경 |
| 딜레이 심함 | 해상도 과다 | --max-size 1280 옵션 사용 |

---

## 📡 방법 2: WiFi 무선 연결 (고급)

### ⚠️ 전제조건
- **처음 1회는 USB 케이블 필요** (WiFi 연결 설정용)
- 핸드폰과 PC가 **같은 WiFi 네트워크**에 연결되어 있어야 함

### 절차 개요

```
┌──────────────────────────────────────────────────┐
│  1. USB로 연결 (처음 한 번만)                      │
│  2. TCP/IP 모드 활성화 (adb tcpip 5555)           │
│  3. USB 케이블 제거                               │
│  4. 핸드폰 IP 주소 확인                            │
│  5. WiFi로 연결 (scrcpy --tcpip=IP주소)           │
│  6. 이후 케이블 없이 WiFi만으로 사용 가능!        │
└──────────────────────────────────────────────────┘
```

### 상세 단계

#### Step 1: USB로 연결 (처음 1회)

```powershell
# USB 케이블 연결 후 실행
C:\Users\USER\scrcpy\scrcpy.exe --tcpip
```

또는 수동으로 adb 명령:

```powershell
# ADB TCP/IP 모드 활성화
C:\Users\USER\scrcpy\adb.exe tcpip 5555
# 출력: "restarting in TCP mode port: 5555"
```

#### Step 2: USB 케이블 제거

- **케이블을 뽑아도 됨** (WiFi 연결 유지됨)
- 핸드폰을 자유롭게 이동 가능

#### Step 3: 핸드폰 IP 주소 확인

**방법 A: 핸드폰에서 확인**
1. **설정** → **WiFi** → 연결된 네트워크 터치
2. **IP 주소** 확인 (예: 192.168.1.100)

**방법 B: PC에서 확인 (adb 사용)**
```powershell
# 핸드폰에 연결된 후 IP 확인
C:\Users\USER\scrcpy\adb.exe shell ip route
# 출력 예: "192.168.1.0/24 dev wlan0 ... src 192.168.1.100"
```

#### Step 4: WiFi로 연결

```powershell
# IP 주소를 알고 있을 때 (예: 192.168.1.100)
C:\Users\USER\scrcpy\scrcpy.exe --tcpip=192.168.1.100

# 포트 지정 (기본 5555)
C:\Users\USER\scrcpy\scrcpy.exe --tcpip=192.168.1.100:5555
```

#### Step 5: 이후 재연결

한 번 WiFi 연결을 설정하면:

```powershell
# USB 없이 바로 WiFi 연결 (자동 감지)
C:\Users\USER\scrcpy\scrcpy.exe

# 또는 IP 직접 지정
C:\Users\USER\scrcpy\scrcpy.exe --tcpip=192.168.1.100
```

---

## 🎥 OBS 설정 가이드

### 화면 캡처 설정

1. **OBS Studio** 실행
2. **소스** → **+** → **창 캡처** (Window Capture)
3. **이름**: "핸드폰 화면" → **확인**
4. **창** 선택: `[scrcpy.exe]: ...` 또는 핸드폰 모델명
5. **캡처 방법**: `Windows 10/11` 또는 `BitBlt`
6. **확인**

### 최적화 설정

| 설정 | 권장값 | 설명 |
|------|--------|------|
| 해상도 | 1280x720 또는 1920x1080 | 화질/성능 균형 |
| FPS | 30fps | 유튜브 권장 |
| 비트레이트 | 2500-4000 Kbps | 화질/파일 크기 균형 |

### 녹화 시작

1. **-controls-** → **녹화 시작**
2. 핸드폰에서 시연/촬영 진행
3. **녹화 중지**
4. 파일은 OBS 설정에서 지정한 폴터에 저장

---

## ⌨️ 키보드/마우스 제어

Scrcpy는 **PC에서 핸드폰을 직접 조작**할 수 있습니다.

### 마우스 조작

| 동작 | 기능 |
|------|------|
| **왼쪽 클릭** | 터치/클릭 |
| **오른쪽 클릭** | 뒤로 가기 |
| **휠 클릭** | 홈 버튼 |
| **스크롤** | 화면 스크롤 |
| **드래그** | 터치 후 이동 |

### 키보드 단축키

| 단축키 | 기능 |
|--------|------|
| `Ctrl`+`F` | 전체화면 토글 |
| `Ctrl`+`G` | 창 크기 조정 |
| `Ctrl`+`X` | 화면 끄기/켜기 |
| `Ctrl`+`S` | 전원 버튼 |
| `Ctrl`+`B` | 홈 버튼 |
| `Ctrl`+`V` | 클립보드 붙여넣기 |
| `Ctrl`+`Shift`+`V` | 파일 붙여넣기 |
| `Ctrl`+`O` | 기기 화면 꺼짐 |
| `Ctrl`+`R` | 화면 회전 |

---

## 📝 명령어 정리

### 기본 명령어

```powershell
# 기본 실행
scrcpy

# 화면 크기 제한
scrcpy --max-size 1024
scrcpy --max-size 1280
scrcpy --max-size 1920

# 비트레이트 조절
scrcpy --bit-rate 2M   # 2Mbps
scrcpy --bit-rate 8M   # 8Mbps

# 최대 FPS 제한
scrcpy --max-fps 30

# 화면 녹화
scrcpy --record filename.mp4

# 조작 불가 (시청만)
scrcpy --no-control

# 전체화면
scrcpy --fullscreen
```

### 무선 연결 명령어

```powershell
# TCP/IP 모드 활성화 (USB 연결 상태에서)
scrcpy --tcpip

# 특정 IP로 연결
scrcpy --tcpip=192.168.1.100

# 포트 지정
scrcpy --tcpip=192.168.1.100:5555
```

---

## 🚨 문제 해결

### 1. "Device not found" / "No devices/emulators found"

**원인**: 핸드폰이 인식되지 않음

**해결책**:
```powershell
# ADB 서버 재시작
C:\Users\USER\scrcpy\adb.exe kill-server
C:\Users\USER\scrcpy\adb.exe start-server

# 기기 목록 확인
C:\Users\USER\scrcpy\adb.exe devices
```

### 2. "Could not listen on port 27183"

**원인**: 포트 충돌

**해결책**:
```powershell
# 다른 포트 사용
scrcpy --port 27184
```

### 3. WiFi 연결이 자주 끊김

**원인**: WiFi 신호 불안정

**해결책**:
- 5GHz WiFi 사용 (혼잡 덜함)
- 핸드폰-공유기 거리 가깝게
- WiFi 채널 변경 (혼잡한 경우)

### 4. 화면이 끊김/버벅임

**원인**: 네트워크/성능 문제

**해결책**:
```powershell
# 해상도 낮추기
scrcpy --max-size 1024 --bit-rate 2M

# FPS 제한
scrcpy --max-fps 30
```

---

## 💡 팁과 활용법

### 1. 항상 같은 설정으로 실행

**배치 파일 생성** (`start_scrcpy.bat`):
```batch
@echo off
C:\Users\USER\scrcpy\scrcpy.exe --max-size 1280 --bit-rate 4M
```

### 2. 여러 기기 연결

```powershell
# 기기 목록 확인
adb devices

# 특정 기기 선택 (시리얼 번호 사용)
scrcpy --serial R3CX50BXG8F
```

### 3. 화면 캡처 (스크린샷)

```powershell
# 스크린샷 저장
scrcpy --no-display --record screenshot.mp4
```

---

## 📂 관련 파일 위치

| 파일/폴터 | 위치 |
|-----------|------|
| Scrcpy 실행 파일 | `C:\Users\USER\scrcpy\scrcpy.exe` |
| ADB 도구 | `C:\Users\USER\scrcpy\adb.exe` |
| 녹화 파일 | OBS 설정 폴터 또는 명령어로 지정 |

---

## 🔗 참고 자료

- **Scrcpy GitHub**: https://github.com/Genymobile/scrcpy
- **공식 문서**: https://github.com/Genymobile/scrcpy/blob/master/README.md
- **FAQ**: https://github.com/Genymobile/scrcpy/blob/master/FAQ.md

---

**작성 완료**: 2026-02-03  
**버전**: 1.0  
**적용 대상**: 시니어 AI 클래스 영상 제작

*문서 업데이트: 새로운 기능이나 문제 해결법 발견 시 추가 예정*
