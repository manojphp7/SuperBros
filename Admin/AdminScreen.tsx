import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native";
import LeftMenu from "./LeftMenu";
import { adminMenuItems } from "../helpers/helpers";
import Dashboard from "./Dashboard";
import Orders from "./Orders";
import Settings from "./Settings";
import { useCart } from "../context/CartContext";
import { usePushNotifications } from "../helpers/PushNotification";

import {
  Pusher,
  PusherMember,
  PusherChannel,
  PusherEvent,
} from '@pusher/pusher-websocket-react-native';

const AdminScreen = () => {
  const [active, setActive] = useState("dashboard");
  const [menuVisible, setMenuVisible] = useState(false);
  const [newOrderID, setNewOrderID] = useState<string | null>(null);



    // const token = usePushNotifications((obj: any) => {
  
    //   const data = obj?.data
    
    //   if (data) {
    //     if (data.refresh === "AdminOrders") {
    //      setNewOrderID(data.OrderID);
    //       // userOrderStatusUpdateHandling(body.orderObj);
    //     }
    //   } else {
    //     console.log("No body or data in the notification payload.");
    //   }
    // });

    // console.log(token)


const renderContent = () => {
  switch (active) {
    case "dashboard":
      return <Dashboard onSelect={(id) => setActive(id)} />;
    case "orders":
      return <Orders newOrderID={newOrderID} afterAdded={()=>setNewOrderID('')}/>;
    case "settings":
      return <Settings onSelect={(id) => setActive(id)} />;
    default:
      return <Text style={styles.contentText}>Select a section</Text>;
  }
};

  return (
    <SafeAreaView style={styles.container}>
      {menuVisible && (
        <LeftMenu
          active={active}
          onSelect={(id) => setActive(id)}
          onClose={() => setMenuVisible(false)} // Close the menu when ✖ is pressed
          menuItems={adminMenuItems}
        />
      )}

      {/* Right content */}
      {!menuVisible && (
       <View style={styles.content}>
       {/* Menu toggle icon and title */}
       <View style={styles.toggleContainer}>
         <TouchableOpacity
           onPress={() => setMenuVisible(!menuVisible)}
           style={styles.menuToggle}
         >
           <Text style={styles.menuToggleText}>☰</Text>
         </TouchableOpacity>
         <Text style={styles.menuTitle}>
           {adminMenuItems.find((i) => i.id === active)?.label}
         </Text>
       </View>
     
       {renderContent()}
     </View>
      )}
    </SafeAreaView>
  );
};

export default AdminScreen;

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    paddingTop:0,
    backgroundColor: '#FC8019',
  },
  menuToggle: {
     // Change to your desired bg color
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    backgroundColor: '#FC8019'
  },
  menuToggleText: {
    color: '#ffffff', // Change to your desired text color
    fontSize: 18,
  },
  menuTitle: {
    color: '#333333', // Change to your desired text color
    fontSize: 18,
    fontWeight: 'bold',
  },
  container: {
    flexDirection: "row",
    flex: 1,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
    //padding: 10,
    paddingTop: 35, // Leave space for the toggle button
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  contentText: {
    fontSize: 18,
    color: "#444",
  },
  
});
