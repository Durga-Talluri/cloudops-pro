import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "react-query";
import { LineChart } from "react-native-chart-kit";
import { CostData, CostSummary } from "../types";
import { apiService } from "../services/api";

const screenWidth = Dimensions.get("window").width;

const mockCostData: CostData[] = [
  { date: "2024-01-15", cost: 2847, predicted: 2900 },
  { date: "2024-01-16", cost: 2923, predicted: 2950 },
  { date: "2024-01-17", cost: 3105, predicted: 3000 },
  { date: "2024-01-18", cost: 2987, predicted: 3050 },
  { date: "2024-01-19", cost: 3123, predicted: 3100 },
  { date: "2024-01-20", cost: 3056, predicted: 3150 },
  { date: "2024-01-21", cost: 3189, predicted: 3200 },
];

const mockCostSummary: CostSummary = {
  currentCost: 3189,
  previousCost: 3056,
  change: 133,
  changePercent: 4.35,
  totalSavings: 1250,
};

const mockOptimizations = [
  {
    id: "1",
    title: "Right-size EC2 instances",
    savings: 340,
    impact: "high",
    category: "Compute",
  },
  {
    id: "2",
    title: "Enable S3 Intelligent Tiering",
    savings: 120,
    impact: "medium",
    category: "Storage",
  },
  {
    id: "3",
    title: "Reserve instances for predictable workloads",
    savings: 450,
    impact: "high",
    category: "Compute",
  },
  {
    id: "4",
    title: "Optimize database queries",
    savings: 85,
    impact: "medium",
    category: "Database",
  },
];

