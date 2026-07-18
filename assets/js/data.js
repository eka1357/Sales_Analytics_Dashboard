'use strict';
/* ============================================================
   DATA.JS — Sales Analytics Dashboard
   All mock sales data: monthly, products, customers, regions
   Exposed via window.SalesData namespace
   ============================================================ */

window.SalesData = (function () {

  /* ─────────────────────────────────────────
     MONTHS & PERIODS
  ───────────────────────────────────────── */
  const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const MONTHS_FULL = ['January','February','March','April','May','June',
                       'July','August','September','October','November','December'];

  /* ─────────────────────────────────────────
     CATEGORIES
  ───────────────────────────────────────── */
  const CATEGORIES = [
    { id: 'electronics',   name: 'Electronics',      color: '#6366f1', icon: '💻' },
    { id: 'apparel',       name: 'Apparel',           color: '#22d3ee', icon: '👕' },
    { id: 'furniture',     name: 'Furniture',         color: '#a855f7', icon: '🛋️' },
    { id: 'food_beverage', name: 'Food & Beverage',   color: '#10b981', icon: '🍔' },
    { id: 'sports',        name: 'Sports',            color: '#f59e0b', icon: '⚽' },
    { id: 'beauty',        name: 'Beauty',            color: '#ef4444', icon: '💄' },
  ];

  /* ─────────────────────────────────────────
     REGIONS
  ───────────────────────────────────────── */
  const REGIONS = [
    { id: 'north',         name: 'North',         color: '#6366f1', cities: ['Chicago','Detroit','Minneapolis','Milwaukee'] },
    { id: 'south',         name: 'South',         color: '#10b981', cities: ['Dallas','Atlanta','Miami','Houston'] },
    { id: 'east',          name: 'East',          color: '#22d3ee', cities: ['New York','Boston','Philadelphia','Washington D.C.'] },
    { id: 'west',          name: 'West',          color: '#a855f7', cities: ['Los Angeles','San Francisco','Seattle','Phoenix'] },
    { id: 'international', name: 'International', color: '#f59e0b', cities: ['Toronto','London','Sydney','Singapore'] },
  ];

  /* ─────────────────────────────────────────
     MONTHLY REVENUE DATA (Jan–Dec 2024)
  ───────────────────────────────────────── */
  const monthlyRevenue = [
    { month: 'Jan', revenue: 312450, orders: 1842, customers: 1105, target: 300000, profit: 93735,  returns: 18420 },
    { month: 'Feb', revenue: 278900, orders: 1623, customers:  987, target: 290000, profit: 83670,  returns: 16230 },
    { month: 'Mar', revenue: 395600, orders: 2341, customers: 1342, target: 360000, profit: 118680, returns: 23410 },
    { month: 'Apr', revenue: 421300, orders: 2489, customers: 1489, target: 400000, profit: 126390, returns: 24890 },
    { month: 'May', revenue: 387200, orders: 2215, customers: 1298, target: 390000, profit: 116160, returns: 22150 },
    { month: 'Jun', revenue: 458700, orders: 2762, customers: 1612, target: 440000, profit: 137610, returns: 27620 },
    { month: 'Jul', revenue: 502300, orders: 3041, customers: 1823, target: 480000, profit: 150690, returns: 30410 },
    { month: 'Aug', revenue: 489100, orders: 2918, customers: 1745, target: 470000, profit: 146730, returns: 29180 },
    { month: 'Sep', revenue: 531400, orders: 3187, customers: 1934, target: 510000, profit: 159420, returns: 31870 },
    { month: 'Oct', revenue: 567800, orders: 3412, customers: 2089, target: 540000, profit: 170340, returns: 34120 },
    { month: 'Nov', revenue: 642300, orders: 3891, customers: 2341, target: 600000, profit: 192690, returns: 38910 },
    { month: 'Dec', revenue: 718500, orders: 4312, customers: 2678, target: 700000, profit: 215550, returns: 43120 },
  ];

  /* ─────────────────────────────────────────
     CATEGORY SALES DATA
  ───────────────────────────────────────── */
  const categorySales = [
    { category: 'Electronics',    revenue: 1523400, units: 12840, growth: 18.4,  color: '#6366f1' },
    { category: 'Apparel',        revenue:  987300, units: 34210, growth: 12.1,  color: '#22d3ee' },
    { category: 'Furniture',      revenue:  742100, units:  5670, growth:  8.7,  color: '#a855f7' },
    { category: 'Food & Beverage',revenue:  631500, units: 89340, growth: 22.3,  color: '#10b981' },
    { category: 'Sports',         revenue:  489200, units: 18920, growth: 15.6,  color: '#f59e0b' },
    { category: 'Beauty',         revenue:  333050, units: 28750, growth:  9.2,  color: '#ef4444' },
  ];

  /* ─────────────────────────────────────────
     REGIONAL SALES DATA
  ───────────────────────────────────────── */
  const regionalSales = [
    {
      region: 'East', color: '#22d3ee',
      revenue: 1423500, orders: 8921, customers: 4234, growth: 16.2,
      cities: [
        { name: 'New York',       revenue: 621400, orders: 3812 },
        { name: 'Boston',         revenue: 312800, orders: 1923 },
        { name: 'Philadelphia',   revenue: 298100, orders: 1876 },
        { name: 'Washington D.C.',revenue: 191200, orders: 1310 },
      ]
    },
    {
      region: 'West', color: '#a855f7',
      revenue: 1287400, orders: 7834, customers: 3891, growth: 21.5,
      cities: [
        { name: 'Los Angeles',    revenue: 534200, orders: 3245 },
        { name: 'San Francisco',  revenue: 389600, orders: 2312 },
        { name: 'Seattle',        revenue: 241800, orders: 1456 },
        { name: 'Phoenix',        revenue: 121800, orders:  821 },
      ]
    },
    {
      region: 'South', color: '#10b981',
      revenue: 1089200, orders: 6543, customers: 3124, growth: 14.3,
      cities: [
        { name: 'Dallas',         revenue: 398400, orders: 2412 },
        { name: 'Atlanta',        revenue: 312100, orders: 1876 },
        { name: 'Miami',          revenue: 234900, orders: 1392 },
        { name: 'Houston',        revenue: 143800, orders:  863 },
      ]
    },
    {
      region: 'North', color: '#6366f1',
      revenue:  891300, orders: 5342, customers: 2567, growth:  9.8,
      cities: [
        { name: 'Chicago',        revenue: 387200, orders: 2341 },
        { name: 'Detroit',        revenue: 234100, orders: 1423 },
        { name: 'Minneapolis',    revenue: 168400, orders: 1023 },
        { name: 'Milwaukee',      revenue: 101600, orders:  555 },
      ]
    },
    {
      region: 'International', color: '#f59e0b',
      revenue:  616150, orders: 3178, customers: 1723, growth: 31.7,
      cities: [
        { name: 'Toronto',        revenue: 198400, orders: 1023 },
        { name: 'London',         revenue: 189200, orders:  976 },
        { name: 'Sydney',         revenue: 143600, orders:  723 },
        { name: 'Singapore',      revenue:  84950, orders:  456 },
      ]
    },
  ];

  /* ─────────────────────────────────────────
     TOP PRODUCTS
  ───────────────────────────────────────── */
  const products = [
    { id: 'P001', name: 'ProBook Elite X1',       category: 'Electronics',    price: 1299, sold: 2341, revenue: 3040959, stock: 142,  rating: 4.8, growth: 23.4,  color: '#6366f1' },
    { id: 'P002', name: 'AirFlow Runner Pro',     category: 'Sports',         price:  189, sold: 4821, revenue:  910569, stock: 387,  rating: 4.6, growth: 18.2,  color: '#f59e0b' },
    { id: 'P003', name: 'UltraSound BT 500',      category: 'Electronics',    price:  349, sold: 3912, revenue: 1365288, stock:  89,  rating: 4.7, growth: 31.1,  color: '#6366f1' },
    { id: 'P004', name: 'Luxe Denim Collection',  category: 'Apparel',        price:   89, sold: 7234, revenue:  643826, stock: 921,  rating: 4.4, growth:  9.8,  color: '#22d3ee' },
    { id: 'P005', name: 'ErgoDesk Pro 4K',        category: 'Furniture',      price:  799, sold: 1124, revenue:  898076, stock:  34,  rating: 4.9, growth: 12.3,  color: '#a855f7' },
    { id: 'P006', name: 'GlowSkin Serum Kit',     category: 'Beauty',         price:   67, sold: 6891, revenue:  461697, stock: 478,  rating: 4.5, growth: 15.7,  color: '#ef4444' },
    { id: 'P007', name: 'OrganicBlend Coffee',    category: 'Food & Beverage',price:   34, sold:12340, revenue:  419560, stock:2341,  rating: 4.6, growth: 27.9,  color: '#10b981' },
    { id: 'P008', name: 'SmartWatch Series 9',    category: 'Electronics',    price:  449, sold: 2890, revenue: 1297610, stock: 201,  rating: 4.8, growth: 41.2,  color: '#6366f1' },
    { id: 'P009', name: 'YogaMat Ultra Grip',     category: 'Sports',         price:   79, sold: 5612, revenue:  443348, stock: 634,  rating: 4.3, growth:  6.4,  color: '#f59e0b' },
    { id: 'P010', name: 'CloudPillow Memory',     category: 'Furniture',      price:  129, sold: 3421, revenue:  441309, stock: 289,  rating: 4.7, growth: 11.8,  color: '#a855f7' },
    { id: 'P011', name: 'ActiveWear Tank Set',    category: 'Apparel',        price:   59, sold: 8923, revenue:  526457, stock: 741,  rating: 4.2, growth:  8.1,  color: '#22d3ee' },
    { id: 'P012', name: 'NutriMix Pro Blender',   category: 'Food & Beverage',price:  199, sold: 2134, revenue:  424666, stock: 178,  rating: 4.5, growth: 19.4,  color: '#10b981' },
  ];

  /* ─────────────────────────────────────────
     CUSTOMERS
  ───────────────────────────────────────── */
  const customers = [
    { id: 'C001', name: 'Alexandra Chen',   email: 'alex.chen@email.com',   segment: 'VIP',     ltv: 24580, orders: 47, avgOrder: 523, region: 'West',  lastOrder: '2024-12-15', joinDate: '2022-03-10', initials: 'AC', color: '#6366f1' },
    { id: 'C002', name: 'Marcus Rodriguez', email: 'm.rodriguez@email.com',  segment: 'VIP',     ltv: 19340, orders: 38, avgOrder: 509, region: 'South', lastOrder: '2024-12-18', joinDate: '2021-08-22', initials: 'MR', color: '#22d3ee' },
    { id: 'C003', name: 'Priya Sharma',     email: 'p.sharma@email.com',    segment: 'Premium', ltv: 14210, orders: 29, avgOrder: 490, region: 'East',  lastOrder: '2024-12-10', joinDate: '2022-11-05', initials: 'PS', color: '#a855f7' },
    { id: 'C004', name: 'James O\'Brien',   email: 'j.obrien@email.com',    segment: 'Premium', ltv: 12890, orders: 31, avgOrder: 416, region: 'North', lastOrder: '2024-12-20', joinDate: '2023-01-14', initials: 'JO', color: '#10b981' },
    { id: 'C005', name: 'Sarah Williams',   email: 's.williams@email.com',  segment: 'Premium', ltv: 11420, orders: 24, avgOrder: 476, region: 'East',  lastOrder: '2024-12-08', joinDate: '2022-06-18', initials: 'SW', color: '#f59e0b' },
    { id: 'C006', name: 'David Kim',        email: 'd.kim@email.com',       segment: 'Regular', ltv:  8930, orders: 18, avgOrder: 496, region: 'West',  lastOrder: '2024-11-28', joinDate: '2023-04-20', initials: 'DK', color: '#ef4444' },
    { id: 'C007', name: 'Emma Thompson',    email: 'e.thompson@email.com',  segment: 'Regular', ltv:  7840, orders: 21, avgOrder: 373, region: 'North', lastOrder: '2024-12-01', joinDate: '2023-07-12', initials: 'ET', color: '#6366f1' },
    { id: 'C008', name: 'Carlos Mendez',    email: 'c.mendez@email.com',    segment: 'Regular', ltv:  6920, orders: 15, avgOrder: 461, region: 'South', lastOrder: '2024-11-25', joinDate: '2023-09-08', initials: 'CM', color: '#a855f7' },
    { id: 'C009', name: 'Aisha Johnson',    email: 'a.johnson@email.com',   segment: 'New',     ltv:  3210, orders:  7, avgOrder: 459, region: 'East',  lastOrder: '2024-12-19', joinDate: '2024-08-15', initials: 'AJ', color: '#22d3ee' },
    { id: 'C010', name: 'Noah Patel',       email: 'n.patel@email.com',     segment: 'New',     ltv:  2840, orders:  5, avgOrder: 568, region: 'West',  lastOrder: '2024-12-21', joinDate: '2024-10-03', initials: 'NP', color: '#10b981' },
  ];

  /* ─────────────────────────────────────────
     SALES TEAM
  ───────────────────────────────────────── */
  const salesTeam = [
    { id: 'S001', name: 'Rachel Foster',   role: 'Senior AE',    revenue: 891234, target: 850000, deals: 142, conversion: 34.2, region: 'East',  initials: 'RF', color: '#6366f1' },
    { id: 'S002', name: 'Tyler Brooks',    role: 'Account Exec', revenue: 742180, target: 700000, deals: 118, conversion: 29.8, region: 'West',  initials: 'TB', color: '#22d3ee' },
    { id: 'S003', name: 'Monica Desai',    role: 'Senior AE',    revenue: 698450, target: 680000, deals: 109, conversion: 31.4, region: 'North', initials: 'MD', color: '#a855f7' },
    { id: 'S004', name: 'Kevin Chang',     role: 'Account Exec', revenue: 623900, target: 620000, deals:  97, conversion: 27.1, region: 'South', initials: 'KC', color: '#10b981' },
    { id: 'S005', name: 'Laura Mitchell',  role: 'Junior AE',    revenue: 489200, target: 520000, deals:  84, conversion: 24.6, region: 'West',  initials: 'LM', color: '#f59e0b' },
    { id: 'S006', name: 'Daniel Okafor',   role: 'Junior AE',    revenue: 412780, target: 450000, deals:  71, conversion: 21.3, region: 'East',  initials: 'DO', color: '#ef4444' },
  ];

  /* ─────────────────────────────────────────
     RECENT ORDERS
  ───────────────────────────────────────── */
  const recentOrders = [
    { id: '#ORD-7841', customer: 'Alexandra Chen',   product: 'SmartWatch Series 9',  amount: 449,  status: 'Completed', date: '2024-12-21', region: 'West'  },
    { id: '#ORD-7840', customer: 'Noah Patel',        product: 'ProBook Elite X1',      amount: 1299, status: 'Completed', date: '2024-12-21', region: 'West'  },
    { id: '#ORD-7839', customer: 'Sarah Williams',    product: 'UltraSound BT 500',     amount: 349,  status: 'Processing',date: '2024-12-20', region: 'East'  },
    { id: '#ORD-7838', customer: 'James O\'Brien',    product: 'ErgoDesk Pro 4K',       amount: 799,  status: 'Completed', date: '2024-12-20', region: 'North' },
    { id: '#ORD-7837', customer: 'Aisha Johnson',     product: 'GlowSkin Serum Kit',    amount: 67,   status: 'Completed', date: '2024-12-19', region: 'East'  },
    { id: '#ORD-7836', customer: 'Marcus Rodriguez',  product: 'OrganicBlend Coffee',   amount: 102,  status: 'Shipped',   date: '2024-12-19', region: 'South' },
    { id: '#ORD-7835', customer: 'Emma Thompson',     product: 'AirFlow Runner Pro',    amount: 189,  status: 'Processing',date: '2024-12-18', region: 'North' },
    { id: '#ORD-7834', customer: 'David Kim',         product: 'CloudPillow Memory',    amount: 129,  status: 'Completed', date: '2024-12-18', region: 'West'  },
    { id: '#ORD-7833', customer: 'Priya Sharma',      product: 'Luxe Denim Collection', amount: 178,  status: 'Shipped',   date: '2024-12-17', region: 'East'  },
    { id: '#ORD-7832', customer: 'Carlos Mendez',     product: 'NutriMix Pro Blender',  amount: 199,  status: 'Cancelled', date: '2024-12-16', region: 'South' },
  ];

  /* ─────────────────────────────────────────
     KPI SUMMARY (full year 2024)
  ───────────────────────────────────────── */
  const kpiSummary = {
    totalRevenue:    5307550,
    totalOrders:     32017,
    totalCustomers:  19743,
    avgOrderValue:   165.77,
    totalProfit:     1611765,
    profitMargin:    30.4,
    returnRate:      8.2,
    customerGrowth:  24.7,
    revenueGrowth:   18.3,
    ordersGrowth:    21.4,
    avgOrderGrowth:  -2.6,

    // Previous year comparisons
    prevRevenue:     4487600,
    prevOrders:      26367,
    prevCustomers:   15832,
    prevAvgOrder:    170.21,
  };

  /* ─────────────────────────────────────────
     WEEKLY REVENUE (last 8 weeks)
  ───────────────────────────────────────── */
  const weeklyRevenue = [82400, 91200, 87600, 104300, 98700, 115800, 128400, 142300];

  /* ─────────────────────────────────────────
     CUSTOMER GROWTH (monthly new customers)
  ───────────────────────────────────────── */
  const customerGrowth = {
    new:      [412, 389, 523, 567, 498, 634, 712, 689, 741, 823, 912, 1023],
    returning:[693, 598, 819, 922, 800, 978, 1111,1056,1193,1266,1429,1655],
    churned:  [ 82,  94,  71,  89,  76,  92, 104,  98, 112, 121, 134, 148],
  };

  /* ─────────────────────────────────────────
     FUNNEL DATA
  ───────────────────────────────────────── */
  const salesFunnel = [
    { stage: 'Visitors',     count: 284300, color: '#6366f1' },
    { stage: 'Leads',        count: 42648,  color: '#22d3ee' },
    { stage: 'Prospects',    count: 14923,  color: '#a855f7' },
    { stage: 'Qualified',    count:  6834,  color: '#10b981' },
    { stage: 'Closed Won',   count:  3241,  color: '#f59e0b' },
  ];

  /* ─────────────────────────────────────────
     PUBLIC API
  ───────────────────────────────────────── */
  return {
    MONTHS,
    MONTHS_FULL,
    CATEGORIES,
    REGIONS,
    monthlyRevenue,
    categorySales,
    regionalSales,
    products,
    customers,
    salesTeam,
    recentOrders,
    kpiSummary,
    weeklyRevenue,
    customerGrowth,
    salesFunnel,

    // Helper: get monthly values for a given key
    getMonthlyValues(key) {
      return monthlyRevenue.map(m => m[key]);
    },

    // Helper: total for a key in monthlyRevenue
    getTotal(key) {
      return monthlyRevenue.reduce((sum, m) => sum + (m[key] || 0), 0);
    },

    // Helper: top N products by revenue
    getTopProducts(n = 5) {
      return [...products].sort((a, b) => b.revenue - a.revenue).slice(0, n);
    },

    // Helper: filter orders by status
    getOrdersByStatus(status) {
      if (!status || status === 'all') return recentOrders;
      return recentOrders.filter(o => o.status.toLowerCase() === status.toLowerCase());
    },

    // Helper: customer segment counts
    getSegmentCounts() {
      const counts = {};
      customers.forEach(c => {
        counts[c.segment] = (counts[c.segment] || 0) + 1;
      });
      return counts;
    },
  };
})();
