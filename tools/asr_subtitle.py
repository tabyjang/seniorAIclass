# -*- coding: utf-8 -*-
"""
🎤 ASR 자막 생성 도구
영상/음성 파일 → 자막 파일 (SRT) 자동 생성

사용법:
    python asr_subtitle.py "영상파일.mp4"
    python asr_subtitle.py "영상파일.mp4" --model medium
    python asr_subtitle.py "영상파일.mp4" --font "KOTRA_BOLD"
"""

import whisper
import sys
import os
from pathlib import Path


def format_timestamp(seconds: float) -> str:
    """초를 SRT 타임스탬프 형식으로 변환"""
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = int((seconds - int(seconds)) * 1000)
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"


def transcribe_to_srt(input_file: str, model_name: str = "medium", language: str = "ko") -> str:
    """
    음성/영상 파일을 SRT 자막으로 변환
    
    Args:
        input_file: 입력 파일 경로 (mp4, mp3, wav 등)
        model_name: Whisper 모델 (tiny, base, small, medium, large)
        language: 언어 코드 (ko, en, ja 등)
    
    Returns:
        생성된 SRT 파일 경로
    """
    print(f"🎤 Whisper 모델 로딩 중... ({model_name})")
    model = whisper.load_model(model_name)
    
    print(f"🎧 음성 인식 중... ({input_file})")
    result = model.transcribe(input_file, language=language)
    
    # SRT 파일 생성
    input_path = Path(input_file)
    srt_path = input_path.with_suffix('.srt')
    
    print(f"📝 SRT 파일 생성 중... ({srt_path})")
    with open(srt_path, 'w', encoding='utf-8') as f:
        for i, segment in enumerate(result['segments'], 1):
            start = format_timestamp(segment['start'])
            end = format_timestamp(segment['end'])
            text = segment['text'].strip()
            
            f.write(f"{i}\n")
            f.write(f"{start} --> {end}\n")
            f.write(f"{text}\n\n")
    
    print(f"✅ 완료! 자막 파일: {srt_path}")
    print(f"📊 총 {len(result['segments'])}개 자막 세그먼트 생성")
    
    return str(srt_path)


def burn_subtitles(video_file: str, srt_file: str, font_name: str = "KOTRA_BOLD", 
                   font_size: int = 48, output_file: str = None) -> str:
    """
    FFmpeg로 자막을 영상에 하드코딩
    
    Args:
        video_file: 입력 영상 파일
        srt_file: SRT 자막 파일
        font_name: 폰트 이름 (KOTRA_BOLD, KOTRA_GOTHIC 등)
        font_size: 폰트 크기
        output_file: 출력 파일 (기본: 원본파일명_sub.mp4)
    
    Returns:
        출력 파일 경로
    """
    import subprocess
    
    if output_file is None:
        video_path = Path(video_file)
        output_file = str(video_path.with_stem(video_path.stem + "_sub"))
    
    # 폰트 파일 경로
    font_dir = r"C:\Users\USER\AppData\Local\Microsoft\Windows\Fonts"
    font_file = os.path.join(font_dir, f"{font_name}.ttf")
    
    # FFmpeg 명령어
    # subtitles 필터 사용
    filter_str = f"subtitles='{srt_file}':force_style='FontName={font_name},FontSize={font_size},PrimaryColour=&HFFFFFF,OutlineColour=&H000000,BorderStyle=1,Outline=3'"
    
    cmd = [
        'ffmpeg', '-i', video_file,
        '-vf', filter_str,
        '-c:a', 'copy',
        '-y', output_file
    ]
    
    print(f"🎬 자막 하드코딩 중...")
    print(f"   폰트: {font_name} ({font_size}pt)")
    
    subprocess.run(cmd, check=True)
    
    print(f"✅ 완료! 출력 파일: {output_file}")
    return output_file


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(1)
    
    input_file = sys.argv[1]
    model = "medium"  # 기본 모델
    
    # 옵션 파싱
    if "--model" in sys.argv:
        idx = sys.argv.index("--model")
        model = sys.argv[idx + 1]
    
    # 자막 생성
    srt_file = transcribe_to_srt(input_file, model_name=model)
    
    print("\n" + "="*50)
    print("🎉 자막 생성 완료!")
    print(f"📁 SRT 파일: {srt_file}")
    print("\n다음 단계:")
    print("  1. SRT 파일 검토/수정")
    print("  2. 영상에 자막 입히기:")
    print(f"     python asr_subtitle.py burn {input_file} {srt_file}")
