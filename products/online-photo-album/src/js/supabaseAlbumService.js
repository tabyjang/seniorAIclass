/**
 * Supabase Album Service
 * 앨범 CRUD 기능 (Supabase 연동)
 */

const SupabaseAlbumService = {
  /**
   * 앨범 생성
   */
  async create(name, description, date) {
    const client = initSupabase();
    const user = await Auth.getCurrentUser();

    if (!user) {
      throw new Error('로그인이 필요합니다');
    }

    const { data, error } = await client
      .from('albums')
      .insert({
        user_id: user.id,
        name: name,
        description: description || '',
        date: date || null
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * 내 앨범 목록 조회
   */
  async getAll() {
    const client = initSupabase();
    const user = await Auth.getCurrentUser();

    if (!user) {
      return [];
    }

    const { data, error } = await client
      .from('albums')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    // 각 앨범의 사진 수 가져오기
    for (const album of data) {
      const { count } = await client
        .from('photos')
        .select('*', { count: 'exact', head: true })
        .eq('album_id', album.id);

      album.photoCount = count || 0;
    }

    return data;
  },

  /**
   * 앨범 상세 조회
   */
  async getById(id) {
    const client = initSupabase();

    const { data, error } = await client
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
  async update(id, updates) {
    const client = initSupabase();

    const { data, error } = await client
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
   * 앨범 커버 이미지 설정
   */
  async setCoverImage(albumId, imageUrl) {
    return this.update(albumId, { cover_image_url: imageUrl });
  },

  /**
   * 앨범 삭제
   */
  async delete(id) {
    const client = initSupabase();

    // 먼저 앨범의 모든 사진 삭제
    await SupabasePhotoService.deleteByAlbum(id);

    // 앨범 삭제
    const { error } = await client
      .from('albums')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// 전역으로 노출
window.SupabaseAlbumService = SupabaseAlbumService;
