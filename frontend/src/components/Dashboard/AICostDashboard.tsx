import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  LightBulbIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface CostData {
  date: string;
  cost: number;
  predicted: number;
}

interface OptimizationSuggestion {
  id: string;
  title: string;
  description: string;
  potentialSavings: number;
  impact: 'low' | 'medium' | 'high';
  category: string;
}

const mockCostData: CostData[] = [
  { date: '2024-01-15', cost: 2847, predicted: 2900 },
  { date: '2024-01-16', cost: 2923, predicted: 2950 },
  { date: '2024-01-17', cost: 3105, predicted: 3000 },
  { date: '2024-01-18', cost: 2987, predicted: 3050 },
  { date: '2024-01-19', cost: 3123, predicted: 3100 },
  { date: '2024-01-20', cost: 3056, predicted: 3150 },
  { date: '2024-01-21', cost: 3189, predicted: 3200 }
];

const mockOptimizations: OptimizationSuggestion[] = [
  {
    id: '1',
    title: 'Right-size EC2 instances',
    description: 'Switch from m5.large to m5.medium for non-production workloads',
    potentialSavings: 340,
    impact: 'high',
    category: 'Compute'
  },
  {
    id: '2',
    title: 'Enable S3 Intelligent Tiering',
    description: 'Move infrequently accessed data to cheaper storage tiers',
    potentialSavings: 120,
    impact: 'medium',
    category: 'Storage'
  },
  {
    id: '3',
    title: 'Reserve instances for predictable workloads',
    description: 'Purchase 1-year reserved instances for production databases',
    potentialSavings: 450,
    impact: 'high',
    category: 'Compute'
  },
  {
    id: '4',
    title: 'Optimize database queries',
    description: 'Reduce RDS query execution time by 15% through indexing',
    potentialSavings: 85,
    impact: 'medium',
    category: 'Database'
  }
];

export default function AICostDashboard() {
  const [costData, setCostData] = useState<CostData[]>(mockCostData);
  const [optimizations, setOptimizations] = useState<OptimizationSuggestion[]>(mockOptimizations);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d'>('7d');

  const currentCost = costData[costData.length - 1]?.cost || 0;
  const previousCost = costData[costData.length - 2]?.cost || 0;
  const costChange = currentCost - previousCost;
  const costChangePercent = previousCost > 0 ? ((costChange / previousCost) * 100) : 0;

  const totalPotentialSavings = optimizations.reduce((sum, opt) => sum + opt.potentialSavings, 0);

  const fetchCostData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // In real implementation, fetch from /ai-cost endpoint
      console.log('Fetching cost data from /ai-cost endpoint');
    } catch (error) {
      console.error('Failed to fetch cost data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-600 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <ChartBarIcon className="h-5 w-5 text-primary-600 mr-2" />
          AI Cost Dashboard
        </h3>
        <button
          onClick={fetchCostData}
          disabled={isLoading}
          className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
        >
          <ArrowPathIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Cost Summary */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Current Daily Cost</p>
            <p className="text-2xl font-bold text-gray-900">${currentCost.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <div className={`flex items-center text-sm ${costChange >= 0 ? 'text-red-600' : 'text-green-600'}`}>
              {costChange >= 0 ? (
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
              ) : (
                <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
              )}
              {Math.abs(costChangePercent).toFixed(1)}%
            </div>
            <p className="text-xs text-gray-500">vs yesterday</p>
          </div>
        </div>
      </div>

      {/* Cost Trend Chart */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-900">7-Day Cost Trend</h4>
          <div className="flex space-x-1">
            {(['7d', '30d', '90d'] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-2 py-1 text-xs rounded ${
                  selectedPeriod === period
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={costData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Cost']}
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
              />
              <Line 
                type="monotone" 
                dataKey="cost" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
              />
              <Line 
                type="monotone" 
                dataKey="predicted" 
                stroke="#10b981" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center space-x-4 mt-2 text-xs text-gray-500">
          <div className="flex items-center">
            <div className="w-3 h-0.5 bg-blue-500 mr-1"></div>
            Actual
          </div>
          <div className="flex items-center">
            <div className="w-3 h-0.5 bg-green-500 mr-1 border-dashed border-t border-green-500"></div>
            AI Predicted
          </div>
        </div>
      </div>

      {/* AI Optimization Suggestions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-medium text-gray-900 flex items-center">
            <LightBulbIcon className="h-4 w-4 text-yellow-500 mr-1" />
            AI Optimization Suggestions
          </h4>
          <span className="text-xs text-gray-500">
            Potential savings: ${totalPotentialSavings.toLocaleString()}/month
          </span>
        </div>
        
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {optimizations.map((optimization) => (
            <div key={optimization.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h5 className="text-sm font-medium text-gray-900">{optimization.title}</h5>
                  <p className="text-xs text-gray-600 mt-1">{optimization.description}</p>
                  <div className="flex items-center mt-2 space-x-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${getImpactColor(optimization.impact)}`}>
                      {optimization.impact} impact
                    </span>
                    <span className="text-xs text-gray-500">{optimization.category}</span>
                  </div>
                </div>
                <div className="text-right ml-3">
                  <p className="text-sm font-semibold text-green-600">
                    -${optimization.potentialSavings}
                  </p>
                  <p className="text-xs text-gray-500">/month</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}