import React, { useState, useEffect } from 'react';
import { 
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  ClockIcon,
  ArrowPathIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface Alert {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'warning' | 'info';
  status: 'active' | 'acknowledged' | 'resolved';
  timestamp: string;
  resource: string;
  category: string;
}

const mockAlerts: Alert[] = [
  {
    id: '1',
    title: 'High CPU Usage',
    description: 'Web server CPU usage has exceeded 90% for the last 15 minutes',
    severity: 'critical',
    status: 'active',
    timestamp: '2024-01-21T14:30:00Z',
    resource: 'aws-web-server-01',
    category: 'Performance'
  },
  {
    id: '2',
    title: 'Database Connection Pool Exhausted',
    description: 'PostgreSQL connection pool is at 95% capacity',
    severity: 'warning',
    status: 'active',
    timestamp: '2024-01-21T14:25:00Z',
    resource: 'gcp-postgres-primary',
    category: 'Database'
  },
  {
    id: '3',
    title: 'SSL Certificate Expiring',
    description: 'SSL certificate for api.cloudopspro.com expires in 7 days',
    severity: 'warning',
    status: 'acknowledged',
    timestamp: '2024-01-21T10:15:00Z',
    resource: 'api.cloudopspro.com',
    category: 'Security'
  },
  {
    id: '4',
    title: 'Backup Job Completed',
    description: 'Daily backup job completed successfully',
    severity: 'info',
    status: 'resolved',
    timestamp: '2024-01-21T06:00:00Z',
    resource: 'backup-service',
    category: 'Backup'
  },
  {
    id: '5',
    title: 'Memory Usage High',
    description: 'Application server memory usage is at 85%',
    severity: 'warning',
    status: 'active',
    timestamp: '2024-01-21T13:45:00Z',
    resource: 'azure-app-server-02',
    category: 'Performance'
  }
];

export default function AlertsCard() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');

  const fetchAlerts = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to /alerts endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Fetching alerts from /alerts endpoint');
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
      default:
        return <InformationCircleIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'info':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-red-600 bg-red-100';
      case 'acknowledged':
        return 'text-yellow-600 bg-yellow-100';
      case 'resolved':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircleIcon className="h-4 w-4" />;
      default:
        return <ClockIcon className="h-4 w-4" />;
    }
  };

  const filteredAlerts = alerts.filter(alert => 
    filter === 'all' || alert.severity === filter
  );

  const alertCounts = {
    critical: alerts.filter(a => a.severity === 'critical' && a.status === 'active').length,
    warning: alerts.filter(a => a.severity === 'warning' && a.status === 'active').length,
    info: alerts.filter(a => a.severity === 'info' && a.status === 'active').length,
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const alertTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - alertTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <ExclamationTriangleIcon className="h-5 w-5 text-primary-600 mr-2" />
          Alerts
        </h3>
        <button
          onClick={fetchAlerts}
          disabled={isLoading}
          className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
        >
          <ArrowPathIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="text-center p-2 bg-red-50 rounded-lg">
          <p className="text-lg font-bold text-red-600">{alertCounts.critical}</p>
          <p className="text-xs text-red-600">Critical</p>
        </div>
        <div className="text-center p-2 bg-yellow-50 rounded-lg">
          <p className="text-lg font-bold text-yellow-600">{alertCounts.warning}</p>
          <p className="text-xs text-yellow-600">Warning</p>
        </div>
        <div className="text-center p-2 bg-blue-50 rounded-lg">
          <p className="text-lg font-bold text-blue-600">{alertCounts.info}</p>
          <p className="text-xs text-blue-600">Info</p>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="flex space-x-1 mb-4">
        {(['all', 'critical', 'warning', 'info'] as const).map((filterType) => (
          <button
            key={filterType}
            onClick={() => setFilter(filterType)}
            className={`px-3 py-1 text-xs rounded-full capitalize ${
              filter === filterType
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            {filterType}
          </button>
        ))}
      </div>

      {/* Alerts List */}
      <div className="space-y-3 max-h-80 overflow-y-auto">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-3 rounded-lg border-2 ${getSeverityColor(alert.severity)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-2 flex-1">
                {getSeverityIcon(alert.severity)}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {alert.title}
                  </h4>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {alert.description}
                  </p>
                  <div className="flex items-center mt-2 space-x-2">
                    <span className="text-xs text-gray-500">{alert.resource}</span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">{alert.category}</span>
                  </div>
                </div>
              </div>
              <div className="text-right ml-2">
                <div className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${getStatusColor(alert.status)}`}>
                  {getStatusIcon(alert.status)}
                  <span className="ml-1 capitalize">{alert.status}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {formatTimeAgo(alert.timestamp)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredAlerts.length === 0 && (
        <div className="text-center py-8">
          <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-2" />
          <p className="text-gray-600">No {filter === 'all' ? '' : filter} alerts</p>
        </div>
      )}
    </div>
  );
}