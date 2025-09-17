import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Alert,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "react-query";
import { Alert as AlertType } from "../types";
import { apiService } from "../services/api";

const mockAlerts: AlertType[] = [
  {
    id: "1",
    title: "High CPU Usage",
    description:
      "Web server CPU usage has exceeded 90% for the last 15 minutes",
    severity: "critical",
    status: "active",
    timestamp: "2024-01-21T14:30:00Z",
    resource: "aws-web-server-01",
    category: "Performance",
  },
  {
    id: "2",
    title: "Database Connection Pool Exhausted",
    description: "PostgreSQL connection pool is at 95% capacity",
    severity: "warning",
    status: "active",
    timestamp: "2024-01-21T14:25:00Z",
    resource: "gcp-postgres-primary",
    category: "Database",
  },
  {
    id: "3",
    title: "SSL Certificate Expiring",
    description: "SSL certificate for api.cloudopspro.com expires in 7 days",
    severity: "warning",
    status: "acknowledged",
    timestamp: "2024-01-21T10:15:00Z",
    resource: "api.cloudopspro.com",
    category: "Security",
  },
  {
    id: "4",
    title: "Backup Job Completed",
    description: "Daily backup job completed successfully",
    severity: "info",
    status: "resolved",
    timestamp: "2024-01-21T06:00:00Z",
    resource: "backup-service",
    category: "Backup",
  },
  {
    id: "5",
    title: "Memory Usage High",
    description: "Application server memory usage is at 85%",
    severity: "warning",
    status: "active",
    timestamp: "2024-01-21T13:45:00Z",
    resource: "azure-app-server-02",
    category: "Performance",
  },
];

export default function AlertsScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<"all" | "critical" | "warning" | "info">(
    "all"
  );

  const {
    data: alerts = mockAlerts,
    isLoading,
    refetch,
  } = useQuery(
    "alerts",
    async () => {
      try {
        const response = await apiService.get<AlertType[]>("/alerts");
        return response.data;
      } catch (error) {
        console.error("Failed to fetch alerts:", error);
        return mockAlerts;
      }
    },
    {
      refetchInterval: 30000, // Refetch every 30 seconds
    }
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "#ef4444";
      case "warning":
        return "#f59e0b";
      case "info":
        return "#3b82f6";
      default:
        return "#6b7280";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return "alert-circle";
      case "warning":
        return "warning";
      case "info":
        return "information-circle";
      default:
        return "help-circle";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "#ef4444";
      case "acknowledged":
        return "#f59e0b";
      case "resolved":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffInMinutes = Math.floor(
      (now.getTime() - alertTime.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const filteredAlerts = alerts.filter(
    (alert) => filter === "all" || alert.severity === filter
  );

  const alertCounts = {
    critical: alerts.filter(
      (a) => a.severity === "critical" && a.status === "active"
    ).length,
    warning: alerts.filter(
      (a) => a.severity === "warning" && a.status === "active"
    ).length,
    info: alerts.filter((a) => a.severity === "info" && a.status === "active")
      .length,
  };

  const handleAlertPress = (alert: AlertType) => {
    Alert.alert(
      alert.title,
      `${alert.description}\n\nResource: ${alert.resource}\nCategory: ${
        alert.category
      }\nTime: ${formatTimeAgo(alert.timestamp)}`,
      [
        { text: "Close", style: "cancel" },
        {
          text: "Acknowledge",
          onPress: () => console.log("Acknowledge alert:", alert.id),
        },
      ]
    );
  };

  const renderAlertItem = ({ item }: { item: AlertType }) => (
    <TouchableOpacity
      style={[
        styles.alertItem,
        { borderLeftColor: getSeverityColor(item.severity) },
      ]}
      onPress={() => handleAlertPress(item)}
    >
      <View style={styles.alertHeader}>
        <View style={styles.alertTitleContainer}>
          <Ionicons
            name={getSeverityIcon(item.severity) as any}
            size={20}
            color={getSeverityColor(item.severity)}
            style={styles.alertIcon}
          />
          <Text style={styles.alertTitle} numberOfLines={1}>
            {item.title}
          </Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <Text style={styles.alertDescription} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.alertFooter}>
        <Text style={styles.alertResource}>{item.resource}</Text>
        <Text style={styles.alertTime}>{formatTimeAgo(item.timestamp)}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderFilterButton = (
    filterType: "all" | "critical" | "warning" | "info",
    label: string,
    count: number
  ) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        filter === filterType && styles.filterButtonActive,
      ]}
      onPress={() => setFilter(filterType)}
    >
      <Text
        style={[
          styles.filterButtonText,
          filter === filterType && styles.filterButtonTextActive,
        ]}
      >
        {label} ({count})
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Alert Summary */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>{alertCounts.critical}</Text>
          <Text style={styles.summaryLabel}>Critical</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>{alertCounts.warning}</Text>
          <Text style={styles.summaryLabel}>Warning</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>{alertCounts.info}</Text>
          <Text style={styles.summaryLabel}>Info</Text>
        </View>
      </View>

      {/* Filter Buttons */}
      <View style={styles.filterContainer}>
        {renderFilterButton("all", "All", alerts.length)}
        {renderFilterButton("critical", "Critical", alertCounts.critical)}
        {renderFilterButton("warning", "Warning", alertCounts.warning)}
        {renderFilterButton("info", "Info", alertCounts.info)}
      </View>

      {/* Alerts List */}
      <FlatList
        data={filteredAlerts}
        renderItem={renderAlertItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
  },
  summaryContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryItem: {
    flex: 1,
    alignItems: "center",
  },
  summaryNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: "#e5e7eb",
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: "#3b82f6",
  },
  filterButtonText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  filterButtonTextActive: {
    color: "white",
  },
  listContainer: {
    padding: 16,
  },
  alertItem: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  alertHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  alertTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  alertIcon: {
    marginRight: 8,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    color: "white",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  alertDescription: {
    fontSize: 14,
    color: "#6b7280",
    lineHeight: 20,
    marginBottom: 12,
  },
  alertFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  alertResource: {
    fontSize: 12,
    color: "#9ca3af",
    fontFamily: "monospace",
  },
  alertTime: {
    fontSize: 12,
    color: "#9ca3af",
  },
});
