# Supabase DB 연동 기술 가이드

**작성일:** 2026-02-03
**버전:** 1.0
**목적:** 온라인 포토앨범의 Supabase 데이터베이스 연동

---

## 1. 왜 Supabase인가?

### 1.1 현재 방식의 한계

| 저장소 | 용량 제한 | 문제점 |
|--------|----------|--------|
| localStorage | ~5MB | 메타데이터만 가능 |
| IndexedDB | ~50-500MB | 브라우저별 상이, 기기 변경 시 데이터 손실 |

### 1.2 Supabase 장점

| 항목 | 내용 |
|------|------|
| **무료 플랜** | Storage 1GB, DB 500MB, 무제한 API |
| **이미지 저장** | S3 호환 Storage (CDN 제공) |
| **데이터베이스** | PostgreSQL (빠르고 안정적) |
| **인증** | 이메일/소셜 로그인 기본 제공 |
| **실시간** | 변경사항 실시간 동기화 |
| **한글 지원** | 문서/대시보드 한글 지원 |

### 1.3 무료 플랜 스펙

```
- Database: 500MB
- Storage: 1GB
- Bandwidth: 2GB/월
- API 요청: 무제한
- 동시 접속: 50명
```

**시니어용 개인 앨범에 충분!** (사진 1장 평균 2MB → 약 500장)

---

## 2. 아키텍처 변경

### 2.1 Before (현재)

```
┌─────────────────────────────────────────┐
│           브라우저                       │
│  ┌──────────────────────────────────┐  │
│  │  localStorage (메타데이터)         │  │
│  │  IndexedDB (이미지 base64)        │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
      ↓ 문제: 기기 변경 시 데이터 손실
```

### 2.2 After (Supabase 연동)

