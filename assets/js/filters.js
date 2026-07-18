'use strict';
/* ============================================================
   FILTERS.JS — Sales Analytics Dashboard
   Date range, region, category, and search filter logic
   Exposed via window.Filters namespace
   ============================================================ */

window.Filters = (function () {

  /* ─────────────────────────────────────────
     STATE
  ───────────────────────────────────────── */
  const state = {
    period:   'year',    // 'week' | 'month' | 'quarter' | 'year'
    region:   'all',
    category: 'all',
    search:   '',
  };

  // Registered change listeners
  const _listeners = [];

  /* ─────────────────────────────────────────
     PERIOD DEFINITIONS
  ───────────────────────────────────────── */
  const PERIODS = {
    week:    { label: 'Last 7 Days',    months: 1,  label_short: 'W' },
    month:   { label: 'Last 30 Days',   months: 1,  label_short: 'M' },
    quarter: { label: 'Last Quarter',   months: 3,  label_short: 'Q' },
    year:    { label: 'Full Year 2024', months: 12, label_short: 'Y' },
  };

  /* ─────────────────────────────────────────
     DATA SLICING BY PERIOD
  ───────────────────────────────────────── */

  /**
   * Get monthly revenue data sliced by period
   */
  function getFilteredMonthlyRevenue() {
    const data = window.SalesData.monthlyRevenue;
    const { months } = PERIODS[state.period];
    return data.slice(-months);
  }

  /**
   * Get labels (month names) for current period
   */
  function getFilteredMonthLabels() {
    const data = getFilteredMonthlyRevenue();
    return data.map(m => m.month);
  }

  /**
   * Get filtered revenue values for a given key
   */
  function getFilteredValues(key) {
    return getFilteredMonthlyRevenue().map(m => m[key] || 0);
  }

  /**
   * Get filtered category sales (optionally by category)
   */
  function getFilteredCategorySales() {
    const data = window.SalesData.categorySales;
    if (state.category === 'all') return data;
    return data.filter(c =>
      c.category.toLowerCase().replace(/\s+/g, '_') === state.category
    );
  }

  /**
   * Get filtered regional sales (optionally by region)
   */
  function getFilteredRegionalSales() {
    const data = window.SalesData.regionalSales;
    if (state.region === 'all') return data;
    return data.filter(r => r.region.toLowerCase() === state.region.toLowerCase());
  }

  /**
   * Get filtered products (by category / search)
   */
  function getFilteredProducts() {
    let data = window.SalesData.products;

    if (state.category !== 'all') {
      data = data.filter(p =>
        p.category.toLowerCase().replace(/[\s&]+/g, '_').includes(state.category)
      );
    }

    if (state.search) {
      const q = state.search.toLowerCase();
      data = data.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }

    return data;
  }

  /**
   * Get filtered customers (by segment / region / search)
   */
  function getFilteredCustomers() {
    let data = window.SalesData.customers;

    if (state.region !== 'all') {
      data = data.filter(c => c.region.toLowerCase() === state.region.toLowerCase());
    }

    if (state.search) {
      const q = state.search.toLowerCase();
      data = data.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.segment.toLowerCase().includes(q)
      );
    }

    return data;
  }

  /**
   * Compute aggregated KPIs for the current period filter
   */
  function getFilteredKPIs() {
    const rows = getFilteredMonthlyRevenue();
    const revenue = rows.reduce((s, m) => s + m.revenue, 0);
    const orders  = rows.reduce((s, m) => s + m.orders,  0);
    const profit  = rows.reduce((s, m) => s + m.profit,  0);

    // Previous period (same slice, shifted back)
    const allData = window.SalesData.monthlyRevenue;
    const months  = PERIODS[state.period].months;
    const prevEnd = allData.length - months;
    const prevRows = allData.slice(Math.max(0, prevEnd - months), prevEnd);
    const prevRevenue = prevRows.reduce((s, m) => s + m.revenue, 0);
    const prevOrders  = prevRows.reduce((s, m) => s + m.orders,  0);

    return {
      revenue,
      orders,
      profit,
      avgOrder: orders > 0 ? revenue / orders : 0,
      revenueGrowth: Utils.calcGrowth(revenue, prevRevenue),
      ordersGrowth:  Utils.calcGrowth(orders,  prevOrders),
    };
  }

  /* ─────────────────────────────────────────
     STATE SETTERS
  ───────────────────────────────────────── */

  function setPeriod(period) {
    if (!PERIODS[period]) return;
    state.period = period;
    _notify('period');
  }

  function setRegion(region) {
    state.region = region;
    _notify('region');
  }

  function setCategory(category) {
    state.category = category;
    _notify('category');
  }

  function setSearch(query) {
    state.search = query.trim();
    _notify('search');
  }

  function reset() {
    state.period   = 'year';
    state.region   = 'all';
    state.category = 'all';
    state.search   = '';
    _notify('reset');
  }

  function getState() {
    return { ...state };
  }

  /* ─────────────────────────────────────────
     CHANGE LISTENER
  ───────────────────────────────────────── */

  function onChange(fn) {
    _listeners.push(fn);
  }

  function _notify(type) {
    _listeners.forEach(fn => fn({ type, state: { ...state } }));
  }

  /* ─────────────────────────────────────────
     UI BINDING HELPERS
  ───────────────────────────────────────── */

  /**
   * Bind period tab buttons (elements with data-period attribute)
   */
  function bindPeriodTabs(containerEl) {
    if (!containerEl) return;
    const tabs = containerEl.querySelectorAll('[data-period]');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        setPeriod(tab.dataset.period);
      });
    });
  }

  /**
   * Bind a <select> element to a filter
   */
  function bindSelect(selectEl, filterType) {
    if (!selectEl) return;
    selectEl.addEventListener('change', () => {
      if (filterType === 'region')   setRegion(selectEl.value);
      if (filterType === 'category') setCategory(selectEl.value);
    });
  }

  /**
   * Bind a search input to the search filter (debounced)
   */
  function bindSearch(inputEl) {
    if (!inputEl) return;
    const handler = Utils.debounce(() => setSearch(inputEl.value), 300);
    inputEl.addEventListener('input', handler);
  }

  /* ─────────────────────────────────────────
     PUBLIC API
  ───────────────────────────────────────── */
  return {
    PERIODS,
    state,
    getState,
    getFilteredMonthlyRevenue,
    getFilteredMonthLabels,
    getFilteredValues,
    getFilteredCategorySales,
    getFilteredRegionalSales,
    getFilteredProducts,
    getFilteredCustomers,
    getFilteredKPIs,
    setPeriod,
    setRegion,
    setCategory,
    setSearch,
    reset,
    onChange,
    bindPeriodTabs,
    bindSelect,
    bindSearch,
  };
})();
