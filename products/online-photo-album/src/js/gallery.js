/**
 * Gallery Page
 * 갤러리 페이지 기능
 */

// 전역 변수
let albumManager;
let photoManager;
let currentAlbum = null;
let currentPhotos = [];

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    initGalleryPage();
});

/**
 * 페이지 초기화
 */
async function initGalleryPage() {
    // URL에서 앨범 ID 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const albumId = urlParams.get('album');

    if (!albumId) {
        // 앨범 ID 없으면 목록으로
        window.location.href = 'albums.html';
        return;
    }

    // 매니저 초기화
    albumManager = new AlbumManager();
    photoManager = new PhotoManager(albumId);

    // 앨범 정보 로드
    currentAlbum = albumManager.get(albumId);
    if (!currentAlbum) {
        showToast('앨범을 찾을 수 없습니다.', 'error');
        window.location.href = 'albums.html';
        return;
    }

    // 페이지 정보 업데이트
    updateAlbumInfo();

    // 사진 로드 및 표시
    await loadPhotos();

    // 이벤트 리스너 설정
    setupEventListeners();
}

/**
 * 앨범 정보 표시
 */
function updateAlbumInfo() {
    document.getElementById('albumName').textContent = currentAlbum.name;
    document.getElementById('albumMeta').textContent = 
        `${currentAlbum.description || formatDate(currentAlbum.date)} • ${currentAlbum.photoCount}장의 사진`;
}

/**
 * 사진 로드
 */
async function loadPhotos() {
    try {
        currentPhotos = await photoManager.load();
        renderGallery();
    } catch (error) {
        console.error('Error loading photos:', error);
        showToast('사진을 불러오는 중 오류가 발생했습니다.', 'error');
    }
}

/**
 * 갤러리 렌더링
 */
function renderGallery() {
    const gallery = document.getElementById('gallery');
    const emptyState = document.getElementById('emptyState');

    // 기존 내용 초기화
    gallery.innerHTML = '';

    // 빈 상태 처리
    if (currentPhotos.length === 0) {
        gallery.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    gallery.style.display = 'block';
    emptyState.style.display = 'none';

    // 사진 카드 생성
    currentPhotos.forEach((photo, index) => {
        const card = createPhotoCard(photo, index);
        gallery.appendChild(card);
    });
}

/**
 * 사진 카드 생성
 */
function createPhotoCard(photo, index) {
    const card = document.createElement('div');
    card.className = 'photo-card';
    card.onclick = () => openLightbox(currentPhotos, index);

    const favoriteIcon = photo.isFavorite ? '❤️' : '🤍';

    card.innerHTML = `
        <div class="photo-wrapper">
            <img src="${photo.data}" alt="${photo.description || '사진'}" loading="lazy">
            <div class="photo-overlay">
                <button class="view-btn">🔍 크게 보기</button>
            </div>
            <button class="favorite-btn ${photo.isFavorite ? 'active' : ''}" 
                    onclick="event.stopPropagation(); togglePhotoFavorite('${photo.id}')">
                ${favoriteIcon}
            </button>
        </div>
        <div class="card-info">
            <div class="card-meta">
                ${photo.location ? `<span>📍 ${escapeHtml(photo.location)}</span>` : ''}
                ${photo.date ? `<span>📅 ${formatShortDate(photo.date)}</span>` : ''}
            </div>
            ${photo.description ? `<p class="card-description">${escapeHtml(photo.description)}</p>` : ''}
        </div>
    `;

    return card;
}

/**
 * 이벤트 리스너 설정
 */
function setupEventListeners() {
    // 드래그앤드롭
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');

    // 클릭으로 파일 선택
    dropZone.addEventListener('click', () => fileInput.click());

    // 파일 선택 시
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFiles(e.target.files);
        }
    });

    // 드래그 이벤트
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFiles(files);
        }
    });

    // 전역 함수 등록
    window.togglePhotoFavorite = togglePhotoFavorite;
    window.deletePhoto = deletePhoto;
    window.toggleFavorite = toggleFavorite;
    window.downloadPhoto = downloadPhoto;
    window.editPhoto = editPhoto;
    window.savePhotoInfo = savePhotoInfo;
}

/**
 * 파일 처리
 */
