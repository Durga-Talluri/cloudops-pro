import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function DashboardScreen() {
  const stats = [
    {
      title: "Total Resources",
      value: "24",
      icon: "server",
      color: "#3b82f6",
      bgColor: "#dbeafe",
    },
    {
      title: "Active Alerts",
      value: "3",
      icon: "warning",
      color: "#ef4444",
      bgColor: "#fee2e2",
    },
    {
      title: "Compliance Score",
      value: "87%",
      icon: "shield-checkmark",
      color: "#10b981",
      bgColor: "#d1fae5",
    },
    {
      title: "Monthly Cost",
      value: "$2,847",
      icon: "analytics",
      color: "#8b5cf6",
      bgColor: "#ede9fe",
    },
  ];

  const quickActions = [
    {
      title: "View Alerts",
      icon: "warning",
      color: "#ef4444",
      screen: "Alerts",
    },
    {
      title: "Cost Analysis",
      icon: "analytics",
      color: "#3b82f6",
      screen: "Cost",
    },
    {
      title: "Infrastructure",
      icon: "server",
      color: "#10b981",
      screen: "Infrastructure",
    },
    {
      title: "Settings",
      icon: "settings",
      color: "#6b7280",
      screen: "Settings",
    },
  ];

  const renderStatCard = (stat: any) => (
    <View
      key={stat.title}
      style={[styles.statCard, { backgroundColor: stat.bgColor }]}
    >
      <View style={styles.statIconContainer}>
        <Ionicons name={stat.icon as any} size={24} color={stat.color} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{stat.value}</Text>
        <Text style={styles.statTitle}>{stat.title}</Text>
      </View>
    </View>
  );

  const renderQuickAction = (action: any) => (
    <TouchableOpacity
      key={action.title}
      style={styles.actionCard}
      onPress={() => console.log(`Navigate to ${action.screen}`)}
    >
      <View
        style={[styles.actionIconContainer, { backgroundColor: action.color }]}
      >
        <Ionicons name={action.icon as any} size={24} color="white" />
      </View>
      <Text style={styles.actionTitle}>{action.title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Welcome Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome back!</Text>
          <Text style={styles.subtitleText}>
            Here's your infrastructure overview
          </Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsContainer}>{stats.map(renderStatCard)}</View>

        {/* Quick Actions */}
        <View style={styles.actionsSection}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map(renderQuickAction)}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityItem}>
              <View
                style={[styles.activityIcon, { backgroundColor: "#fee2e2" }]}
              >
                <Ionicons name="warning" size={16} color="#ef4444" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>High CPU Usage Alert</Text>
                <Text style={styles.activityTime}>2 minutes ago</Text>
              </View>
            </View>

            <View style={styles.activityItem}>
              <View
                style={[styles.activityIcon, { backgroundColor: "#d1fae5" }]}
              >
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>
                  Backup completed successfully
                </Text>
                <Text style={styles.activityTime}>1 hour ago</Text>
              </View>
            </View>

            <View style={styles.activityItem}>
              <View
                style={[styles.activityIcon, { backgroundColor: "#dbeafe" }]}
              >
                <Ionicons name="analytics" size={16} color="#3b82f6" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>
                  Cost optimization report generated
                </Text>
                <Text style={styles.activityTime}>3 hours ago</Text>
              </View>
            </View>
          </View>
        </View>
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
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 16,
    color: "#6b7280",
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: "45%",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIconContainer: {
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 2,
  },
  statTitle: {
    fontSize: 12,
    color: "#6b7280",
  },
  actionsSection: {
    padding: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 16,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  actionCard: {
    width: "47%",
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
    textAlign: "center",
  },
  activitySection: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 32,
  },
  activityCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1f2937",
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    color: "#6b7280",
  },
});
