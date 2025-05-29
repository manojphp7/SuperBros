import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

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

type orderOnProcessType = {
    id: string;
    euid: string;
    deliveryBoy: string;
    amount: string;
    address: string;
    latlong: null;
    flat: string;
    movement: string;
    status: string;
    deliveryCharges: string;
    description: string;
    deliveryOption:string;
}

type currentOrderType = {
  orderID : string,
  status : string
}

type CartContextType = {
  cartItems: CartItem[];
  userName: string;
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
  expoTokenHandler: (prop: string) => void;
  userOrderStatusUpdateHandling: (prop: any) => void;
  userOrderStatusUpdate: any;
  savedSocket: any;
  handleSocket: (prop: any) => void;
  initDeliveryTime: (orderID: string, deliveryTimeInMinutes: number) => void;
  getRemainingTime: (orderID: string) => string;
  setNewAdminOrdersFn: (orderID: string) => void;
  newAdminOrders : any;
  setOrderOnProcessFn: (orderObj: orderOnProcessType[]) => void;
  orderOnProcess : orderOnProcessType[] | null,
  orderOnProcessUpdateFn : (orderObj: currentOrderType) => void;
  setUserRoleFn:(role:string)=>void;
  userRole:any,
  setPostCodeChargefn:(prop:number)=>void;
  postCodeCharge:number;
  settings:any;
  setSettingsfn:(prop:any)=>void;
  
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
  const [expoToken, setExpoToken] = useState('');
  const [userOrderStatusUpdate, setUserOrderStatusUpdate] = useState<any>({});
  const [userName, setUserName] = useState('');
  const [savedSocket, setSavedSocket] = useState<any>(null);
  const [newAdminOrders, setNewAdminOrders] = useState<string[]>([])
  const [orderOnProcess, setOrderOnProcess] = useState<orderOnProcessType[] | null>(null)
  const [userRole, setUserRole] = useState<any>(null)
  const [postCodeCharge, setPostCodeCharge] = useState(0)
  const [settings, setSettings] = useState<any>(null)



  const [currentOrder, setCurrentOrder] = useState<currentOrderType | null>(null)

  // Stores remaining time for orders
  const [deliveryTimes, setDeliveryTimes] = useState<{ [orderID: string]: number }>({});

  // Countdown function to update the delivery time every minute
  const initDeliveryTime = (orderID: string, deliveryTimeInMinutes: number) => {
    setDeliveryTimes(prev => ({
      ...prev,
      [orderID]: deliveryTimeInMinutes
    }));

    // Update the countdown every minute
    const interval = setInterval(() => {
      setDeliveryTimes(prev => {
        const currentTime = prev[orderID];
        if (currentTime > 0) {
          return {
            ...prev,
            [orderID]: currentTime - 1
          };
        } else {
          clearInterval(interval); // Stop the countdown when it finishes
          return prev;
        }
      });
    }, 60000); // 1 minute interval
  };

  // Get the remaining time for a specific order
  const getRemainingTime = (orderID: string) => {
    const remaining = deliveryTimes[orderID];
    if (remaining !== undefined) {
      return `Arriving in ${remaining} mins`;
    }
    return 'Time not available';
  };

  // Cart item management functions
  const addItem = (item: CartItem) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(cartItem => cartItem.id === item.id);
      if (existingIndex !== -1) {
        const updatedCart = [...prev];
        updatedCart[existingIndex] = { ...item };
        return updatedCart;
      }
      return [...prev, { ...item }];
    });
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
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
    setDeliveryAddress(null);
    setUserRole(null)
  };

  const setDeliveryAddressfn = (prop: any) => {
    setDeliveryAddress(prop);
  };

  const expoTokenHandler = (prop: string) => {
    setExpoToken(prop);
  };

  const userOrderStatusUpdateHandling = (prop: any) => {
    setUserOrderStatusUpdate(prop);
  };

  const setNewAdminOrdersFn = (newOrderID:string) =>{
    if(newOrderID === '')
    {
      setNewAdminOrders([])
    } else{
      setNewAdminOrders(prev => [...prev, newOrderID]);
    }
  }

const setOrderOnProcessFn = (orderObj: orderOnProcessType[]) => {
    if(orderOnProcess && orderOnProcess.length > 0){
        setOrderOnProcess([...orderOnProcess, ...orderObj]);
    } else{
      setOrderOnProcess([...orderObj]);
    }
};


const orderOnProcessUpdateFn = (msgObj : currentOrderType) => {
    if(orderOnProcess && orderOnProcess.length > 0){
      let tmpObj:orderOnProcessType[] =  orderOnProcess.map(order =>
      order.id.toString() === msgObj.orderID.toString()
        ? { ...order, status: msgObj.status }
        : order
    )
      setOrderOnProcess([...tmpObj])
    } else{
      console.error("orderOnProcess was found empty")
    }
}   

const setUserRoleFn = (role:string) =>{
  setUserRole(role)
}

const setPostCodeChargefn = (prop:number) =>{
    setPostCodeCharge(prop)
}

const setSettingsfn = (prop:any) =>{
    setSettings(prop)
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
        handleSocket,
        initDeliveryTime,
        getRemainingTime,
        setNewAdminOrdersFn,
        newAdminOrders,
        setOrderOnProcessFn,
        orderOnProcess,
        orderOnProcessUpdateFn,
        setUserRoleFn,
        userRole,
        setPostCodeChargefn,
        postCodeCharge,
        settings,
        setSettingsfn
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
