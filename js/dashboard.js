// ============================================
// 后台核心模块：导航、页面切换、数据展示
// ============================================
(function() {

  const PLATFORMS = window.APP_CONFIG.PLATFORMS;
  const PLATFORM_PAGE_MAP = window.APP_CONFIG.PLATFORM_PAGE_MAP;

  // ==================== 侧边栏 ====================
  window.renderSidebar = function() {
    const sidebar = document.getElementById('sidebar');
    if (!sidebar) return;
    
    sidebar.innerHTML = `
      <div class="sidebar-logo"><span></span>数据中心</div>
      <div class="nav-item active" data-page="dashboard" onclick="window.toggleNav(this,'dashboard')">
        <div class="left">📊 数据大盘</div>
      </div>
      <div class="nav-group">
        <div class="nav-item" onclick="window.toggleNav(this,'brand')">
          <div class="left">📊 品牌数据</div><span class="arrow">▶</span>
        </div>
        <div class="sub-nav" id="sub-brand">
          <div class="sub-item" data-page="brand-chuangyi" onclick="window.switchPage('brand-chuangyi')">创艺装饰</div>
          <div class="sub-item" data-page="brand-xikexi" onclick="window.switchPage('brand-xikexi')">喜客喜装饰</div>
        </div>
      </div>
      <div class="nav-group">
        <div class="nav-item" onclick="window.toggleNav(this,'content')">
          <div class="left">🎬 内容生产</div><span class="arrow">▶</span>
        </div>
        <div class="sub-nav" id="sub-content">
          <div class="sub-item" data-page="content-shoot" onclick="window.switchPage('content-shoot')">拍摄任务</div>
          <div class="sub-item" data-page="content-edit" onclick="window.switchPage('content-edit')">剪辑任务</div>
          <div class="sub-item" data-page="content-copy" onclick="window.switchPage('content-copy')">文案任务</div>
          <div class="sub-item" data-page="content-idea" onclick="window.switchPage('content-idea')">灵感/选题库</div>
        </div>
      </div>
      <div class="nav-group">
        <div class="nav-item" onclick="window.toggleNav(this,'summary')">
          <div class="left">📝 工作总结</div><span class="arrow">▶</span>
        </div>
        <div class="sub-nav" id="sub-summary">
          <div class="sub-item" data-page="summary-month-plan" onclick="window.switchPage('summary-month-plan')">月度视频规划</div>
          <div class="sub-item" data-page="summary-week-plan" onclick="window.switchPage('summary-week-plan')">周执行计划</div>
          <div class="sub-item" data-page="summary-week" onclick="window.switchPage('summary-week')">周总结</div>
          <div class="sub-item" data-page="summary-month" onclick="window.switchPage('summary-month')">月总结</div>
          <div class="sub-item" data-page="summary-year" onclick="window.switchPage('summary-year')">年总结</div>
        </div>
      </div>
      <div class="nav-group">
        <div class="nav-item" onclick="window.toggleNav(this,'maintain')">
          <div class="left">🔧 数据维护</div><span class="arrow">▶</span>
        </div>
        <div class="sub-nav" id="sub-maintain">
          <div class="sub-item" data-page="maintain-wechat" onclick="window.switchPage('maintain-wechat')">视频号</div>
          <div class="sub-item" data-page="maintain-kuaishou" onclick="window.switchPage('maintain-kuaishou')">快手</div>
          <div class="sub-item" data-page="maintain-douyin" onclick="window.switchPage('maintain-douyin')">抖音</div>
          <div class="sub-item" data-page="maintain-bilibili" onclick="window.switchPage('maintain-bilibili')">B站</div>
          <div class="sub-item" data-page="maintain-weibo" onclick="window.switchPage('maintain-weibo')">微博</div>
        </div>
      </div>
      <div class="nav-group">
        <div class="nav-item" onclick="window.toggleNav(this,'fun')">
          <div class="left">🎮 放松小站</div><span class="arrow">▶</span>
        </div>
        <div class="sub-nav" id="sub-fun">
          <div class="sub-item" data-page="fun-touch" onclick="window.switchPage('fun-touch')">今日摸鱼</div>
          <div class="sub-item" data-page="fun-pixel" onclick="window.switchPage('fun-pixel')">像素画板</div>
          <div class="sub-item" data-page="fun-plant" onclick="window.switchPage('fun-plant')">虚拟盆栽</div>
          <div class="sub-item" data-page="fun-mood" onclick="window.switchPage('fun-mood')">心情日记</div>
        </div>
      </div>`;
  };

  // ==================== 展开/折叠子菜单 ====================
  window.toggleNav = function(el, group) {
    const sub = document.getElementById('sub-' + group);
    const arrow = el.querySelector('.arrow');
    if (sub) {
      sub.classList.toggle('show');
      if (arrow) arrow.classList.toggle('open');
    } else {
      window.switchPage(el.dataset.page);
    }
  };

  // ==================== 页面切换 ====================
  window.switchPage = function(pageId) {
    // 高亮导航
    document.querySelectorAll('.nav-item, .sub-item').forEach(el => el.classList.remove('active'));
    const activeEl = document.querySelector(`[data-page="${pageId}"]`);
    if (activeEl) activeEl.classList.add('active');

    // 面包屑
    const bc = document.getElementById('breadcrumb');
    const map = {
      'dashboard': '📊 数据大盘',
      'brand-chuangyi': '📊 品牌数据 / 创艺装饰',
      'brand-xikexi': '📊 品牌数据 / 喜客喜装饰',
      'content-shoot': '🎬 内容生产 / 拍摄任务',
      'content-edit': '🎬 内容生产 / 剪辑任务',
      'content-copy': '🎬 内容生产 / 文案任务',
      'content-idea': '🎬 内容生产 / 灵感/选题库',
      'summary-month-plan': '📝 工作总结 / 月度视频规划',
      'summary-week-plan': '📝 工作总结 / 周执行计划',
      'summary-week': '📝 工作总结 / 周总结',
      'summary-month': '📝 工作总结 / 月总结',
      'summary-year': '📝 工作总结 / 年总结',
      'maintain-wechat': '🔧 数据维护 / 视频号',
      'maintain-kuaishou': '🔧 数据维护 / 快手',
      'maintain-douyin': '🔧 数据维护 / 抖音',
      'maintain-bilibili': '🔧 数据维护 / B站',
      'maintain-weibo': '🔧 数据维护 / 微博',
      'fun-touch': '🎮 放松小站 / 今日摸鱼',
      'fun-pixel': '🎮 放松小站 / 像素画板',
      'fun-plant': '🎮 放松小站 / 虚拟盆栽',
      'fun-mood': '🎮 放松小站 / 心情日记'
    };
    if (bc) bc.innerHTML = map[pageId] || '';

    const mc = document.getElementById('pageContent');
    if (!mc) return;

    // 路由分发
    if (pageId === 'dashboard') {
      renderDashboard(mc);
    } else if (pageId.startsWith('brand-')) {
      const brand = pageId.includes('chuangyi') ? '创艺装饰' : '喜客喜装饰';
      renderBrandPage(mc, brand);
    } else if (pageId.startsWith('maintain-')) {
      const key = pageId.replace('maintain-', '');
      const platform = PLATFORM_PAGE_MAP[key] || key;
      renderMaintainPage(mc, platform);
        } else if (pageId === 'content-add') {
      renderContentAdd(mc);
    } else {
      mc.innerHTML = '<div class="card"><h3>页面开发中...</h3></div>';
    }
  };

  // ==================== 工具函数 ====================
  function formatNum(n) {
    if (n >= 10000) return (n / 10000).toFixed(1) + 'w';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
    return n.toString();
  }
  window.formatNum = formatNum;

  function getVideoViews(video) {
    return (window.appData.platformData || [])
      .filter(pd => pd.video_id === video.id)
      .reduce((s, pd) => s + (pd.views || 0), 0);
  }
  window.getVideoViews = getVideoViews;

  function getBrandVideos(brandName) {
    const brand = (window.appData.brands || []).find(b => b.name === brandName);
    return (window.appData.videos || []).filter(v => v.brand_id === brand?.id);
  }
  window.getBrandVideos = getBrandVideos;

  // ==================== 数据大盘 ====================
  function renderDashboard(mc) {
    const cy = getBrandVideos('创艺装饰');
    const xk = getBrandVideos('喜客喜装饰');
    const cyPub = cy.filter(v => v.status === '已发布');
    const xkPub = xk.filter(v => v.status === '已发布');
    const cyViews = cyPub.reduce((s, v) => s + getVideoViews(v), 0);
    const xkViews = xkPub.reduce((s, v) => s + getVideoViews(v), 0);
    const totalPub = cyPub.length + xkPub.length;
    const totalPlan = cy.length + xk.length;
    
    const statusCount = {};
    (window.appData.videos || []).forEach(v => {
      statusCount[v.status] = (statusCount[v.status] || 0) + 1;
    });
    const statusData = Object.entries(statusCount).map(([n, v]) => ({ name: n, value: v }));

    const today = new Date();
    const todayStr = today.getFullYear() + '-' + 
      (today.getMonth() + 1).toString().padStart(2, '0') + '-' + 
      today.getDate().toString().padStart(2, '0');
    const todayVideos = (window.appData.videos || []).filter(v => 
      v.planned_date === todayStr && v.status !== '已发布'
    );
    const recentVideos = [...(window.appData.videos || [])]
      .filter(v => v.status === '已发布')
      .sort((a, b) => b.planned_date.localeCompare(a.planned_date))
      .slice(0, 5);

    mc.innerHTML = `
      <div class="kpi-row">
        <div class="kpi-card brand-card">
          <div class="label">🏠 创艺装饰 · 总播放</div>
          <div class="value">${formatNum(cyViews)}</div>
          <div class="sub">已发布 ${cyPub.length} 条</div>
        </div>
        <div class="kpi-card brand-card orange">
          <div class="label">🏡 喜客喜装饰 · 总播放</div>
          <div class="value">${formatNum(xkViews)}</div>
          <div class="sub">已发布 ${xkPub.length} 条</div>
        </div>
        <div class="kpi-card">
          <div class="label">📹 本月发布进度</div>
          <div class="value">${totalPub}<span style="font-size:16px;color:#94a3b8;"> / ${totalPlan}</span></div>
          <div class="sub">完成率 ${totalPlan > 0 ? Math.round(totalPub / totalPlan * 100) : 0}%</div>
        </div>
        <div class="kpi-card">
          <div class="label">📋 今日待处理</div>
          <div class="value">${todayVideos.length}</div>
          <div class="sub">条视频待拍摄/剪辑/发布</div>
        </div>
      </div>
      <div class="grid-2">
        <div class="card"><h3>视频状态分布</h3><div id="statusChart" class="chart-box"></div></div>
        <div class="card">
          <h3>最近发布视频</h3>
          <table>
            <tr><th>品牌</th><th>标题</th><th>日期</th><th>总播放</th></tr>
            ${recentVideos.map(v => `
              <tr>
                <td>${(window.appData.brands.find(b => b.id === v.brand_id)?.name || '')}</td>
                <td>${v.title}</td>
                <td>${v.planned_date}</td>
                <td>${formatNum(getVideoViews(v))}</td>
              </tr>
            `).join('')}
          </table>
        </div>
      </div>`;

    // 延迟渲染图表
    setTimeout(() => {
      if (window.renderStatusPieChart) {
        window.renderStatusPieChart('statusChart', statusData);
      }
    }, 200);
  }

  // ==================== 品牌数据页面 ====================
  function renderBrandPage(mc, brand) {
    const vids = getBrandVideos(brand);
    const pub = vids.filter(v => v.status === '已发布');
    const totalViews = pub.reduce((s, v) => s + getVideoViews(v), 0);
    
    mc.innerHTML = `
      <div class="kpi-row">
        <div class="kpi-card">
          <div class="label">总播放</div>
          <div class="value">${formatNum(totalViews)}</div>
        </div>
        <div class="kpi-card">
          <div class="label">发布视频数</div>
          <div class="value">${pub.length}</div>
        </div>
      </div>
      <div class="card">
        <h3>月度计划表</h3>
        <table>
          <tr><th>标题</th><th>类型</th><th>日期</th><th>时间</th><th>状态</th></tr>
          ${vids.map(v => {
            const typeName = (window.appData.videoTypes || []).find(t => t.id === v.type_id)?.name || '';
            const statusClass = v.status === '已发布' ? 'published' :
                                v.status === '剪辑中' ? 'editing' :
                                v.status === '拍摄中' ? 'shooting' : 'pending';
            return `<tr>
              <td>${v.title}</td>
              <td>${typeName}</td>
              <td>${v.planned_date}</td>
              <td>${v.planned_time}</td>
              <td><span class="status-tag ${statusClass}">${v.status}</span></td>
            </tr>`;
          }).join('')}
        </table>
      </div>`;
  }

  // ==================== 数据维护页面 ====================
  function renderMaintainPage(mc, platform) {
    const platformObj = (window.appData.platforms || []).find(p => p.name === platform);
    const pid = platformObj?.id;
    const vids = window.appData.videos || [];
    
    let html = `<div class="card"><h3>${platform} · 数据维护</h3>`;
    
    vids.forEach((v, i) => {
      const pd = (window.appData.platformData || []).find(d => d.video_id === v.id && d.platform_id === pid) || {};
      const brandName = (window.appData.brands || []).find(b => b.id === v.brand_id)?.name || '';
      html += `
        <div style="background:#f8fafc;border-radius:14px;padding:14px;margin-bottom:12px;">
          <b>${brandName} · ${v.title}</b>
          <div style="display:flex;gap:12px;margin-top:8px;flex-wrap:wrap;">
            播放 <input type="number" id="v${i}_views" value="${pd.views || 0}" style="width:90px;">
            点赞 <input type="number" id="v${i}_likes" value="${pd.likes || 0}" style="width:90px;">
            评论 <input type="number" id="v${i}_comments" value="${pd.comments || 0}" style="width:90px;">
            <label style="font-size:13px;">
              <input type="checkbox" id="v${i}_pub" ${pd.published ? 'checked' : ''}> 已发布
            </label>
          </div>
        </div>`;
    });
    
    html += `<button class="btn btn-primary" onclick="window.submitPlatformData(${pid})">提交数据</button></div>`;
    mc.innerHTML = html;
  }

})();
