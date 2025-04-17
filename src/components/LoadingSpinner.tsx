// Yuklanish animatsiyasi uchun komponent
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

// LoadingSpinner - sahifa yuklanayotganini ko'rsatadi
const LoadingSpinner = () => (
  <div style={{ 
    position: 'fixed', // Ekran bo'ylab to'liq joylashadi
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255,255,255,0.8)', // Yarim shaffof fon
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999 // Barcha elementlardan ustun turadi
  }}>
    {/* Ant Design spinner animatsiyasi */}
    <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
  </div>
);

export default LoadingSpinner;
