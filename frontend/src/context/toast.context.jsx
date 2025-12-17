"use client";

import { createContext, useContext } from "react";
import { Toaster, toast } from "sonner";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const addToast = (message, type = "info", duration = 3000) => {
    switch (type) {
      case "success":
        toast.success(message, { duration });
        break;
      case "error":
        toast.error(message, { duration });
        break;
      case "warning":
        toast.warning(message, { duration });
        break;
      default:
        toast(message, { duration });
    }
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <Toaster
        position="bottom-right"
        theme="system"
        richColors
        closeButton
        expand={true}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
