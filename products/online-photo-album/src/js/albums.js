/**
 * Albums Page
 * 앨범 목록 페이지 기능
 */

// 전역 변수
let albumManager;
let currentAlbums = [];

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    initAlbumsPage();
});

/**
 * 페이지 초기화
 */
function initAlbumsPage() {
    albumManager = new AlbumManager();
    renderAlbums();
    setupEventListeners();
}

/**
 * 앨범 목록 렌더링
 */
function renderAlbums() {
    currentAlbums = albumManager.getSorted('date');
    const grid = document.getElementById('albumGrid');
    const emptyState = document.getElementById('emptyState');

    // 기존 내용 초기화
    grid.innerHTML = '';

    // 빈 상태 처리
    if (currentAlbums.length === 0) {
        grid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    grid.style.display = 'grid';
    emptyState.style.display = 'none';

    // 앨범 카드 생성
    currentAlbums.forEach(album => {
        const card = createAlbumCard(album);
        grid.appendChild(card);
    });

    // 새 앨범 카드 추가
    const newCard = createNewAlbumCard();
    grid.appendChild(newCard);
}

/**
 * 앨범 카드 생성
 */
function createAlbumCard(album) {
    const card = document.createElement('div');
    card.className = 'album-card';
    card.onclick = () => openAlbum(album.id);

    // 커버 이미지
    const coverImage = album.coverPhoto || `https://picsum.photos/400/300?random=${album.id.slice(-5)}`;
    
    card.innerHTML = `
        <div class="album-cover">
            <img src="${coverImage}" alt="${album.name}" loading="lazy">
            <span class="photo-count">${album.photoCount}장</span>
        </div>
        <div class="album-info">
            <h3>${escapeHtml(album.name)}</h3>
            <p>${escapeHtml(album.description) || formatDate(album.date)}</p>
        </div>
    `;

    return card;
}

/**
 * 새 앨범 카드 생성
 */
function createNewAlbumCard() {
    const card = document.createElement('div');
    card.className = 'new-album-card';
    card.onclick = openCreateModal;

    card.innerHTML = `
        <span class="new-album-icon">+</span>
        <span class="new-album-text">새 앨범 만들기</span>
        <span class="new-album-hint">사진을 정리하고 공유하세요</span>
    `;

    return card;
}

/**
 * 앨범 열기
 */
function openAlbum(albumId) {
    window.location.href = `index.html?album=${albumId}`;
}

/**
 * 모달 열기
 */
function openCreateModal() {
    const modal = document.getElementById('createModal');
    const dateInput = document.getElementById('albumDate');
    
    // 오늘 날짜 기본값
    dateInput.value = new Date().toISOString().split('T')[0];
    
    modal.classList.add('active');
    document.getElementById('albumName').focus();
}

/**
 * 모달 닫기
 */
function closeCreateModal() {
    const modal = document.getElementById('createModal');
    modal.classList.remove('active');
    
    // 폼 초기화
    document.getElementById('albumName').value = '';
    document.getElementById('albumDesc').value = '';
}

/**
 * 앨범 생성
 */
async function createAlbum() {
    const nameInput = document.getElementById('albumName');
    const descInput = document.getElementById('albumDesc');
    const dateInput = document.getElementById('albumDate');

    const name = nameInput.value.trim();
    const description = descInput.value.trim();
    const date = dateInput.value;

    if (!name) {
        showToast('앨범 이름을 입력해주세요.', 'error');
        nameInput.focus();
        return;
    }

    try {
        const album = albumManager.create(name, description, date);
        closeCreateModal();
        renderAlbums();
        showToast(`'${name}' 앨범이 생성되었습니다.`);
        
        // 생성된 앨범으로 이동
        setTimeout(() => openAlbum(album.id), 500);
    } catch (error) {
        showToast(error.message, 'error');
    }
}

/**
 * 이벤트 리스너 설정
 */
function setupEventListeners() {
    // 모달 외부 클릭 시 닫기
    document.getElementById('createModal').addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeCreateModal();
        }
    });

    // Enter 키로 생성
    document.getElementById('albumName').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            createAlbum();
        }
    });
}

/**
 * HTML 이스케이프
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * 날짜 포맷
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
 * 토스트 메시지 표시
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
