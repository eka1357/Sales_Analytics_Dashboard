'use strict';
/* ============================================================
   DASHBOARD.JS — Sales Analytics Dashboard
   Main dashboard initialization, KPI rendering, chart binding
   ============================================================ */

(function () {

  /* ─────────────────────────────────────────
     INITIALIZATION
  ───────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    Charts.applyGlobalDefaults();
    _renderKPIs();
    _renderSparklines();
    _renderRevenueTrendChart();
    _renderCategoryDonut();
    _renderSalesVsTarget();
    _renderFunnel();
    _renderRecentOrders();
    _renderTopProducts();
    _renderLeaderboard();
    _bindFilters();
    _bindMisc();
    _staggerLoadCards();
  });

  /* ─────────────────────────────────────────
     KPI CARDS
  ───────────────────────────────────────── */
  function _renderKPIs() {
    const kpi = SalesData.kpiSummary;

    // Revenue
    const revEl = document.getElementById('kpi-revenue-value');
    if (revEl) Utils.animateCounter(revEl, kpi.totalRevenue, 1400, v => Utils.formatCurrency(v, true));

    // Orders
    const ordEl = document.getElementById('kpi-orders-value');
    if (ordEl) Utils.animateCounter(ordEl, kpi.totalOrders, 1200, v => Utils.formatCompact(Math.round(v)));

    // Customers
    const cusEl = document.getElementById('kpi-customers-value');
    if (cusEl) Utils.animateCounter(cusEl, kpi.totalCustomers, 1300, v => Utils.formatCompact(Math.round(v)));

    // Avg Order Value
    const aovEl = document.getElementById('kpi-aov-value');
    if (aovEl) Utils.animateCounter(aovEl, kpi.avgOrderValue, 1100, v => '$' + v.toFixed(2));
  }

  /* ─────────────────────────────────────────
     SPARKLINES
  ───────────────────────────────────────── */
  function _renderSparklines() {
    const revenueVals  = SalesData.getMonthlyValues('revenue');
    const ordersVals   = SalesData.getMonthlyValues('orders');
    const customerVals = SalesData.customerGrowth.new.map((n, i) => n + SalesData.customerGrowth.returning[i]);
    const aovVals      = SalesData.monthlyRevenue.map(m => m.revenue / m.orders);

    Charts.createSparkline('sparkline-revenue',   revenueVals,  '#6366f1');
    Charts.createSparkline('sparkline-orders',    ordersVals,   '#22d3ee');
    Charts.createSparkline('sparkline-customers', customerVals, '#10b981');
    Charts.createSparkline('sparkline-aov',       aovVals,      '#f59e0b');
  }

  /* ─────────────────────────────────────────
     REVENUE TREND CHART
  ───────────────────────────────────────── */
  function _renderRevenueTrendChart(mode = 'revenue-target') {
    const labels = Filters.getFilteredMonthLabels();

    if (mode === 'revenue-target') {
      const revenue = Filters.getFilteredValues('revenue');
      const target  = Filters.getFilteredValues('target');
      Charts.createRevenueTrend('chart-revenue-trend', labels, revenue, target);
    } else {
      const revenue = Filters.getFilteredValues('revenue');
      const profit  = Filters.getFilteredValues('profit');
      Charts.createProfitMargin('chart-revenue-trend', labels, revenue, profit);
    }
  }

  // Chart mode toggle
  let _revChartMode = 'revenue-target';

  /* ─────────────────────────────────────────
     CATEGORY DONUT
  ───────────────────────────────────────── */
  function _renderCategoryDonut() {
    const cats = Filters.getFilteredCategorySales();
    Charts.createCategoryDonut('chart-category-donut', cats);

    // Render legend
    const legendEl = document.getElementById('category-legend');
    if (!legendEl) return;
    const total = cats.reduce((s, c) => s + c.revenue, 0);
    legendEl.innerHTML = cats.map(c => `
      <div class="stat-row">
        <div class="stat-row__label">
          <span class="dot" style="background:${c.color}"></span>
          ${c.category}
        </div>
        <div style="display:flex;align-items:center;gap:8px;">
          <div class="stat-row__value">${Utils.formatCurrency(c.revenue, true)}</div>
          <div class="stat-row__change up">${Utils.calcPercent(c.revenue, total).toFixed(1)}%</div>
        </div>
      </div>
    `).join('');
  }

  /* ─────────────────────────────────────────
     SALES VS TARGET
  ───────────────────────────────────────── */
  function _renderSalesVsTarget() {
    const labels  = Filters.getFilteredMonthLabels();
    const sales   = Filters.getFilteredValues('revenue');
    const targets = Filters.getFilteredValues('target');
    Charts.createSalesVsTarget('chart-sales-vs-target', labels, sales, targets);
  }

  /* ─────────────────────────────────────────
     FUNNEL
  ───────────────────────────────────────── */
  function _renderFunnel() {
    Charts.createFunnel('chart-funnel', SalesData.salesFunnel);
  }

  /* ─────────────────────────────────────────
     RECENT ORDERS TABLE
  ───────────────────────────────────────── */
  function _renderRecentOrders() {
    const tbody = document.getElementById('orders-tbody');
    if (!tbody) return;

    const orders = SalesData.recentOrders;
    tbody.innerHTML = orders.map(o => {
      const badge = Utils.getStatusBadge(o.status);
      return `
        <tr>
          <td>
            <div data-col="id" data-value="${o.id}">
              <div style="font-family:var(--font-mono);font-size:var(--font-size-xs);color:var(--color-primary-light);">${o.id}</div>
              <div style="font-size:var(--font-size-xs);color:var(--color-text-muted);">${Utils.timeAgo(o.date)}</div>
            </div>
          </td>
          <td>
            <div class="table__avatar" data-col="customer" data-value="${o.customer}">
              <div class="table__avatar-initials" style="background:var(--color-primary-subtle);color:var(--color-primary-light);">
                ${o.customer.split(' ').map(n=>n[0]).join('').slice(0,2)}
              </div>
              <div>
                <div class="table__avatar-name">${o.customer}</div>
                <div class="table__avatar-sub">${o.product}</div>
              </div>
            </div>
          </td>
          <td>
            <span class="font-mono" data-col="amount" data-value="${o.amount}" style="color:var(--color-text);font-weight:600;">
              ${Utils.formatCurrency(o.amount)}
            </span>
          </td>
          <td>
            <span class="badge ${badge.class}" data-col="status" data-value="${o.status}">
              ${badge.icon} ${o.status}
            </span>
          </td>
        </tr>`;
    }).join('');

    // Make sortable
    const table = document.getElementById('recent-orders-table');
    if (table) Utils.makeTableSortable(table);
  }

  /* ─────────────────────────────────────────
     TOP PRODUCTS
  ───────────────────────────────────────── */
  function _renderTopProducts() {
    const container = document.getElementById('top-products-list');
    if (!container) return;

    const products = SalesData.getTopProducts(6);
    const maxRev = products[0].revenue;

    container.innerHTML = products.map((p, i) => {
      const pct = Utils.calcPercent(p.revenue, maxRev);
      const rankClass = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
      return `
        <div class="list-item">
          <div class="list-item__rank ${rankClass}">${i + 1}</div>
          <div class="list-item__info">
            <div class="list-item__name">${p.name}</div>
            <div style="margin-top:4px;">
              <div class="progress-bar">
                <div class="progress-bar__fill progress-bar__fill--primary" style="width:0%" data-target="${pct.toFixed(1)}"></div>
              </div>
            </div>
          </div>
          <div class="list-item__value">${Utils.formatCurrency(p.revenue, true)}</div>
        </div>`;
    }).join('');

    // Animate progress bars
    setTimeout(() => {
      container.querySelectorAll('.progress-bar__fill').forEach(bar => {
        bar.style.width = bar.dataset.target + '%';
      });
    }, 400);
  }

  /* ─────────────────────────────────────────
     SALES LEADERBOARD
  ───────────────────────────────────────── */
  function _renderLeaderboard() {
    const container = document.getElementById('leaderboard-list');
    if (!container) return;

    const sorted = [...SalesData.salesTeam].sort((a, b) => b.revenue - a.revenue);
    const maxRev = sorted[0].revenue;

    container.innerHTML = sorted.map((rep, i) => {
      const pct = Utils.calcPercent(rep.revenue, maxRev);
      const attainment = Utils.calcPercent(rep.revenue, rep.target);
      const rankClass = i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : '';
      const atColor = attainment >= 100 ? 'var(--color-success)' : attainment >= 80 ? 'var(--color-warning)' : 'var(--color-danger)';
      return `
        <div class="list-item">
          <div class="list-item__rank ${rankClass}">${i + 1}</div>
          <div class="list-item__avatar" style="width:32px;height:32px;border-radius:50%;background:${rep.color};opacity:0.8;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:white;flex-shrink:0;">
            ${rep.initials}
          </div>
          <div class="list-item__info">
            <div class="list-item__name">${rep.name}</div>
            <div style="margin-top:4px;">
              <div class="progress-bar">
                <div class="progress-bar__fill" style="width:0%;background:${rep.color};opacity:0.8" data-target="${pct.toFixed(1)}"></div>
              </div>
            </div>
          </div>
          <div style="text-align:right;">
            <div class="list-item__value">${Utils.formatCurrency(rep.revenue, true)}</div>
            <div style="font-size:var(--font-size-xs);color:${atColor};font-weight:600;">${attainment.toFixed(0)}%</div>
          </div>
        </div>`;
    }).join('');

    // Animate
    setTimeout(() => {
      container.querySelectorAll('.progress-bar__fill').forEach(bar => {
        bar.style.transition = 'width 1s cubic-bezier(0.165,0.84,0.44,1)';
        bar.style.width = bar.dataset.target + '%';
      });
    }, 600);
  }

  /* ─────────────────────────────────────────
     FILTER BINDING
  ───────────────────────────────────────── */
  function _bindFilters() {
    // Period tabs
    Filters.bindPeriodTabs(document.getElementById('period-tabs'));

    // Revenue chart mode toggle
    const revTabs = document.getElementById('revenue-chart-tabs');
    if (revTabs) {
      revTabs.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          revTabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          _revChartMode = btn.dataset.chartMode;
          _renderRevenueTrendChart(_revChartMode);
        });
      });
    }

    // On filter change, re-render charts
    Filters.onChange(() => {
      _renderRevenueTrendChart(_revChartMode);
      _renderCategoryDonut();
      _renderSalesVsTarget();
      _renderKPIs();
    });

    // Search (just a demo for now)
    Filters.bindSearch(document.getElementById('global-search'));
  }

  /* ─────────────────────────────────────────
     MISC BINDINGS
  ───────────────────────────────────────── */
  function _bindMisc() {
    // Export button (demo)
    const exportBtn = document.getElementById('btn-export');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => {
        const data = SalesData.monthlyRevenue;
        const csv = [
          'Month,Revenue,Orders,Customers,Profit,Target',
          ...data.map(m => `${m.month},${m.revenue},${m.orders},${m.customers},${m.profit},${m.target}`)
        ].join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement('a');
        a.href = url; a.download = 'sales_2024.csv'; a.click();
        URL.revokeObjectURL(url);
      });
    }

    // Ripple on nav items
    document.querySelectorAll('.nav-item').forEach(el => Utils.addRipple(el));
  }

  /* ─────────────────────────────────────────
     STAGGER CARD ENTRANCE
  ───────────────────────────────────────── */
  function _staggerLoadCards() {
    const cards = document.querySelectorAll('.animate-on-load');
    cards.forEach((card, i) => {
      card.style.animationDelay = (i * 80) + 'ms';
    });
  }

})();
