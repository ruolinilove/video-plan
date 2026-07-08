// ============================================
// 登录认证模块
// ============================================
(function() {

  let currentUser = null;

  // 暴露 currentUser 到全局
  Object.defineProperty(window, 'currentUser', {
    get() { return currentUser; },
    set(val) { currentUser = val; }
  });

  // ==================== 登录 ====================
  window.login = async function() {
    const u = document.getElementById('usernameInput')?.value.trim();
    const pw = document.getElementById('passwordInput')?.value.trim();
    const errEl = document.getElementById('loginError');
    if (errEl) errEl.textContent = '';

    if (!u || !pw) {
      if (errEl) errEl.textContent = '请输入账号和密码';
      return;
    }

    try {
      const res = await window.db
        .from('app_users')
        .select('*')
        .eq('username', u)
        .eq('password', pw)
        .single();

      if (res.data) {
        currentUser = res.data;
        sessionStorage.setItem('loggedInUser', u);
        await window.loadAllData();
        enterDashboard();
      } else {
        if (errEl) errEl.textContent = '账号或密码错误';
      }
    } catch (e) {
      if (errEl) errEl.textContent = '登录失败，网络异常';
      console.error(e);
    }
  };

  // ==================== 进入后台 ====================
  function enterDashboard() {
    const loginPage = document.getElementById('loginPage');
    const loginBg = document.getElementById('loginBg');
    const particleCanvas = document.getElementById('particleCanvas');
    const appContainer = document.getElementById('appContainer');
    const userAvatar = document.getElementById('userAvatar');

    if (loginPage) loginPage.style.display = 'none';
    if (loginBg) loginBg.style.display = 'none';
    if (particleCanvas) particleCanvas.style.display = 'none';
    if (appContainer) appContainer.style.display = 'block';
    if (userAvatar && currentUser) {
      userAvatar.textContent = currentUser.username[0].toUpperCase();
    }

    // 渲染侧边栏并显示数据大盘
    if (window.renderSidebar) window.renderSidebar();
    if (window.switchPage) window.switchPage('dashboard');
  }

  // ==================== 退出登录 ====================
  window.logout = function() {
    sessionStorage.removeItem('loggedInUser');
    currentUser = null;
    
    const appContainer = document.getElementById('appContainer');
    const loginPage = document.getElementById('loginPage');
    const loginBg = document.getElementById('loginBg');
    const particleCanvas = document.getElementById('particleCanvas');

    if (appContainer) appContainer.style.display = 'none';
    if (loginPage) loginPage.style.display = 'flex';
    if (loginBg) loginBg.style.display = 'block';
    if (particleCanvas) particleCanvas.style.display = 'block';
    
    // 清空输入框
    const usernameInput = document.getElementById('usernameInput');
    const passwordInput = document.getElementById('passwordInput');
    if (usernameInput) usernameInput.value = '';
    if (passwordInput) passwordInput.value = '';
    
    // 销毁图表
    if (window.disposeAllCharts) window.disposeAllCharts();
  };

  // ==================== 修改密码 ====================
  window.changePassword = async function() {
    const oldPw = document.getElementById('oldPassword')?.value.trim();
    const newPw = document.getElementById('newPassword')?.value.trim();
    const confirmPw = document.getElementById('confirmPassword')?.value.trim();
    const errEl = document.getElementById('passwordError');

    if (!currentUser) return;
    if (oldPw !== currentUser.password) {
      if (errEl) errEl.textContent = '当前密码错误';
      return;
    }
    if (!newPw || newPw.length < 3) {
      if (errEl) errEl.textContent = '新密码至少3位';
      return;
    }
    if (newPw !== confirmPw) {
      if (errEl) errEl.textContent = '两次密码不一致';
      return;
    }

    try {
      await window.db
        .from('app_users')
        .update({ password: newPw })
        .eq('id', currentUser.id);
      
      currentUser.password = newPw;
      if (window.showToast) window.showToast('密码修改成功', 'success');
      window.closePasswordModal();
    } catch (e) {
      if (window.showToast) window.showToast('修改失败', 'error');
    }
  };

  // ==================== 弹窗控制 ====================
  window.showChangePassword = function() {
    const modal = document.getElementById('passwordModal');
    if (modal) modal.classList.add('show');
    // 清空输入
    const oldEl = document.getElementById('oldPassword');
    const newEl = document.getElementById('newPassword');
    const confirmEl = document.getElementById('confirmPassword');
    const errEl = document.getElementById('passwordError');
    if (oldEl) oldEl.value = '';
    if (newEl) newEl.value = '';
    if (confirmEl) confirmEl.value = '';
    if (errEl) errEl.textContent = '';
  };

  window.closePasswordModal = function() {
    const modal = document.getElementById('passwordModal');
    if (modal) modal.classList.remove('show');
  };

  window.toggleUserDropdown = function() {
    const dropdown = document.getElementById('userDropdown');
    if (dropdown) dropdown.classList.toggle('show');
  };

  // 点击其他地方关闭下拉菜单
  document.addEventListener('click', function(e) {
    const avatar = document.getElementById('userAvatar');
    const dropdown = document.getElementById('userDropdown');
    if (avatar && dropdown) {
      if (!avatar.contains(e.target) && !dropdown.contains(e.target)) {
        dropdown.classList.remove('show');
      }
    }
  });

  // ==================== 自动登录 ====================
  async function autoLogin() {
    const savedUser = sessionStorage.getItem('loggedInUser');
    if (!savedUser) return;
    
    try {
      const res = await window.db
        .from('app_users')
        .select('*')
        .eq('username', savedUser)
        .single();
      
      if (res.data) {
        currentUser = res.data;
        await window.loadAllData();
        enterDashboard();
      }
    } catch (e) {
      // 自动登录失败，清除状态
      sessionStorage.removeItem('loggedInUser');
    }
  }

  // 页面加载后尝试自动登录
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoLogin);
  } else {
    autoLogin();
  }

})();
