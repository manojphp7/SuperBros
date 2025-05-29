// navigation.ts
export type RootStackParamList = {
    
    EnterMobile: undefined;
    OtpVerification: {phone:string};
    Home: undefined;
    Profile: undefined;
    Category: { catId: string; catName: string };
    Cart: undefined;
    Address:undefined;
    AddressForm: undefined;
    UserOrders: undefined;
    TermAndCondition: undefined;
    PrivacyPolicy: undefined;
    Logout: undefined;
    Dashboard : undefined;
    Orders : undefined;
    DeliveryBoys : undefined;
    Settings: undefined;
    OrderDetails : { orderID: any;};
    MyDeliveries : undefined;
    Delivered: undefined;
    Search: undefined;
  };