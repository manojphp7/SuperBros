// src/context/CartContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

export type CartItem = {
  id: string;
  name: string;
  image: string;
  isVeg: number;
  isWithAdons: number;
  qty: number;
  extraPriceTotal: number;
  adOnsIDs?: any;
  adOnsNames?: any;
  adOnsTotalPrice?: number;
  productFinalPrice: number;
};

type CartContextType = {
  cartItems: CartItem[];
  userName:string,
  handleUserName: (prop: string) => void;
  userLocation: any;
  euid: string | null;
  deliveryAddress: string;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  handleLocation: (prop: any) => void;
  handleLatLong: (prop: any) => void;
  loginUser: (prop: any) => void;
  logoutUser: () => void;
  setDeliveryAddressfn: (prop: string) => void;
  latLong: any;
  flat: string;
  handleFlat: (prop: any) => void;
  expoToken: string;
  expoTokenHandler: (prop:string) => void;
  userOrderStatusUpdateHandling: (prop:any) => void;
  userOrderStatusUpdate:any;
  savedSocket:any;
  handleSocket: (prop: any) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

type CartProviderProps = {
  children: ReactNode;
};

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [userLocation, setUserLocation] = useState<any>(null);
  const [euid, setEuid] = useState<null | string>(null);
  const [deliveryAddress, setDeliveryAddress] = useState<any>(null);
  const [latLong, setLatLong] = useState<any>(null);
  const [flat, setFlat] = useState<any>(null);
  const [expoToken, setExpoToken] = useState('')
  const [userOrderStatusUpdate, setUserOrderStatusUpdate] = useState<any>({})
  const [userName, setUserName] = useState('')
  const [savedSocket, setSavedSocket] = useState<any>(null)

  const addItem = (item: CartItem) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (cartItem) => cartItem.id === item.id
      );

      if (existingIndex !== -1) {
        // Replace the existing item
        const updatedCart = [...prev];
        updatedCart[existingIndex] = { ...item };
        return updatedCart;
      }

      // Item not found, add new
      return [...prev, { ...item }];
    });
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const handleUserName = (prop: string) => {
    setUserName(prop);
  };
  const handleLocation = (prop: any) => {
    setUserLocation(prop);
  };

  const handleLatLong = (prop: any) => {
    setLatLong(prop);
  };

  const handleFlat = (prop: any) => {
    setFlat(prop);
  };
  
  const handleSocket = (prop: any) => {
    setSavedSocket(prop);
  };
  const loginUser = (prop: string) => {
    setEuid(prop);
  };

  const logoutUser = () => {
    setEuid(null);
  };

  const setDeliveryAddressfn = (prop: any) => {
    setDeliveryAddress(prop);
  };

  const expoTokenHandler = (prop: string) => {
    setExpoToken(prop)
  }

  const userOrderStatusUpdateHandling = (prop: any) =>{
    setUserOrderStatusUpdate(prop)
  }

  return (
    <CartContext.Provider
      value={{
        cartItems,
        userLocation,
        addItem,
        removeItem,
        clearCart,
        userName,
        handleUserName,
        handleLocation,
        euid,
        loginUser,
        logoutUser,
        setDeliveryAddressfn,
        deliveryAddress,
        latLong,
        flat,
        handleLatLong,
        handleFlat,
        expoToken,
        expoTokenHandler,
        userOrderStatusUpdateHandling,
        userOrderStatusUpdate,
        savedSocket,
        handleSocket
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
