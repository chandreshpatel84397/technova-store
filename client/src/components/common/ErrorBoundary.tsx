"use client";

import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("TechNova render error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container-shell py-20">
          <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-red-700 dark:border-red-900/60 dark:bg-red-950/30">
            <h1 className="text-2xl font-bold">Something needs attention</h1>
            <p className="mt-2 text-sm">Refresh the page or try again in a moment.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
