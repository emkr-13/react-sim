import axios from "axios";

// Use environment variable or fallback to localhost if not available
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3080";

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  // Add timeout to prevent long hanging requests
  timeout: 10000,
});

// Request interceptor for adding the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle network errors gracefully
    if (error.code === "ERR_NETWORK") {
      console.error("Network error - API server may be down or unreachable");
      return Promise.reject({
        ...error,
        message:
          "Server is unreachable. Please check your connection or try again later.",
      });
    }

    // If error is 401 (Unauthorized) and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Get the refresh token
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          // No refresh token, logout the user
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
          return Promise.reject(error);
        }

        // Try to get a new token
        const response = await axios.post(`${API_URL}/api/auth/refresh-token`, {
          refreshToken,
        });

        if (response.data.success) {
          const { token, refreshToken: newRefreshToken } = response.data.data;

          // Save the new tokens
          localStorage.setItem("token", token);
          localStorage.setItem("refreshToken", newRefreshToken);

          // Update the Authorization header
          originalRequest.headers.Authorization = `Bearer ${token}`;

          // Retry the original request
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token is invalid or expired, logout the user
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API service functions
const apiService = {
  // Auth endpoints
  login: (email: string, password: string) =>
    api.post("/api/auth/login", { email, password }),

  logout: () => api.post("/api/auth/logout"),

  refreshToken: (refreshToken: string) =>
    api.post("/api/auth/refresh-token", { refreshToken }),

  // User endpoints
  getUserProfile: () => api.get("/api/user/profile"),
  updateUserProfile: (data: { fullname: string }) =>
    api.post("/api/user/update", data),
  createUser: (data: { email: string; password: string; fullname: string }) =>
    api.post("/api/user/create", data),

  // Dashboard endpoints
  getDashboardGeneralSummary: () => api.get("/api/dashboard/summary-general"),
  getDashboardSpecificSummary: (timeFilter: string) =>
    api.get(`/api/dashboard/summary-specific?time_filter=${timeFilter}`),

  // Categories endpoints
  getCategories: (params: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) => api.get("/api/categories/all", { params }),
  getCategoryDetail: (id: string) => api.post("/api/categories/detail", { id }),
  createCategory: (data: { name: string; description: string }) =>
    api.post("/api/categories/create", data),
  updateCategory: (data: { id: string; name: string; description: string }) =>
    api.post("/api/categories/update", data),
  deleteCategory: (id: string) => api.post("/api/categories/delete", { id }),

  // Stores endpoints
  getStores: (params: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) => api.get("/api/store/all", { params }),
  getStoreDetail: (id: string) => api.post("/api/store/detail", { id }),
  createStore: (data: {
    name: string;
    location: string;
    description: string;
    manager: string;
    contactInfo: string;
    phone: string;
    email: string;
    address: string;
  }) => api.post("/api/store/create", data),
  updateStore: (data: {
    id: string;
    name: string;
    location: string;
    description: string;
    manager: string;
    contactInfo: string;
    phone: string;
    email: string;
    address: string;
  }) => api.post("/api/store/update", data),
  deleteStore: (id: string) => api.post("/api/store/delete", { id }),

  // Products endpoints
  getProducts: (params: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) => api.get("/api/products/all", { params }),
  getProductDetail: (id: string) => api.post("/api/products/detail", { id }),
  createProduct: (data: {
    name: string;
    categoryId: string;
    price_sell: string;
    price_cost: string;
    satuan: string;
    description: string;
    sku?: string;
  }) => api.post("/api/products/create", data),
  updateProduct: (data: {
    id: string;
    name: string;
    description: string;
    categoryId: string;
    price_sell: string;
    price_cost: string;
    satuan: string;
    sku?: string;
  }) => api.post("/api/products/update", data),
  deleteProduct: (id: string) => api.post("/api/products/delete", { id }),

  // Stock Movements endpoints
  getStockMovements: (params: {
    page?: number;
    limit?: number;
    search?: string;
    storeId?: string;
    productId?: string;
    movementType?: "in" | "out";
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) => api.get("/api/stock-movements/all", { params }),
  getStockMovementDetail: (id: number) =>
    api.post("/api/stock-movements/detail", { id }),
  createStockMovement: (data: {
    productId: string;
    storeId: string;
    quantity: number;
    movementType: "in" | "out";
    note?: string;
    referenceId?: string;
    referenceType?: string;
  }) => api.post("/api/stock-movements/create", data),

  // Quotations endpoints
  getQuotations: (params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) => api.get("/api/quotations/all", { params }),
  getQuotationDetail: (id: number) =>
    api.post("/api/quotations/detail", { id }),
  createQuotation: (data: {
    customerId: number;
    storeId: number;
    quotationDate: string;
    items: Array<{
      productId: string;
      quantity: number;
      unitPrice: number;
    }>;
    notes?: string;
    discountAmount?: number;
  }) => api.post("/api/quotations/create", data),
  updateQuotationStatus: (id: number, status: string) =>
    api.post("/api/quotations/update-status", { id, status }),
  exportQuotationToPdf: (id: number) =>
    api.post("/api/quotations/export-pdf", { id }, { responseType: "blob" }),

  // Purchases endpoints
  getPurchases: (params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    paymentStatus?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) => api.get("/api/purchases/all", { params }),
  getPurchaseDetail: (id: number) => api.post("/api/purchases/detail", { id }),
  createPurchase: (data: {
    supplierId: number;
    storeId: number;
    purchaseDate: string;
    paymentDueDate: string;
    items: Array<{
      productId: string;
      quantity: number;
      unitPrice: number;
    }>;
    notes?: string;
    taxAmount?: number;
    discountAmount?: number;
  }) => api.post("/api/purchases/create", data),
  updatePurchaseStatus: (id: number, status: string) =>
    api.post("/api/purchases/update-status", { id, status }),
  updatePurchasePaymentStatus: (id: number, paymentStatus: string) =>
    api.post("/api/purchases/update-payment-status", { id, paymentStatus }),
  exportPurchaseToPdf: (id: number) =>
    api.post("/api/purchases/export-pdf", { id }, { responseType: "blob" }),

  // Reports endpoints
  generateInventoryReport: (data: {
    filterType: string;
    storeId?: string;
    categoryId?: string;
    startDate?: string;
    endDate?: string;
    title?: string;
  }) => api.post("/api/reports/inventory/pdf", data, { responseType: "blob" }),
  generatePurchasesReport: (data: {
    filterType: string;
    storeId?: string;
    supplierId?: string;
    startDate?: string;
    endDate?: string;
    title?: string;
  }) => api.post("/api/reports/purchases/pdf", data, { responseType: "blob" }),
  generateQuotationsReport: (data: {
    filterType: string;
    storeId?: string;
    customerId?: string;
    startDate?: string;
    endDate?: string;
    title?: string;
  }) => api.post("/api/reports/quotations/pdf", data, { responseType: "blob" }),
  generateStockMovementsReport: (data: {
    filterType: string;
    storeId?: string;
    productId?: string;
    movementType?: "in" | "out";
    startDate?: string;
    endDate?: string;
    title?: string;
  }) =>
    api.post("/api/reports/stock-movements/pdf", data, {
      responseType: "blob",
    }),

  // Akun endpoints
  getAkuns: (params: {
    page?: number;
    limit?: number;
    search?: string;
    type?: "supplier" | "customer";
    sortBy?: string;
    sortOrder?: "asc" | "desc";
  }) => api.get("/api/akun/all", { params }),
  getAkunDetail: (id: number) => api.post("/api/akun/detail", { id }),
  createAkun: (data: {
    name: string;
    type: "supplier" | "customer";
    phone: string;
    email: string;
    address: string;
  }) => api.post("/api/akun/create", data),
  updateAkun: (data: {
    id: number;
    name: string;
    phone: string;
    email: string;
    address: string;
    type: "supplier" | "customer";
  }) => api.post("/api/akun/update", data),
  deleteAkun: (id: number) => api.post("/api/akun/delete", { id }),
};

export default apiService;
