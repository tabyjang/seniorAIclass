/**
 * Supabase Photo Service
 * 사진 업로드/삭제 기능 (Supabase Storage + Database)
 */

const SupabasePhotoService = {
  /**
   * 사진 업로드
   */
  async upload(file, albumId, metadata = {}) {
    const client = initSupabase();
    const user = await Auth.getCurrentUser();

    if (!user) {
      throw new Error('로그인이 필요합니다');
    }

    // 파일 검증
    if (!CONFIG.ALLOWED_TYPES.includes(file.type)) {
      throw new Error('JPG, PNG, GIF, WebP 파일만 업로드 가능합니다');
    }

    if (file.size > CONFIG.MAX_FILE_SIZE) {
      throw new Error('파일 크기는 10MB 이하여야 합니다');
    }

    // 이미지 리사이즈 (옵션)
    let uploadFile = file;
    if (file.size > 2 * 1024 * 1024) { // 2MB 이상이면 리사이즈
      try {
        uploadFile = await this.resizeImage(file, CONFIG.MAX_IMAGE_WIDTH);
      } catch (e) {
        console.warn('Image resize failed, using original:', e);
      }
    }

    // 파일 경로 생성: user_id/album_id/timestamp.ext
    const ext = file.name.split('.').pop().toLowerCase();
    const timestamp = Date.now();
    const filePath = `${user.id}/${albumId}/${timestamp}.${ext}`;

    // Storage에 업로드
    const { error: uploadError } = await client.storage
      .from(CONFIG.STORAGE_BUCKET)
      .upload(filePath, uploadFile, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;

    // Public URL 가져오기
    const { data: { publicUrl } } = client.storage
      .from(CONFIG.STORAGE_BUCKET)
      .getPublicUrl(filePath);

    // 이미지 크기 가져오기
    const dimensions = await this.getImageDimensions(file);

    // Database에 메타데이터 저장
    const { data, error } = await client
      .from('photos')
      .insert({
        album_id: albumId,
        user_id: user.id,
        file_name: file.name,
        file_url: publicUrl,
        file_size: uploadFile.size,
        width: dimensions.width,
        height: dimensions.height,
        description: metadata.description || '',
        location: metadata.location || '',
        taken_at: metadata.taken_at || null,
        is_favorite: false
      })
      .select()
      .single();

    if (error) throw error;

    // 첫 번째 사진이면 앨범 커버로 설정
    await this.setAlbumCoverIfFirst(albumId, publicUrl);

    return data;
  },

  /**
   * 여러 사진 업로드
   */
  async uploadMultiple(files, albumId, onProgress) {
    const results = [];

    for (let i = 0; i < files.length; i++) {
      try {
        const photo = await this.upload(files[i], albumId);
        results.push({ success: true, photo });
      } catch (error) {
        results.push({
          success: false,
          error: error.message,
          fileName: files[i].name
        });
      }

      if (onProgress) {
        onProgress(i + 1, files.length);
      }
    }

    return results;
  },

  /**
   * 앨범의 사진 목록 조회
   */
  async getByAlbum(albumId) {
    const client = initSupabase();

    const { data, error } = await client
      .from('photos')
      .select('*')
      .eq('album_id', albumId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * 사진 상세 조회
   */
  async getById(id) {
    const client = initSupabase();

    const { data, error } = await client
      .from('photos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * 사진 정보 수정
   */
  async update(id, updates) {
    const client = initSupabase();

    const { data, error } = await client
      .from('photos')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * 즐겨찾기 토글
   */
  async toggleFavorite(id) {
    const photo = await this.getById(id);
    return this.update(id, { is_favorite: !photo.is_favorite });
  },

  /**
   * 사진 삭제
   */
  async delete(photo) {
    const client = initSupabase();

    // Storage에서 파일 삭제
    const filePath = this.extractFilePath(photo.file_url);
    if (filePath) {
      await client.storage
        .from(CONFIG.STORAGE_BUCKET)
        .remove([filePath]);
    }

    // Database에서 삭제
    const { error } = await client
      .from('photos')
      .delete()
      .eq('id', photo.id);

    if (error) throw error;
  },

  /**
   * 앨범의 모든 사진 삭제
   */
  async deleteByAlbum(albumId) {
    const photos = await this.getByAlbum(albumId);

    for (const photo of photos) {
      await this.delete(photo);
    }
  },

  /**
   * 첫 번째 사진을 앨범 커버로 설정
   */
  async setAlbumCoverIfFirst(albumId, imageUrl) {
    const client = initSupabase();

    // 앨범의 현재 커버 확인
    const { data: album } = await client
      .from('albums')
      .select('cover_image_url')
      .eq('id', albumId)
      .single();

    // 커버가 없으면 설정
    if (!album?.cover_image_url) {
      await client
        .from('albums')
        .update({ cover_image_url: imageUrl })
        .eq('id', albumId);
    }
  },

  /**
   * URL에서 Storage 파일 경로 추출
   */
  extractFilePath(url) {
    if (!url) return null;
    const match = url.match(/\/photos\/(.+)$/);
    return match ? match[1] : null;
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
   * 이미지 리사이즈
   */
  resizeImage(file, maxWidth) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(new File([blob], file.name, { type: 'image/jpeg' }));
            } else {
              reject(new Error('Resize failed'));
            }
          },
          'image/jpeg',
          0.85
        );

        URL.revokeObjectURL(img.src);
      };
      img.onerror = () => reject(new Error('Image load failed'));
      img.src = URL.createObjectURL(file);
    });
  }
};

// 전역으로 노출
window.SupabasePhotoService = SupabasePhotoService;
