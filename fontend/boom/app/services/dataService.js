const API_BASE = "http://localhost/investment_site/api";

export const dataService = {
  getSummary: async () => {
    const res = await fetch(`${API_BASE}/summary.php`);
    if (!res.ok) throw new Error("Failed to fetch summary");
    const data = await res.json();
    return data.data;
  },

  getHoldings: async () => {
    const res = await fetch(`${API_BASE}/holdings.php`);
    if (!res.ok) throw new Error("Failed to fetch holdings");
    const data = await res.json();
    return data.data;
  },

  getPerformanceHistory: async () => {
    const res = await fetch(`${API_BASE}/performances.php`);
    if (!res.ok) throw new Error("Failed to fetch performance history");
    const data = await res.json();
    return data.data;
  },
};
