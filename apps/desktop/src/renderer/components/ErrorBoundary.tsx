import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Uncaught React UI Error:', error, errorInfo);
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-workspace-dark text-gray-200 p-6">
          <div className="bg-workspace-panel border border-red-500/40 rounded-lg p-6 max-w-md w-full shadow-2xl flex flex-col items-center text-center">
            <AlertTriangle className="w-12 h-12 text-red-400 mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">IDE Workspace Render Error</h2>
            <p className="text-xs text-gray-400 font-mono bg-workspace-dark p-3 rounded w-full border border-workspace-border mb-6 overflow-x-auto text-left">
              {this.state.error?.message || 'An unexpected rendering error occurred inside React.'}
            </p>
            <button
              onClick={this.handleReload}
              className="px-4 py-2 bg-workspace-accent hover:bg-workspace-accentHover text-white text-xs font-semibold rounded flex items-center gap-2 transition"
            >
              <RefreshCw className="w-4 h-4" /> Reload Workspace
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
