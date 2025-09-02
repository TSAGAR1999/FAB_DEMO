import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Role hierarchy and permissions
const ROLES = {
  EXECUTIVE: {
    level: 5,
    name: 'Executive',
    permissions: ['view_all', 'override_all', 'configure_agents', 'view_audit_complete', 'manage_users'],
    color: 'bg-red-50 text-red-700 border-red-200'
  },
  MANAGER: {
    level: 4,
    name: 'Manager',
    permissions: ['view_team', 'escalate', 'reassign', 'view_roi', 'approve_flags'],
    color: 'bg-yellow-50 text-yellow-700 border-yellow-200'
  },
  SPECIALIST: {
    level: 3,
    name: 'Specialist',
    permissions: ['review_applications', 'flag_issues', 'view_compliance', 'escalate_cases'],
    color: 'bg-green-50 text-green-700 border-green-200'
  },
  OPERATOR: {
    level: 2,
    name: 'Operator',
    permissions: ['view_assigned', 'upload_documents', 'update_status'],
    color: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  SUPPORT: {
    level: 1,
    name: 'Support',
    permissions: ['view_readonly', 'assist_documents'],
    color: 'bg-gray-50 text-gray-700 border-gray-200'
  }
};

// Mock users for demonstration
const MOCK_USERS = [
  {
    id: 1,
    username: 'ahmed.hassan',
    password: 'password123',
    name: 'Ahmed Hassan',
    role: 'EXECUTIVE',
    department: 'Operations',
    avatar: 'AH'
  },
  {
    id: 2,
    username: 'mohammed.ali',
    password: 'password123',
    name: 'Mohammed Ali',
    role: 'SPECIALIST',
    department: 'Risk Assessment',
    avatar: 'MA'
  },
  {
    id: 3,
    username: 'fatima.ahmed',
    password: 'password123',
    name: 'Fatima Ahmed',
    role: 'MANAGER',
    department: 'Compliance',
    avatar: 'FA'
  },
  {
    id: 4,
    username: 'ali.hassan',
    password: 'password123',
    name: 'Ali Hassan',
    role: 'OPERATOR',
    department: 'Document Processing',
    avatar: 'AH'
  },
  {
    id: 5,
    username: 'aisha.mohamed',
    password: 'password123',
    name: 'Aisha Mohamed',
    role: 'SUPPORT',
    department: 'Customer Support',
    avatar: 'AM'
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fabAccountTypes,setFabAccountTypes] = useState([]);
  const [email,setEmail] = useState("");
  const [allformsData,setAllFormsdata] = useState({});
  let [extractedData,setExtractedData] = useState({});

  useEffect(() => {
    // Check for stored auth on mount
    const storedUser = localStorage.getItem('fab_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (username, password) => {
    // Simulate API call
    const foundUser = MOCK_USERS.find(
      u => u.username === username && u.password === password
    );

    if (foundUser) {
      const userWithRole = {
        ...foundUser,
        roleInfo: ROLES[foundUser.role]
      };
      setUser(userWithRole);
      localStorage.setItem('fab_user', JSON.stringify(userWithRole));
      return { success: true };
    } else {
      return { success: false, error: 'Invalid credentials' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('fab_user');
  };

  const hasPermission = (permission) => {
    if (!user || !user.roleInfo) return false;
    return user.roleInfo.permissions.includes(permission);
  };

  const hasMinimumRole = (requiredRole) => {
    if (!user || !user.roleInfo) return false;
    return user.roleInfo.level >= ROLES[requiredRole].level;
  };

  const handleFabAccountTypes = (accounts) => {
    setFabAccountTypes(accounts)
  };

  const handleEmail= (email) => {
    setEmail(email)
  };

  const handleAllFormsdata = (formdata)=>{
    setAllFormsdata(prev=>({...prev,...formdata}))
  }
  const handleExtractedData = (data)=>{
    setExtractedData(prev=>({...prev,...data}))
  }

  const value = {
    user,
    login,
    logout,
    hasPermission,
    hasMinimumRole,
    isLoading,
    roles: ROLES,
    fabAccountTypes,
    handleFabAccountTypes,
    handleEmail,
    email,
    handleAllFormsdata,
    allformsData,
    handleExtractedData,
    extractedData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};