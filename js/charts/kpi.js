window.dashboardChartModules = window.dashboardChartModules || {};

window.dashboardChartModules.kpi = (function () {
  const sparklines = new Map();

  function animateCounter(el, toValue, suffix = '') {
    const start = Number(el.getAttribute('data-count-current') || '0');
    const duration = 900;
    const startTime = performance.now();

    function frame(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(start + (toValue - start) * eased);
      el.textContent = `${value}${suffix}`;
      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        el.setAttribute('data-count-current', String(toValue));
      }
    }

    requestAnimationFrame(frame);
  }

  function ensureChart(map, id) {
    const el = document.getElementById(id);
    if (!el || typeof echarts === 'undefined') return null;
    if (!map.has(id)) {
      map.set(id, echarts.init(el));
    }
    return map.get(id);
  }

  function sparklineOption(values) {
    return {
      grid: { left: 2, right: 2, top: 4, bottom: 2 },
      xAxis: { type: 'category', show: false, data: values.map((_, i) => i + 1) },
      yAxis: { type: 'value', show: false },
      tooltip: Object.assign(window.dashboardChartsConfig.tooltip(), {
        trigger: 'axis'
      }),
      series: [
        {
          type: 'line',
          smooth: true,
          symbol: 'none',
          data: values,
          lineStyle: { width: 2, color: window.dashboardChartsConfig.gradient() },
          areaStyle: { color: window.dashboardChartsConfig.areaGradient() }
        }
      ]
    };
  }

  function update(data) {
    const weekValues = data.weeks;
    const cards = [
      {
        sparkId: 'kpi-spark-1',
        counterSel: '[data-kpi="crm-lines"]',
        badgeSel: '[data-kpi-badge="crm"]',
        count: data.totalTickets,
        suffix: '',
        spark: weekValues
      },
      {
        sparkId: 'kpi-spark-2',
        counterSel: '[data-kpi="segmentation"]',
        badgeSel: '[data-kpi-badge="segment"]',
        count: 100,
        suffix: '%',
        spark: weekValues.map(v => Math.min(100, Math.round((v / Math.max(1, Math.max(...weekValues))) * 100)))
      },
      {
        sparkId: 'kpi-spark-3',
        counterSel: '[data-kpi="hub"]',
        badgeSel: '[data-kpi-badge="hub"]',
        count: 1,
        suffix: '',
        spark: weekValues.map((v, i) => v + i * 2)
      }
    ];

    cards.forEach(card => {
      const spark = ensureChart(sparklines, card.sparkId);
      if (spark) {
        spark.setOption(sparklineOption(card.spark), true);
      }

      const counter = document.querySelector(card.counterSel);
      if (counter) {
        animateCounter(counter, card.count, card.suffix);
      }

      const badge = document.querySelector(card.badgeSel);
      if (badge) {
        const delta = card.spark[card.spark.length - 1] - card.spark[0];
        badge.textContent = `${delta >= 0 ? '▲' : '▼'} ${Math.abs(delta)}`;
      }
    });
  }

  function resize() {
    sparklines.forEach(chart => chart.resize());
  }

  function dispose() {
    sparklines.forEach(chart => chart.dispose());
    sparklines.clear();
  }

  return { update, resize, dispose };
})();
