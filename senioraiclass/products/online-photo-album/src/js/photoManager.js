/**
 * Photo Manager
 * 사진 관리 (업로드, 저장, 삭제)
 */

class PhotoManager {
    constructor(albumId) {
        this.albumId = albumId;
        this.photos = [];
    }

    /**
     * 사진 목록 불러오기
     */
    async load() {
        this.photos = await Storage.getPhotosByAlbum(this.albumId);
        // 날짜 순으로 정렬 (최신순)
        this.photos.sort((a, b) => new Date(b.date) - new Date(a.date));
        return this.photos;
    }

    /**
     * 사진 추가
     * @param {string} imageData - base64 이미지 데이터
     * @param {Object} metadata - 메타데이터 (date, location, description)
     */
    async add(imageData, metadata = {}) {
        const photo = {
            id: 'photo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            albumId: this.albumId,
            data: imageData,
            date: metadata.date || new Date().toISOString().split('T')[0],
            location: metadata.location || '',
            description: metadata.description || '',
            isFavorite: false,
            createdAt: new Date().toISOString()
        };

        await Storage.savePhoto(photo);
        this.photos.unshift(photo);
        
        // 앨범의 사진 수 업데이트
        if (window.albumManager) {
            window.albumManager.updatePhotoCount(this.albumId, this.photos.length);
        }

        return photo;
    }

    /**
     * 파일에서 사진 추가
     * @param {File} file - 이미지 파일
     */
    async addFromFile(file) {
        // 파일 검증
        if (!file.type.startsWith('image/')) {
            throw new Error('이미지 파일만 업로드 가능합니다.');
        }

        // 10MB 제한
        if (file.size > 10 * 1024 * 1024) {
            throw new Error('파일 크기는 10MB 이하여야 합니다.');
        }

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = async (e) => {
                try {
                    // 이미지 리사이즈 (최대 1920px)
                    const resizedData = await this.resizeImage(e.target.result);
                    const photo = await this.add(resizedData);
                    resolve(photo);
                } catch (error) {
                    reject(error);
                }
            };

            reader.onerror = () => reject(new Error('파일을 읽을 수 없습니다.'));
            reader.readAsDataURL(file);
        });
    }

    /**
     * 이미지 리사이즈 및 WebP 변환
     * @param {string} dataUrl - 원본 이미지 데이터
     * @param {number} maxSize - 최대 크기
     */
    async resizeImage(dataUrl, maxSize = 1920) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                let width = img.width;
                let height = img.height;

                // 크기가 maxSize보다 크면 리사이즈
                if (width > maxSize || height > maxSize) {
                    if (width > height) {
                        height = Math.round((height * maxSize) / width);
                        width = maxSize;
                    } else {
                        width = Math.round((width * maxSize) / height);
                        height = maxSize;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                // WebP 지원 여부 체크
                const isWebPSupported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
                
                if (isWebPSupported) {
                    // WebP로 변환 (용량 30~50% 절약, 품질 0.85)
                    const webpData = canvas.toDataURL('image/webp', 0.85);
                    console.log(`✅ WebP 변환 완료: ${width}x${height}`);
                    resolve(webpData);
                } else {
                    // WebP 미지원 브라우저는 JPEG로 변환
                    console.log(`⚠️ JPEG로 변환 (WebP 미지원): ${width}x${height}`);
                    resolve(canvas.toDataURL('image/jpeg', 0.9));
                }
            };

            img.onerror = () => reject(new Error('이미지 처리 실패'));
            img.src = dataUrl;
        });
    }

    /**
     * 여러 파일 업로드
     * @param {FileList} files - 파일 목록
     */
    async addMultiple(files) {
        const results = [];
        const errors = [];

        for (const file of files) {
            try {
                const photo = await this.addFromFile(file);
                results.push(photo);
            } catch (error) {
                errors.push({ file: file.name, error: error.message });
            }
        }

        return { results, errors };
    }

    /**
     * 사진 가져오기
     * @param {string} id - 사진 ID
     */
    get(id) {
        return this.photos.find(p => p.id === id) || null;
    }

    /**
     * 모든 사진 가져오기
     */
    getAll() {
        return [...this.photos];
    }

    /**
     * 사진 정보 수정
     * @param {string} id - 사진 ID
     * @param {Object} updates - 수정할 내용
     */
    async update(id, updates) {
        const photo = this.get(id);
        if (!photo) {
            throw new Error('사진을 찾을 수 없습니다.');
        }

        Object.assign(photo, updates);
        await Storage.savePhoto(photo);
        
        return photo;
    }

    /**
     * 즐겨찾기 토글
     * @param {string} id - 사진 ID
     */
    async toggleFavorite(id) {
        const photo = this.get(id);
        if (photo) {
            photo.isFavorite = !photo.isFavorite;
            await Storage.savePhoto(photo);
        }
        return photo;
    }

    /**
     * 사진 삭제
     * @param {string} id - 사진 ID
     */
    async delete(id) {
        const index = this.photos.findIndex(p => p.id === id);
        if (index === -1) {
            throw new Error('사진을 찾을 수 없습니다.');
        }

        await Storage.deletePhoto(id);
        this.photos.splice(index, 1);

        // 앨범의 사진 수 업데이트
        if (window.albumManager) {
            window.albumManager.updatePhotoCount(this.albumId, this.photos.length);
        }
    }

    /**
     * 사진 수
     */
    get count() {
        return this.photos.length;
    }
}

// 전역 객체로 등록
window.PhotoManager = PhotoManager;
