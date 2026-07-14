window.dashboardChartModules = window.dashboardChartModules || {};

window.dashboardChartModules.recommendations = (function () {
  let chart;

  function update() {
    const el = document.getElementById('recommendations-chart');
    if (!el || typeof echarts === 'undefined') return;
    if (!chart) chart = echarts.init(el);

    chart.setOption({
      animationDuration: 900,
      animationEasing: window.dashboardChartsConfig.ease,
      tooltip: window.dashboardChartsConfig.tooltip(),
      legend: {
        bottom: 0,
        textStyle: { color: window.dashboardChartsConfig.getPalette().textSoft, fontSize: 11 }
      },
      series: [{
        type: 'pie',
        radius: ['38%', '68%'],
        center: ['50%', '44%'],
        itemStyle: { borderRadius: 8, borderColor: 'transparent', borderWidth: 2 },
        label: { show: false },
        data: [
          { value: 45, name: i18n.t('slide9.tech') },
          { value: 30, name: i18n.t('slide9.process') },
          { value: 25, name: i18n.t('slide9.print') }
        ],
        emphasis: { scale: true, scaleSize: 8 }
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
