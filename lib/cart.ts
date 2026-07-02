"use client";

import { Product } from "./data";

export type CartItem = Product & { qty: number };

const KEY = "1001-articole-cart";

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]) {
  window.localStorage.setItem(KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cart:change"));
}

export function addToCart(product: Product, qty: number) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === product.id);
  const next = existing
    ? cart.map((item) => (item.id === product.id ? { ...item, qty: item.qty + qty } : item))
    : [...cart, { ...product, qty }];
  saveCart(next);
  return next;
}

export function updateQty(id: string, qty: number) {
  const next = getCart().map((item) => (item.id === id ? { ...item, qty } : item));
  saveCart(next);
  return next;
}

export function removeFromCart(id: string) {
  const next = getCart().filter((item) => item.id !== id);
  saveCart(next);
  return next;
}

export function clearCart() {
  saveCart([]);
}

export function effectivePrice(item: CartItem) {
  return item.price * (1 - (item.discount ?? 0) / 100);
}

export function cartTotal(cart: CartItem[]) {
  return cart.reduce((sum, item) => sum + effectivePrice(item) * item.qty, 0);
}

export function cartWeight(cart: CartItem[]) {
  return cart.reduce((sum, item) => sum + (item.unit === "kg" ? item.qty : 0), 0);
}
