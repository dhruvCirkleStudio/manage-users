import React from "react";
import { Outlet } from "react-router-dom";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    // logErrorToMyService(error, errorInfo);
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="h-screen w-full text-black flex items-center justify-center">
          <div className="p-40 text-center shadow-2xl rounded-4xl">
            <h1 className=" font-bold">Something went wrong</h1>
            <h1 className=" font-bold">Try after sometime again</h1>
          </div>
        </div>
      );
    } else {
      return <Outlet />;
    }
  }
}
