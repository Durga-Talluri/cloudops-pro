import React, { useState, useEffect } from 'react';
import { 
  ShieldCheckIcon, 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface ComplianceStandard {
  id: string;
  name: string;
  description: string;
  status: 'pass' | 'fail' | 'warning';
  score: number;
  lastChecked: string;
  issues: ComplianceIssue[];
}

interface ComplianceIssue {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  remediation: string;
}

const mockComplianceData: ComplianceStandard[] = [
  {
    id: 'soc2',
    name: 'SOC 2 Type II',
    description: 'Security, availability, and confidentiality controls',
    status: 'pass',
    score: 94,
    lastChecked: '2024-01-20T10:30:00Z',
    issues: [
      {
        id: 'soc2-1',
        title: 'Access logging incomplete',
        severity: 'medium',
        description: 'Some admin actions are not being logged',
        remediation: 'Enable comprehensive audit logging for all admin operations'
      }
    ]
  },
  {
    id: 'hipaa',
    name: 'HIPAA',
    description: 'Health Insurance Portability and Accountability Act',
    status: 'pass',
    score: 98,
    lastChecked: '2024-01-19T14:15:00Z',
    issues: [
      {
        id: 'hipaa-1',
        title: 'Data encryption at rest',
        severity: 'low',
        description: 'Some backup files are not encrypted',
        remediation: 'Enable encryption for all backup storage'
      }
    ]
  },
  {
    id: 'pci',
    name: 'PCI DSS',
    description: 'Payment Card Industry Data Security Standard',
    status: 'warning',
    score: 87,
    lastChecked: '2024-01-18T09:45:00Z',
    issues: [
      {
        id: 'pci-1',
        title: 'Network segmentation insufficient',
        severity: 'high',
        description: 'Payment processing network not properly isolated',
        remediation: 'Implement proper network segmentation for cardholder data environment'
      },
      {
        id: 'pci-2',
        title: 'Vulnerability scanning outdated',
        severity: 'medium',
        description: 'Last vulnerability scan was 45 days ago',
        remediation: 'Schedule monthly vulnerability scans and implement automated scanning'
      }
    ]
  }
];

export default function ComplianceMonitor() {
  const [complianceData, setComplianceData] = useState<ComplianceStandard[]>(mockComplianceData);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStandard, setSelectedStandard] = useState<ComplianceStandard | null>(null);

  const fetchComplianceData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to /compliance endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Fetching compliance data from /compliance endpoint');
    } catch (error) {
      console.error('Failed to fetch compliance data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      case 'fail':
        return <XCircleIcon className="h-6 w-6 text-red-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />;
      default:
        return <ExclamationTriangleIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'bg-green-50 border-green-200';
      case 'fail':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 95) return 'text-green-600';
    if (score >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-600 bg-red-50';
      case 'high':
        return 'text-red-500 bg-red-50';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50';
      case 'low':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const overallScore = Math.round(
    complianceData.reduce((sum, standard) => sum + standard.score, 0) / complianceData.length
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <ShieldCheckIcon className="h-5 w-5 text-primary-600 mr-2" />
          Compliance Monitor
        </h3>
        <button
          onClick={fetchComplianceData}
          disabled={isLoading}
          className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
        >
          <ArrowPathIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Overall Score */}
      <div className="mb-6">
        <div className="text-center">
          <p className="text-sm text-gray-600">Overall Compliance Score</p>
          <p className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
            {overallScore}%
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full ${
                overallScore >= 95 ? 'bg-green-500' : 
                overallScore >= 85 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${overallScore}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Compliance Standards */}
      <div className="space-y-4">
        {complianceData.map((standard) => (
          <div
            key={standard.id}
            className={`p-4 rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${getStatusColor(standard.status)}`}
            onClick={() => setSelectedStandard(standard)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStatusIcon(standard.status)}
                <div>
                  <h4 className="font-medium text-gray-900">{standard.name}</h4>
                  <p className="text-sm text-gray-600">{standard.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${getScoreColor(standard.score)}`}>
                  {standard.score}%
                </p>
                <p className="text-xs text-gray-500">
                  {standard.issues.length} issue{standard.issues.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Standard Details Modal */}
      {selectedStandard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold flex items-center">
                {getStatusIcon(selectedStandard.status)}
                <span className="ml-2">{selectedStandard.name}</span>
              </h3>
              <button
                onClick={() => setSelectedStandard(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">{selectedStandard.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  Last checked: {new Date(selectedStandard.lastChecked).toLocaleDateString()}
                </span>
                <span className={`text-lg font-bold ${getScoreColor(selectedStandard.score)}`}>
                  {selectedStandard.score}%
                </span>
              </div>
            </div>

            {selectedStandard.issues.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Issues Found</h4>
                <div className="space-y-3">
                  {selectedStandard.issues.map((issue) => (
                    <div key={issue.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-medium text-gray-900">{issue.title}</h5>
                        <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(issue.severity)}`}>
                          {issue.severity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{issue.description}</p>
                      <div className="bg-blue-50 p-2 rounded">
                        <p className="text-xs text-blue-800">
                          <strong>Remediation:</strong> {issue.remediation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedStandard.issues.length === 0 && (
              <div className="text-center py-8">
                <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-2" />
                <p className="text-gray-600">No issues found for this standard</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}