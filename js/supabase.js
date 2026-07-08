// ============================================
// Supabase 数据库连接与操作
// ============================================
(function() {
  const CONFIG = window.APP_CONFIG;
  
  // 初始化 Supabase 客户端
  const supabaseClient = window.supabase.createClient(
    CONFIG.SUPABASE_URL,
    CONFIG.SUPABASE_KEY
  );
  
  // 暴露到全局
  window.db = supabaseClient;
  
  // 全局数据容器
  window.appData = {
    videos: [],
    brands: [],
    platforms: [],
    videoTypes: [],
    weeklyTasks: [],
    platformData: [],
    dailyTrends: []       // 新增趋势数据
  };
  
  // ========== 加载所有业务数据 ==========
  window.loadAllData = async function() {
    try {
      const [vRes, bRes, pRes, tRes, wRes, pdRes, dtRes] = await Promise.all([
        supabaseClient.from('videos').select('*, brands(name), video_types(name)'),
        supabaseClient.from('brands').select('*'),
        supabaseClient.from('platforms').select('*'),
        supabaseClient.from('video_types').select('*'),
        supabaseClient.from('weekly_tasks').select('*'),
        supabaseClient.from('platform_data').select('*'),
        supabaseClient.from('daily_trends').select('*')   // 新增趋势表
      ]);
      
      if (vRes.data) window.appData.videos = vRes.data;
      if (bRes.data) window.appData.brands = bRes.data;
      if (pRes.data) window.appData.platforms = pRes.data;
      if (tRes.data) window.appData.videoTypes = tRes.data;
      if (wRes.data) window.appData.weeklyTasks = wRes.data;
      if (pdRes.data) window.appData.platformData = pdRes.data;
      if (dtRes.data) window.appData.dailyTrends = dtRes.data;
      
      if (window.updateDataTime) window.updateDataTime();
      return true;
    } catch (e) {
      console.error('数据加载失败', e);
      return false;
    }
  };
  
  // ========== 提交平台数据更新 ==========
  window.submitPlatformData = async function(platformId) {
    const vids = window.appData.videos;
    for (let i = 0; i < vids.length; i++) {
      const vid = vids[i].id;
      const existing = (window.appData.platformData || [])
        .find(d => d.video_id === vid && d.platform_id === platformId);
      
      const viewsEl = document.getElementById('v' + vid + '_views');
      const likesEl = document.getElementById('v' + vid + '_likes');
      const commentsEl = document.getElementById('v' + vid + '_comments');
      const pubEl = document.getElementById('v' + vid + '_pub');
      
      if (!viewsEl && !likesEl && !commentsEl) continue; // 该视频不在当前页面
      
      const data = {
        video_id: vid,
        platform_id: platformId,
        published: pubEl ? pubEl.checked : false,
        views: viewsEl ? parseInt(viewsEl.value) || 0 : 0,
        likes: likesEl ? parseInt(likesEl.value) || 0 : 0,
        comments: commentsEl ? parseInt(commentsEl.value) || 0 : 0,
        updated_at: new Date()
      };
      
      if (existing) {
        await supabaseClient.from('platform_data').update(data).eq('id', existing.id);
      } else {
        await supabaseClient.from('platform_data').insert(data);
      }
    }
    await window.loadAllData();
    if (window.showToast) window.showToast('✅ 数据已保存到数据库', 'success');
  };
  
  // ========== 添加新视频 ==========
  window.addVideo = async function(videoData) {
    const { data, error } = await supabaseClient
      .from('videos')
      .insert([videoData])
      .select();
    if (error) {
      console.error('添加视频失败', error);
      if (window.showToast) window.showToast('添加失败：' + error.message, 'error');
      return null;
    }
    await window.loadAllData();
    if (window.showToast) window.showToast('视频添加成功！', 'success');
    return data;
  };
  
  // ========== 动态添加品牌（如果已存在则返回已有记录） ==========
  window.addBrand = async function(name) {
    const { data, error } = await supabaseClient
      .from('brands')
      .insert({ name })
      .select()
      .single();
    if (!error) {
      window.appData.brands.push(data);
      return data;
    } else if (error.code === '23505') {
      // 唯一键冲突，说明已存在
      return window.appData.brands.find(b => b.name === name);
    }
    console.error('添加品牌失败', error);
    return null;
  };
  
  // ========== 动态添加视频类型 ==========
  window.addType = async function(name) {
    const { data, error } = await supabaseClient
      .from('video_types')
      .insert({ name })
      .select()
      .single();
    if (!error) {
      window.appData.videoTypes.push(data);
      return data;
    } else if (error.code === '23505') {
      return window.appData.videoTypes.find(t => t.name === name);
    }
    console.error('添加类型失败', error);
    return null;
  };
  
})();
