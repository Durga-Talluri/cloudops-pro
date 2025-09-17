import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(false);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => console.log("Logout"),
      },
    ]);
  };

  const handleClearCache = () => {
    Alert.alert(
      "Clear Cache",
      "This will clear all cached data. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: () => console.log("Clear cache"),
        },
      ]
    );
  };

  const renderSettingItem = (
    icon: string,
    title: string,
    subtitle?: string,
    onPress?: () => void,
    rightComponent?: React.ReactNode
  ) => (
    <TouchableOpacity
      style={styles.settingItem}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingLeft}>
        <View style={styles.settingIcon}>
          <Ionicons name={icon as any} size={20} color="#6b7280" />
        </View>
        <View style={styles.settingContent}>
          <Text style={styles.settingTitle}>{title}</Text>
          {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      {rightComponent ||
        (onPress && (
          <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
        ))}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <View style={styles.section}>
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={32} color="#6b7280" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>John Doe</Text>
              <Text style={styles.profileEmail}>john.doe@cloudopspro.com</Text>
              <Text style={styles.profileRole}>Administrator</Text>
            </View>
          </View>
        </View>

        {/* Notifications Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          <View style={styles.sectionCard}>
            {renderSettingItem(
              "notifications",
              "Push Notifications",
              "Receive alerts and updates",
              undefined,
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: "#e5e7eb", true: "#3b82f6" }}
                thumbColor={notificationsEnabled ? "#ffffff" : "#f3f4f6"}
              />
            )}
            {renderSettingItem(
              "mail",
              "Email Notifications",
              "Get notified via email",
              undefined,
              <Switch
                value={true}
                onValueChange={() => {}}
                trackColor={{ false: "#e5e7eb", true: "#3b82f6" }}
                thumbColor="#ffffff"
              />
            )}
          </View>
        </View>

        {/* App Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Settings</Text>
          <View style={styles.sectionCard}>
            {renderSettingItem(
              "refresh",
              "Auto Refresh",
              "Automatically refresh data",
              undefined,
              <Switch
                value={autoRefreshEnabled}
                onValueChange={setAutoRefreshEnabled}
                trackColor={{ false: "#e5e7eb", true: "#3b82f6" }}
                thumbColor={autoRefreshEnabled ? "#ffffff" : "#f3f4f6"}
              />
            )}
            {renderSettingItem(
              "moon",
              "Dark Mode",
              "Use dark theme",
              undefined,
              <Switch
                value={darkModeEnabled}
                onValueChange={setDarkModeEnabled}
                trackColor={{ false: "#e5e7eb", true: "#3b82f6" }}
                thumbColor={darkModeEnabled ? "#ffffff" : "#f3f4f6"}
              />
            )}
            {renderSettingItem("language", "Language", "English", () =>
              console.log("Change language")
            )}
          </View>
        </View>

        {/* Data Management Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          <View style={styles.sectionCard}>
            {renderSettingItem(
              "download",
              "Export Data",
              "Download your data",
              () => console.log("Export data")
            )}
            {renderSettingItem(
              "trash",
              "Clear Cache",
              "Free up storage space",
              handleClearCache
            )}
            {renderSettingItem(
              "sync",
              "Sync Settings",
              "Last synced 2 hours ago",
              () => console.log("Sync settings")
            )}
          </View>
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.sectionCard}>
            {renderSettingItem(
              "help-circle",
              "Help Center",
              "Get help and support",
              () => console.log("Help center")
            )}
            {renderSettingItem(
              "chatbubble",
              "Contact Support",
              "Get in touch with our team",
              () => console.log("Contact support")
            )}
            {renderSettingItem(
              "document-text",
              "Terms of Service",
              "Read our terms",
              () => console.log("Terms of service")
            )}
            {renderSettingItem(
              "shield-checkmark",
              "Privacy Policy",
              "How we protect your data",
              () => console.log("Privacy policy")
            )}
          </View>
        </View>

        {/* App Info Section */}
        <View style={styles.section}>
          <View style={styles.sectionCard}>
            {renderSettingItem(
              "information-circle",
              "App Version",
              "1.0.0 (Build 100)",
              () => console.log("App version")
            )}
            {renderSettingItem(
              "code-slash",
              "Open Source",
              "View source code",
              () => console.log("Open source")
            )}
          </View>
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out" size={20} color="#ef4444" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  sectionCard: {
    backgroundColor: "white",
    marginHorizontal: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileCard: {
    backgroundColor: "white",
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 2,
  },
  profileRole: {
    fontSize: 12,
    color: "#3b82f6",
    fontWeight: "500",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f3f4f6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1f2937",
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: "#6b7280",
  },
  logoutButton: {
    backgroundColor: "white",
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ef4444",
    marginLeft: 8,
  },
  bottomSpacer: {
    height: 32,
  },
});
