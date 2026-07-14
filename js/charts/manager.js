const chartsManager = {
  ready: false,

  init() {
    if (this.ready || typeof echarts === 'undefined') return;
    this.ready = true;
    window.addEventListener('resize', () => this.resize());
  },

  getWeeklyBreakdown(stats, week) {
    const weekData = stats?.weeks?.[week];
    if (!weekData) return [];
    return Object.entries(weekData.categories || {})
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([name, value], i) => ({
        name,
        value,
        itemStyle: { color: window.dashboardChartsConfig.getSeriesColors()[i % 5] }
      }));
  },

  getWeightMetrics(stats) {
    const total = Math.max(1, stats.totalTickets || 0);
    const unreadable = (stats.byCategory['Unreadable code'] || 0) + (stats.byCategory['Code rejected'] || 0);
    const delayed = (stats.byCategory['Delayed Gain'] || 0) + (stats.byCategory['Prize not received'] || 0);
    const info = (stats.byCategory['User does not know how to participate'] || 0) + (stats.byCategory['User cannot find the code'] || 0);
    const bugs = Math.max(0, total - unreadable - delayed - info);

    const palette = window.dashboardChartsConfig.getSeriesColors();

    return [
      { id: 'metric-unreadable', name: i18n.t('slide8.unreadable'), value: Math.round((unreadable / total) * 100), itemStyle: { color: palette[0] } },
      { id: 'metric-delayed', name: i18n.t('slide8.delayed'), value: Math.round((delayed / total) * 100), itemStyle: { color: palette[1] } },
      { id: 'metric-bugs', name: i18n.t('slide8.bugs'), value: Math.round((bugs / total) * 100), itemStyle: { color: palette[2] } },
      { id: 'metric-info', name: i18n.t('slide8.info'), value: Math.round((info / total) * 100), itemStyle: { color: palette[3] } }
    ];
  },

  clamp(value, min = 0, max = 100) {
    return Math.max(min, Math.min(max, value));
  },

  getCriticalSeries(stats, weekKeys) {
    const keys = (weekKeys || []).slice().sort((a, b) => Number(a) - Number(b));
    if (!keys.length) return [];

    const maxCount = Math.max(...keys.map(k => stats.weeks[k].count || 0), 1);
    let previousCount = stats.weeks[keys[0]].count || 0;

    return keys.map((weekKey, index) => {
      const week = stats.weeks[weekKey] || { count: 0, unreadableRate: 0 };
      const unreadableRate = week.unreadableRate || 0;
      const charge = Math.round((week.count / maxCount) * 100);
      const deltaLoad = Math.abs(week.count - previousCount);
      const stability = this.clamp(100 - Math.round((deltaLoad / maxCount) * 120));
      const delay = this.clamp(Math.round(unreadableRate * 0.65 + charge * 0.35));
      const satisfaction = this.clamp(Math.round(100 - unreadableRate * 0.72 - charge * 0.18));

      previousCount = week.count;

      return {
        name: `${i18n.t('slide5.week')} ${weekKey}`,
        value: [
          this.clamp(100 - unreadableRate),
          this.clamp(charge),
          delay,
          satisfaction,
          stability
        ],
        order: index
      };
    });
  },

  updateFromApp(app, selectedWeek) {
    if (!this.ready || !app?.stats) return;

    const weekKeys = Object.keys(app.stats.weeks || {}).sort((a, b) => Number(a) - Number(b));
    const selected = selectedWeek || weekKeys[0];
    const weekValues = weekKeys.map(k => app.stats.weeks[k].count || 0);

    const timelinePayload = {
      weekLabels: weekKeys.map(k => `${i18n.t('slide5.week')} ${k}`),
      weekValues,
      selectedWeekBreakdown: this.getWeeklyBreakdown(app.stats, selected)
    };

    if (window.dashboardChartModules.kpi) {
      window.dashboardChartModules.kpi.update({
        totalTickets: app.stats.totalTickets || 0,
        weeks: weekValues.length ? weekValues : [0, 0, 0, 0]
      });
    }

    if (window.dashboardChartModules.matrix) {
      window.dashboardChartModules.matrix.update(app.stats);
    }

    if (window.dashboardChartModules.timeline) {
      window.dashboardChartModules.timeline.update(timelinePayload);
    }

    const metrics = this.getWeightMetrics(app.stats);
    if (window.dashboardChartModules.weight) {
      window.dashboardChartModules.weight.update(metrics.map(m => ({ name: m.name, value: m.value, itemStyle: m.itemStyle })));
    }

    metrics.forEach(metric => {
      const valueElement = document.querySelector(`#${metric.id} .metric-value`);
      if (valueElement) {
        valueElement.textContent = `${metric.value}%`;
      }
    });

    if (window.dashboardChartModules.recommendations) {
      window.dashboardChartModules.recommendations.update();
    }

    if (window.dashboardChartModules.critical) {
      window.dashboardChartModules.critical.update({
        series: this.getCriticalSeries(app.stats, weekKeys)
      });
    }
  },

  onThemeOrLanguageChange(app) {
    this.resize();
    this.updateFromApp(app, app?.activeWeek || null);
  },

  resize() {
    Object.values(window.dashboardChartModules || {}).forEach(module => {
      if (module && typeof module.resize === 'function') {
        module.resize();
      }
    });
  }
};

window.chartsManager = chartsManager;
