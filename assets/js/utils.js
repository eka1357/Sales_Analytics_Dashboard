'use strict';
/* ============================================================
   UTILS.JS — Sales Analytics Dashboard
   Utility helpers: formatters, color generators, DOM helpers
   Exposed via window.Utils namespace
   ============================================================ */

window.Utils = (function () {

  /* ─────────────────────────────────────────
     NUMBER FORMATTERS
  ───────────────────────────────────────── */

  /**
   * Format a number as USD currency
   * @param {number} value
   * @param {boolean} compact - use K/M/B shorthand
   */
  function formatCurrency(value, compact = false) {
    if (compact) {
      if (value >= 1_000_000) return '$' + (value / 1_000_000).toFixed(1) + 'M';
      if (value >= 1_000)     return '$' + (value / 1_000).toFixed(1) + 'K';
      return '$' + value.toFixed(0);
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  }

  /**
   * Format a number with thousands separator
   */
  function formatNumber(value, decimals = 0) {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  }

  /**
   * Format a percentage
   */
  function formatPercent(value, decimals = 1) {
    return (value >= 0 ? '+' : '') + value.toFixed(decimals) + '%';
  }

  /**
   * Format a compact number (K / M / B)
   */
  function formatCompact(value) {
    if (value >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1) + 'B';
    if (value >= 1_000_000)     return (value / 1_000_000).toFixed(1) + 'M';
    if (value >= 1_000)         return (value / 1_000).toFixed(1) + 'K';
    return String(value);
  }

  /* ─────────────────────────────────────────
     DATE HELPERS
  ───────────────────────────────────────── */

  /**
   * Format a date string to readable format
   */
  function formatDate(dateStr, format = 'short') {
    const date = new Date(dateStr);
    if (format === 'short') {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
    if (format === 'medium') {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    if (format === 'long') {
      return date.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' });
    }
    return dateStr;
  }

  /**
   * Get relative time (e.g., "2 days ago")
   */
  function timeAgo(dateStr) {
    const now = new Date('2024-12-22');
    const date = new Date(dateStr);
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7)  return diffDays + ' days ago';
    if (diffDays < 30) return Math.floor(diffDays / 7) + ' weeks ago';
    return Math.floor(diffDays / 30) + ' months ago';
  }

  /* ─────────────────────────────────────────
     COLOR HELPERS
  ───────────────────────────────────────── */

  /**
   * Add alpha to a hex color
   */
  function hexToRgba(hex, alpha = 1) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  /**
   * Gradient stops from a hex color (for Chart.js gradients)
   */
  function makeGradient(ctx, color, fromAlpha = 0.4, toAlpha = 0) {
    const gradient = ctx.createLinearGradient(0, 0, 0, ctx.canvas.height);
    gradient.addColorStop(0, hexToRgba(color, fromAlpha));
    gradient.addColorStop(1, hexToRgba(color, toAlpha));
    return gradient;
  }

  // Standard chart color palette
  const CHART_COLORS = [
    '#6366f1', '#22d3ee', '#a855f7', '#10b981',
    '#f59e0b', '#ef4444', '#f97316', '#06b6d4',
    '#84cc16', '#ec4899',
  ];

  const CHART_COLORS_ALPHA = CHART_COLORS.map(c => hexToRgba(c, 0.15));

  /* ─────────────────────────────────────────
     DOM HELPERS
  ───────────────────────────────────────── */

  /**
   * Query selector shorthand
   */
  function $(selector, parent = document) {
    return parent.querySelector(selector);
  }

  function $$(selector, parent = document) {
    return [...parent.querySelectorAll(selector)];
  }

  /**
   * Create element with attributes and inner content
   */
  function createElement(tag, attrs = {}, html = '') {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([key, val]) => {
      if (key === 'class') el.className = val;
      else el.setAttribute(key, val);
    });
    if (html) el.innerHTML = html;
    return el;
  }

  /**
   * Animate a number from 0 to target value (counter animation)
   */
  function animateCounter(element, targetValue, duration = 1200, formatter = null) {
    const start = performance.now();
    const startValue = 0;

    function update(timestamp) {
      const elapsed = timestamp - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quart
      const eased = 1 - Math.pow(1 - progress, 4);
      const currentValue = startValue + (targetValue - startValue) * eased;

      element.textContent = formatter
        ? formatter(currentValue)
        : Math.round(currentValue).toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  /**
   * Animate progress bar width
   */
  function animateProgressBar(barEl, targetWidth, delay = 0) {
    barEl.style.width = '0%';
    setTimeout(() => {
      barEl.style.transition = 'width 1s cubic-bezier(0.165, 0.84, 0.44, 1)';
      barEl.style.width = targetWidth + '%';
    }, delay);
  }

  /**
   * Add ripple effect to element on click
   */
  function addRipple(element) {
    element.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect = element.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple-effect';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top  = (e.clientY - rect.top  - size / 2) + 'px';
      element.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  }

  /**
   * Throttle a function call
   */
  function throttle(fn, delay = 100) {
    let lastCall = 0;
    return function (...args) {
      const now = Date.now();
      if (now - lastCall >= delay) {
        lastCall = now;
        return fn.apply(this, args);
      }
    };
  }

  /**
   * Debounce a function call
   */
  function debounce(fn, delay = 300) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  /* ─────────────────────────────────────────
     TABLE SORTING
  ───────────────────────────────────────── */

  /**
   * Make a table sortable by clicking headers
   */
  function makeTableSortable(tableEl) {
    const headers = tableEl.querySelectorAll('th[data-sort]');
    let currentCol = null;
    let currentDir = 'asc';

    headers.forEach(th => {
      th.style.cursor = 'pointer';
      th.addEventListener('click', () => {
        const col = th.dataset.sort;
        const type = th.dataset.type || 'string';

        if (currentCol === col) {
          currentDir = currentDir === 'asc' ? 'desc' : 'asc';
        } else {
          currentCol = col;
          currentDir = 'asc';
        }

        // Update header classes
        headers.forEach(h => h.classList.remove('sort-asc', 'sort-desc'));
        th.classList.add(currentDir === 'asc' ? 'sort-asc' : 'sort-desc');

        // Sort rows
        const tbody = tableEl.querySelector('tbody');
        const rows = [...tbody.querySelectorAll('tr')];
        rows.sort((a, b) => {
          const aCell = a.querySelector(`[data-col="${col}"]`);
          const bCell = b.querySelector(`[data-col="${col}"]`);
          if (!aCell || !bCell) return 0;

          let aVal = aCell.dataset.value || aCell.textContent.trim();
          let bVal = bCell.dataset.value || bCell.textContent.trim();

          if (type === 'number') {
            aVal = parseFloat(aVal.replace(/[^0-9.-]/g, '')) || 0;
            bVal = parseFloat(bVal.replace(/[^0-9.-]/g, '')) || 0;
            return currentDir === 'asc' ? aVal - bVal : bVal - aVal;
          }

          return currentDir === 'asc'
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        });

        rows.forEach(row => tbody.appendChild(row));
      });
    });
  }

  /* ─────────────────────────────────────────
     STAGGERED ANIMATION
  ───────────────────────────────────────── */

  /**
   * Apply staggered fade-in-up to a list of elements
   */
  function staggerAnimate(elements, baseDelay = 0, step = 80) {
    elements.forEach((el, i) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = `opacity 0.4s ease, transform 0.4s ease`;
      setTimeout(() => {
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, baseDelay + i * step);
    });
  }

  /**
   * Observe elements and animate them when in viewport
   */
  function observeAndAnimate(selector, animClass = 'animate-fade-in-up') {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(animClass);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll(selector).forEach(el => {
      el.style.opacity = '0';
      observer.observe(el);
    });
  }

  /* ─────────────────────────────────────────
     STATUS HELPERS
  ───────────────────────────────────────── */

  function getStatusBadge(status) {
    const map = {
      'Completed':  { class: 'badge--success', icon: '✓' },
      'Processing': { class: 'badge--primary', icon: '⟳' },
      'Shipped':    { class: 'badge--accent',  icon: '→' },
      'Cancelled':  { class: 'badge--danger',  icon: '✕' },
      'Pending':    { class: 'badge--warning', icon: '⏳' },
    };
    return map[status] || { class: 'badge--muted', icon: '?' };
  }

  function getSegmentBadge(segment) {
    const map = {
      'VIP':     'badge--warning',
      'Premium': 'badge--primary',
      'Regular': 'badge--accent',
      'New':     'badge--success',
    };
    return map[segment] || 'badge--muted';
  }

  /* ─────────────────────────────────────────
     MATH HELPERS
  ───────────────────────────────────────── */

  function calcGrowth(current, previous) {
    if (!previous) return 0;
    return ((current - previous) / previous) * 100;
  }

  function calcPercent(part, total) {
    if (!total) return 0;
    return (part / total) * 100;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  /* ─────────────────────────────────────────
     PUBLIC API
  ───────────────────────────────────────── */
  return {
    // Formatters
    formatCurrency,
    formatNumber,
    formatPercent,
    formatCompact,
    // Date
    formatDate,
    timeAgo,
    // Colors
    hexToRgba,
    makeGradient,
    CHART_COLORS,
    CHART_COLORS_ALPHA,
    // DOM
    $,
    $$,
    createElement,
    animateCounter,
    animateProgressBar,
    addRipple,
    throttle,
    debounce,
    makeTableSortable,
    staggerAnimate,
    observeAndAnimate,
    // Status
    getStatusBadge,
    getSegmentBadge,
    // Math
    calcGrowth,
    calcPercent,
    clamp,
  };
})();
