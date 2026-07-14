window.dashboardChartModules = window.dashboardChartModules || {};

window.dashboardChartsConfig = {
  ease: 'cubicOut',
  duration: 900,

  css(name) {
    return getComputedStyle(document.body).getPropertyValue(name).trim();
  },

  getPalette() {
    return {
      red: this.css('--accent-red') || '#F40009',
      redDark: this.css('--accent-red-dark') || '#c20006',
      text: this.css('--text-primary') || '#1a1a1a',
      textSoft: this.css('--text-secondary') || '#666666',
      border: this.css('--border-color') || '#e0e0e0',
      bgSoft: this.css('--bg-tertiary') || '#e9ecef'
    };
  },

  getSeriesColors(alpha = 1) {
    const p = this.getPalette();
    return [
      `rgba(244, 0, 9, ${alpha})`,
      `rgba(194, 0, 6, ${Math.max(alpha - 0.12, 0.3)})`,
      `rgba(244, 0, 9, ${Math.max(alpha - 0.35, 0.2)})`,
      `rgba(244, 0, 9, ${Math.max(alpha - 0.55, 0.15)})`,
      `rgba(244, 0, 9, ${Math.max(alpha - 0.7, 0.1)})`
    ];
  },

  gradient() {
    const p = this.getPalette();
    return new echarts.graphic.LinearGradient(0, 0, 1, 0, [
      { offset: 0, color: p.redDark },
      { offset: 1, color: p.red }
    ]);
  },

  areaGradient() {
    const p = this.getPalette();
    return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
      { offset: 0, color: 'rgba(244, 0, 9, 0.32)' },
      { offset: 1, color: 'rgba(244, 0, 9, 0.02)' }
    ]);
  },

  tooltip() {
    const p = this.getPalette();
    return {
      trigger: 'item',
      backgroundColor: 'rgba(11, 12, 16, 0.92)',
      borderColor: 'rgba(244, 0, 9, 0.35)',
      borderWidth: 1,
      textStyle: {
        color: '#ffffff',
        fontSize: 12,
        fontFamily: 'Inter, sans-serif'
      },
      extraCssText: 'box-shadow: 0 16px 40px rgba(0,0,0,0.35); border-radius: 10px;'
    };
  },

  axis() {
    const p = this.getPalette();
    return {
      axisLine: { lineStyle: { color: p.border } },
      axisLabel: { color: p.textSoft, fontSize: 11 },
      splitLine: { lineStyle: { color: 'rgba(127,127,127,0.18)' } }
    };
  }
};
