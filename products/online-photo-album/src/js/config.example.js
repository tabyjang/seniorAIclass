/**
 * Supabase 설정 템플릿
 *
 * 사용법:
 * 1. 이 파일을 복사해서 config.js로 이름 변경
 * 2. 아래 값들을 실제 Supabase 프로젝트 값으로 교체
 * 3. config.js는 .gitignore에 포함되어 있어 커밋되지 않음
 */

const CONFIG = {
  // Supabase 프로젝트 URL (대시보드 → Settings → API)
  SUPABASE_URL: 'https://your-project-id.supabase.co',

  // Supabase Anon Key (대시보드 → Settings → API → anon public)
  SUPABASE_ANON_KEY: 'your-anon-key-here',

  // Storage 버킷 이름
  STORAGE_BUCKET: 'photos',

  // 파일 업로드 제한
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],

  // 이미지 리사이즈
  MAX_IMAGE_WIDTH: 1920,
  THUMBNAIL_WIDTH: 300
};

// 전역으로 노출
window.CONFIG = CONFIG;
