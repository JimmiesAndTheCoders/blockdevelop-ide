import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export interface PanelErrorBoundaryProps {
  panelId?: string | undefined;
  title?: string | undefined;
  children?: ReactNode | undefined;
}

interface PanelErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Catches component errors inside individual dockable panels, preventing a single view crash from breaking the IDE layout shell.
 */
export class PanelErrorBoundary extends Component<
  PanelErrorBoundaryProps,
  PanelErrorBoundaryState
> {
  public state: PanelErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): PanelErrorBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error(
      `[PanelErrorBoundary] Panel '${this.props.panelId || 'unknown'}' crashed:`,
      error,
      errorInfo,
    );
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full w-full bg-workspace-panel text-gray-200 p-4 font-sans text-xs select-none">
          <div className="bg-workspace-dark border border-red-500/40 rounded-lg p-4 max-w-sm w-full shadow-lg flex flex-col items-center text-center">
            <AlertTriangle className="w-8 h-8 text-red-400 mb-2 shrink-0" />
            <h3 className="text-xs font-bold text-white mb-1 truncate">
              {this.props.title || 'Panel Rendering Error'}
            </h3>
            <p className="text-2xs text-gray-400 font-mono bg-workspace-panel p-2 rounded w-full border border-workspace-border mb-3 overflow-x-auto text-left max-h-24">
              {this.state.error?.message ||
                'An unexpected rendering error occurred inside this panel.'}
            </p>
            <button
              type="button"
              onClick={this.handleReset}
              className="px-3 py-1.5 bg-brand-blue hover:bg-brand-blueHover text-white text-2xs font-semibold rounded flex items-center gap-1.5 transition select-none"
            >
              <RefreshCw className="w-3 h-3 shrink-0" /> Reset Panel View
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
