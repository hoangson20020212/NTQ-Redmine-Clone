import React, { ReactNode } from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    localStorage.clear();
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="flex h-screen w-full flex-col items-center justify-center">
          <h1 className="text-9xl font-extrabold tracking-widest text-gray-900">500</h1>
          <div className="absolute rotate-12 rounded bg-orange px-2 text-sm text-white">Error!</div>
          <button className="mt-5">
            <a href="/" className="active:text-orange-500 group relative inline-block text-sm font-medium text-red-500 focus:outline-none focus:ring">
              <span className="absolute inset-0 translate-x-0.5 translate-y-0.5 bg-orange transition-transform group-hover:translate-y-0 group-hover:translate-x-0" />
              <span className="relative block border border-current px-8 py-3">
                <span>Quay lại trang chủ</span>
              </span>
            </a>
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
