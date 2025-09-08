import React from 'react';
import { Settings, Bell, Search, MoreVertical, ChevronDown, Bot, TrendingUp, GitBranch, Sliders } from 'lucide-react';
import SettingsDropdown from './SettingsDropdown';
import { useAuth } from '../contexts/AuthContext';
import RoleGuard from './RoleGuard';

const Header = ({ currentPage, breadcrumbs, onToggleDrawer }) => {
  const { user, logout } = useAuth();
  const defaultBreadcrumbs = ['FAB Home', 'Personal Account Opening', currentPage];
  const displayBreadcrumbs = breadcrumbs.length > 0 ? breadcrumbs : defaultBreadcrumbs;

  return (
    <header className="fixed top-0 left-64 right-0 z-10 bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4 flex justify-between items-center">
        {/* Left Section - Page Title & Breadcrumbs */}
        <div>
          <h1 className="text-xl font-semibold text-gray-800 mb-1">{currentPage}</h1>
          <div className="text-xs text-gray-500 flex items-center gap-1">
            {displayBreadcrumbs.map((crumb, index) => (
              <React.Fragment key={index}>
                <span className={index === displayBreadcrumbs.length - 1 ? 'text-gray-800 font-semibold' : ''}>
                  {crumb}
                </span>
                {index < displayBreadcrumbs.length - 1 && <span>{'>'}</span>}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Search className="w-5 h-5 text-gray-600" />
          </button>
          
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
          
          <RoleGuard requiredRole="SPECIALIST" showMessage={false}>
            <SettingsDropdown />
          </RoleGuard>
          
          <button 
            onClick={onToggleDrawer}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <MoreVertical className="w-5 h-5 text-gray-600" />
          </button> */}
          
          <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-200">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">{user?.name}</p>
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${user?.roleInfo?.color}`}>
                  {user?.roleInfo?.name}
                </span>
              </div>
            </div>
            <div className="relative group">
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer">
                <span className="text-sm font-medium text-gray-700">{user?.avatar}</span>
              </div>
              
              <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg w-48 text-sm p-2 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="p-3 border-b border-gray-200">
                  <p className="font-medium text-gray-800">{user?.name}</p>
                  <p className="text-xs text-gray-600">{user?.department}</p>
                </div>
                <button
                  onClick={logout}
                  className="w-full text-left p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-700"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;