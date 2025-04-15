
import React from 'react';
import { Button, Result } from 'antd';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="error"
          title="Xatolik yuz berdi"
          subTitle="Iltimos, sahifani qayta yuklang yoki administratorga murojaat qiling"
          extra={[
            <Button type="primary" onClick={() => window.location.reload()} key="reload">
              Qayta yuklash
            </Button>,
          ]}
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
