"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

import { WidgetError } from "@repo/ui/widget-error";

export interface WidgetRenderBoundaryProps {
  widgetKey: string;
  children: ReactNode;
}

interface WidgetRenderBoundaryState {
  error: Error | null;
}

export class WidgetRenderBoundary extends Component<
  WidgetRenderBoundaryProps,
  WidgetRenderBoundaryState
> {
  state: WidgetRenderBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): WidgetRenderBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn(
      `Widget "${this.props.widgetKey}" crashed:`,
      error.message,
      info.componentStack,
    );
  }

  render() {
    if (this.state.error) {
      return (
        <WidgetError
          widgetKey={this.props.widgetKey}
          message="This section failed to render."
          details={this.state.error.message}
        />
      );
    }

    return this.props.children;
  }
}
