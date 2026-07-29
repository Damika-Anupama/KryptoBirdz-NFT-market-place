import React from "react";
import { copyText } from "../lib/clipboard";

interface Props {
  children: React.ReactNode;
}

interface State {
  error: Error | null;
  copied: boolean;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null, copied: false };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { error };
  }

  copyDetails = async () => {
    const { error } = this.state;
    const ok = await copyText(
      `KryptoBirdz error report\n${error?.name}: ${error?.message}\n${error?.stack ?? ""}`
    );
    this.setState({ copied: ok });
  };

  render() {
    const { error, copied } = this.state;
    if (!error) return this.props.children;
    return (
      <div className="errorfall" role="alert">
        <span className="errorfall__icon">🪺</span>
        <h1>Something flew off course</h1>
        <p>
          The page hit an unexpected error. Your local demo data is safe —
          reloading usually fixes it.
        </p>
        <div className="errorfall__actions">
          <button
            className="btn btn--primary"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
          <button className="btn btn--ghost" onClick={this.copyDetails}>
            {copied ? "Copied ✓" : "Copy error details"}
          </button>
        </div>
        <pre className="errorfall__detail">{error.message}</pre>
      </div>
    );
  }
}
