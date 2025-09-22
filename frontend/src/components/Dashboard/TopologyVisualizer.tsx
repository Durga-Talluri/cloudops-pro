import React, { useState, useEffect } from 'react';
import { 
  ServerIcon, 
  CircleStackIcon, 
  CloudIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

interface CloudResource {
  id: string;
  name: string;
  type: 'server' | 'database' | 'storage' | 'network' | 'container';
  status: 'running' | 'stopped' | 'pending' | 'error';
  provider: 'aws' | 'gcp' | 'azure';
  region: string;
  cost: number;
}

interface TopologyData {
  aws: CloudResource[];
  gcp: CloudResource[];
  azure: CloudResource[];
}

const mockTopologyData: TopologyData = {
  aws: [
    { id: 'aws-vm1', name: 'Web Server', type: 'server', status: 'running', provider: 'aws', region: 'us-east-1', cost: 120 },
    { id: 'aws-db1', name: 'Primary DB', type: 'database', status: 'running', provider: 'aws', region: 'us-east-1', cost: 340 },
    { id: 'aws-s3', name: 'File Storage', type: 'storage', status: 'running', provider: 'aws', region: 'us-east-1', cost: 45 },
    { id: 'aws-lb', name: 'Load Balancer', type: 'network', status: 'running', provider: 'aws', region: 'us-east-1', cost: 18 }
  ],
  gcp: [
    { id: 'gcp-vm1', name: 'App Server', type: 'server', status: 'running', provider: 'gcp', region: 'us-central1', cost: 95 },
    { id: 'gcp-db1', name: 'Analytics DB', type: 'database', status: 'running', provider: 'gcp', region: 'us-central1', cost: 280 },
    { id: 'gcp-k8s', name: 'Kubernetes', type: 'container', status: 'running', provider: 'gcp', region: 'us-central1', cost: 156 }
  ],
  azure: [
    { id: 'azure-vm1', name: 'Backup Server', type: 'server', status: 'stopped', provider: 'azure', region: 'eastus', cost: 0 },
    { id: 'azure-db1', name: 'Cache DB', type: 'database', status: 'running', provider: 'azure', region: 'eastus', cost: 78 },
    { id: 'azure-storage', name: 'Archive Storage', type: 'storage', status: 'running', provider: 'azure', region: 'eastus', cost: 23 }
  ]
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'running':
      return <CheckCircleIcon className="h-4 w-4 text-green-500" />;
    case 'stopped':
      return <div className="h-4 w-4 rounded-full bg-gray-400" />;
    case 'error':
      return <ExclamationTriangleIcon className="h-4 w-4 text-red-500" />;
    case 'pending':
      return <div className="h-4 w-4 rounded-full bg-yellow-400 animate-pulse" />;
    default:
      return <div className="h-4 w-4 rounded-full bg-gray-400" />;
  }
};

const getResourceIcon = (type: string) => {
  switch (type) {
    case 'server':
      return <ServerIcon className="h-5 w-5" />;
    case 'database':
      return <CircleStackIcon className="h-5 w-5" />;
    case 'storage':
      return <CloudIcon className="h-5 w-5" />;
    default:
      return <ServerIcon className="h-5 w-5" />;
  }
};

const getProviderColor = (provider: string) => {
  switch (provider) {
    case 'aws':
      return 'border-orange-200 bg-orange-50';
    case 'gcp':
      return 'border-blue-200 bg-blue-50';
    case 'azure':
      return 'border-blue-300 bg-blue-100';
    default:
      return 'border-gray-200 bg-gray-50';
  }
};

export default function TopologyVisualizer() {
  const [topologyData, setTopologyData] = useState<TopologyData>(mockTopologyData);
  const [selectedResource, setSelectedResource] = useState<CloudResource | null>(null);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');

  useEffect(() => {
    // Simulate data fetching
    const interval = setInterval(() => {
      // Randomly update some resource statuses for demo
      setTopologyData(prev => ({
        ...prev,
        aws: prev.aws.map(resource => ({
          ...resource,
          status: Math.random() > 0.9 ? 
            (resource.status === 'running' ? 'error' : 'running') : 
            resource.status
        }))
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const totalCost = Object.values(topologyData)
    .flat()
    .reduce((sum, resource) => sum + resource.cost, 0);

  return (
    <div className="space-y-6">
      {/* Cost Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">Total Infrastructure Cost</h3>
          <span className="text-2xl font-bold text-primary-600">${totalCost.toLocaleString()}/month</span>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">AWS</p>
            <p className="text-lg font-semibold text-orange-600">
              ${topologyData.aws.reduce((sum, r) => sum + r.cost, 0)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">GCP</p>
            <p className="text-lg font-semibold text-blue-600">
              ${topologyData.gcp.reduce((sum, r) => sum + r.cost, 0)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">Azure</p>
            <p className="text-lg font-semibold text-blue-700">
              ${topologyData.azure.reduce((sum, r) => sum + r.cost, 0)}
            </p>
          </div>
        </div>
      </div>

      {/* Topology Visualization */}
      <div className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* AWS Resources */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-orange-600 flex items-center">
              <CloudIcon className="h-5 w-5 mr-2" />
              AWS (us-east-1)
            </h4>
            <div className="space-y-2">
              {topologyData.aws.map((resource) => (
                <div
                  key={resource.id}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${getProviderColor(resource.provider)}`}
                  onClick={() => setSelectedResource(resource)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getResourceIcon(resource.type)}
                      <div>
                        <p className="font-medium text-gray-900">{resource.name}</p>
                        <p className="text-sm text-gray-600 capitalize">{resource.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(resource.status)}
                      <span className="text-sm font-medium">${resource.cost}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* GCP Resources */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-blue-600 flex items-center">
              <CloudIcon className="h-5 w-5 mr-2" />
              GCP (us-central1)
            </h4>
            <div className="space-y-2">
              {topologyData.gcp.map((resource) => (
                <div
                  key={resource.id}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${getProviderColor(resource.provider)}`}
                  onClick={() => setSelectedResource(resource)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getResourceIcon(resource.type)}
                      <div>
                        <p className="font-medium text-gray-900">{resource.name}</p>
                        <p className="text-sm text-gray-600 capitalize">{resource.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(resource.status)}
                      <span className="text-sm font-medium">${resource.cost}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Azure Resources */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-blue-700 flex items-center">
              <CloudIcon className="h-5 w-5 mr-2" />
              Azure (eastus)
            </h4>
            <div className="space-y-2">
              {topologyData.azure.map((resource) => (
                <div
                  key={resource.id}
                  className={`p-3 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${getProviderColor(resource.provider)}`}
                  onClick={() => setSelectedResource(resource)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getResourceIcon(resource.type)}
                      <div>
                        <p className="font-medium text-gray-900">{resource.name}</p>
                        <p className="text-sm text-gray-600 capitalize">{resource.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(resource.status)}
                      <span className="text-sm font-medium">${resource.cost}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Resource Details Modal */}
      {selectedResource && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Resource Details</h3>
              <button
                onClick={() => setSelectedResource(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{selectedResource.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Type</p>
                <p className="font-medium capitalize">{selectedResource.type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Provider</p>
                <p className="font-medium uppercase">{selectedResource.provider}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Region</p>
                <p className="font-medium">{selectedResource.region}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(selectedResource.status)}
                  <span className="font-medium capitalize">{selectedResource.status}</span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Monthly Cost</p>
                <p className="font-medium text-lg">${selectedResource.cost}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}