// Xatoliklarni ushlovchi komponent (Error Boundary)
import React from 'react';
import { Button, Result } from 'antd';

// ErrorBoundary - React xatoliklarni ushlab, foydalanuvchiga chiroyli xabar ko'rsatadi
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  // Agar ichki komponentda xatolik yuz bersa, state yangilanadi
  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      // Xatolik yuz berganda foydalanuvchiga xabar va qayta yuklash tugmasi chiqadi
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

    // Xatolik bo'lmasa, bolalarni (children) ko'rsatadi
    return this.props.children;
  }
}

export default ErrorBoundary;
