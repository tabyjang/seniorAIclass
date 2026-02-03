/**
 * Auth Module
 * Supabase 인증 관리
 */

const Auth = {
  /**
   * 회원가입
   */
  async signUp(email, password) {
    const client = initSupabase();
    const { data, error } = await client.auth.signUp({
      email,
      password
    });
    if (error) throw error;
    return data;
  },

  /**
   * 로그인
   */
  async signIn(email, password) {
    const client = initSupabase();
    const { data, error } = await client.auth.signInWithPassword({
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
    const client = initSupabase();
    const { error } = await client.auth.signOut();
    if (error) throw error;
  },

  /**
   * 현재 사용자 가져오기
   */
  async getCurrentUser() {
    const client = initSupabase();
    const { data: { user } } = await client.auth.getUser();
    return user;
  },

  /**
   * 세션 확인
   */
  async getSession() {
    const client = initSupabase();
    const { data: { session } } = await client.auth.getSession();
    return session;
  },

  /**
   * 인증 상태 변경 감지
   */
  onAuthStateChange(callback) {
    const client = initSupabase();
    return client.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  },

  /**
   * 로그인 필요 여부 확인 후 리다이렉트
   */
  async requireAuth() {
    const user = await this.getCurrentUser();
    if (!user) {
      // 로그인 모달 표시
      showLoginModal();
      return false;
    }
    return true;
  }
};

// 전역으로 노출
window.Auth = Auth;

/**
 * 로그인 모달 표시
 */
function showLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) {
    modal.classList.add('show');
  }
}

/**
 * 로그인 모달 닫기
 */
function closeLoginModal() {
  const modal = document.getElementById('loginModal');
  if (modal) {
    modal.classList.remove('show');
  }
}

/**
 * 로그인 폼 제출
 */
async function handleLogin(e) {
  if (e) e.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  if (!email || !password) {
    showToast('이메일과 비밀번호를 입력하세요', 'error');
    return;
  }

  try {
    await Auth.signIn(email, password);
    showToast('로그인 성공!', 'success');
    closeLoginModal();
    // 페이지 새로고침하여 데이터 로드
    location.reload();
  } catch (error) {
    console.error('Login error:', error);
    showToast(getAuthErrorMessage(error), 'error');
  }
}

/**
 * 회원가입 폼 제출
 */
async function handleSignUp(e) {
  if (e) e.preventDefault();

  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  const passwordConfirm = document.getElementById('signupPasswordConfirm').value;

  if (!email || !password) {
    showToast('이메일과 비밀번호를 입력하세요', 'error');
    return;
  }

  if (password !== passwordConfirm) {
    showToast('비밀번호가 일치하지 않습니다', 'error');
    return;
  }

  if (password.length < 6) {
    showToast('비밀번호는 6자 이상이어야 합니다', 'error');
    return;
  }

  try {
    await Auth.signUp(email, password);
    showToast('회원가입 완료! 이메일을 확인해주세요', 'success');
    // 로그인 탭으로 전환
    switchAuthTab('login');
  } catch (error) {
    console.error('Signup error:', error);
    showToast(getAuthErrorMessage(error), 'error');
  }
}

/**
 * 로그아웃
 */
async function handleLogout() {
  try {
    await Auth.signOut();
    showToast('로그아웃 되었습니다', 'success');
    location.reload();
  } catch (error) {
    console.error('Logout error:', error);
    showToast('로그아웃 실패', 'error');
  }
}

/**
 * 로그인/회원가입 탭 전환
 */
function switchAuthTab(tab) {
  const loginForm = document.getElementById('loginForm');
  const signupForm = document.getElementById('signupForm');
  const loginTab = document.getElementById('loginTab');
  const signupTab = document.getElementById('signupTab');

  if (tab === 'login') {
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
  } else {
    loginForm.style.display = 'none';
    signupForm.style.display = 'block';
    loginTab.classList.remove('active');
    signupTab.classList.add('active');
  }
}

/**
 * 인증 에러 메시지 변환
 */
function getAuthErrorMessage(error) {
  const messages = {
    'Invalid login credentials': '이메일 또는 비밀번호가 틀렸습니다',
    'User already registered': '이미 가입된 이메일입니다',
    'Email not confirmed': '이메일 인증을 완료해주세요',
    'Invalid email': '올바른 이메일 형식이 아닙니다',
    'Signup requires a valid password': '유효한 비밀번호를 입력하세요'
  };
  return messages[error.message] || error.message || '오류가 발생했습니다';
}

/**
 * 사용자 UI 업데이트
 */
async function updateAuthUI() {
  const user = await Auth.getCurrentUser();
  const authButton = document.getElementById('authButton');
  const userInfo = document.getElementById('userInfo');

  if (user) {
    // 로그인 상태
    if (authButton) {
      authButton.innerHTML = '로그아웃';
      authButton.onclick = handleLogout;
    }
    if (userInfo) {
      userInfo.innerHTML = `<span class="user-email">${user.email}</span>`;
      userInfo.style.display = 'block';
    }
  } else {
    // 로그아웃 상태
    if (authButton) {
      authButton.innerHTML = '로그인';
      authButton.onclick = showLoginModal;
    }
    if (userInfo) {
      userInfo.style.display = 'none';
    }
  }
}

// 전역 함수 노출
window.showLoginModal = showLoginModal;
window.closeLoginModal = closeLoginModal;
window.handleLogin = handleLogin;
window.handleSignUp = handleSignUp;
window.handleLogout = handleLogout;
window.switchAuthTab = switchAuthTab;
window.updateAuthUI = updateAuthUI;
