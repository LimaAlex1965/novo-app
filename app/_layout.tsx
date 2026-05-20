import { Drawer } from "expo-router/drawer";
import { View } from "react-native";

export default function RootLayout() {
  return <Drawer 
      screenOptions={{
        drawerActiveTintColor: '#fff',  
        drawerActiveBackgroundColor: '#b98952',
        drawerInactiveTintColor: '#f30f0f',
      }}>
        
       <Drawer.Screen options={{title:"Pricipal", headerTitle: "kkkkk"}}  name="index"/>
    </Drawer>;
}