export default function CostScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<"7d" | "30d" | "90d">(
    "7d"
  );

  const {
    data: costData = mockCostData,
    isLoading: costLoading,
    refetch: refetchCost,
  } = useQuery(
    "cost-data",
    async () => {
      try {
        const response = await apiService.get<CostData[]>("/ai-cost");
        return response.data;
      } catch (error) {
        console.error("Failed to fetch cost data:", error);
        return mockCostData;
      }
    },
    {
      refetchInterval: 60000, // Refetch every minute
    }
  );

  const {
    data: costSummary = mockCostSummary,
    isLoading: summaryLoading,
    refetch: refetchSummary,
  } = useQuery("cost-summary", async () => {
    try {
      const response = await apiService.get<CostSummary>("/ai-cost/summary");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch cost summary:", error);
      return mockCostSummary;
    }
  });

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refetchCost(), refetchSummary()]);
    setRefreshing(false);
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "#ef4444";
      case "medium":
        return "#f59e0b";
      case "low":
        return "#10b981";
      default:
        return "#6b7280";
    }
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? "#ef4444" : "#10b981";
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? "trending-up" : "trending-down";
  };

  const chartData = {
    labels: costData.map((item) => {
      const date = new Date(item.date);
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }),
    datasets: [
      {
        data: costData.map((item) => item.cost),
        color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
        strokeWidth: 2,
      },
      {
        data: costData.map((item) => item.predicted),
        color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: "#ffffff",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: "#3b82f6",
    },
  };

  const renderOptimizationItem = (item: any) => (
    <View key={item.id} style={styles.optimizationItem}>
      <View style={styles.optimizationHeader}>
        <Text style={styles.optimizationTitle}>{item.title}</Text>
        <View
          style={[
            styles.impactBadge,
            { backgroundColor: getImpactColor(item.impact) },
          ]}
        >
          <Text style={styles.impactText}>{item.impact}</Text>
        </View>
      </View>
      <Text style={styles.optimizationCategory}>{item.category}</Text>
      <View style={styles.optimizationFooter}>
        <Text style={styles.savingsText}>-${item.savings}/month</Text>
        <TouchableOpacity style={styles.applyButton}>
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Cost Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Text style={styles.summaryTitle}>Current Daily Cost</Text>
            <View style={styles.periodSelector}>
              {(["7d", "30d", "90d"] as const).map((period) => (
                <TouchableOpacity
                  key={period}
                  style={[
                    styles.periodButton,
                    selectedPeriod === period && styles.periodButtonActive,
                  ]}
                  onPress={() => setSelectedPeriod(period)}
                >
                  <Text
                    style={[
                      styles.periodButtonText,
                      selectedPeriod === period &&
                        styles.periodButtonTextActive,
                    ]}
                  >
                    {period}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.costDisplay}>
            <Text style={styles.costAmount}>
              ${costSummary.currentCost.toLocaleString()}
            </Text>
            <View style={styles.costChange}>
              <Ionicons
                name={getChangeIcon(costSummary.change) as any}
                size={16}
                color={getChangeColor(costSummary.change)}
              />
              <Text
                style={[
                  styles.costChangeText,
                  { color: getChangeColor(costSummary.change) },
                ]}
              >
                {Math.abs(costSummary.changePercent).toFixed(1)}%
              </Text>
            </View>
          </View>

          <Text style={styles.costSubtext}>vs yesterday</Text>
        </View>

        {/* Cost Trend Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>7-Day Cost Trend</Text>
          <View style={styles.chartContainer}>
            <LineChart
              data={chartData}
              width={screenWidth - 64}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </View>
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#3b82f6" }]}
              />
              <Text style={styles.legendText}>Actual</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#10b981" }]}
              />
              <Text style={styles.legendText}>AI Predicted</Text>
            </View>
          </View>
        </View>

        {/* AI Optimization Suggestions */}
        <View style={styles.optimizationsCard}>
          <View style={styles.optimizationsHeader}>
            <Text style={styles.optimizationsTitle}>
              AI Optimization Suggestions
            </Text>
            <Text style={styles.totalSavings}>
              Potential savings: ${costSummary.totalSavings.toLocaleString()}
              /month
            </Text>
          </View>

          <View style={styles.optimizationsList}>
            {mockOptimizations.map(renderOptimizationItem)}
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
  summaryCard: {
    backgroundColor: "white",
    margin: 16,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  periodSelector: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderRadius: 8,
    padding: 2,
  },
  periodButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  periodButtonActive: {
    backgroundColor: "#3b82f6",
  },
  periodButtonText: {
    fontSize: 12,
    color: "#6b7280",
    fontWeight: "500",
  },
  periodButtonTextActive: {
    color: "white",
  },
  costDisplay: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  costAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1f2937",
  },
  costChange: {
    flexDirection: "row",
    alignItems: "center",
  },
  costChangeText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 4,
  },
  costSubtext: {
    fontSize: 14,
    color: "#6b7280",
  },
  chartCard: {
    backgroundColor: "white",
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: "center",
  },
  chart: {
    borderRadius: 16,
  },
  chartLegend: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: "#6b7280",
  },
  optimizationsCard: {
    backgroundColor: "white",
    margin: 16,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optimizationsHeader: {
    marginBottom: 16,
  },
  optimizationsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
    marginBottom: 4,
  },
  totalSavings: {
    fontSize: 12,
    color: "#6b7280",
  },
  optimizationsList: {
    gap: 12,
  },
  optimizationItem: {
    backgroundColor: "#f9fafb",
    borderRadius: 12,
    padding: 16,
  },
  optimizationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  optimizationTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1f2937",
    flex: 1,
  },
  impactBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  impactText: {
    fontSize: 10,
    color: "white",
    fontWeight: "600",
    textTransform: "uppercase",
  },
  optimizationCategory: {
    fontSize: 12,
    color: "#6b7280",
    marginBottom: 12,
  },
  optimizationFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  savingsText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#10b981",
  },
  applyButton: {
    backgroundColor: "#3b82f6",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  applyButtonText: {
    fontSize: 12,
    color: "white",
    fontWeight: "600",
  },
});
