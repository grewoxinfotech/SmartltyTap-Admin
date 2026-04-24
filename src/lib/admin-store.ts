export type PlanType = "BASIC" | "PREMIUM";
export type OrderStatus = "PENDING" | "PAID" | "PROCESSING" | "DELIVERED";

export type User = {
  id: string;
  name: string;
  email: string;
  plan: PlanType;
  role: "USER" | "RESELLER";
  cardIds: string[];
};

export type Order = {
  id: string;
  userId: string;
  customerName: string;
  amount: number;
  status: OrderStatus;
  date: string;
  invoiceUrl: string;
};

export type Card = {
  id: string;
  uid: string;
  userId: string | null;
  status: "ACTIVE" | "INACTIVE";
  taps: number;
};

export type Profile = {
  id: string;
  userId: string;
  name?: string;
  profile_image?: string;
  templateId: string;
  links: {
    googleReview: string;
    whatsapp: string;
    instagram: string;
    website: string;
  };
  featuresEnabled: boolean;
  gallery?: string[];
  brochure_url?: string | null;
  brochure_name?: string | null;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  stock: number;
  imageUrl: string;
  images?: string[];
};

export type Template = {
  id: string;
  name: string;
  category: "BASIC" | "PREMIUM";
  previewUrl: string;
  active: boolean;
};

export type Payment = {
  id: string;
  orderId: string;
  amount: number;
  method: string;
  status: "SUCCESS" | "FAILED" | "REFUNDED";
};

export type Reseller = {
  id: string;
  name: string;
  assignedPricing: string;
  totalSales: number;
  commissionRate: number;
};

export type AdminSettings = {
  websiteName: string;
  whatsappNumber: string;
  smtpHost: string;
  smtpEmail: string;
  brandColor: string;
};

export type AdminDB = {
  users: User[];
  orders: Order[];
  cards: Card[];
  profiles: Profile[];
  products: Product[];
  templates: Template[];
  payments: Payment[];
  resellers: Reseller[];
  settings: AdminSettings;
  activity: string[];
};

const STORAGE_KEY = "smartlytap-admin-db-v1";

const seed: AdminDB = {
  users: [
    { id: "USR-1001", name: "John Doe", email: "john@example.com", plan: "PREMIUM", role: "USER", cardIds: ["CRD-001"] },
    { id: "USR-1002", name: "Sarah Smith", email: "sarah@example.com", plan: "BASIC", role: "USER", cardIds: ["CRD-003"] },
    { id: "USR-1003", name: "Mike Ross", email: "mike@example.com", plan: "PREMIUM", role: "RESELLER", cardIds: [] },
  ],
  orders: [
    { id: "ORD-9821", userId: "USR-1001", customerName: "John Doe", amount: 149, status: "PAID", date: "2026-10-24", invoiceUrl: "/invoice/ORD-9821" },
    { id: "ORD-9822", userId: "USR-1002", customerName: "Sarah Smith", amount: 299, status: "PROCESSING", date: "2026-10-25", invoiceUrl: "/invoice/ORD-9822" },
    { id: "ORD-9823", userId: "USR-1003", customerName: "Mike Ross", amount: 49, status: "PENDING", date: "2026-10-26", invoiceUrl: "/invoice/ORD-9823" },
  ],
  cards: [
    { id: "CRD-001", uid: "1A2B-3C4D", userId: "USR-1001", status: "ACTIVE", taps: 142 },
    { id: "CRD-002", uid: "5E6F-7G8H", userId: null, status: "INACTIVE", taps: 0 },
    { id: "CRD-003", uid: "9I0J-1K2L", userId: "USR-1002", status: "ACTIVE", taps: 890 },
  ],
  profiles: [
    {
      id: "PROF-001",
      userId: "USR-1001",
      name: "John Doe Official",
      templateId: "TPL-01",
      links: {
        googleReview: "https://g.page/demo",
        whatsapp: "https://wa.me/919876543210",
        instagram: "https://instagram.com/demo",
        website: "https://smartlytap.com",
      },
      featuresEnabled: true,
      gallery: ["https://images.unsplash.com/photo-1557804506-669a67965ba0", "https://images.unsplash.com/photo-1556761175-b413da4baf72"],
      brochure_url: null,
      brochure_name: null,
    },
  ],
  products: [
    {
      id: "PROD-1",
      name: "Premium Metal Card",
      price: 49.99,
      stock: 150,
      imageUrl: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d",
      images: [
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d",
        "https://images.unsplash.com/photo-1512428559087-560fa5ceab42",
      ],
    },
    {
      id: "PROD-2",
      name: "Matte Black PVC Card",
      price: 19.99,
      stock: 430,
      imageUrl: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338",
      images: [
        "https://images.unsplash.com/photo-1586075010923-2dd4570fb338",
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3",
      ],
    },
  ],
  templates: [
    { id: "TPL-01", name: "Executive Dark", category: "PREMIUM", previewUrl: "https://example.com/tpl-1", active: true },
    { id: "TPL-02", name: "Modern Minimal Light", category: "BASIC", previewUrl: "https://example.com/tpl-2", active: true },
  ],
  payments: [
    { id: "pay_XYZ123ABC", orderId: "ORD-9821", amount: 149, method: "Razorpay (Credit Card)", status: "SUCCESS" },
    { id: "pay_XYZ789GHI", orderId: "ORD-9823", amount: 49, method: "Razorpay (Net Banking)", status: "FAILED" },
  ],
  resellers: [
    { id: "RES-101", name: "Alpha Tech Partners", assignedPricing: "Wholesale Tier A", totalSales: 12450, commissionRate: 15 },
    { id: "RES-102", name: "Global Tap Inc", assignedPricing: "Wholesale Tier B", totalSales: 4200, commissionRate: 10 },
  ],
  settings: {
    websiteName: "SmartlyTap",
    whatsappNumber: "+91 9876543210",
    smtpHost: "smtp.mailgun.org",
    smtpEmail: "support@smartlytap.com",
    brandColor: "#4F46E5",
  },
  activity: ["Order ORD-9821 marked PAID", "Card CRD-003 tapped 890 times", "New reseller RES-102 onboarded"],
};

function id(prefix: string) {
  return `${prefix}-${Math.floor(Math.random() * 9000 + 1000)}`;
}

export function loadDB(): AdminDB {
  if (typeof window === "undefined") return seed;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }
  try {
    return JSON.parse(raw) as AdminDB;
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
    return seed;
  }
}

export function saveDB(db: AdminDB) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

export function createId(prefix: "USR" | "ORD" | "CRD" | "PROD" | "TPL" | "RES" | "PROF") {
  return id(prefix);
}
