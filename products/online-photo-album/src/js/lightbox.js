/**
 * Lightbox
 * 사진 상세 보기 (전체화면)
 */

class Lightbox {
    constructor() {
        this.currentIndex = 0;
        this.photos = [];
        this.element = document.getElementById('lightbox');
        this.imgElement = document.getElementById('lightboxImg');
        this.counterElement = document.getElementById('lightboxCounter');
        this.dateElement = document.getElementById('lightboxDate');
        this.locationElement = document.getElementById('lightboxLocation');
        this.descElement = document.getElementById('lightboxDescription');
        
        this.bindEvents();
    }

    /**
     * 라이트박스 열기
     * @param {Array} photos - 사진 목록
     * @param {number} startIndex - 시작 인덱스
     */
    open(photos, startIndex = 0) {
        this.photos = photos;
        this.currentIndex = startIndex;
        this.render();
        
        this.element.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    /**
     * 라이트박스 닫기
     */
    close() {
        this.element.classList.remove('active');
        document.body.style.overflow = '';
    }

    /**
     * 다음 사진
     */
    next() {
        if (this.photos.length <= 1) return;
        this.currentIndex = (this.currentIndex + 1) % this.photos.length;
        this.render();
    }

    /**
     * 이전 사진
     */
    prev() {
        if (this.photos.length <= 1) return;
        this.currentIndex = (this.currentIndex - 1 + this.photos.length) % this.photos.length;
        this.render();
    }

    /**
     * 현재 사진 가져오기
     */
    getCurrentPhoto() {
        return this.photos[this.currentIndex];
    }

    /**
     * 화면 렌더링
     */
    render() {
        const photo = this.getCurrentPhoto();
        if (!photo) return;

        // 이미지
        this.imgElement.src = photo.data;
        
        // 카운터
        this.counterElement.textContent = `${this.currentIndex + 1} / ${this.photos.length}`;
        
        // 날짜
        this.dateElement.textContent = photo.date ? `📅 ${this.formatDate(photo.date)}` : '';
        this.dateElement.style.display = photo.date ? 'block' : 'none';
        
        // 장소
        this.locationElement.textContent = photo.location ? `📍 ${photo.location}` : '';
        this.locationElement.style.display = photo.location ? 'block' : 'none';
        
        // 설명
        this.descElement.textContent = photo.description || '';
        this.descElement.style.display = photo.description ? 'block' : 'none';

        // 즐겨찾기 버튼 상태
        this.updateFavoriteButton(photo.isFavorite);
    }

    /**
     * 즐겨찾기 버튼 업데이트
     */
    updateFavoriteButton(isFavorite) {
        const btn = document.querySelector('.lightbox-actions .btn-icon');
        if (btn) {
            btn.textContent = isFavorite ? '❤️' : '🤍';
            btn.classList.toggle('active', isFavorite);
        }
    }

    /**
     * 날짜 포맷
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    /**
     * 이벤트 바인딩
     */
    bindEvents() {
        // 키보드 네비게이션
        document.addEventListener('keydown', (e) => {
            if (!this.element.classList.contains('active')) return;

            switch (e.key) {
                case 'Escape':
                    this.close();
                    break;
                case 'ArrowRight':
                    this.next();
                    break;
                case 'ArrowLeft':
                    this.prev();
                    break;
            }
        });

        // 배경 클릭 시 닫기
        this.element.addEventListener('click', (e) => {
            if (e.target === this.element) {
                this.close();
            }
        });

        // 터치 스와이프 (모바일)
        let touchStartX = 0;
        let touchEndX = 0;

        this.element.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        this.element.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe(touchStartX, touchEndX);
        }, { passive: true });
    }

    /**
     * 터치 스와이프 처리
     */
    handleSwipe(startX, endX) {
        const diff = startX - endX;
        const threshold = 50; // 스와이프 감지 임계값

        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                // 왼쪽으로 스와이프 (다음)
                this.next();
            } else {
                // 오른쪽으로 스와이프 (이전)
                this.prev();
            }
        }
    }
}

// 전역 인스턴스 생성
let lightbox;

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    lightbox = new Lightbox();
});

// 전역 함수로 등록
window.lightbox = lightbox;
window.openLightbox = (photos, index) => lightbox.open(photos, index);
window.closeLightbox = () => lightbox.close();
window.nextPhoto = () => lightbox.next();
window.prevPhoto = () => lightbox.prev();
