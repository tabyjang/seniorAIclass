/**
 * Storage Module
 * 로컬 저장소 관리 (localStorage, IndexedDB)
 */

const Storage = {
    // localStorage 키
    KEYS: {
        ALBUMS: 'opa_albums',
        SETTINGS: 'opa_settings'
    },

    /**
     * 앨범 목록 불러오기
     */
    getAlbums() {
        try {
            const data = localStorage.getItem(this.KEYS.ALBUMS);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Error loading albums:', e);
            return [];
        }
    },

    /**
     * 앨범 목록 저장
     */
    saveAlbums(albums) {
        try {
            localStorage.setItem(this.KEYS.ALBUMS, JSON.stringify(albums));
            return true;
        } catch (e) {
            console.error('Error saving albums:', e);
            this.showError('저장 공간이 부족합니다.');
            return false;
        }
    },

    /**
     * IndexedDB 초기화
     */
    async initIndexedDB() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('OnlinePhotoAlbum', 1);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // 사진 저장소
                if (!db.objectStoreNames.contains('photos')) {
                    const photoStore = db.createObjectStore('photos', { keyPath: 'id' });
                    photoStore.createIndex('albumId', 'albumId', { unique: false });
                }
            };
        });
    },

    /**
     * 사진 저장
     */
    async savePhoto(photo) {
        const db = await this.initIndexedDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['photos'], 'readwrite');
            const store = transaction.objectStore('photos');
            const request = store.put(photo);

            request.onsuccess = () => resolve(photo);
            request.onerror = () => reject(request.error);
        });
    },

    /**
     * 앨범별 사진 불러오기
     */
    async getPhotosByAlbum(albumId) {
        const db = await this.initIndexedDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['photos'], 'readonly');
            const store = transaction.objectStore('photos');
            const index = store.index('albumId');
            const request = index.getAll(albumId);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    },

    /**
     * 사진 삭제
     */
    async deletePhoto(id) {
        const db = await this.initIndexedDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['photos'], 'readwrite');
            const store = transaction.objectStore('photos');
            const request = store.delete(id);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    },

    /**
     * 모든 사진 삭제 (앨범 삭제 시)
     */
    async deletePhotosByAlbum(albumId) {
        const photos = await this.getPhotosByAlbum(albumId);
        for (const photo of photos) {
            await this.deletePhoto(photo.id);
        }
    },

    /**
     * 설정 저장
     */
    saveSettings(settings) {
        try {
            localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(settings));
        } catch (e) {
            console.error('Error saving settings:', e);
        }
    },

    /**
     * 설정 불러오기
     */
    getSettings() {
        try {
            const data = localStorage.getItem(this.KEYS.SETTINGS);
            return data ? JSON.parse(data) : {};
        } catch (e) {
            return {};
        }
    },

    /**
     * 에러 메시지 표시
     */
    showError(message) {
        showToast(message, 'error');
    }
};

// 전역 객체로 등록
window.Storage = Storage;