async function handleFiles(files) {
    showToast('사진을 업로드 중입니다...');

    try {
        const { results, errors } = await photoManager.addMultiple(files);

        if (results.length > 0) {
            await loadPhotos();
            showToast(`${results.length}장의 사진이 추가되었습니다.`);
            
            // 첫 업로드면 앨범 커버 업데이트
            if (currentAlbum.photoCount === results.length) {
                albumManager.updateCover(currentAlbum.id, results[0].data);
            }
        }

        if (errors.length > 0) {
            console.error('Upload errors:', errors);
            showToast(`${errors.length}개 파일 업로드 실패`, 'error');
        }
    } catch (error) {
        console.error('Upload error:', error);
        showToast('업로드 중 오류가 발생했습니다.', 'error');
    }

    // 파일 input 초기화
    document.getElementById('fileInput').value = '';
}

/**
 * 즐겨찾기 토글
 */
async function togglePhotoFavorite(photoId) {
    try {
        await photoManager.toggleFavorite(photoId);
        await loadPhotos();
    } catch (error) {
        showToast('오류가 발생했습니다.', 'error');
    }
}

/**
 * 라이트박스에서 즐겨찾기
 */
async function toggleFavorite() {
    const photo = lightbox.getCurrentPhoto();
    if (photo) {
        await togglePhotoFavorite(photo.id);
        lightbox.updateFavoriteButton(!photo.isFavorite);
    }
}

/**
 * 사진 다운로드
 */
function downloadPhoto() {
    const photo = lightbox.getCurrentPhoto();
    if (!photo) return;

    const link = document.createElement('a');
    link.href = photo.data;
    link.download = `photo_${photo.date || 'unknown'}.jpg`;
    link.click();
}

/**
 * 사진 정보 수정 모달 열기
 */
function editPhoto() {
    const photo = lightbox.getCurrentPhoto();
    if (!photo) return;

    document.getElementById('photoDate').value = photo.date || '';
    document.getElementById('photoLocation').value = photo.location || '';
    document.getElementById('photoDesc').value = photo.description || '';

    document.getElementById('editModal').classList.add('active');
}

/**
 * 모달 닫기
 */
function closeEditModal() {
    document.getElementById('editModal').classList.remove('active');
}

/**
 * 사진 정보 저장
 */
async function savePhotoInfo() {
    const photo = lightbox.getCurrentPhoto();
    if (!photo) return;

    const updates = {
        date: document.getElementById('photoDate').value,
        location: document.getElementById('photoLocation').value.trim(),
        description: document.getElementById('photoDesc').value.trim()
    };

    try {
        await photoManager.update(photo.id, updates);
        await loadPhotos();
        closeEditModal();
        lightbox.render();
        showToast('사진 정보가 저장되었습니다.');
    } catch (error) {
        showToast('저장 중 오류가 발생했습니다.', 'error');
    }
}

/**
 * 사진 삭제
 */
async function deletePhoto() {
    const photo = lightbox.getCurrentPhoto();
    if (!photo) return;

    if (!confirm('이 사진을 삭제하시겠습니까?')) return;

    try {
        await photoManager.delete(photo.id);
        await loadPhotos();
        closeLightbox();
        updateAlbumInfo();
        showToast('사진이 삭제되었습니다.');
    } catch (error) {
        showToast('삭제 중 오류가 발생했습니다.', 'error');
    }
}

/**
 * 앨범 삭제
 */
async function deleteAlbum() {
    if (!confirm(`'${currentAlbum.name}' 앨범을 삭제하시겠습니까?\n모든 사진이 함께 삭제됩니다.`)) return;

    try {
        await albumManager.delete(currentAlbum.id);
        showToast('앨범이 삭제되었습니다.');
        setTimeout(() => {
            window.location.href = 'albums.html';
        }, 1000);
    } catch (error) {
        showToast('삭제 중 오류가 발생했습니다.', 'error');
    }
}

/**
 * 공유 기능
 */
async function shareAlbum() {
    const shareUrl = window.location.href;
    
    try {
        await navigator.clipboard.writeText(shareUrl);
        showToast('링크가 복사되었습니다. 원하는 곳에 붙여넣기 하세요.');
    } catch (err) {
        // 클립보드 API 실패 시 선택
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('링크가 복사되었습니다.');
    }
}

/**
 * 슬라이드쇼
 */
function showSlideshow() {
    if (currentPhotos.length === 0) {
        showToast('사진이 없습니다.', 'error');
        return;
    }
    
    showToast('슬라이드쇼 기능은 준비 중입니다.');
}

/**
 * HTML 이스케이프
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * 날짜 포맷 (긴 형태)
 */
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * 날짜 포맷 (짧은 형태)
 */
function formatShortDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

/**
 * 토스트 메시지
 */
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// 모달 외부 클릭 시 닫기
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});
