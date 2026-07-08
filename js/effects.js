// ============================================
// 视觉效果引擎
// ============================================
(function() {

  // ==================== 登录页粒子系统 ====================
  function initLoginParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let w, h;
    let mouseX = -500, mouseY = -500;

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    window.addEventListener('mousemove', function(e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // 创建粒子：蓝紫色系，大小不一
    const COUNT = 120;
    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 6 + 2,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.5 + 0.2,
        color: Math.random() > 0.3 ? '59, 130, 246' : '139, 92, 246'
      });
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // 鼠标吸引
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 250 && dist > 0.1) {
          const angle = Math.atan2(dy, dx);
          const force = (250 - dist) / 250;
          p.x += Math.cos(angle) * force * 1.5;
          p.y += Math.sin(angle) * force * 1.5;
        } else {
          p.x += p.dx;
          p.y += p.dy;
        }

        // 边界反弹
        if (p.x < 0 || p.x > w) p.dx *= -1;
        if (p.y < 0 || p.y > h) p.dy *= -1;
        p.x = Math.max(0, Math.min(w, p.x));
        p.y = Math.max(0, Math.min(h, p.y));

        // 绘制粒子
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
        ctx.fill();

        // 粒子间连线
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const d2 = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
          if (d2 < 140) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const alpha = 0.12 * (1 - d2 / 140);
            ctx.strokeStyle = `rgba(99, 130, 246, ${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    draw();
  }

  // ==================== 登录卡片视差跟随 ====================
  function initLoginCardTilt() {
    window.addEventListener('mousemove', function(e) {
      const box = document.getElementById('loginBox');
      if (!box || box.offsetParent === null) return;
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const dx = (e.clientX - cx) / cx * 3;
      const dy = (e.clientY - cy) / cy * 3;
      box.style.transform = `translate(${dx}px, ${dy}px)`;
    });
  }

  // ==================== 后台卡片悬浮动画 ====================
  function initCardHoverEffects() {
    // 使用事件委托监听 KPI 卡片
    document.addEventListener('mouseover', function(e) {
      const card = e.target.closest('.kpi-card');
      if (card) {
        gsap.to(card, {
          scale: 1.02,
          duration: 0.4,
          ease: 'power2.out'
        });
      }
    });
    document.addEventListener('mouseout', function(e) {
      const card = e.target.closest('.kpi-card');
      if (card) {
        gsap.to(card, {
          scale: 1,
          duration: 0.4,
          ease: 'power2.out'
        });
      }
    });
  }

  // ==================== 数字滚动动画 ====================
  window.animateValue = function(element, start, end, duration) {
    if (!element) return;
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    const timer = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
        element.textContent = Math.round(end).toLocaleString();
        clearInterval(timer);
      } else {
        element.textContent = Math.round(current).toLocaleString();
      }
    }, 16);
  };

  // ==================== 数据更新时间显示 ====================
  window.updateDataTime = function() {
    const el = document.getElementById('dataTime');
    if (!el) return;
    const n = new Date();
    el.textContent = '更新于 ' + 
      n.getHours().toString().padStart(2, '0') + ':' + 
      n.getMinutes().toString().padStart(2, '0');
    setTimeout(window.updateDataTime, 60000);
  };

  // ==================== Toast 消息提示 ====================
  window.showToast = function(msg, type) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.className = 'toast ' + type + ' show';
    clearTimeout(el._tid);
    el._tid = setTimeout(() => {
      el.className = 'toast';
    }, 2500);
  };

  // ==================== 初始化所有特效 ====================
  function init() {
    initLoginParticles();
    initLoginCardTilt();
    // 卡片效果在进入后台后启用，这里先绑定，等 dashboard 加载后自动生效
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initCardHoverEffects);
    } else {
      initCardHoverEffects();
    }
  }

  init();

})();
