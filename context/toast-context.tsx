"use client";
import { createContext, useContext, ReactNode } from "react";
// import { Toaster, Toast } from "@/components/ui/toast";
// import { useToast } from "@/components/ui/use-toast";
// import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

type ToastVariant = "default" | "destructive" | "success" | "info" | "warning";

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: ReactNode;
}

interface ToastContextType {
  toast: (options: ToastOptions) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();

  const showToast = ({
    title,
    description,
    variant = "default",
    duration = 5000,
    action,
  }: ToastOptions) => {
    toast({
      title,
      description,
    //   variant,
      duration,
    //   action,
    });
  };

  return (
    <ToastContext.Provider value={{ toast: showToast }}>
      {children}
      <Toaster />
    </ToastContext.Provider>
  );
};

export const useAppToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useAppToast must be used within a ToastProvider");
  }
  return context;
};