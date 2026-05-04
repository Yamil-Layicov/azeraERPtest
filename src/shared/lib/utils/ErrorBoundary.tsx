import { ErrorPage } from "@/pages/error-page/ui"; 
import React, { type ReactNode } from "react";
import { useLocation } from "react-router-dom";

interface ErrorBoundaryProps {
  children: ReactNode;
  locationKey?: string; 
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

const initialErrorState: ErrorBoundaryState = { 
  hasError: false, 
  error: undefined 
};


class ErrorBoundaryInner extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = initialErrorState;
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (this.props.locationKey !== prevProps.locationKey) {
      if (this.state.hasError) {
        this.setState(initialErrorState);
      }
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (import.meta.env.PROD) {
      console.error(' Critical Error:', error, errorInfo);
    }
  }

  handleRetry = () => this.setState(initialErrorState);

  render() {
    if (this.state.hasError) {
      return <ErrorPage error={this.state.error} onRetry={this.handleRetry} />;
    }

    return this.props.children;
  }
}

export const ErrorBoundary = ({ children }: { children: ReactNode }) => {
  const location = useLocation(); 
  
  return (
    <ErrorBoundaryInner locationKey={location.pathname}>
      {children}
    </ErrorBoundaryInner>
  );
};