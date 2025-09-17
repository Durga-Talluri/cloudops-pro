import React, { useState, useEffect } from 'react';
import { 
  ChartBarIcon, 
  ShieldCheckIcon, 
  ExclamationTriangleIcon,
  CloudIcon,
  ServerIcon,
  DatabaseIcon
} from '@heroicons/react/24/outline';
import AICostDashboard from '@/components/Dashboard/AICostDashboard';
import ComplianceMonitor from '@/components/Dashboard/ComplianceMonitor';
import AlertsCard from '@/components/Dashboard/AlertsCard';
import TopologyVisualizer from '@/components/Dashboard/TopologyVisualizer';

interface DashboardStats {
  totalResources: number;
  activeAlerts: number;
  complianceScore: number;
  monthlyCost: number;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalResources: 0,
    activeAlerts: 0,
    complianceScore: 0,
    monthlyCost: 0
  });

  useEffect(() => {
    // Mock data loading
    setStats({
      totalResources: 24,
      activeAlerts: 3,
      complianceScore: 87,
      monthlyCost: 2847.50
    });
  }, []);

  const statCards = [
    {
      name: 'Total Resources',
      value: stats.totalResources,
      icon: ServerIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'Active Alerts',
      value: stats.activeAlerts,
      icon: ExclamationTriangleIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      name: 'Compliance Score',
      value: `${stats.complianceScore}%`,
      icon: ShieldCheckIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      name: 'Monthly Cost',
      value: `$${stats.monthlyCost.toLocaleString()}`,
      icon: ChartBarIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <CloudIcon className="h-8 w-8 text-primary-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">CloudOps Pro</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Last updated: {new Date().toLocaleTimeString()}</span>
              <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => (
            <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Dashboard Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* AI Cost Dashboard */}
          <div className="lg:col-span-1">
            <AICostDashboard />
          </div>

          {/* Compliance Monitor */}
          <div className="lg:col-span-1">
            <ComplianceMonitor />
          </div>

          {/* Alerts Card */}
          <div className="lg:col-span-1">
            <AlertsCard />
          </div>
        </div>

        {/* Cloud Infrastructure Topology Visualizer */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <DatabaseIcon className="h-6 w-6 text-primary-600 mr-2" />
              Cloud Infrastructure Topology
            </h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
                2D View
              </button>
              <button className="px-3 py-1 text-sm bg-primary-100 text-primary-700 rounded-md hover:bg-primary-200">
                3D View
              </button>
            </div>
          </div>
          <TopologyVisualizer />
        </div>
      </div>
    </div>
  );
}