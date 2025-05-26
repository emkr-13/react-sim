// Auth types
export interface User {
  id: string;
  email: string;
  fullname: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    refreshToken: string;
  };
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Pagination types
export interface Pagination {
  total_data: number;
  total_page: number;
  total_display: number;
  first_page: boolean;
  last_page: boolean;
  prev: number | null;
  current: number;
  next: number | null;
  detail: number[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

// Dashboard types
export interface DashboardGeneralSummary {
  totalUsers: number;
  totalProducts: number;
  totalCategories: number;
  totalStores: number;
}

export interface RecentTransaction {
  id: string;
  type: string;
  amount: number;
  date: string;
}

export interface DashboardSpecificSummary {
  salesTotal: number;
  purchasesTotal: number;
  transactionsCount: number;
  recentTransactions: RecentTransaction[];
}

// Category types
export interface Category {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// Store types
export interface Store {
  id: string;
  name: string;
  description: string;
  location: string;
  manager: string;
  contactInfo: string;
  phone: string;
  email: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  sku: string;
  categoryId: string;
  categoryName: string;
  price_sell: string;
  price_cost: string;
  satuan: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductDetail extends Omit<Product, "categoryName"> {
  category: {
    id: string;
    name: string;
  };
}

// Stock Movement types
export interface StockMovement {
  id: number;
  productId: string;
  productName: string;
  productSku: string;
  productSatuan: string;
  storeId: string;
  storeName: string;
  quantity: number;
  movementType: "in" | "out";
  referenceId: string | null;
  referenceType: string | null;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}

// Quotation types
export interface Quotation {
  id: number;
  quotationNumber: string;
  quotationDate: string;
  customerId: number;
  customerName: string;
  storeId: number;
  storeName: string;
  subtotal: number;
  discountAmount: number;
  grandTotal: number;
  status: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// Quotation Item types
export interface QuotationItem {
  id: number;
  quotationId: number;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

// Purchase types
export interface Purchase {
  id: number;
  invoiceNumber: string;
  purchaseDate: string;
  supplierId: number;
  supplierName: string;
  storeId: number;
  storeName: string;
  subtotal: number;
  taxAmount: number;
  discountAmount: number;
  grandTotal: number;
  status: string;
  paymentStatus: string;
  paymentDueDate: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// Purchase Item types
export interface PurchaseItem {
  id: number;
  purchaseId: number;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

// Akun types (Supplier/Customer)
export interface Akun {
  id: number;
  name: string;
  type: "supplier" | "customer";
  phone: string;
  email: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface StockByStore {
  storeId: string;
  storeName: string;
  productId: string;
  productName: string;
  productSku: string;
  productSatuan: string;
  currentStock: number;
}

export interface CreateQuotationPayload {
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
}

export interface CreatePurchasePayload {
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
}

export interface CreateStockMovementPayload {
  productId: string;
  storeId: string;
  quantity: number;
  movementType: "in" | "out";
  note?: string;
  referenceId?: string;
  referenceType?: string;
}

export interface ReportGenerationParams {
  filterType: string;
  startDate?: string;
  endDate?: string;
  storeId?: string;
  categoryId?: string;
  productId?: string;
  customerId?: string;
  supplierId?: string;
  movementType?: "in" | "out";
  title?: string;
}
