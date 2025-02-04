import React from "@moonlight-mod/wp/react";
import { ErrorBoundaryProps, ErrorBoundaryState } from "@moonlight-mod/types/coreExtensions/common";

const logger = moonlight.getLogger("ErrorBoundary");

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      errored: false,
      error: undefined,
      componentStack: undefined
    };
  }

  static getDerivedStateFromError(error: Error) {
    return {
      errored: true,
      error
    };
  }

  componentDidCatch(error: Error, { componentStack }: { componentStack: string }) {
    logger.error(`${error}\n\nComponent stack:\n${componentStack}`);
    this.setState({ error, componentStack });
  }

  render() {
    const { noop, fallback: FallbackComponent, children, message } = this.props;
    const { errored, error, componentStack } = this.state;

    if (noop) return null;
    if (FallbackComponent) return <FallbackComponent children={children} {...this.state} />;

    if (errored) {
      return (
        <div className={`moonlight-error-boundary`}>
          <h3>{message ?? "An error occurred rendering this component:"}</h3>
          <code className="hljs">{`${error}\n\nComponent stack:\n${componentStack}`}</code>
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
