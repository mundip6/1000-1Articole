export type MetaEventName =
  | "PageView"
  | "ViewContent"
  | "AddToCart"
  | "InitiateCheckout"
  | "AddPaymentInfo"
  | "Purchase"
  | "Contact";

export interface MetaContent {
  id: string;
  quantity: number;
  item_price?: number;
}

export interface MetaEventData {
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  contents?: MetaContent[];
  content_type?: "product" | "product_group";
  value?: number;
  currency?: "RON";
  num_items?: number;
}

export interface MetaUserData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  city?: string;
  country?: string;
}
