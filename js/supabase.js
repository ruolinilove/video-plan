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
    platformData: []
  };
  
  // 加载所有业务数据
  window.loadAllData = async function() {
    try {
      const [vRes, bRes, pRes, tRes, wRes, pdRes] = await Promise.all([
        supabaseClient.from('videos').select('*, brands(name), video_types(name)'),
        supabaseClient.from('brands').select('*'),
        supabaseClient.from('platforms').select('*'),
        supabaseClient.from('video_types').select('*'),
        supabaseClient.from('weekly_tasks').select('*'),
        supabaseClient.from('platform_data').select('*')
      ]);
      
      if (vRes.data) window.appData.videos = vRes.data;
      if (bRes.data) window.appData.brands = bRes.data;
      if (pRes.data) window.appData.platforms = pRes.data;
      if (tRes.data) window.appData.videoTypes = tRes.data;
      if (wRes.data) window.appData.weeklyTasks = wRes.data;
      if (pdRes.data) window.appData.platformData = pdRes.data;
      
      if (window.updateDataTime) window.updateDataTime();
      return true;
    } catch (e) {
      console.error('数据加载失败', e);
      return false;
    }
  };
  
  // 提交平台数据更新
  window.submitPlatformData = async function(platformId) {
    const vids = window.appData.videos;
    for (let i = 0; i < vids.length; i++) {
      const existing = (window.appData.platformData || [])
        .find(d => d.video_id === vids[i].id && d.platform_id === platformId);
      
      const data = {
        video_id: vids[i].id,
        platform_id: platformId,
        published: document.getElementById('v' + i + '_pub')?.checked || false,
        views: parseInt(document.getElementById('v' + i + '_views')?.value) || 0,
        likes: parseInt(document.getElementById('v' + i + '_likes')?.value) || 0,
        comments: parseInt(document.getElementById('v' + i + '_comments')?.value) || 0,
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
  
})();
