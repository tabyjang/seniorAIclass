# Supabase 설정 완료 가이드

**작성일:** 2026-02-03
**프로젝트:** online-photo-album
**상태:** ✅ 설정 완료

---

## 1. 프로젝트 정보

| 항목 | 값 |
|------|-----|
| **프로젝트명** | online-photo-album |
| **프로젝트 ID** | `zrpmnolsxswlgsxwxgnt` |
| **리전** | ap-northeast-2 (서울) |
| **URL** | https://zrpmnolsxswlgsxwxgnt.supabase.co |
| **대시보드** | https://supabase.com/dashboard/project/zrpmnolsxswlgsxwxgnt |

---

## 2. API 키 (클라이언트용)

```javascript
// js/config.js
const CONFIG = {
  SUPABASE_URL: 'https://zrpmnolsxswlgsxwxgnt.supabase.co',
  SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpycG1ub2xzeHN3bGdzeHd4Z250Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAwOTkyNjAsImV4cCI6MjA4NTY3NTI2MH0.zEx4EkuolRNAtamNMc9Wo5dHd2jXRvLBenGTezRx8Jc',
  STORAGE_BUCKET: 'photos',
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
};
```

---

## 3. 데이터베이스 구조

### 3.1 albums 테이블

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | 기본 키 (자동 생성) |
| user_id | UUID | 사용자 ID (FK → auth.users) |
| name | VARCHAR(100) | 앨범 이름 |
| description | TEXT | 앨범 설명 |
| date | DATE | 앨범 날짜 |
| cover_image_url | TEXT | 커버 이미지 URL |
| created_at | TIMESTAMPTZ | 생성일 |
| updated_at | TIMESTAMPTZ | 수정일 |

### 3.2 photos 테이블

| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | UUID | 기본 키 (자동 생성) |
| album_id | UUID | 앨범 ID (FK → albums) |
| user_id | UUID | 사용자 ID (FK → auth.users) |
| file_name | VARCHAR(255) | 원본 파일명 |
| file_url | TEXT | Storage URL |
| thumbnail_url | TEXT | 썸네일 URL |
| file_size | INTEGER | 파일 크기 (bytes) |
| width | INTEGER | 이미지 너비 |
| height | INTEGER | 이미지 높이 |
| description | TEXT | 사진 설명 |
| location | VARCHAR(200) | 촬영 장소 |
| taken_at | DATE | 촬영일 |
| is_favorite | BOOLEAN | 즐겨찾기 |
| created_at | TIMESTAMPTZ | 업로드일 |

### 3.3 Storage 버킷

| 항목 | 설정 |
|------|------|
| **버킷명** | photos |
| **공개 여부** | Public (누구나 URL로 접근 가능) |
| **파일 크기 제한** | 10MB |
| **허용 파일 형식** | JPEG, PNG, GIF, WebP |

---

## 4. 보안 정책 (RLS)

### 4.1 albums 테이블 정책
- ✅ 사용자는 자신의 앨범만 조회
- ✅ 사용자는 자신의 앨범만 생성
- ✅ 사용자는 자신의 앨범만 수정
- ✅ 사용자는 자신의 앨범만 삭제

### 4.2 photos 테이블 정책
- ✅ 사용자는 자신의 사진만 조회
- ✅ 사용자는 자신의 사진만 업로드
- ✅ 사용자는 자신의 사진만 수정
- ✅ 사용자는 자신의 사진만 삭제

### 4.3 Storage 정책
- ✅ 사용자는 자신의 폴더(user_id/)에만 업로드
- ✅ 누구나 사진 조회 가능 (Public)
- ✅ 사용자는 자신의 사진만 삭제

---

## 5. 클라이언트 코드

### 5.1 HTML에 추가

```html
<!-- Supabase CDN -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<!-- 설정 파일 -->
<script src="js/config.js"></script>
<script src="js/supabaseClient.js"></script>
<script src="js/auth.js"></script>
<script src="js/albumService.js"></script>
<script src="js/photoService.js"></script>
```

### 5.2 Supabase 클라이언트 초기화

```javascript
// js/supabaseClient.js
const supabase = window.supabase.createClient(
  CONFIG.SUPABASE_URL,
  CONFIG.SUPABASE_ANON_KEY
);

window.supabase = supabase;
```

### 5.3 인증 (Auth)

```javascript
// js/auth.js
const Auth = {
  // 회원가입
  async signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  },

  // 로그인
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  },

  // 로그아웃
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  // 현재 사용자
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  // 세션 변경 감지
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
};

window.Auth = Auth;
```

### 5.4 앨범 서비스

```javascript
// js/albumService.js
const AlbumService = {
  // 앨범 생성
  async create(name, description, date) {
    const user = await Auth.getCurrentUser();
    if (!user) throw new Error('로그인이 필요합니다');

    const { data, error } = await supabase
      .from('albums')
      .insert({ user_id: user.id, name, description, date })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 내 앨범 목록
  async getAll() {
    const { data, error } = await supabase
      .from('albums')
      .select('*, photos(count)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // 앨범 상세
  async getById(id) {
    const { data, error } = await supabase
      .from('albums')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // 앨범 수정
  async update(id, updates) {
    const { data, error } = await supabase
      .from('albums')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // 앨범 삭제
  async delete(id) {
    // 앨범의 사진들도 삭제
    await PhotoService.deleteByAlbum(id);

    const { error } = await supabase
      .from('albums')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

window.AlbumService = AlbumService;
```

