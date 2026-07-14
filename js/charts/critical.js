window.dashboardChartModules = window.dashboardChartModules || {};

window.dashboardChartModules.critical = (function () {
  let chart;

  function update(criticalData) {
    const el = document.getElementById('critical-chart');
    if (!el || typeof echarts === 'undefined') return;
    if (!chart) chart = echarts.init(el);

    const highContrast = ['#F40009', '#f59e0b', '#22c55e', '#38bdf8', '#a78bfa', '#fb7185'];

    chart.setOption({
      animationDuration: 980,
      animationEasing: window.dashboardChartsConfig.ease,
      color: highContrast,
      tooltip: window.dashboardChartsConfig.tooltip(),
      legend: {
        bottom: 0,
        textStyle: { color: window.dashboardChartsConfig.getPalette().textSoft, fontSize: 11 },
        itemWidth: 14,
        itemHeight: 10
      },
      radar: {
        center: ['50%', '42%'],
        radius: '60%',
        splitNumber: 5,
        axisName: { color: window.dashboardChartsConfig.getPalette().text, fontSize: 11, fontWeight: 600 },
        axisLine: { lineStyle: { color: 'rgba(127,127,127,0.4)' } },
        splitLine: { lineStyle: { color: 'rgba(127,127,127,0.36)', width: 1.2 } },
        splitArea: { areaStyle: { color: ['rgba(0,0,0,0)', 'rgba(244,0,9,0.04)'] } },
        indicator: [
          { name: 'Lisibilite', max: 100 },
          { name: 'Charge', max: 100 },
          { name: 'Delai', max: 100 },
          { name: 'Satisfaction', max: 100 },
          { name: 'Stabilite', max: 100 }
        ]
      },
      series: [{
        type: 'radar',
        data: (criticalData.series || []).map((serie, index) => ({
          name: serie.name,
          value: serie.value,
          lineStyle: {
            width: index === 0 ? 2.4 : 2,
            type: index % 2 === 0 ? 'solid' : 'dashed'
          },
          areaStyle: {
            color: highContrast[index % highContrast.length],
            opacity: 0.12 + (index * 0.02)
          }
        })),
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: { borderWidth: 1, borderColor: '#ffffff' }
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
