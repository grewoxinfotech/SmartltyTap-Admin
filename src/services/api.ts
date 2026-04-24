const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

interface ApiOptions extends RequestInit {
  token?: string;
}

export async function fetchApi(endpoint: string, options: ApiOptions = {}) {
  const { token, ...fetchOptions } = options;
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...fetchOptions.headers as Record<string, string>,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...fetchOptions, headers });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

async function uploadApi(endpoint: string, formData: FormData, token?: string) {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers,
    body: formData,
  });
  if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
  return response.json();
}

export const adminApi = {
  // Users
  listUsers: (token?: string) => fetchApi("/users", { token }),
  createUser: (body: unknown, token?: string) => fetchApi("/users", { method: "POST", body: JSON.stringify(body), token }),
  updateUser: (id: string, body: unknown, token?: string) =>
    fetchApi(`/users/${id}`, { method: "PATCH", body: JSON.stringify(body), token }),
  resetUserPassword: (id: string, newPassword: string, token?: string) =>
    fetchApi(`/users/${id}/reset-password`, { method: "PATCH", body: JSON.stringify({ newPassword }), token }),
  updateUserStatus: (id: string, isActive: boolean, token?: string) =>
    fetchApi(`/users/${id}/status`, { method: "PATCH", body: JSON.stringify({ isActive }), token }),
  deleteUser: (id: string, token?: string) => fetchApi(`/users/${id}`, { method: "DELETE", token }),

  // Cards
  listCards: (token?: string) => fetchApi("/admin/cards", { token }),
  createCard: (body: { cardUid: string, userId?: string }, token?: string) => fetchApi("/cards/create", { method: "POST", body: JSON.stringify(body), token }),
  assignCard: (cardUid: string, userId: string, token?: string) =>
    fetchApi("/cards/assign", { method: "POST", body: JSON.stringify({ cardUid, userId }), token }),
  reassignCard: (oldCardUid: string, newCardUid: string, userId: string, token?: string) =>
    fetchApi("/cards/reassign", { method: "POST", body: JSON.stringify({ oldCardUid, newCardUid, userId }), token }),
  updateCardStatus: (cardId: string, isActive: boolean, token?: string) =>
    fetchApi(`/cards/${cardId}/status`, { method: "PATCH", body: JSON.stringify({ isActive }), token }),
  updateCard: (id: string, body: any, token?: string) =>
    fetchApi(`/cards/${id}`, { method: "PATCH", body: JSON.stringify(body), token }),

  // Profiles
  listProfiles: (token?: string) => fetchApi("/profiles", { token }),
  getProfile: (token?: string) => fetchApi("/profiles/me", { token }),
  updateProfile: (body: unknown, token?: string) => fetchApi("/profiles/update", { method: "POST", body: JSON.stringify(body), token }),

  // Admin/Analytics
  dashboard: (token?: string) => fetchApi("/admin/dashboard", { token }),
  listPayments: (token?: string) => fetchApi("/admin/payments", { token }),

  // Leads
  listLeads: (query = "", token?: string) => fetchApi(`/leads${query ? `?${query}` : ""}`, { token }),
  exportLeadsCsv: async (query = "", token?: string) => {
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(`${API_BASE_URL}/leads/export.csv${query ? `?${query}` : ""}`, { headers });
    if (!res.ok) throw new Error("Failed to export CSV");
    return res.text();
  },

  // Templates / themes
  listTemplates: (token?: string) => fetchApi("/templates", { token }),
  createTemplate: (body: unknown, token?: string) => fetchApi("/templates/create", { method: "POST", body: JSON.stringify(body), token }),
  updateTemplate: (id: string, body: unknown, token?: string) =>
    fetchApi(`/templates/${id}`, { method: "PATCH", body: JSON.stringify(body), token }),
  assignTemplate: (body: unknown, token?: string) => fetchApi("/templates/assign", { method: "POST", body: JSON.stringify(body), token }),
  listMyThemeOptions: (token?: string) => fetchApi("/templates/my-options", { token }),
  selectMyTheme: (templateId: string, token?: string) =>
    fetchApi("/templates/my-select", { method: "POST", body: JSON.stringify({ templateId }), token }),

  // Settings / API control
  getSettings: (token?: string) => fetchApi("/settings", { token }),
  updateSettings: (body: unknown, token?: string) => fetchApi("/settings/update", { method: "POST", body: JSON.stringify(body), token }),
  updateFeatureFlags: (body: unknown, token?: string) =>
    fetchApi("/settings/feature-flags", { method: "PATCH", body: JSON.stringify(body), token }),

  // Security / sub-admin / logs
  listAdmins: (token?: string) => fetchApi("/security/admins", { token }),
  setAdminPermissions: (userId: string, body: unknown, token?: string) =>
    fetchApi(`/security/admins/${userId}/permissions`, { method: "POST", body: JSON.stringify(body), token }),
  listActivity: (query = "", token?: string) => fetchApi(`/security/activity${query ? `?${query}` : ""}`, { token }),

  // Subscriptions / invoices
  listPlans: (token?: string) => fetchApi("/subscriptions/plans", { token }),
  savePlan: (body: unknown, token?: string) => fetchApi("/subscriptions/plans", { method: "POST", body: JSON.stringify(body), token }),
  assignPlan: (body: unknown, token?: string) => fetchApi("/subscriptions/assign", { method: "POST", body: JSON.stringify(body), token }),
  listInvoices: (query = "", token?: string) => fetchApi(`/subscriptions/invoices${query ? `?${query}` : ""}`, { token }),
  createInvoice: (body: unknown, token?: string) =>
    fetchApi("/subscriptions/invoices", { method: "POST", body: JSON.stringify(body), token }),
  setInvoiceStatus: (id: string | number, status: "DUE" | "PAID" | "VOID", token?: string) =>
    fetchApi(`/subscriptions/invoices/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }), token }),

  // Products
  listProducts: (token?: string) => fetchApi("/products", { token }),
  createProduct: (body: unknown, token?: string) => fetchApi("/products", { method: "POST", body: JSON.stringify(body), token }),
  updateProduct: (id: string, body: unknown, token?: string) =>
    fetchApi(`/products/${id}`, { method: "PATCH", body: JSON.stringify(body), token }),
  deleteProduct: (id: string, token?: string) => fetchApi(`/products/${id}`, { method: "DELETE", token }),

  // Orders
  listOrders: (token?: string) => fetchApi("/admin/orders", { token }),
  updateOrderStatus: (id: string, status: string, token?: string) =>
    fetchApi(`/admin/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }), token }),

  // Payments
  adminPayments: (token?: string) => fetchApi("/admin/payments", { token }),

  // Resellers
  listResellers: (token?: string) => fetchApi("/admin/resellers", { token }),
  createReseller: (body: unknown, token?: string) =>
    fetchApi("/admin/resellers", { method: "POST", body: JSON.stringify(body), token }),

  // Billing
  createInvoicePaymentIntent: (invoiceId: string | number, token?: string) =>
    fetchApi(`/billing/invoice/${invoiceId}/pay`, { method: "POST", token }),
  markInvoicePaid: (invoiceId: string | number, note: string, token?: string) =>
    fetchApi(`/billing/invoice/${invoiceId}/mark-paid`, { method: "PATCH", body: JSON.stringify({ note }), token }),

  // Uploads
  uploadGalleryImage: (file: File, token?: string) => {
    const fd = new FormData();
    fd.append("image", file);
    return uploadApi("/upload/gallery-image", fd, token);
  },
  uploadBrochure: (file: File, token?: string) => {
    const fd = new FormData();
    fd.append("file", file);
    return uploadApi("/upload/brochure", fd, token);
  },
};

export const publicApi = {
  getProfile: (userId: string) => fetchApi(`/profiles/${userId}`),
  submitLead: (body: unknown) => fetchApi("/leads", { method: "POST", body: JSON.stringify(body) }),
  trackClick: (cardId: string, userId: string, type: string) => 
    fetchApi("/analytics/click", { method: "POST", body: JSON.stringify({ cardId, userId, type }) }),
};