### 5.5 사진 서비스

```javascript
// js/photoService.js
const PhotoService = {
  // 사진 업로드
  async upload(file, albumId, metadata = {}) {
    const user = await Auth.getCurrentUser();
    if (!user) throw new Error('로그인이 필요합니다');

    // 파일 검증
    if (!CONFIG.ALLOWED_TYPES.includes(file.type)) {
      throw new Error('JPG, PNG, GIF, WebP만 업로드 가능합니다');
    }
    if (file.size > CONFIG.MAX_FILE_SIZE) {
      throw new Error('파일 크기는 10MB 이하여야 합니다');
    }

    // 파일명 생성: user_id/album_id/timestamp.ext
    const ext = file.name.split('.').pop();
    const filePath = `${user.id}/${albumId}/${Date.now()}.${ext}`;

    // Storage에 업로드
    const { error: uploadError } = await supabase.storage
      .from(CONFIG.STORAGE_BUCKET)
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    // Public URL 가져오기
    const { data: { publicUrl } } = supabase.storage
      .from(CONFIG.STORAGE_BUCKET)
      .getPublicUrl(filePath);

    // 이미지 크기 가져오기
    const dimensions = await this.getImageDimensions(file);

    // DB에 메타데이터 저장
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

  // 여러 사진 업로드
  async uploadMultiple(files, albumId, onProgress) {
    const results = [];
    for (let i = 0; i < files.length; i++) {
      try {
        const photo = await this.upload(files[i], albumId);
        results.push({ success: true, photo });
      } catch (err) {
        results.push({ success: false, error: err.message, fileName: files[i].name });
      }
      if (onProgress) onProgress(i + 1, files.length);
    }
    return results;
  },

  // 앨범별 사진 조회
  async getByAlbum(albumId) {
    const { data, error } = await supabase
      .from('photos')
      .select('*')
      .eq('album_id', albumId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // 사진 삭제
  async delete(photo) {
    // Storage에서 파일 삭제
    const filePath = photo.file_url.split('/photos/')[1];
    if (filePath) {
      await supabase.storage
        .from(CONFIG.STORAGE_BUCKET)
        .remove([filePath]);
    }

    // DB에서 삭제
    const { error } = await supabase
      .from('photos')
      .delete()
      .eq('id', photo.id);

    if (error) throw error;
  },

  // 앨범의 모든 사진 삭제
  async deleteByAlbum(albumId) {
    const photos = await this.getByAlbum(albumId);
    for (const photo of photos) {
      await this.delete(photo);
    }
  },

  // 이미지 크기 가져오기
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
  }
};

window.PhotoService = PhotoService;
```

---

## 6. 파일 구조 (업데이트)

```
online-photo-album/
├── index.html              # 로그인/회원가입 페이지
├── albums.html             # 앨범 목록 페이지
├── gallery.html            # 갤러리 페이지
├── css/
│   ├── base.css
│   ├── components.css
│   ├── gallery.css
│   └── albums.css
├── js/
│   ├── config.js           # ⭐ Supabase 설정
│   ├── supabaseClient.js   # ⭐ Supabase 초기화
│   ├── auth.js             # ⭐ 인증 서비스
│   ├── albumService.js     # ⭐ 앨범 CRUD
│   ├── photoService.js     # ⭐ 사진 CRUD
│   ├── gallery.js          # 갤러리 UI
│   ├── albums.js           # 앨범 UI
│   └── lightbox.js         # 라이트박스
└── docs/
    └── ...
```

---

## 7. 다음 단계

### 즉시 할 일
1. [ ] js/config.js 파일 생성
2. [ ] js/supabaseClient.js 파일 생성
3. [ ] js/auth.js 파일 생성
4. [ ] js/albumService.js 파일 생성
5. [ ] js/photoService.js 파일 생성

### 이후 작업
6. [ ] 로그인/회원가입 UI 구현
7. [ ] 기존 storage.js를 Supabase 호출로 교체
8. [ ] 테스트
9. [ ] 기존 로컬 데이터 마이그레이션 (선택)

---

## 8. 유용한 링크

- **대시보드**: https://supabase.com/dashboard/project/zrpmnolsxswlgsxwxgnt
- **테이블 에디터**: https://supabase.com/dashboard/project/zrpmnolsxswlgsxwxgnt/editor
- **Storage**: https://supabase.com/dashboard/project/zrpmnolsxswlgsxwxgnt/storage
- **인증 설정**: https://supabase.com/dashboard/project/zrpmnolsxswlgsxwxgnt/auth
- **API 문서**: https://supabase.com/dashboard/project/zrpmnolsxswlgsxwxgnt/api

---

*최종 수정일: 2026-02-03*
