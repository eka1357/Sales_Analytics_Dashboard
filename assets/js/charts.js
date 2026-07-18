'use strict';
/* ============================================================
   CHARTS.JS — Sales Analytics Dashboard
   Chart.js 4.x wrapper — all chart builders
   Exposed via window.Charts namespace
   ============================================================ */

window.Charts = (function () {

  /* ─────────────────────────────────────────
     GLOBAL CHART.JS DEFAULTS
  ───────────────────────────────────────── */
  function _applyGlobalDefaults() {
    if (typeof Chart === 'undefined') return;

    Chart.defaults.color            = '#64748b';
    Chart.defaults.font.family      = "'Inter', sans-serif";
    Chart.defaults.font.size        = 12;
    Chart.defaults.animation.duration = 600;
    Chart.defaults.animation.easing   = 'easeInOutQuart';

    Chart.defaults.plugins.legend.display   = false;
    Chart.defaults.plugins.tooltip.enabled  = true;
    Chart.defaults.plugins.tooltip.mode     = 'index';
    Chart.defaults.plugins.tooltip.intersect = false;

    // Custom global tooltip style
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(17, 24, 39, 0.95)';
    Chart.defaults.plugins.tooltip.borderColor      = 'rgba(255,255,255,0.1)';
    Chart.defaults.plugins.tooltip.borderWidth      = 1;
    Chart.defaults.plugins.tooltip.padding          = 12;
    Chart.defaults.plugins.tooltip.cornerRadius     = 10;
    Chart.defaults.plugins.tooltip.titleColor       = '#f1f5f9';
    Chart.defaults.plugins.tooltip.bodyColor        = '#94a3b8';
    Chart.defaults.plugins.tooltip.titleFont        = { weight: '600', size: 13 };
    Chart.defaults.plugins.tooltip.boxPadding       = 4;
  }

  /* ─────────────────────────────────────────
     HELPER: Destroy existing chart on canvas
  ───────────────────────────────────────── */
  function _destroyExisting(canvasId) {
    const existing = Chart.getChart(canvasId);
    if (existing) existing.destroy();
  }

  /* ─────────────────────────────────────────
     HELPER: Get canvas context
  ───────────────────────────────────────── */
  function _getCtx(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    return canvas.getContext('2d');
  }

  /* ─────────────────────────────────────────
     1. REVENUE TREND — Line Chart (hero)
  ───────────────────────────────────────── */
  function createRevenueTrend(canvasId, labels, revenueData, targetData) {
    _destroyExisting(canvasId);
    const ctx = _getCtx(canvasId);
    if (!ctx) return null;

    // Gradient fill
    const grad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    grad.addColorStop(0, 'rgba(99,102,241,0.35)');
    grad.addColorStop(1, 'rgba(99,102,241,0)');

    const targetGrad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    targetGrad.addColorStop(0, 'rgba(34,211,238,0.15)');
    targetGrad.addColorStop(1, 'rgba(34,211,238,0)');

    return new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Revenue',
            data: revenueData,
            borderColor: '#6366f1',
            backgroundColor: grad,
            borderWidth: 2.5,
            fill: true,
            tension: 0.45,
            pointRadius: 4,
            pointHoverRadius: 7,
            pointBackgroundColor: '#6366f1',
            pointBorderColor: '#0a0e1a',
            pointBorderWidth: 2,
          },
          {
            label: 'Target',
            data: targetData,
            borderColor: '#22d3ee',
            backgroundColor: targetGrad,
            borderWidth: 1.5,
            borderDash: [6, 4],
            fill: true,
            tension: 0.45,
            pointRadius: 3,
            pointHoverRadius: 6,
            pointBackgroundColor: '#22d3ee',
            pointBorderColor: '#0a0e1a',
            pointBorderWidth: 2,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
            ticks: { color: '#64748b', font: { size: 11 } },
            border: { display: false },
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false },
            ticks: {
              color: '#64748b',
              font: { size: 11 },
              callback: v => '$' + (v >= 1000 ? (v/1000).toFixed(0) + 'K' : v),
            },
            border: { display: false },
          }
        },
        plugins: {
          legend: { display: true, position: 'top', align: 'end',
            labels: { color: '#94a3b8', usePointStyle: true, pointStyleWidth: 8, boxHeight: 8, padding: 20 }
          },
          tooltip: {
            callbacks: {
              label: ctx => ' ' + ctx.dataset.label + ': $' + ctx.parsed.y.toLocaleString(),
            }
          }
        }
      }
    });
  }

  /* ─────────────────────────────────────────
     2. CATEGORY DONUT CHART
  ───────────────────────────────────────── */
  function createCategoryDonut(canvasId, categories) {
    _destroyExisting(canvasId);
    const ctx = _getCtx(canvasId);
    if (!ctx) return null;

    return new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: categories.map(c => c.category),
        datasets: [{
          data:            categories.map(c => c.revenue),
          backgroundColor: categories.map(c => Utils.hexToRgba(c.color, 0.85)),
          borderColor:     categories.map(c => c.color),
          borderWidth: 2,
          hoverOffset: 8,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => ' ' + ctx.label + ': $' + ctx.parsed.toLocaleString(),
            }
          }
        }
      }
    });
  }

  /* ─────────────────────────────────────────
     3. SALES vs TARGET — Bar Chart
  ───────────────────────────────────────── */
  function createSalesVsTarget(canvasId, labels, salesData, targetData) {
    _destroyExisting(canvasId);
    const ctx = _getCtx(canvasId);
    if (!ctx) return null;

    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Revenue',
            data: salesData,
            backgroundColor: 'rgba(99,102,241,0.75)',
            hoverBackgroundColor: '#6366f1',
            borderRadius: 6,
            borderSkipped: false,
          },
          {
            label: 'Target',
            data: targetData,
            backgroundColor: 'rgba(34,211,238,0.2)',
            hoverBackgroundColor: 'rgba(34,211,238,0.35)',
            borderRadius: 6,
            borderSkipped: false,
            borderColor: '#22d3ee',
            borderWidth: 1,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: '#64748b', font: { size: 11 } },
            border: { display: false },
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false },
            ticks: {
              color: '#64748b', font: { size: 11 },
              callback: v => '$' + (v >= 1000 ? (v/1000).toFixed(0) + 'K' : v),
            },
            border: { display: false },
          }
        },
        plugins: {
          legend: { display: true, position: 'top', align: 'end',
            labels: { color: '#94a3b8', usePointStyle: true, pointStyleWidth: 8, boxHeight: 8, padding: 20 }
          },
          tooltip: {
            callbacks: {
              label: ctx => ' ' + ctx.dataset.label + ': $' + ctx.parsed.y.toLocaleString(),
            }
          }
        }
      }
    });
  }

  /* ─────────────────────────────────────────
     4. REGIONAL BAR CHART (horizontal)
  ───────────────────────────────────────── */
  function createRegionalBar(canvasId, regions) {
    _destroyExisting(canvasId);
    const ctx = _getCtx(canvasId);
    if (!ctx) return null;

    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels: regions.map(r => r.region),
        datasets: [{
          label: 'Revenue',
          data: regions.map(r => r.revenue),
          backgroundColor: regions.map(r => Utils.hexToRgba(r.color, 0.7)),
          hoverBackgroundColor: regions.map(r => r.color),
          borderRadius: 8,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
            ticks: {
              color: '#64748b', font: { size: 11 },
              callback: v => '$' + (v/1000).toFixed(0) + 'K',
            },
            border: { display: false },
          },
          y: {
            grid: { display: false },
            ticks: { color: '#94a3b8', font: { size: 12, weight: '500' } },
            border: { display: false },
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => ' Revenue: $' + ctx.parsed.x.toLocaleString(),
            }
          }
        }
      }
    });
  }

  /* ─────────────────────────────────────────
     5. CUSTOMER GROWTH — Area Chart
  ───────────────────────────────────────── */
  function createCustomerGrowth(canvasId, labels, newData, returningData) {
    _destroyExisting(canvasId);
    const ctx = _getCtx(canvasId);
    if (!ctx) return null;

    const newGrad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    newGrad.addColorStop(0, 'rgba(16,185,129,0.4)');
    newGrad.addColorStop(1, 'rgba(16,185,129,0)');

    const retGrad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    retGrad.addColorStop(0, 'rgba(99,102,241,0.3)');
    retGrad.addColorStop(1, 'rgba(99,102,241,0)');

    return new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'New Customers',
            data: newData,
            borderColor: '#10b981',
            backgroundColor: newGrad,
            borderWidth: 2,
            fill: true,
            tension: 0.45,
            pointRadius: 3,
            pointHoverRadius: 6,
            pointBackgroundColor: '#10b981',
            pointBorderColor: '#0a0e1a',
            pointBorderWidth: 2,
          },
          {
            label: 'Returning',
            data: returningData,
            borderColor: '#6366f1',
            backgroundColor: retGrad,
            borderWidth: 2,
            fill: true,
            tension: 0.45,
            pointRadius: 3,
            pointHoverRadius: 6,
            pointBackgroundColor: '#6366f1',
            pointBorderColor: '#0a0e1a',
            pointBorderWidth: 2,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
            ticks: { color: '#64748b', font: { size: 11 } },
            border: { display: false },
          },
          y: {
            grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false },
            ticks: { color: '#64748b', font: { size: 11 } },
            border: { display: false },
          }
        },
        plugins: {
          legend: { display: true, position: 'top', align: 'end',
            labels: { color: '#94a3b8', usePointStyle: true, pointStyleWidth: 8, boxHeight: 8, padding: 16 }
          }
        }
      }
    });
  }

  /* ─────────────────────────────────────────
     6. PRODUCT PERFORMANCE — Radar Chart
  ───────────────────────────────────────── */
  function createProductRadar(canvasId, labels, datasets) {
    _destroyExisting(canvasId);
    const ctx = _getCtx(canvasId);
    if (!ctx) return null;

    return new Chart(ctx, {
      type: 'radar',
      data: {
        labels,
        datasets: datasets.map((ds, i) => ({
          ...ds,
          borderColor: Utils.CHART_COLORS[i],
          backgroundColor: Utils.hexToRgba(Utils.CHART_COLORS[i], 0.12),
          pointBackgroundColor: Utils.CHART_COLORS[i],
          pointBorderColor: '#0a0e1a',
          pointBorderWidth: 2,
          borderWidth: 2,
          pointRadius: 4,
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            grid:      { color: 'rgba(255,255,255,0.07)' },
            angleLines:{ color: 'rgba(255,255,255,0.07)' },
            pointLabels: { color: '#94a3b8', font: { size: 11 } },
            ticks: { display: false, backdropColor: 'transparent' },
          }
        },
        plugins: {
          legend: { display: true, position: 'top', align: 'end',
            labels: { color: '#94a3b8', usePointStyle: true, pointStyleWidth: 8, boxHeight: 8, padding: 16 }
          }
        }
      }
    });
  }

  /* ─────────────────────────────────────────
     7. SPARKLINE — Mini line (KPI cards)
  ───────────────────────────────────────── */
  function createSparkline(canvasId, data, color = '#6366f1') {
    _destroyExisting(canvasId);
    const ctx = _getCtx(canvasId);
    if (!ctx) return null;

    const grad = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    grad.addColorStop(0, Utils.hexToRgba(color, 0.3));
    grad.addColorStop(1, Utils.hexToRgba(color, 0));

    return new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.map((_, i) => i),
        datasets: [{
          data,
          borderColor: color,
          backgroundColor: grad,
          borderWidth: 2,
          fill: true,
          tension: 0.5,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointHoverBackgroundColor: color,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 800 },
        scales: {
          x: { display: false },
          y: { display: false },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: () => '',
              label: ctx => '$' + ctx.parsed.y.toLocaleString(),
            }
          }
        }
      }
    });
  }

  /* ─────────────────────────────────────────
     8. SALES FUNNEL — Horizontal bar
  ───────────────────────────────────────── */
  function createFunnel(canvasId, funnelData) {
    _destroyExisting(canvasId);
    const ctx = _getCtx(canvasId);
    if (!ctx) return null;

    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels: funnelData.map(d => d.stage),
        datasets: [{
          data: funnelData.map(d => d.count),
          backgroundColor: funnelData.map(d => Utils.hexToRgba(d.color, 0.75)),
          hoverBackgroundColor: funnelData.map(d => d.color),
          borderRadius: 6,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        scales: {
          x: {
            grid: { color: 'rgba(255,255,255,0.04)', drawBorder: false },
            ticks: { color: '#64748b', font: { size: 11 },
              callback: v => v >= 1000 ? (v/1000).toFixed(0) + 'K' : v,
            },
            border: { display: false },
          },
          y: {
            grid: { display: false },
            ticks: { color: '#94a3b8', font: { size: 12 } },
            border: { display: false },
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => ' Count: ' + ctx.parsed.x.toLocaleString(),
            }
          }
        }
      }
    });
  }

  /* ─────────────────────────────────────────
     9. ORDERS TREND — Small bar for recent orders
  ───────────────────────────────────────── */
  function createOrdersTrend(canvasId, labels, data) {
    _destroyExisting(canvasId);
    const ctx = _getCtx(canvasId);
    if (!ctx) return null;

    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: 'rgba(34,211,238,0.6)',
          hoverBackgroundColor: '#22d3ee',
          borderRadius: 4,
          borderSkipped: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { display: false },
          y: { display: false },
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => ' Orders: ' + ctx.parsed.y.toLocaleString(),
            }
          }
        }
      }
    });
  }

  /* ─────────────────────────────────────────
     10. PROFIT MARGIN — Stacked bar
  ───────────────────────────────────────── */
  function createProfitMargin(canvasId, labels, revenueData, profitData) {
    _destroyExisting(canvasId);
    const ctx = _getCtx(canvasId);
    if (!ctx) return null;

    return new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Profit',
            data: profitData,
            backgroundColor: 'rgba(16,185,129,0.75)',
            hoverBackgroundColor: '#10b981',
            borderRadius: { topLeft: 6, topRight: 6 },
            borderSkipped: 'bottom',
            stack: 'revenue',
          },
          {
            label: 'Cost',
            data: revenueData.map((r, i) => r - profitData[i]),
            backgroundColor: 'rgba(99,102,241,0.25)',
            hoverBackgroundColor: 'rgba(99,102,241,0.4)',
            borderRadius: { bottomLeft: 6, bottomRight: 6 },
            borderSkipped: 'top',
            stack: 'revenue',
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        scales: {
          x: {
            stacked: true,
            grid: { display: false },
            ticks: { color: '#64748b', font: { size: 11 } },
            border: { display: false },
          },
          y: {
            stacked: true,
            grid: { color: 'rgba(255,255,255,0.05)', drawBorder: false },
            ticks: {
              color: '#64748b', font: { size: 11 },
              callback: v => '$' + (v/1000).toFixed(0) + 'K',
            },
            border: { display: false },
          }
        },
        plugins: {
          legend: { display: true, position: 'top', align: 'end',
            labels: { color: '#94a3b8', usePointStyle: true, pointStyleWidth: 8, boxHeight: 8, padding: 16 }
          },
          tooltip: {
            callbacks: {
              label: ctx => ' ' + ctx.dataset.label + ': $' + ctx.parsed.y.toLocaleString(),
            }
          }
        }
      }
    });
  }

  /* ─────────────────────────────────────────
     11. CUSTOMER SEGMENTS — Pie chart
  ───────────────────────────────────────── */
  function createSegmentPie(canvasId, segments) {
    _destroyExisting(canvasId);
    const ctx = _getCtx(canvasId);
    if (!ctx) return null;

    const colors = { VIP: '#f59e0b', Premium: '#6366f1', Regular: '#22d3ee', New: '#10b981' };

    return new Chart(ctx, {
      type: 'pie',
      data: {
        labels: segments.map(s => s.label),
        datasets: [{
          data: segments.map(s => s.value),
          backgroundColor: segments.map(s => Utils.hexToRgba(colors[s.label] || '#6366f1', 0.8)),
          borderColor: segments.map(s => colors[s.label] || '#6366f1'),
          borderWidth: 2,
          hoverOffset: 6,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: ctx => ' ' + ctx.label + ': ' + ctx.parsed + ' customers',
            }
          }
        }
      }
    });
  }

  /* ─────────────────────────────────────────
     PUBLIC API
  ───────────────────────────────────────── */

  // Apply defaults on load
  if (typeof Chart !== 'undefined') {
    _applyGlobalDefaults();
  } else {
    // Retry after Chart.js loads
    window.addEventListener('load', _applyGlobalDefaults);
  }

  return {
    createRevenueTrend,
    createCategoryDonut,
    createSalesVsTarget,
    createRegionalBar,
    createCustomerGrowth,
    createProductRadar,
    createSparkline,
    createFunnel,
    createOrdersTrend,
    createProfitMargin,
    createSegmentPie,
    applyGlobalDefaults: _applyGlobalDefaults,
  };
})();
