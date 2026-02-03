/**
 * Album Manager
 * 앨범 CRUD 관리
 */

class AlbumManager {
    constructor() {
        this.albums = Storage.getAlbums();
    }

    /**
     * 새 앨범 생성
     * @param {string} name - 앨범 이름
     * @param {string} description - 설명
     * @param {string} date - 날짜 (YYYY-MM-DD)
     * @returns {Object} 생성된 앨범 객체
     */
    create(name, description = '', date = '') {
        if (!name || name.trim() === '') {
            throw new Error('앨범 이름을 입력해주세요.');
        }

        const album = {
            id: 'album_' + Date.now(),
            name: name.trim(),
            description: description.trim(),
            date: date || new Date().toISOString().split('T')[0],
            createdAt: new Date().toISOString(),
            photoCount: 0,
            coverPhoto: null
        };

        this.albums.push(album);
        this.save();
        
        return album;
    }

    /**
     * 앨범 가져오기
     * @param {string} id - 앨범 ID
     * @returns {Object|null} 앨범 객체
     */
    get(id) {
        return this.albums.find(a => a.id === id) || null;
    }

    /**
     * 모든 앨범 가져오기
     * @returns {Array} 앨범 목록
     */
    getAll() {
        return [...this.albums];
    }

    /**
     * 앨범 수정
     * @param {string} id - 앨범 ID
     * @param {Object} updates - 수정할 내용
     */
    update(id, updates) {
        const index = this.albums.findIndex(a => a.id === id);
        if (index === -1) {
            throw new Error('앨범을 찾을 수 없습니다.');
        }

        this.albums[index] = {
            ...this.albums[index],
            ...updates,
            id: this.albums[index].id // ID는 변경 불가
        };

        this.save();
        return this.albums[index];
    }

    /**
     * 앨범 삭제
     * @param {string} id - 앨범 ID
     */
    async delete(id) {
        const index = this.albums.findIndex(a => a.id === id);
        if (index === -1) {
            throw new Error('앨범을 찾을 수 없습니다.');
        }

        // 해당 앨범의 모든 사진 삭제
        await Storage.deletePhotosByAlbum(id);

        // 앨범 목록에서 제거
        this.albums.splice(index, 1);
        this.save();
    }

    /**
     * 사진 수 업데이트
     * @param {string} albumId - 앨범 ID
     * @param {number} count - 사진 수
     */
    updatePhotoCount(albumId, count) {
        const album = this.get(albumId);
        if (album) {
            album.photoCount = count;
            this.save();
        }
    }

    /**
     * 커버 사진 업데이트
     * @param {string} albumId - 앨범 ID
     * @param {string} photoData - 사진 데이터 (base64)
     */
    updateCover(albumId, photoData) {
        const album = this.get(albumId);
        if (album) {
            album.coverPhoto = photoData;
            this.save();
        }
    }

    /**
     * 저장
     */
    save() {
        Storage.saveAlbums(this.albums);
    }

    /**
     * 정렬된 앨범 목록
     * @param {string} sortBy - 정렬 기준 (date, name)
     * @returns {Array} 정렬된 앨범 목록
     */
    getSorted(sortBy = 'date') {
        const albums = [...this.albums];
        
        switch (sortBy) {
            case 'date':
                return albums.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            case 'name':
                return albums.sort((a, b) => a.name.localeCompare(b.name));
            default:
                return albums;
        }
    }
}

// 전역 객체로 등록
window.AlbumManager = AlbumManager;
