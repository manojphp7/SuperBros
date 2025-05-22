import { CartItem } from "../context/CartContext";

export const AdminEuid = "2b8cc9d9b360d7ca22a4fcfe196ca64b"; //Admin
export const AdminExpoToken = "ExponentPushToken[QKxSK2POo4BPpQv5euJsxr]"; //Admin
export const BaseUrl = "https://restaurants.atozassignment.com/";

export const formatCurrency = (
  amount: number | string | undefined | null,
  currencySymbol = "£"
) => {
  const numericAmount = parseFloat(String(amount));
  if (isNaN(numericAmount)) return `${currencySymbol}0.00`;

  return `${currencySymbol}${numericAmount.toFixed(2)}`;
};

export const addToCartWithoutAddons = (
  item: CartItem,
  addItem: (item: CartItem) => void
) => {
  addItem(item);
};

export const formatAddress = (location: any): string => {
  const {
    name,
    street,
    streetNumber,
    district,
    city,
    subregion,
    region,
    postalCode,
    country,
  } = location;

  const parts = [
    name || "",
    street || "",
    district || "",
    city || subregion || "",
    region || "",
    postalCode || "",
    country || "",
  ];

  // Filter out empty strings and join
  return parts.filter(Boolean).join(", ");
};

export const adminMenuItems = [
  { id: "dashboard", label: "Dashboard" },
  { id: "orders", label: "Orders" },
  { id: "settings", label: "Settings" },
];


export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};