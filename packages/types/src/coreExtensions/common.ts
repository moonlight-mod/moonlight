export type ErrorBoundaryProps = React.PropsWithChildren<{
  noop?: boolean;
  fallback?: React.FC<any>;
  message?: string;
}>;

export interface ErrorBoundaryState {
  errored: boolean;
  error?: Error;
  componentStack?: string;
}
