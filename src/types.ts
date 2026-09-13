export type CategoryType = 
  | 'all' 
  | 'classic_pizza' 
  | 'specialty_pizza' 
  | 'burgers' 
  | 'fried_chicken' 
  | 'wraps' 
  | 'pasta' 
  | 'sides' 
  | 'drinks' 
  | 'deals';

export type OrderType = 'delivery' | 'takeaway' | 'dinein';

export type PaymentMethod = 'cod' | 'easypaisa' | 'jazzcash' | 'bank_transfer' | 'card';

export type OrderStatus = 'pending' | 'preparing' | 'dispatched' | 'completed' | 'cancelled';

export interface MenuItemOption {
  name: string;
  priceModifier: number; // e.g. +300 for Large
}

export interface MenuItemAddon {
  id: string;
  name: string;
  price: number;
}

export interface MenuItem {
  id: string;
  name: string;
  category: CategoryType;
  description: string;
  basePrice: number;
  image: string;
  isPopular?: boolean;
  isSpicy?: boolean;
  sizes?: MenuItemOption[];
  spiceLevels?: string[];
  addons?: MenuItemAddon[];
  available: boolean;
}

export interface DailyDeal {
  id: string;
  title: string;
  tag: string;
  subtitle: string;
  dealPrice: number;
  originalPrice: number;
  itemsIncluded: string[];
  image: string;
  validTag: string;
  active: boolean;
  popular?: boolean;
}

export interface CartItem {
  cartItemId: string;
  menuItemId?: string;
  dealId?: string;
  name: string;
  category: CategoryType;
  unitPrice: number;
  quantity: number;
  selectedSize?: string;
  selectedSpice?: string;
  selectedAddons?: MenuItemAddon[];
  specialNote?: string;
  isDeal?: boolean;
  dealTag?: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  orderType: OrderType;
  deliveryArea: string;
  customAddress: string;
  tableNumber: string;
  paymentMethod: PaymentMethod;
  notes: string;
}

export interface DiscountCode {
  code: string;
  description: string;
  type: 'percentage' | 'flat' | 'free_delivery';
  value: number; // e.g., 10 for 10%, 200 for Rs. 200
  minOrder: number;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  timestamp: number;
  dateFormatted: string;
  customer: CustomerInfo;
  items: CartItem[];
  subtotal: number;
  discountAmount: number;
  appliedCoupon?: string;
  adminDiscount?: {
    type: 'flat' | 'percentage';
    value: number;
  };
  discountDetails?: string;
  deliveryFee: number;
  taxAmount: number;
  total: number;
  status: OrderStatus;
  mode: 'customer' | 'admin';
  cashierName?: string;
}
