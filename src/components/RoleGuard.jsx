import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Shield, AlertTriangle } from 'lucide-react';

const RoleGuard = ({ 
  children, 
  requiredRole = null, 
  requiredPermission = null, 
  fallback = null,
  showMessage = true 
}) => {
  const { user, hasMinimumRole, hasPermission } = useAuth();

  // Check role-based access
  if (requiredRole && !hasMinimumRole(requiredRole)) {
    if (fallback) return fallback;
    
    if (showMessage) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">Access Restricted</h3>
            <p className="text-sm text-gray-600 mb-4">
              This feature requires {requiredRole} level access or higher.
            </p>
            <p className="text-xs text-gray-500">
              Your current role: {user?.roleInfo?.name || 'Unknown'}
            </p>
          </div>
        </div>
      );
    }
    
    return null;
  }

  // Check permission-based access
  if (requiredPermission && !hasPermission(requiredPermission)) {
    if (fallback) return fallback;
    
    if (showMessage) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">Permission Required</h3>
            <p className="text-sm text-gray-600 mb-4">
              You don't have permission to access this feature.
            </p>
            <p className="text-xs text-gray-500">
              Required permission: {requiredPermission}
            </p>
          </div>
        </div>
      );
    }
    
    return null;
  }

  return children;
};

export default RoleGuard;