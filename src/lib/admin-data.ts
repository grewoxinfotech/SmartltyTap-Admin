export type OrderStatus = "Pending" | "Paid" | "Processing" | "Delivered";
export type PlanType = "Basic" | "Premium";

export type Order = {
  id: string;
  userId: string;
  customerName: string;
  amount: number;
  status: OrderStatus;
  invoiceUrl: string;
  createdAt: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  plan: PlanType;
  isActive: boolean;
};

export type Card = {
  id: string;
  cardUid: string;
  userId: string | null;
  isActive: boolean;
  tapCount: number;
};

export type SmartProfile = {
  userId: string;
  googleReview: string;
  whatsapp: string;
  instagram: string;
  website: string;
  featuresEnabled: boolean;
  templateId: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl: string;
};

export type Template = {
  id: string;
  name: string;
  previewUrl: string;
  isActive: boolean;
};

export type PaymentLog = {
  id: string;
  provider: "Razorpay";
  orderId: string;
  status: "Captured" | "Failed" | "Refunded";
  amount: number;
};

export type Reseller = {
  id: string;
  name: string;
  pricingMultiplier: number;
  salesCount: number;
  commissionEarned: number;
};

export type Settings = {
  websiteName: string;
  whatsappNumber: string;
  smtpHost: string;
  smtpEmail: string;
  brandingPrimaryColor: string;
};

type DB = {
  orders: Order[];
  users: User[];
  cards: Card[];
  profiles: SmartProfile[];
  products: Product[];
  templates: Template[];
  payments: PaymentLog[];
  resellers: Reseller[];
  settings: Settings;
  activity: string[];
};

const db: DB = {
  orders: [
    {
      id: "ORD-1001",
      userId: "USR-1",
      customerName: "Aarav Sharma",
      amount: 1999,
      status: "Paid",
      invoiceUrl: "/invoices/ORD-1001.pdf",
      createdAt: new Date().toISOString(),
    },
  ],
  users: [
    { id: "USR-1", name: "Aarav Sharma", email: "aarav@demo.com", plan: "Premium", isActive: true },
    { id: "USR-2", name: "Neha Patel", email: "neha@demo.com", plan: "Basic", isActive: true },
  ],
  cards: [
    { id: "CARD-1", cardUid: "NFC-9D2A-3011", userId: "USR-1", isActive: true, tapCount: 135 },
    { id: "CARD-2", cardUid: "NFC-AB3C-7721", userId: null, isActive: false, tapCount: 0 },
  ],
  profiles: [
    {
      userId: "USR-1",
      googleReview: "https://g.page/r/demo-review",
      whatsapp: "https://wa.me/919900001111",
      instagram: "https://instagram.com/demo",
      website: "https://smartlytap.com",
      featuresEnabled: true,
      templateId: "TPL-1",
    },
  ],
  products: [
    {
      id: "PRD-1",
      name: "NFC Smart Card Premium",
      price: 999,
      stock: 450,
      imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d",
    },
  ],
  templates: [{ id: "TPL-1", name: "Modern Glass", previewUrl: "https://example.com/template-1", isActive: true }],
  payments: [{ id: "PAY-1", provider: "Razorpay", orderId: "ORD-1001", status: "Captured", amount: 1999 }],
  resellers: [{ id: "RSL-1", name: "North Region Partner", pricingMultiplier: 0.88, salesCount: 143, commissionEarned: 76500 }],
  settings: {
    websiteName: "SmartlyTap",
    whatsappNumber: "+91 90000 90000",
    smtpHost: "smtp.gmail.com",
    smtpEmail: "noreply@smartlytap.com",
    brandingPrimaryColor: "#0f172a",
  },
  activity: ["Initial admin seed created", "Order ORD-1001 marked Paid"],
};

export function generateId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export function getDB() {
  return db;
}
