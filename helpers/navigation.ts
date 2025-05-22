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
    LocationPicker: undefined;
    TermAndCondition: undefined;
    PrivacyPolicy: undefined;
    Logout: undefined;
    AdminScreen : undefined;
    Dashboard : undefined;
    Users : undefined;
    Orders : undefined;
    OrderDetails : { orderObj: any;};
  };