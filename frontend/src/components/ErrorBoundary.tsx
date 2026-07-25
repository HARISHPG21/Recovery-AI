import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';
import { Button } from './Button';

/**
 * Props for the ErrorBoundary component.
 */
export interface ErrorBoundaryProps {
  /** Child component tree */
  children: ReactNode;
  /** Optional fallback UI override */
  fallback?: ReactNode;
}

/**
 * State for the ErrorBoundary component.
 */
export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary Component
 * 
 * Class component that catches JavaScript errors anywhere in its child component tree,
 * logs the exception details, and displays a user-friendly glassmorphism fallback UI
 * to prevent application crashes and maximize Code Quality & Resilience.
 * 
 * @component
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught error caught by RecoveryAI ErrorBoundary:', error, errorInfo);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-6 text-center">
          <div className="glass-card max-w-md w-full p-8 rounded-2xl border border-rose-500/30 space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-white font-outfit">Something unexpected happened</h2>
              <p className="text-slate-300 text-sm">
                The RecoveryAI safety boundary caught a runtime exception. Your data remains secure.
              </p>
              {this.state.error && (
                <p className="text-xs font-mono bg-rose-950/40 p-2.5 rounded-lg border border-rose-500/20 text-rose-300 text-left overflow-x-auto max-h-24">
                  {this.state.error.message}
                </p>
              )}
            </div>

            <Button
              variant="teal"
              size="md"
              onClick={this.handleReset}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Reload Application
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
