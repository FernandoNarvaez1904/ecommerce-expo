import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ItemListScreen from "./item-list";
import ProfileScreen from "./profile";
import { SafeAreaView } from "react-native-safe-area-context";
import { HomeTabParamList } from "../types/navigation";
import CartListScreen from "./cart-list";
import Ionicons from "@expo/vector-icons/Ionicons";
import MyOrdersScreen from "./my-orders";

const Tab = createBottomTabNavigator<HomeTabParamList>();

function HomeScreen() {
  return (
    <SafeAreaView className="h-full">
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
        }}
      >
        <Tab.Screen
          name="Search"
          component={ItemListScreen}
          options={{
            tabBarIcon: (props) => (
              <Ionicons name="search-outline" {...props} />
            ),
          }}
        />
        <Tab.Screen
          name="Cart"
          component={CartListScreen}
          options={{
            tabBarIcon: (props) => <Ionicons name="cart-outline" {...props} />,
          }}
        />
        <Tab.Screen
          name="Orders"
          component={MyOrdersScreen}
          options={{
            tabBarIcon: (props) => (
              <Ionicons name="receipt-outline" {...props} />
            ),
          }}
        />
        <Tab.Screen
          name="My Profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: (props) => (
              <Ionicons name="person-outline" {...props} />
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

export default HomeScreen;
