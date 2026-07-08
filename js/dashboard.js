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
          <div class="sub-item" data-page="content-add" onclick="window.switchPage('content-add')">➕ 添加视频</div>
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
      'content-add': '🎬 内容生产 / 添加视频',
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

  // ==================== 数据大盘（全功能增强版） ====================
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

    const platData = PLATFORMS.map(pName => {
      const platformObj = (window.appData.platforms || []).find(p => p.name === pName);
      const pid = platformObj?.id;
      const totalViews = (window.appData.platformData || [])
        .filter(pd => pd.platform_id === pid)
        .reduce((s, pd) => s + (pd.views || 0), 0);
      return { name: pName, views: totalViews };
    });
    const maxView = Math.max(...platData.map(x => x.views), 1);

    const weeks = window.appData.weeklyTasks || [];

    // 日历热力图
    const monthDays = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const monthVideos = Array(monthDays).fill(0);
    (window.appData.videos || []).forEach(v => {
      const d = new Date(v.planned_date);
      if (d.getMonth() === today.getMonth()) {
        monthVideos[d.getDate() - 1] += 1;
      }
    });
    const maxDay = Math.max(...monthVideos, 1);
    const calendarHtml = monthVideos.map((count, idx) => {
      const intensity = count / maxDay;
      const color = intensity === 0 ? '#f1f5f9' : `rgba(59, 130, 246, ${0.2 + intensity * 0.6})`;
      return `<div style="background:${color};border-radius:4px;padding:2px;text-align:center;font-size:10px;" title="${idx+1}日: ${count}条">${idx+1}</div>`;
    }).join('');

    // 实时动态
    const recentUpdates = (window.appData.platformData || [])
      .filter(pd => pd.updated_at)
      .sort((a,b) => new Date(b.updated_at) - new Date(a.updated_at))
      .slice(0, 5);
    const updateHtml = recentUpdates.map(pd => {
      const video = (window.appData.videos || []).find(v => v.id === pd.video_id);
      const platform = (window.appData.platforms || []).find(p => p.id === pd.platform_id);
      return video ? `${platform?.name || ''} · ${video.title} 更新至 ${pd.views}播放` : '';
    }).filter(Boolean).join(' · ') || '暂无更新';

    mc.innerHTML = `
      <div style="background:rgba(255,255,255,0.8);border-radius:12px;padding:10px 16px;margin-bottom:20px;display:flex;align-items:center;gap:10px;font-size:13px;color:#475569;backdrop-filter:blur(10px);">
        <span style="font-weight:600;color:#3b82f6;">📡 动态</span>
        <span>${updateHtml}</span>
      </div>

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

      <div class="grid-2" style="margin-bottom:24px;">
        <div class="card">
          <h3>品牌对比指标</h3>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
            <div>
              <div style="font-weight:600;color:#3b82f6;margin-bottom:8px;">创艺装饰</div>
              <div>总播放：${formatNum(cyViews)}</div>
              <div>已发布：${cyPub.length} 条</div>
              <div>完成率：${cy.length > 0 ? Math.round(cyPub.length / cy.length * 100) : 0}%</div>
            </div>
            <div>
              <div style="font-weight:600;color:#f59e0b;margin-bottom:8px;">喜客喜装饰</div>
              <div>总播放：${formatNum(xkViews)}</div>
              <div>已发布：${xkPub.length} 条</div>
              <div>完成率：${xk.length > 0 ? Math.round(xkPub.length / xk.length * 100) : 0}%</div>
            </div>
          </div>
        </div>
        <div class="card">
          <h3>${today.getMonth() + 1}月发布热力</h3>
          <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;">${calendarHtml}</div>
        </div>
      </div>

      <div class="grid-2">
        <div class="card"><h3>近30天播放趋势</h3><div id="trendChart" class="chart-box"></div></div>
        <div class="card"><h3>视频状态分布</h3><div id="statusChart" class="chart-box"></div></div>
      </div>
      <div class="grid-2">
        <div class="card">
          <h3>各平台播放量对比</h3>
          ${platData.map(p => `
            <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;">
              <span style="width:55px;font-size:12px;">${p.name}</span>
              <div style="flex:1;height:8px;background:#f1f5f9;border-radius:4px;">
                <div style="height:100%;background:linear-gradient(90deg,#3b82f6,#60a5fa);border-radius:4px;width:${Math.round(p.views/maxView*100)}%;"></div>
              </div>
              <span style="font-size:12px;">${formatNum(p.views)}</span>
            </div>`).join('')}
        </div>
        <div class="card"><h3>每周执行汇总</h3><div id="weekBarChart" class="chart-box"></div></div>
      </div>

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
            </tr>`).join('')}
        </table>
      </div>
    `;

    setTimeout(() => {
      const trends = window.appData.dailyTrends || [];
      const cyTrend = trends.filter(d => d.brand_id === 1);
      const xkTrend = trends.filter(d => d.brand_id === 2);
      const dates = [...new Set(trends.map(d => d.date))].sort().slice(-30);
      if (window.renderTrendLineChart) {
        window.renderTrendLineChart('trendChart', dates,
          dates.map(d => (cyTrend.find(t => t.date === d) || {}).views || null),
          dates.map(d => (xkTrend.find(t => t.date === d) || {}).views || null));
      }
      if (window.renderStatusPieChart) window.renderStatusPieChart('statusChart', statusData);
      if (window.renderWeekBarChart) window.renderWeekBarChart('weekBarChart', weeks);
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
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <h3 style="margin:0;">月度计划表</h3>
          <button class="btn btn-primary" onclick="window.switchPage('content-add')">+ 添加视频</button>
        </div>
        <table>
          <tr><th>标题</th><th>类型</th><th>日期</th><th>时间</th><th>状态</th></tr>
          ${vids.map(v => {
            const typeName = (window.appData.videoTypes || []).find(t => t.id === v.type_id)?.name || '';
            const statusClass = v.status === '已发布' ? 'published' : v.status === '剪辑中' ? 'editing' : v.status === '拍摄中' ? 'shooting' : 'pending';
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

  // ==================== 数据维护页面（表格美化版） ====================
  function renderMaintainPage(mc, platform) {
    const platformObj = (window.appData.platforms || []).find(p => p.name === platform);
    const pid = platformObj?.id;
    const allVids = window.appData.videos || [];
    const brands = window.appData.brands || [];
    const types = window.appData.videoTypes || [];

    // 保存当前筛选条件
    let filterBrand = '', filterType = '', filterStatus = '';

    // 内部渲染表格函数
    function renderTable() {
      const filtered = allVids.filter(v => {
        const bName = brands.find(b => b.id === v.brand_id)?.name || '';
        const tName = types.find(t => t.id === v.type_id)?.name || '';
        return (!filterBrand || bName === filterBrand) &&
               (!filterType || tName === filterType) &&
               (!filterStatus || v.status === filterStatus);
      });

      return filtered.map(v => {
        const pd = (window.appData.platformData || []).find(d => d.video_id === v.id && d.platform_id === pid) || {};
        const brandName = brands.find(b => b.id === v.brand_id)?.name || '';
        const typeName = types.find(t => t.id === v.type_id)?.name || '';
        const statusClass = v.status === '已发布' ? 'published' : v.status === '剪辑中' ? 'editing' : v.status === '拍摄中' ? 'shooting' : 'pending';
        return `<tr>
          <td><input type="checkbox" class="batch-check" data-id="${v.id}"></td>
          <td>${brandName}</td>
          <td>${v.title}</td>
          <td>${typeName}</td>
          <td>${v.planned_date}</td>
          <td><span class="status-tag ${statusClass}">${v.status}</span></td>
          <td><input type="number" id="v${v.id}_views" value="${pd.views || 0}" style="width:80px;"></td>
          <td><input type="number" id="v${v.id}_likes" value="${pd.likes || 0}" style="width:70px;"></td>
          <td><input type="number" id="v${v.id}_comments" value="${pd.comments || 0}" style="width:70px;"></td>
          <td><input type="checkbox" id="v${v.id}_pub" ${pd.published ? 'checked' : ''}></td>
        </tr>`;
      }).join('') || '<tr><td colspan="10" style="text-align:center;color:#94a3b8;">无匹配数据</td></tr>';
    }

    // 绑定筛选事件
    window.filterMaintain = function() {
      const selects = document.querySelectorAll('#maintainFilters select');
      if (selects.length >= 3) {
        filterBrand = selects[0].value;
        filterType = selects[1].value;
        filterStatus = selects[2].value;
      }
      const tbody = document.getElementById('maintainTableBody');
      if (tbody) tbody.innerHTML = renderTable();
    };

    mc.innerHTML = `
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px;">
          <h3>${platform} · 数据维护</h3>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-secondary" onclick="window.batchPublish('${platform}')">批量设为已发布</button>
            <button class="btn btn-secondary" onclick="window.batchFillZero('${platform}')">批量清零</button>
            <button class="btn btn-primary" onclick="window.submitPlatformData(${pid})">💾 保存全部</button>
          </div>
        </div>

        <div id="maintainFilters" style="display:flex;gap:12px;margin-bottom:12px;">
          <select onchange="window.filterMaintain()">
            <option value="">全部品牌</option>
            ${brands.map(b => `<option>${b.name}</option>`).join('')}
          </select>
          <select onchange="window.filterMaintain()">
            <option value="">全部类型</option>
            ${types.map(t => `<option>${t.name}</option>`).join('')}
          </select>
          <select onchange="window.filterMaintain()">
            <option value="">全部状态</option>
            <option>待拍摄</option><option>拍摄中</option><option>剪辑中</option><option>已发布</option>
          </select>
        </div>

        <div style="overflow-x:auto;">
          <table>
            <thead>
              <tr>
                <th><input type="checkbox" id="selectAll" onchange="document.querySelectorAll('.batch-check').forEach(cb => cb.checked = this.checked)"></th>
                <th>品牌</th><th>标题</th><th>类型</th><th>日期</th><th>状态</th>
                <th>播放量</th><th>点赞</th><th>评论</th><th>已发布</th>
              </tr>
            </thead>
            <tbody id="maintainTableBody">${renderTable()}</tbody>
          </table>
        </div>
      </div>
    `;

    // 批量操作函数
    window.batchPublish = function() {
      document.querySelectorAll('.batch-check:checked').forEach(cb => {
        const vid = cb.dataset.id;
        const pubCheckbox = document.getElementById(`v${vid}_pub`);
        if (pubCheckbox) pubCheckbox.checked = true;
      });
    };
    window.batchFillZero = function() {
      document.querySelectorAll('.batch-check:checked').forEach(cb => {
        const vid = cb.dataset.id;
        ['views','likes','comments'].forEach(field => {
          const input = document.getElementById(`v${vid}_${field}`);
          if (input) input.value = 0;
        });
      });
    };
  }

  // ==================== 添加视频页面 ====================
  function renderContentAdd(mc) {
    const brands = window.appData.brands || [];
    const types = window.appData.videoTypes || [];
    
    const brandOptions = brands.map(b => `<option value="${b.id}">${b.name}</option>`).join('');
    const typeOptions = types.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const defaultDate = tomorrow.toISOString().split('T')[0];
    
    mc.innerHTML = `
      <div class="card">
        <h3>添加新视频</h3>
        <div class="form-group">
          <label>品牌</label>
          <div style="display:flex;gap:8px;">
            <select id="addBrand" style="flex:1;">${brandOptions}</select>
            <input type="text" id="addBrandNew" placeholder="或输入新品牌" style="flex:1;">
          </div>
        </div>
        <div class="form-group">
          <label>视频标题</label>
          <input type="text" id="addTitle" placeholder="输入视频标题">
        </div>
        <div class="form-group">
          <label>视频类型</label>
          <div style="display:flex;gap:8px;">
            <select id="addType" style="flex:1;">${typeOptions}</select>
            <input type="text" id="addTypeNew" placeholder="或输入新类型" style="flex:1;">
          </div>
        </div>
        <div class="form-group">
          <label>计划日期</label>
          <input type="date" id="addDate" value="${defaultDate}">
        </div>
        <div class="form-group">
          <label>计划时间</label>
          <input type="time" id="addTime" value="10:00">
        </div>
        <button class="btn btn-primary" onclick="window.submitNewVideo()">提交</button>
        <div id="addResult" style="margin-top:12px;"></div>
      </div>
    `;
  }

  // 提交新视频（支持动态添加品牌/类型）
  window.submitNewVideo = async function() {
    const brandIdSelect = document.getElementById('addBrand').value;
    const brandNewName = document.getElementById('addBrandNew').value.trim();
    const title = document.getElementById('addTitle').value.trim();
    const typeIdSelect = document.getElementById('addType').value;
    const typeNewName = document.getElementById('addTypeNew').value.trim();
    const date = document.getElementById('addDate').value;
    const time = document.getElementById('addTime').value;
    
    if (!title) { window.showToast('请输入视频标题', 'error'); return; }
    
    let brandId = parseInt(brandIdSelect);
    let typeId = parseInt(typeIdSelect);
    
    // 动态添加品牌
    if (brandNewName && window.addBrand) {
      const newBrand = await window.addBrand(brandNewName);
      if (newBrand) brandId = newBrand.id;
    }
    // 动态添加类型
    if (typeNewName && window.addType) {
      const newType = await window.addType(typeNewName);
      if (newType) typeId = newType.id;
    }
    
    if (!brandId || !typeId) { window.showToast('请选择或输入有效的品牌和类型', 'error'); return; }
    
    const videoData = {
      brand_id: brandId,
      title: title,
      type_id: typeId,
      planned_date: date,
      planned_time: time,
      status: '待拍摄'
    };
    
    const result = await window.addVideo(videoData);
    if (result) {
      document.getElementById('addTitle').value = '';
      document.getElementById('addBrandNew').value = '';
      document.getElementById('addTypeNew').value = '';
      const brand = window.appData.brands.find(b => b.id === brandId);
      if (brand && brand.name === '喜客喜装饰') {
        window.switchPage('brand-xikexi');
      } else {
        window.switchPage('brand-chuangyi');
      }
    }
  };

})();
