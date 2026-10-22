"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
} from "react";
import {
  CartItem,
  CartOrder,
  OrderType,
  generateCartId,
} from "@/lib/whatsapp";

// ─── State ────────────────────────────────────────────────────────────────────

type CartState = CartOrder & {
  isCartOpen: boolean;
  toastMessage: string | null;
};

const initialState: CartState = {
  items: [],
  orderType: null,
  address: "",
  tableNumber: "",
  customerName: "",
  comment: "",
  isCartOpen: false,
  toastMessage: null,
};

// ─── Actions ──────────────────────────────────────────────────────────────────

type CartAction =
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "cartId"> }
  | { type: "REMOVE_ITEM"; cartId: string }
  | { type: "UPDATE_QTY"; cartId: string; quantity: number }
  | { type: "UPDATE_NOTE"; cartId: string; note: string }
  | { type: "SET_ORDER_TYPE"; orderType: OrderType }
  | { type: "SET_ADDRESS"; address: string }
  | { type: "SET_TABLE"; tableNumber: string }
  | { type: "SET_NAME"; customerName: string }
  | { type: "SET_COMMENT"; comment: string }
  | { type: "CLEAR_CART" }
  | { type: "OPEN_CART" }
  | { type: "CLOSE_CART" }
  | { type: "SET_TOAST"; message: string | null }
  | { type: "LOAD_STATE"; state: Partial<CartState> };

// ─── Reducer ──────────────────────────────────────────────────────────────────

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const cartId = generateCartId(action.payload.dishId, action.payload.options);
      const existing = state.items.find((i) => i.cartId === cartId);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.cartId === cartId ? { ...i, quantity: i.quantity + action.payload.quantity } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.payload, cartId }] };
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.cartId !== action.cartId) };
    case "UPDATE_QTY":
      if (action.quantity <= 0) {
        return { ...state, items: state.items.filter((i) => i.cartId !== action.cartId) };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.cartId === action.cartId ? { ...i, quantity: action.quantity } : i
        ),
      };
    case "UPDATE_NOTE":
      return {
        ...state,
        items: state.items.map((i) =>
          i.cartId === action.cartId ? { ...i, note: action.note } : i
        ),
      };
    case "SET_ORDER_TYPE":
      return { ...state, orderType: action.orderType };
    case "SET_ADDRESS":
      return { ...state, address: action.address };
    case "SET_TABLE":
      return { ...state, tableNumber: action.tableNumber };
    case "SET_NAME":
      return { ...state, customerName: action.customerName };
    case "SET_COMMENT":
      return { ...state, comment: action.comment };
    case "CLEAR_CART":
      return { ...initialState };
    case "OPEN_CART":
      return { ...state, isCartOpen: true };
    case "CLOSE_CART":
      return { ...state, isCartOpen: false };
    case "SET_TOAST":
      return { ...state, toastMessage: action.message };
    case "LOAD_STATE":
      return { ...state, ...action.state };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

type CartContextType = {
  state: CartState;
  addItem: (item: Omit<CartItem, "cartId">) => void;
  removeItem: (cartId: string) => void;
  updateQty: (cartId: string, quantity: number) => void;
  updateNote: (cartId: string, note: string) => void;
  setOrderType: (orderType: OrderType) => void;
  setAddress: (address: string) => void;
  setTable: (tableNumber: string) => void;
  setName: (name: string) => void;
  setComment: (comment: string) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  showToast: (message: string) => void;
  totalItems: number;
  totalPrice: number;
  isValid: boolean;
};

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "tunche_cart";
const LEGACY_VISITS_STORAGE_KEY = "tunche_loyalty_visits_v1";

function normalizePersistedCart(value: unknown): Partial<CartState> {
  if (!value || typeof value !== "object") return {};

  const saved = value as Record<string, unknown>;
  const orderType = saved.orderType;

  return {
    items: Array.isArray(saved.items) ? (saved.items as CartItem[]) : [],
    orderType: orderType === "takeaway" || orderType === "dineIn" ? orderType : null,
    address: typeof saved.address === "string" ? saved.address : "",
    tableNumber: typeof saved.tableNumber === "string" ? saved.tableNumber : "",
    customerName: typeof saved.customerName === "string" ? saved.customerName : "",
    comment: typeof saved.comment === "string" ? saved.comment : "",
  };
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      localStorage.removeItem(LEGACY_VISITS_STORAGE_KEY);
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        dispatch({ type: "LOAD_STATE", state: normalizePersistedCart(JSON.parse(saved)) });
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  // Save to localStorage on state change (exclude UI state)
  useEffect(() => {
    try {
      const persistable: CartOrder = {
        items: state.items,
        orderType: state.orderType,
        address: state.address,
        tableNumber: state.tableNumber,
        customerName: state.customerName,
        comment: state.comment,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(persistable));
    } catch {
      // ignore storage errors
    }
  }, [state]);

  // Toast auto-dismiss
  useEffect(() => {
    if (state.toastMessage) {
      const timer = setTimeout(() => {
        dispatch({ type: "SET_TOAST", message: null });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.toastMessage]);

  const totalItems = state.items.reduce((acc, i) => acc + i.quantity, 0);
  const totalPrice = state.items.reduce((acc, i) => acc + i.price * i.quantity, 0);

  const isValid =
    totalItems > 0 &&
    state.orderType !== null &&
    (state.orderType === "dineIn"
      ? state.tableNumber.trim() !== ""
      : state.address.trim() !== "");

  const addItem = useCallback((item: Omit<CartItem, "cartId">) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  }, []);
  const removeItem = useCallback((cartId: string) => dispatch({ type: "REMOVE_ITEM", cartId }), []);
  const updateQty = useCallback((cartId: string, quantity: number) =>
    dispatch({ type: "UPDATE_QTY", cartId, quantity }), []);
  const updateNote = useCallback((cartId: string, note: string) =>
    dispatch({ type: "UPDATE_NOTE", cartId, note }), []);
  const setOrderType = useCallback((orderType: OrderType) =>
    dispatch({ type: "SET_ORDER_TYPE", orderType }), []);
  const setAddress = useCallback((address: string) => dispatch({ type: "SET_ADDRESS", address }), []);
  const setTable = useCallback((tableNumber: string) => dispatch({ type: "SET_TABLE", tableNumber }), []);
  const setName = useCallback((customerName: string) => dispatch({ type: "SET_NAME", customerName }), []);
  const setComment = useCallback((comment: string) => dispatch({ type: "SET_COMMENT", comment }), []);
  const clearCart = useCallback(() => dispatch({ type: "CLEAR_CART" }), []);
  const openCart = useCallback(() => dispatch({ type: "OPEN_CART" }), []);
  const closeCart = useCallback(() => dispatch({ type: "CLOSE_CART" }), []);
  const showToast = useCallback((message: string) =>
    dispatch({ type: "SET_TOAST", message }), []);

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        removeItem,
        updateQty,
        updateNote,
        setOrderType,
        setAddress,
        setTable,
        setName,
        setComment,
        clearCart,
        openCart,
        closeCart,
        showToast,
        totalItems,
        totalPrice,
        isValid,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
