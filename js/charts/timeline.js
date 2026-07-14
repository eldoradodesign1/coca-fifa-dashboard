window.dashboardChartModules = window.dashboardChartModules || {};

window.dashboardChartModules.timeline = (function () {
  let trend;
  let breakdown;

  function initChart(id, current) {
    const el = document.getElementById(id);
    if (!el || typeof echarts === 'undefined') return current;
    if (current) return current;
    return echarts.init(el);
  }

  function update(data) {
    const weeks = data.weekLabels;
    const counts = data.weekValues;

    trend = initChart('week-trend-chart', trend);
    breakdown = initChart('week-category-chart', breakdown);

    if (trend) {
      trend.setOption({
        animationDuration: 1000,
        animationEasing: window.dashboardChartsConfig.ease,
        tooltip: Object.assign(window.dashboardChartsConfig.tooltip(), { trigger: 'axis' }),
        grid: { left: 18, right: 12, top: 18, bottom: 24, containLabel: true },
        xAxis: Object.assign({ type: 'category', data: weeks }, window.dashboardChartsConfig.axis()),
        yAxis: Object.assign({ type: 'value' }, window.dashboardChartsConfig.axis()),
        dataZoom: [{ type: 'inside' }, { type: 'slider', height: 14, bottom: 2 }],
        series: [{
          type: 'line',
          smooth: true,
          data: counts,
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: { width: 3, color: window.dashboardChartsConfig.gradient() },
          itemStyle: { color: window.dashboardChartsConfig.getPalette().red },
          areaStyle: { color: window.dashboardChartsConfig.areaGradient() },
          emphasis: { focus: 'series' }
        }]
      }, true);
    }

    if (breakdown) {
      breakdown.setOption({
        animationDuration: 900,
        tooltip: window.dashboardChartsConfig.tooltip(),
        legend: {
          bottom: 0,
          itemWidth: 10,
          itemHeight: 10,
          textStyle: { color: window.dashboardChartsConfig.getPalette().textSoft, fontSize: 11 }
        },
        series: [{
          type: 'pie',
          radius: ['42%', '70%'],
          center: ['50%', '44%'],
          roseType: false,
          label: { show: false },
          itemStyle: { borderRadius: 8, borderColor: 'transparent', borderWidth: 2 },
          data: data.selectedWeekBreakdown,
          emphasis: { scale: true, scaleSize: 7 }
        }]
      }, true);
    }
  }

  function resize() {
    if (trend) trend.resize();
    if (breakdown) breakdown.resize();
  }

  function dispose() {
    if (trend) trend.dispose();
    if (breakdown) breakdown.dispose();
    trend = null;
    breakdown = null;
  }

  return { update, resize, dispose };
})();