```
┌─────────────────────────────────────────┐
│           브라우저                       │
│  ┌──────────────────────────────────┐  │
│  │  Supabase JS Client               │  │
│  └──────────────────────────────────┘  │
└──────────────┬──────────────────────────┘
               │ HTTPS
               ▼
┌─────────────────────────────────────────┐
│         Supabase Cloud                  │
│  ┌──────────────────────────────────┐  │
│  │  Auth (인증)                      │  │
│  │  PostgreSQL (앨범/사진 메타데이터) │  │
│  │  Storage (실제 이미지 파일)        │  │
│  └──────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

---

## 3. 데이터베이스 설계

### 3.1 테이블 구조

#### users 테이블 (Supabase Auth 자동 생성)
```sql
-- Supabase가 자동으로 생성하는 auth.users 테이블 사용
-- id, email, created_at 등 기본 제공
```

#### albums 테이블
```sql
CREATE TABLE albums (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  date DATE,
  cover_image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_albums_user_id ON albums(user_id);
CREATE INDEX idx_albums_created_at ON albums(created_at DESC);

-- RLS (Row Level Security) 정책
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;

CREATE POLICY "사용자는 자신의 앨범만 볼 수 있음" ON albums
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "사용자는 자신의 앨범만 생성 가능" ON albums
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "사용자는 자신의 앨범만 수정 가능" ON albums
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "사용자는 자신의 앨범만 삭제 가능" ON albums
  FOR DELETE USING (auth.uid() = user_id);
```

#### photos 테이블
```sql
CREATE TABLE photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  album_id UUID REFERENCES albums(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_size INTEGER,
  width INTEGER,
  height INTEGER,
  description TEXT,
  location VARCHAR(200),
  taken_at DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스
CREATE INDEX idx_photos_album_id ON photos(album_id);
CREATE INDEX idx_photos_user_id ON photos(user_id);
CREATE INDEX idx_photos_created_at ON photos(created_at DESC);

-- RLS 정책
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "사용자는 자신의 사진만 볼 수 있음" ON photos
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "사용자는 자신의 사진만 업로드 가능" ON photos
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "사용자는 자신의 사진만 수정 가능" ON photos
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "사용자는 자신의 사진만 삭제 가능" ON photos
  FOR DELETE USING (auth.uid() = user_id);
```

### 3.2 Storage 버킷 설정

```sql
-- Storage 버킷 생성 (Supabase 대시보드에서)
-- 버킷명: photos

-- Storage 정책
CREATE POLICY "사용자는 자신의 폴더에만 업로드 가능"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "사용자는 자신의 사진만 볼 수 있음"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "사용자는 자신의 사진만 삭제 가능"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'photos' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

---

## 4. Supabase 클라이언트 설정

### 4.1 CDN으로 불러오기 (가장 간단)

```html
<!-- index.html -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script>
  const SUPABASE_URL = 'https://your-project.supabase.co';
  const SUPABASE_ANON_KEY = 'your-anon-key';

  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
</script>
```

### 4.2 설정 파일 분리

```javascript
// js/config.js
const CONFIG = {
  SUPABASE_URL: 'https://your-project.supabase.co',
  SUPABASE_ANON_KEY: 'your-anon-key',
  STORAGE_BUCKET: 'photos',
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
};

// 전역 Supabase 클라이언트
const supabase = window.supabase.createClient(
  CONFIG.SUPABASE_URL,
  CONFIG.SUPABASE_ANON_KEY
);
```

---

## 5. 핵심 기능 구현

### 5.1 인증 (Auth)

```javascript
// js/auth.js
const Auth = {
  /**
   * 이메일/비밀번호 회원가입
   */
  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });
    if (error) throw error;
    return data;
  },

  /**
   * 이메일/비밀번호 로그인
   */
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  },

  /**
   * 로그아웃
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * 현재 사용자 정보
   */
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  /**
   * 세션 변경 감지
   */
  onAuthStateChange(callback) {
    supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  }
};
```

### 5.2 앨범 관리 (Database)

```javascript
// js/albumService.js
const AlbumService = {
  /**
   * 앨범 생성
   */
  async createAlbum(name, description, date) {
    const user = await Auth.getCurrentUser();
    if (!user) throw new Error('로그인이 필요합니다');

    const { data, error } = await supabase
      .from('albums')
      .insert({
        user_id: user.id,
        name,
        description,
        date
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * 내 앨범 목록 조회
   */
  async getMyAlbums() {
    const { data, error } = await supabase
      .from('albums')
      .select(`
        *,
        photos:photos(count)
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * 앨범 상세 조회
   */
  async getAlbum(id) {
    const { data, error } = await supabase
      .from('albums')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * 앨범 수정
   */
  async updateAlbum(id, updates) {
    const { data, error } = await supabase
      .from('albums')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * 앨범 삭제
   */
  async deleteAlbum(id) {
    // 앨범의 사진들도 Storage에서 삭제
    await PhotoService.deletePhotosByAlbum(id);

    const { error } = await supabase
      .from('albums')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
```

### 5.3 사진 관리 (Storage + Database)

```javascript
// js/photoService.js
const PhotoService = {
  /**
   * 사진 업로드
   */
  async uploadPhoto(file, albumId, metadata = {}) {
    const user = await Auth.getCurrentUser();
    if (!user) throw new Error('로그인이 필요합니다');

    // 파일 검증
    if (!CONFIG.ALLOWED_TYPES.includes(file.type)) {
      throw new Error('JPG, PNG, GIF, WebP 파일만 업로드 가능합니다');
    }
    if (file.size > CONFIG.MAX_FILE_SIZE) {
      throw new Error('파일 크기는 10MB 이하여야 합니다');
    }

    // 고유 파일명 생성
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${albumId}/${Date.now()}.${fileExt}`;

    // Storage에 업로드
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(CONFIG.STORAGE_BUCKET)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    // 공개 URL 가져오기
    const { data: { publicUrl } } = supabase.storage
      .from(CONFIG.STORAGE_BUCKET)
      .getPublicUrl(fileName);

    // 이미지 크기 가져오기
    const dimensions = await this.getImageDimensions(file);

    // Database에 메타데이터 저장
    const { data, error } = await supabase
      .from('photos')
      .insert({
        album_id: albumId,
        user_id: user.id,
        file_name: file.name,
        file_url: publicUrl,
        file_size: file.size,
        width: dimensions.width,
        height: dimensions.height,
        description: metadata.description || '',
        location: metadata.location || '',
        taken_at: metadata.taken_at || null
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * 여러 사진 업로드
   */
  async uploadPhotos(files, albumId, onProgress) {
    const results = [];
    for (let i = 0; i < files.length; i++) {
      try {
        const photo = await this.uploadPhoto(files[i], albumId);
        results.push({ success: true, photo });
        if (onProgress) onProgress(i + 1, files.length);
      } catch (error) {
        results.push({ success: false, error: error.message, file: files[i].name });
      }
    }
    return results;
  },

  /**
   * 앨범의 사진 목록 조회
   */
  async getPhotosByAlbum(albumId) {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .eq('album_id', albumId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * 사진 삭제
   */
  async deletePhoto(photo) {
    // Storage에서 파일 삭제
    const filePath = this.extractFilePath(photo.file_url);
    await supabase.storage
      .from(CONFIG.STORAGE_BUCKET)
      .remove([filePath]);

    // Database에서 레코드 삭제
    const { error } = await supabase
      .from('photos')
      .delete()
      .eq('id', photo.id);

    if (error) throw error;
  },

  /**
   * 앨범의 모든 사진 삭제
   */
  async deletePhotosByAlbum(albumId) {
    const photos = await this.getPhotosByAlbum(albumId);
    for (const photo of photos) {
      await this.deletePhoto(photo);
    }
  },

  /**
   * 이미지 크기 가져오기
   */
  getImageDimensions(file) {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
        URL.revokeObjectURL(img.src);
      };
      img.onerror = () => resolve({ width: 0, height: 0 });
      img.src = URL.createObjectURL(file);
    });
  },

  /**
   * URL에서 파일 경로 추출
   */
  extractFilePath(url) {
    const match = url.match(/\/photos\/(.+)$/);
    return match ? match[1] : '';
  }
};
```

---

## 6. UI 통합 예제

### 6.1 로그인 화면

```html
<!-- login.html -->
<div class="login-container">
  <h1>📸 온라인 포토앨범</h1>
  <form id="loginForm">
    <input type="email" id="email" placeholder="이메일" required>
    <input type="password" id="password" placeholder="비밀번호" required>
    <button type="submit">로그인</button>
  </form>
  <p>계정이 없으신가요? <a href="#" id="signupLink">회원가입</a></p>
</div>

<script>
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    await Auth.signIn(email, password);
    window.location.href = 'albums.html';
  } catch (error) {
    showToast(error.message, 'error');
  }
});
</script>
```

### 6.2 사진 업로드 UI

```javascript
// 사진 업로드 처리
async function handlePhotoUpload(files, albumId) {
  const progressEl = document.getElementById('uploadProgress');
  progressEl.style.display = 'block';

  const results = await PhotoService.uploadPhotos(files, albumId, (current, total) => {
    const percent = Math.round((current / total) * 100);
    progressEl.textContent = `업로드 중... ${current}/${total} (${percent}%)`;
  });

  progressEl.style.display = 'none';

  const success = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  if (failed > 0) {
    showToast(`${success}장 성공, ${failed}장 실패`, 'warning');
  } else {
    showToast(`${success}장 업로드 완료!`, 'success');
  }

  // 갤러리 새로고침
  loadPhotos(albumId);
}
```

---

## 7. 마이그레이션 가이드

### 7.1 기존 데이터 마이그레이션

```javascript
// 로컬 데이터를 Supabase로 마이그레이션
async function migrateToSupabase() {
  // 1. 로그인 확인
  const user = await Auth.getCurrentUser();
  if (!user) {
    showToast('먼저 로그인해주세요', 'error');
    return;
  }

  // 2. 기존 앨범 데이터 가져오기
  const localAlbums = Storage.getAlbums();
  if (localAlbums.length === 0) {
    showToast('마이그레이션할 데이터가 없습니다', 'info');
    return;
  }

  // 3. 앨범별로 마이그레이션
  for (const localAlbum of localAlbums) {
    try {
      // 앨범 생성
      const newAlbum = await AlbumService.createAlbum(
        localAlbum.name,
        localAlbum.description,
        localAlbum.date
      );

      // 사진 마이그레이션 (IndexedDB → Supabase Storage)
      const photos = await Storage.getPhotosByAlbum(localAlbum.id);
      for (const photo of photos) {
        // base64를 Blob으로 변환
        const blob = await fetch(photo.data).then(r => r.blob());
        const file = new File([blob], photo.fileName || 'photo.jpg', { type: blob.type });

        await PhotoService.uploadPhoto(file, newAlbum.id, {
          description: photo.description,
          location: photo.location
        });
      }

      showToast(`앨범 "${localAlbum.name}" 마이그레이션 완료`, 'success');
    } catch (error) {
      console.error('Migration error:', error);
      showToast(`앨범 "${localAlbum.name}" 마이그레이션 실패`, 'error');
    }
  }

  // 4. 로컬 데이터 정리 (선택)
  const clearLocal = confirm('마이그레이션 완료! 로컬 데이터를 삭제할까요?');
  if (clearLocal) {
    localStorage.removeItem('opa_albums');
    // IndexedDB 정리
  }
}
```

---

## 8. 성능 최적화

### 8.1 이미지 최적화

```javascript
// 업로드 전 이미지 리사이즈
async function resizeImage(file, maxWidth = 1920) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob((blob) => {
        resolve(new File([blob], file.name, { type: 'image/jpeg' }));
      }, 'image/jpeg', 0.85);
    };
    img.src = URL.createObjectURL(file);
  });
}
```

### 8.2 페이지네이션

```javascript
// 사진 페이지네이션
async function getPhotosPaginated(albumId, page = 1, limit = 20) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await supabase
    .from('photos')
    .select('*', { count: 'exact' })
    .eq('album_id', albumId)
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) throw error;
  return {
    photos: data,
    total: count,
    page,
    totalPages: Math.ceil(count / limit)
  };
}
```

### 8.3 썸네일 생성 (Edge Function)

```typescript
// supabase/functions/generate-thumbnail/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  const { photoUrl, width = 300 } = await req.json();

  // 이미지 리사이즈 로직
  // ...

  return new Response(JSON.stringify({ thumbnailUrl }), {
    headers: { 'Content-Type': 'application/json' }
  });
});
```

---

## 9. 에러 처리

```javascript
// 공통 에러 핸들러
function handleSupabaseError(error) {
  console.error('Supabase Error:', error);

  const messages = {
    'Invalid login credentials': '이메일 또는 비밀번호가 틀렸습니다',
    'User already registered': '이미 가입된 이메일입니다',
    'Email not confirmed': '이메일 인증을 완료해주세요',
    'JWT expired': '세션이 만료되었습니다. 다시 로그인해주세요',
    'Payload too large': '파일이 너무 큽니다 (최대 10MB)',
    'Bucket not found': '저장소 설정 오류입니다'
  };

  const message = messages[error.message] || '오류가 발생했습니다. 다시 시도해주세요.';
  showToast(message, 'error');
}
```

---

## 10. 보안 고려사항

### 10.1 RLS 필수
- 모든 테이블에 Row Level Security 활성화
- 사용자는 자신의 데이터만 접근 가능

### 10.2 API 키 관리
- `anon` 키만 클라이언트에 노출 (공개 가능)
- `service_role` 키는 절대 노출 금지

### 10.3 파일 업로드 제한
- MIME 타입 검증
- 파일 크기 제한
- Storage 정책으로 폴더 접근 제한

---

## 다음 단계

1. Supabase 프로젝트 생성
2. 테이블 및 Storage 설정
3. 기존 코드에 Supabase 클라이언트 통합
4. 마이그레이션 테스트
5. 배포 및 모니터링

---

*최종 수정일: 2026-02-03*
