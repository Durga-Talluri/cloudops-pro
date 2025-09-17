import React, { useState, useEffect } from 'react';
import { 
  PlayIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ArrowRightIcon,
  CodeBracketIcon,
  WrenchScrewdriverIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';

interface PipelineStage {
  id: string;
  name: string;
  description: string;
  status: 'success' | 'failed' | 'pending' | 'running';
  duration?: number;
  timestamp?: string;
  logs?: string[];
}

interface Pipeline {
  id: string;
  name: string;
  branch: string;
  commit: string;
  status: 'success' | 'failed' | 'pending' | 'running';
  stages: PipelineStage[];
  startedAt: string;
  completedAt?: string;
  triggeredBy: string;
}

const mockPipelines: Pipeline[] = [
  {
    id: '1',
    name: 'Production Deployment',
    branch: 'main',
    commit: 'a1b2c3d',
    status: 'success',
    startedAt: '2024-01-21T14:00:00Z',
    completedAt: '2024-01-21T14:15:00Z',
    triggeredBy: 'john.doe',
    stages: [
      {
        id: 'build',
        name: 'Build',
        description: 'Compile and package application',
        status: 'success',
        duration: 180,
        timestamp: '2024-01-21T14:03:00Z',
        logs: ['Installing dependencies...', 'Building application...', 'Build completed successfully']
      },
      {
        id: 'test',
        name: 'Test',
        description: 'Run unit and integration tests',
        status: 'success',
        duration: 240,
        timestamp: '2024-01-21T14:07:00Z',
        logs: ['Running unit tests...', 'Running integration tests...', 'All tests passed']
      },
      {
        id: 'deploy',
        name: 'Deploy',
        description: 'Deploy to production environment',
        status: 'success',
        duration: 300,
        timestamp: '2024-01-21T14:12:00Z',
        logs: ['Deploying to production...', 'Health checks passed', 'Deployment successful']
      }
    ]
  },
  {
    id: '2',
    name: 'Feature Branch Build',
    branch: 'feature/new-dashboard',
    commit: 'e4f5g6h',
    status: 'running',
    startedAt: '2024-01-21T14:20:00Z',
    triggeredBy: 'jane.smith',
    stages: [
      {
        id: 'build',
        name: 'Build',
        description: 'Compile and package application',
        status: 'success',
        duration: 165,
        timestamp: '2024-01-21T14:23:00Z',
        logs: ['Installing dependencies...', 'Building application...', 'Build completed successfully']
      },
      {
        id: 'test',
        name: 'Test',
        description: 'Run unit and integration tests',
        status: 'running',
        timestamp: '2024-01-21T14:26:00Z',
        logs: ['Running unit tests...', 'Running integration tests...']
      },
      {
        id: 'deploy',
        name: 'Deploy',
        description: 'Deploy to staging environment',
        status: 'pending'
      }
    ]
  },
  {
    id: '3',
    name: 'Hotfix Deployment',
    branch: 'hotfix/security-patch',
    commit: 'i7j8k9l',
    status: 'failed',
    startedAt: '2024-01-21T13:45:00Z',
    completedAt: '2024-01-21T13:52:00Z',
    triggeredBy: 'mike.wilson',
    stages: [
      {
        id: 'build',
        name: 'Build',
        description: 'Compile and package application',
        status: 'success',
        duration: 120,
        timestamp: '2024-01-21T13:47:00Z',
        logs: ['Installing dependencies...', 'Building application...', 'Build completed successfully']
      },
      {
        id: 'test',
        name: 'Test',
        description: 'Run unit and integration tests',
        status: 'failed',
        duration: 180,
        timestamp: '2024-01-21T13:50:00Z',
        logs: ['Running unit tests...', 'Running integration tests...', 'Test failed: Security validation error']
      },
      {
        id: 'deploy',
        name: 'Deploy',
        description: 'Deploy to production environment',
        status: 'pending'
      }
    ]
  }
];

export default function GitOpsWorkflow() {
  const [pipelines, setPipelines] = useState<Pipeline[]>(mockPipelines);
  const [selectedPipeline, setSelectedPipeline] = useState<Pipeline | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'running':
        return <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'failed':
        return 'bg-red-50 border-red-200';
      case 'running':
        return 'bg-blue-50 border-blue-200';
      case 'pending':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getStageIcon = (stageId: string) => {
    switch (stageId) {
      case 'build':
        return <CodeBracketIcon className="h-4 w-4" />;
      case 'test':
        return <WrenchScrewdriverIcon className="h-4 w-4" />;
      case 'deploy':
        return <RocketLaunchIcon className="h-4 w-4" />;
      default:
        return <PlayIcon className="h-4 w-4" />;
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '-';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <PlayIcon className="h-5 w-5 text-primary-600 mr-2" />
          GitOps Workflow
        </h3>
        <button
          onClick={() => setIsLoading(true)}
          disabled={isLoading}
          className="px-3 py-1 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
        >
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Pipeline List */}
      <div className="space-y-4">
        {pipelines.map((pipeline) => (
          <div
            key={pipeline.id}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${getStatusColor(pipeline.status)}`}
            onClick={() => setSelectedPipeline(pipeline)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                {getStatusIcon(pipeline.status)}
                <div>
                  <h4 className="font-medium text-gray-900">{pipeline.name}</h4>
                  <p className="text-sm text-gray-600">
                    {pipeline.branch} • {pipeline.commit} • by {pipeline.triggeredBy}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {formatTimeAgo(pipeline.startedAt)}
                </p>
                {pipeline.completedAt && (
                  <p className="text-xs text-gray-400">
                    Duration: {formatDuration(
                      Math.floor((new Date(pipeline.completedAt).getTime() - new Date(pipeline.startedAt).getTime()) / 1000)
                    )}
                  </p>
                )}
              </div>
            </div>

            {/* Pipeline Stages */}
            <div className="flex items-center space-x-2">
              {pipeline.stages.map((stage, index) => (
                <React.Fragment key={stage.id}>
                  <div className="flex items-center space-x-2">
                    <div className={`p-2 rounded-lg ${getStatusColor(stage.status)}`}>
                      {getStageIcon(stage.id)}
                    </div>
                    <div className="text-xs">
                      <p className="font-medium text-gray-900">{stage.name}</p>
                      {stage.duration && (
                        <p className="text-gray-500">{formatDuration(stage.duration)}</p>
                      )}
                    </div>
                  </div>
                  {index < pipeline.stages.length - 1 && (
                    <ArrowRightIcon className="h-4 w-4 text-gray-400" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline Details Modal */}
      {selectedPipeline && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                {getStatusIcon(selectedPipeline.status)}
                <span className="ml-2">{selectedPipeline.name}</span>
              </h3>
              <button
                onClick={() => setSelectedPipeline(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600">Branch</p>
                <p className="font-medium">{selectedPipeline.branch}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Commit</p>
                <p className="font-medium font-mono">{selectedPipeline.commit}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Triggered By</p>
                <p className="font-medium">{selectedPipeline.triggeredBy}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Started</p>
                <p className="font-medium">{new Date(selectedPipeline.startedAt).toLocaleString()}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Pipeline Stages</h4>
              <div className="space-y-4">
                {selectedPipeline.stages.map((stage) => (
                  <div key={stage.id} className={`p-4 rounded-lg border ${getStatusColor(stage.status)}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getStageIcon(stage.id)}
                        <h5 className="font-medium text-gray-900">{stage.name}</h5>
                        {getStatusIcon(stage.status)}
                      </div>
                      <div className="text-right">
                        {stage.duration && (
                          <p className="text-sm text-gray-600">{formatDuration(stage.duration)}</p>
                        )}
                        {stage.timestamp && (
                          <p className="text-xs text-gray-500">{formatTimeAgo(stage.timestamp)}</p>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{stage.description}</p>
                    
                    {stage.logs && stage.logs.length > 0 && (
                      <div className="bg-gray-900 text-green-400 p-3 rounded-lg font-mono text-xs">
                        {stage.logs.map((log, index) => (
                          <div key={index} className="mb-1">
                            <span className="text-gray-500">[{new Date().toLocaleTimeString()}]</span> {log}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}