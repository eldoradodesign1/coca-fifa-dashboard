window.dashboardChartModules = window.dashboardChartModules || {};

window.dashboardChartModules.weight = (function () {
  let chart;

  function update(metrics) {
    const el = document.getElementById('weight-main-chart');
    if (!el || typeof echarts === 'undefined') return;
    if (!chart) chart = echarts.init(el);

    chart.setOption({
      animationDuration: 1050,
      animationEasing: window.dashboardChartsConfig.ease,
      tooltip: window.dashboardChartsConfig.tooltip(),
      legend: {
        bottom: 0,
        textStyle: { color: window.dashboardChartsConfig.getPalette().textSoft },
        selectedMode: true
      },
      toolbox: {
        right: 8,
        feature: {
          saveAsImage: { title: 'PNG' }
        },
        iconStyle: { borderColor: window.dashboardChartsConfig.getPalette().textSoft }
      },
      series: [{
        name: 'Poids',
        type: 'pie',
        radius: ['46%', '78%'],
        center: ['50%', '43%'],
        label: { show: false },
        selectedMode: 'single',
        selectedOffset: 10,
        itemStyle: { borderRadius: 10, borderColor: 'transparent', borderWidth: 2 },
        data: metrics,
        emphasis: {
          scale: true,
          scaleSize: 10,
          label: { show: true, formatter: '{b}\n{d}%', color: '#fff', fontWeight: 600 }
        }
      }]
    }, true);
  }

  function resize() {
    if (chart) chart.resize();
  }

  function dispose() {
    if (chart) chart.dispose();
    chart = null;
  }

  return { update, resize, dispose };
})();
