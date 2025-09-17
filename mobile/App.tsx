import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";
import { QueryClient, QueryClientProvider } from "react-query";
import { Ionicons } from "@expo/vector-icons";

import AlertsScreen from "./src/screens/AlertsScreen";
import CostScreen from "./src/screens/CostScreen";
import DashboardScreen from "./src/screens/DashboardScreen";
import SettingsScreen from "./src/screens/SettingsScreen";

const Tab = createBottomTabNavigator();
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              let iconName: keyof typeof Ionicons.glyphMap;

              if (route.name === "Dashboard") {
                iconName = focused ? "home" : "home-outline";
              } else if (route.name === "Alerts") {
                iconName = focused ? "warning" : "warning-outline";
              } else if (route.name === "Cost") {
                iconName = focused ? "analytics" : "analytics-outline";
              } else if (route.name === "Settings") {
                iconName = focused ? "settings" : "settings-outline";
              } else {
                iconName = "help-outline";
              }

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "#3b82f6",
            tabBarInactiveTintColor: "gray",
            headerStyle: {
              backgroundColor: "#3b82f6",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          })}
        >
          <Tab.Screen
            name="Dashboard"
            component={DashboardScreen}
            options={{ title: "CloudOps Pro" }}
          />
          <Tab.Screen
            name="Alerts"
            component={AlertsScreen}
            options={{
              title: "Alerts",
              tabBarBadge: 3, // Mock badge count
            }}
          />
          <Tab.Screen
            name="Cost"
            component={CostScreen}
            options={{ title: "Cost Analysis" }}
          />
          <Tab.Screen
            name="Settings"
            component={SettingsScreen}
            options={{ title: "Settings" }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}
