import React from 'react';
export default class ErrorBoundary extends React.Component<any, { hasError: boolean }> {
  constructor(props: any) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() { return this.state.hasError ? <h1>Something went wrong.</h1> : this.props.children; }
}

