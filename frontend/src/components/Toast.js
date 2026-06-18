import React, { createContext, useContext, useState, useCallback } from 'react';

// Create the context
const ToastContext = createContext();

// Custom hook to use the toast anywhere
export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const showToast = useCallback((message, type = 'success') => {
    setToast({ show: true, message, type });
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* The actual visual toast popup */}
      <div className={`toast ${toast.type} ${toast.show ? 'show' : ''}`}>
        <div className="toast-icon">
          {toast.type === 'success' ? '✓' : '✕'}
        </div>
        <span>{toast.message}</span>
      </div>
    </ToastContext.Provider>
  );
};