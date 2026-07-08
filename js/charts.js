// ============================================
// ECharts 图表模块
// ============================================
(function() {

  // 存储已创建的图表实例
  window.chartInstances = {};

  // 创建或更新图表
  window.renderChart = function(containerId, option) {
    const container = document.getElementById(containerId);
    if (!container) return null;
    
    // 如果已存在实例则销毁重建
    if (window.chartInstances[containerId]) {
      window.chartInstances[containerId].dispose();
    }
    
    const chart = echarts.init(container);
    chart.setOption(option);
    window.chartInstances[containerId] = chart;
    
    // 响应窗口大小变化
    window.addEventListener('resize', () => {
      if (window.chartInstances[containerId]) {
        window.chartInstances[containerId].resize();
      }
    });
    
    return chart;
  };

  // ==================== 数据大盘 - 视频状态分布饼图 ====================
  window.renderStatusPieChart = function(containerId, statusData) {
    return window.renderChart(containerId, {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      series: [{
        type: 'pie',
        radius: ['55%', '75%'],
        center: ['50%', '50%'],
        data: statusData,
        label: {
          color: '#64748b',
          fontSize: 12
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 3,
          borderRadius: 6
        },
        emphasis: {
          label: {
            fontSize: 14,
            fontWeight: 'bold'
          },
          scaleSize: 10
        }
      }]
    });
  };

  // ==================== 数据大盘 - 播放趋势折线图 ====================
  window.renderTrendLineChart = function(containerId, dates, cyData, xkData) {
    return window.renderChart(containerId, {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['创艺装饰', '喜客喜装饰'],
        textStyle: { color: '#64748b' },
        top: 0
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: dates,
        axisLabel: {
          color: '#94a3b8',
          fontSize: 11,
          rotate: 30
        },
        axisLine: {
          lineStyle: { color: '#e2e8f0' }
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: '#94a3b8',
          fontSize: 11
        },
        splitLine: {
          lineStyle: { color: '#f1f5f9' }
        }
      },
      series: [
        {
          name: '创艺装饰',
          type: 'line',
          data: cyData,
          smooth: true,
          lineStyle: { color: '#3b82f6', width: 2 },
          itemStyle: { color: '#3b82f6' },
          symbol: 'circle',
          symbolSize: 6
        },
        {
          name: '喜客喜装饰',
          type: 'line',
          data: xkData,
          smooth: true,
          lineStyle: { color: '#f59e0b', width: 2 },
          itemStyle: { color: '#f59e0b' },
          symbol: 'circle',
          symbolSize: 6
        }
      ]
    });
  };

  // ==================== 数据大盘 - 每周执行汇总柱状图 ====================
  window.renderWeekBarChart = function(containerId, weeks) {
    return window.renderChart(containerId, {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['出片', '拍摄'],
        textStyle: { color: '#64748b' },
        top: 0
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: weeks.map(w => w.week),
        axisLabel: {
          color: '#94a3b8',
          fontSize: 10,
          rotate: 15
        },
        axisLine: {
          lineStyle: { color: '#e2e8f0' }
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: '#94a3b8',
          fontSize: 11
        },
        splitLine: {
          lineStyle: { color: '#f1f5f9' }
        }
      },
      series: [
        {
          name: '出片',
          type: 'bar',
          data: weeks.map(w => w.output),
          itemStyle: {
            color: '#3b82f6',
            borderRadius: [6, 6, 0, 0]
          },
          barWidth: '35%'
        },
        {
          name: '拍摄',
          type: 'bar',
          data: weeks.map(w => w.shoot),
          itemStyle: {
            color: '#f59e0b',
            borderRadius: [6, 6, 0, 0]
          },
          barWidth: '35%'
        }
      ]
    });
  };

  // ==================== 品牌分析 - 类型树状图 ====================
  window.renderTypeTreeChart = function(containerId, treeData) {
    return window.renderChart(containerId, {
      tooltip: {
        trigger: 'item',
        triggerOn: 'mousemove'
      },
      series: [{
        type: 'tree',
        data: treeData,
        top: '5%',
        left: '8%',
        bottom: '5%',
        right: '12%',
        symbolSize: 7,
        orient: 'LR',
        label: {
          position: 'right',
          verticalAlign: 'middle',
          align: 'left',
          fontSize: 12,
          color: '#334155'
        },
        leaves: {
          label: {
            position: 'right',
            verticalAlign: 'middle',
            align: 'left'
          }
        },
        expandAndCollapse: true,
        animationDuration: 550,
        animationDurationUpdate: 750
      }]
    });
  };

  // ==================== 品牌分析 - 雷达图 ====================
  window.renderRadarChart = function(containerId, radarIndicator, cyRadar, xkRadar) {
    return window.renderChart(containerId, {
      tooltip: {},
      radar: {
        indicator: radarIndicator,
        axisName: {
          color: '#64748b',
          fontSize: 11
        },
        shape: 'circle',
        splitArea: {
          areaStyle: {
            color: ['rgba(59,130,246,0.02)', 'rgba(59,130,246,0.02)']
          }
        }
      },
      series: [{
        type: 'radar',
        data: [
          {
            name: '创艺装饰',
            value: cyRadar,
            lineStyle: { color: '#3b82f6' },
            areaStyle: { color: 'rgba(59,130,246,0.1)' },
            itemStyle: { color: '#3b82f6' }
          },
          {
            name: '喜客喜装饰',
            value: xkRadar,
            lineStyle: { color: '#f59e0b' },
            areaStyle: { color: 'rgba(245,158,11,0.1)' },
            itemStyle: { color: '#f59e0b' }
          }
        ]
      }]
    });
  };

  // ==================== 销毁所有图表 ====================
  window.disposeAllCharts = function() {
    Object.keys(window.chartInstances).forEach(key => {
      if (window.chartInstances[key]) {
        window.chartInstances[key].dispose();
        delete window.chartInstances[key];
      }
    });
  };

})();
