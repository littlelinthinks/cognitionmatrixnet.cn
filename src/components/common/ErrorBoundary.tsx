import { Component, type ReactNode, type ErrorInfo } from "react";
import { FaExclamationTriangle, FaRedo } from "react-icons/fa";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex min-h-[40vh] items-center justify-center p-8">
          <div className="glass-card max-w-md p-8 text-center">
            <FaExclamationTriangle className="mx-auto mb-4 text-4xl text-red-500" />
            <h2 className="mb-2 text-xl font-bold text-ink-primary">
              页面加载异常
            </h2>
            <p className="mb-4 text-body text-ink-secondary">
              抱歉，页面出现意外错误。请尝试刷新页面。
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-cyber inline-flex items-center gap-2 rounded-xl border border-neon-blue/30 bg-neon-blue/10 px-6 py-3 text-caption font-semibold text-neon-blue hover:bg-neon-blue hover:text-cyber-bg"
            >
              <FaRedo />
              刷新页面
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
