window.dashboardChartModules = window.dashboardChartModules || {};

window.dashboardChartModules.matrix = (function () {
  let topBar;
  let pareto;
  let donut;
  let treemap;

  function initChart(id, current) {
    const el = document.getElementById(id);
    if (!el || typeof echarts === 'undefined') return current;
    if (current) return current;
    return echarts.init(el);
  }

  function toTopCategories(byCategory, limit = 10) {
    return Object.entries(byCategory || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);
  }

  function update(data) {
    const entries = toTopCategories(data.byCategory, 10);
    if (!entries.length) return;

    const labels = entries.map(([name]) => name);
    const values = entries.map(([, value]) => value);
    const cumulative = [];
    const total = values.reduce((sum, v) => sum + v, 0);
    let sum = 0;
    values.forEach(v => {
      sum += v;
      cumulative.push(Math.round((sum / total) * 100));
    });

    topBar = initChart('matrix-top10-chart', topBar);
    pareto = initChart('matrix-pareto-chart', pareto);
    donut = initChart('matrix-donut-chart', donut);
    treemap = initChart('matrix-treemap-chart', treemap);

    const palette = window.dashboardChartsConfig.getSeriesColors();

    if (topBar) {
      topBar.setOption({
        animationDuration: 900,
        animationEasing: window.dashboardChartsConfig.ease,
        grid: { left: 8, right: 10, top: 16, bottom: 12, containLabel: true },
        tooltip: Object.assign(window.dashboardChartsConfig.tooltip(), { trigger: 'axis', axisPointer: { type: 'shadow' } }),
        xAxis: Object.assign({ type: 'value' }, window.dashboardChartsConfig.axis()),
        yAxis: Object.assign({ type: 'category', data: labels, inverse: true }, window.dashboardChartsConfig.axis()),
        series: [{
          type: 'bar',
          data: values,
          barWidth: 12,
          itemStyle: { color: window.dashboardChartsConfig.gradient(), borderRadius: [0, 10, 10, 0] },
          emphasis: { focus: 'series' }
        }]
      }, true);
    }

    if (pareto) {
      pareto.setOption({
        animationDuration: 950,
        animationEasing: window.dashboardChartsConfig.ease,
        grid: { left: 12, right: 12, top: 16, bottom: 22, containLabel: true },
        tooltip: Object.assign(window.dashboardChartsConfig.tooltip(), { trigger: 'axis' }),
        legend: { bottom: 0, textStyle: { color: window.dashboardChartsConfig.getPalette().textSoft } },
        xAxis: Object.assign({ type: 'category', data: labels, axisLabel: { show: false } }, window.dashboardChartsConfig.axis()),
        yAxis: [
          Object.assign({ type: 'value', name: 'Volume' }, window.dashboardChartsConfig.axis()),
          Object.assign({ type: 'value', name: '%', min: 0, max: 100 }, window.dashboardChartsConfig.axis())
        ],
        series: [
          { type: 'bar', name: 'Volume', data: values, itemStyle: { color: palette[1], borderRadius: [6, 6, 0, 0] } },
          { type: 'line', name: 'Cumule', yAxisIndex: 1, smooth: true, data: cumulative, lineStyle: { width: 2, color: palette[0] }, symbolSize: 6 }
        ]
      }, true);
    }

    if (donut) {
      donut.setOption({
        animationDuration: 1000,
        animationEasing: window.dashboardChartsConfig.ease,
        tooltip: window.dashboardChartsConfig.tooltip(),
        legend: { bottom: 0, textStyle: { color: window.dashboardChartsConfig.getPalette().textSoft } },
        series: [{
          type: 'pie',
          radius: ['45%', '72%'],
          center: ['50%', '46%'],
          minAngle: 4,
          itemStyle: { borderColor: 'transparent', borderWidth: 2, borderRadius: 8 },
          label: { show: false },
          data: entries.map(([name, value], i) => ({ name, value, itemStyle: { color: palette[i % palette.length] } })),
          emphasis: { scale: true, scaleSize: 8 }
        }]
      }, true);
    }

    if (treemap) {
      treemap.setOption({
        animationDuration: 900,
        tooltip: window.dashboardChartsConfig.tooltip(),
        series: [{
          type: 'treemap',
          roam: false,
          nodeClick: 'zoomToNode',
          breadcrumb: { show: false },
          label: { color: '#fff', fontSize: 11 },
          upperLabel: { show: false },
          itemStyle: { borderColor: 'rgba(255,255,255,0.24)', gapWidth: 2, borderRadius: 6 },
          levels: [{}, { color: palette }],
          data: entries.map(([name, value]) => ({ name, value }))
        }]
      }, true);
    }
  }

  function resize() {
    [topBar, pareto, donut, treemap].forEach(chart => chart && chart.resize());
  }

  function dispose() {
    [topBar, pareto, donut, treemap].forEach(chart => chart && chart.dispose());
    topBar = null;
    pareto = null;
    donut = null;
    treemap = null;
  }

  return { update, resize, dispose };
})();
